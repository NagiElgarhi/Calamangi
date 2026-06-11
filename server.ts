import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { v4 as uuidv4 } from "uuid";
import os from "os";

// Configure FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: os.tmpdir() });

async function startServer() {
  // API routes FIRST
  app.post("/api/transcode", upload.single("video"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded" });
    }
    
    const inputPath = req.file.path;
    const outPath = path.join(os.tmpdir(), `${uuidv4()}.mp4`);
    
    try {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '26',
            '-c:a', 'aac',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart'
          ])
          .save(outPath)
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });
      
      res.download(outPath, "video.mp4", () => {
        try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch(e){}
        try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch(e){}
      });
    } catch (e) {
      console.error("Transcode error:", e);
      res.status(500).json({ error: "Transcode failed" });
      try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch(e){}
      try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch(e){}
    }
  });

  app.post("/api/merge", upload.array("videos"), (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No videos uploaded" });
    }
    
    // Rename files to have their correct extensions to ensure FFmpeg can autodetect the format
    const renamedFiles = files.map(f => {
      const extname = path.extname(f.originalname) || '.webm';
      const newPath = `${f.path}${extname}`;
      try {
        if (fs.existsSync(f.path)) {
          fs.renameSync(f.path, newPath);
        }
      } catch (err) {
        console.error("Failed to rename temp file:", err);
      }
      return {
        ...f,
        path: newPath,
        originalPath: f.path
      };
    });

    // We only need to merge if there is more than 1 file
    if (renamedFiles.length === 1 && req.body.quality !== '4k') {
      return res.sendFile(renamedFiles[0].path, (err) => {
        try {
          if (fs.existsSync(renamedFiles[0].path)) fs.unlinkSync(renamedFiles[0].path);
        } catch (e) {}
      });
    }

    const is4KRequested = req.body.quality === '4k';
    const listFile = path.join(os.tmpdir(), `${uuidv4()}.txt`);
    let outPath = path.join(os.tmpdir(), `${uuidv4()}.webm`);
    let ext = "webm";
    
    try {
      // Create a concat text file
      const listContent = renamedFiles.map(f => `file '${f.path}'`).join('\n');
      fs.writeFileSync(listFile, listContent);

      const tryMergeCopy = () => {
        return new Promise<boolean>((resolve) => {
          ffmpeg()
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .input(listFile)
            .outputOptions(['-c', 'copy'])
            .save(outPath)
            .on('end', () => {
              resolve(true);
            })
            .on('error', (err) => {
              console.warn("Fast merge with -c copy failed, falling back to transcode...", err.message);
              resolve(false);
            });
        });
      };

      const runMergeTranscode = (is4K: boolean) => {
        return new Promise<void>((resolve, reject) => {
          // Use MP4 container for maximum compatibility when transcoding
          outPath = path.join(os.tmpdir(), `${uuidv4()}.mp4`);
          ext = "mp4";
          
          const outputOpts = [
            '-c:v', 'libx264',
            '-preset', 'ultrafast', // ultrafast preset prevents cpu hang and timeouts
            '-crf', '26',
            '-c:a', 'aac',
            '-pix_fmt', 'yuv420p',
            '-async', '1',
            '-vsync', '2'
          ];
          
          if (is4K) {
            outputOpts.push('-vf', 'scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2');
          } else {
            outputOpts.push('-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2');
          }

          ffmpeg()
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .input(listFile)
            .outputOptions(outputOpts)
            .save(outPath)
            .on('end', () => {
              resolve();
            })
            .on('error', (err) => {
              reject(err);
            });
        });
      };

      // Run pipeline
      (async () => {
        let success = false;
        
        // Only try direct, lossless copy if we don't need to upscale to 4K
        if (!is4KRequested) {
          success = await tryMergeCopy();
        }
        
        if (!success) {
          try {
            await runMergeTranscode(is4KRequested);
          } catch (transcodeErr: any) {
            console.error("Transcoded merge failed:", transcodeErr);
            throw transcodeErr;
          }
        }

        // Successfully merged and saved on disk, now deliver it
        res.download(outPath, `merged.${ext}`, (err) => {
          // Cleanup files on complete/aborted download
          if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
          renamedFiles.forEach(f => {
            try {
              if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
            } catch (e) {}
            try {
              if (fs.existsSync(f.originalPath)) fs.unlinkSync(f.originalPath);
            } catch (e) {}
          });
          if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        });
      })().catch((err) => {
        console.error("Error during merge process:", err);
        res.status(500).json({ error: "Error merging videos" });
        // Cleanup files on pipeline failure
        if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
        renamedFiles.forEach(f => {
          try {
            if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
          } catch (e) {}
          try {
            if (fs.existsSync(f.originalPath)) fs.unlinkSync(f.originalPath);
          } catch (e) {}
        });
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Since this is express 4, avoid *all, just use *
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
