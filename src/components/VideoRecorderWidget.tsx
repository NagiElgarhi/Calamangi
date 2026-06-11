import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { googleSignIn, getAccessToken, initAuth } from '../lib/googleAuth';
import { User } from 'firebase/auth';

type RecordingState = 'idle' | 'requesting' | 'ready' | 'recording' | 'previewing' | 'submitting' | 'merging' | 'success' | 'error';


export default function VideoRecorderWidget() {
  const { t, lang } = useLanguage();
  const [state, setState] = useState<RecordingState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string, ext: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [clips, setClips] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [needsAuth, setNeedsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Clean up on unmount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      unsubscribe();
    };
  }, [previewUrl]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const requestCamera = async () => {
    try {
      setState('requesting');
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
            width: { ideal: 7680 },
            height: { ideal: 4320 },
            facingMode: 'user'
        }, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.volume = 0; // Mute local feedback to prevent echo
      }
      setState('ready');
    } catch (err: any) {
      console.error("Camera access failed", err);
      setErrorMsg(err.message || 'Failed to access camera.');
      setState('error');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    
    // Find supported mime type for cross-browser support
    let mimeType = '';
    const types = [
        'video/mp4', // Prioritize mp4
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
    ];
    if (typeof MediaRecorder.isTypeSupported === 'function') {
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                break;
            }
        }
    }
        
    const mediaRecorder = new MediaRecorder(streamRef.current, { 
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
    });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setClips([blob]);
      
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.volume = 1; // Unmute for playback
        videoRef.current.loop = true;
        videoRef.current.play().catch(console.error);
      }
      setState('submitting');

      // Transcode and upload to Google Drive
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("No access token available. User must authenticate.");
        }

        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');
        
        const transcodeRes = await fetch('/api/transcode', {
          method: 'POST',
          body: formData
        });

        if (!transcodeRes.ok) throw new Error('Transcoding failed');
        const mp4Blob = await transcodeRes.blob();
        
        const fileId = Date.now().toString();
        const extension = 'mp4';
        const filename = `my-story-${fileId}.${extension}`;
        
        const metadata = {
          name: filename,
          mimeType: 'video/mp4'
        };

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: video/mp4\r\n\r\n';

        const formBlob = new Blob([
           multipartRequestBody,
           mp4Blob,
           close_delim
        ]);

        const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: formBlob
        });

        if (!uploadRes.ok) {
           throw new Error(`Google Drive upload failed: ${uploadRes.statusText}`);
        }

        setState('success');

      } catch (err) {
        console.error("Failed to automatically upload to Google Drive:", err);
        setState('previewing'); // Fallback if upload starts failing
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100); // collect 100ms chunks
    setState('recording');
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const addAnotherClip = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (videoRef.current && streamRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(console.error);
    }
    setState('ready');
  };

  const retry = async () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (downloadInfo) {
      URL.revokeObjectURL(downloadInfo.url);
      setDownloadInfo(null);
    }
    setClips([]);
    setState('idle');
    stopCamera();
    setTimeout(requestCamera, 100);
  };

  const shareFile = async (fallbackName?: string) => {
    if (clips.length === 0) return false;
    const singleBlob = clips[0];
    
    let ext = 'mp4'; // Default to mp4 as requested
    
    const mimeType = singleBlob.type || `video/${ext}`;
    const filename = fallbackName || `my-story-${Date.now()}.${ext}`;
    
    try {
      const file = new File([singleBlob], filename, { type: mimeType });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: lang === 'ar' ? 'مبادرة كلمني عن نفسك' : 'Tell me about yourself',
            text: lang === 'ar' 
              ? 'مشاركتي في مبادرة "كلمني عن نفسك في دقيقتين"! 🎙️✨' 
              : 'My participation in the "Tell me about yourself in two minutes" initiative! 🎙️✨',
          });
          return true;
        } catch (shareErr: any) {
          // If the user cancels the share dialog or permission is denied, fallback gracefully
          console.log("Web Share gracefully falling back:", shareErr);
          throw shareErr;
        }
      } else {
        // Fallback: Just trigger a download if sharing is not supported (e.g. iframe)
        const a = document.createElement('a');
        a.href = URL.createObjectURL(singleBlob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      }
    } catch (err) {
      // Fallback on error without triggering a system-level console.error
      console.log("Using download fallback after share failed or cancelled.");
      const a = document.createElement('a');
      a.href = URL.createObjectURL(singleBlob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
  };

  const handleShareFileDirectly = async () => {
    if (clips.length === 0) return;
    
    // Save to local DB first 
    try {
      await new Promise<void>((resolve, reject) => {
        const dbRequest = indexedDB.open('InitiativeVideoDB', 1);
        dbRequest.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('videos')) {
            db.createObjectStore('videos', { keyPath: 'id' });
          }
        };
        
        dbRequest.onsuccess = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          const transaction = db.transaction('videos', 'readwrite');
          const store = transaction.objectStore('videos');
          const addRequest = store.put({ id: Date.now().toString(), blob: clips[0], date: new Date() });
          
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        };
        
        dbRequest.onerror = () => reject(dbRequest.error);
      });
      console.log("Video saved to IndexedDB successfully");
    } catch (e) {
      console.error("Failed to save video to local database", e);
    }
    
    await shareFile(`direct-share-${Date.now()}.mp4`);
  };

  const submitVideo = async () => {
    if (clips.length === 0) return;
    
    const singleBlob = clips[0];
    const finalUrl = URL.createObjectURL(singleBlob);
    
    let ext = 'mp4';

    setDownloadInfo({ url: finalUrl, ext });
    setState('success');
    stopCamera();

    // Trigger native share prompt automatically as well when they click submit
    setTimeout(async () => {
      try {
        await shareFile();
      } catch (e) {
        console.error("Auto share failed", e);
      }
    }, 50);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[550px] aspect-[9/16] max-h-[75vh] md:max-h-[700px] bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-800 overflow-hidden isolate">
        {/* Background Layer (z-0) */}
        <img 
            src="/custom-bg.jpg" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
            onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0';
            }}
        />

        {/* The Live Video / Preview Feed (z-10) */}
        <video
            ref={videoRef}
            className={`absolute left-0 top-[31%] w-full h-[37%] object-cover z-10 transition-opacity duration-300 ${
                 ['ready', 'recording', 'previewing'].includes(state) ? 'opacity-100 bg-black' : 'opacity-0'
            } ${state !== 'previewing' ? 'scale-x-[-1]' : ''}`}
            autoPlay={state !== 'previewing'}
            playsInline
            muted={state !== 'previewing'}
        />

        {/* UI Overlay Grid - Adjusted to match image sections (z-20) */}
        <div className="absolute inset-0 flex flex-col z-20 pointer-events-none">
            
            {/* Top Area (~31%) - Header & Status */}
            <div className="h-[31%] p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-2 rounded-xl">
                        {state === 'recording' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 pointer-events-auto">{t('live')}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 pointer-events-auto">{t('ready')}</span>
                            </div>
                        )}
                        <span className="text-xs font-mono text-white/80 pointer-events-auto">{formatTime(recordingTime)}</span>
                    </div>
                    {clips.length > 0 && (
                        <div className="flex gap-1 justify-center pointer-events-auto">
                            {clips.map((_, idx) => (
                                <div key={idx} className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Middle Area (~37%) - Active Video Area Focus Bracket */}
            <div className="h-[37%] flex items-center justify-center relative">
                 {state === 'requesting' && (
                     <div className="text-center z-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs font-medium text-white">{t('cameraRequired')}</p>
                     </div>
                 )}
                 {(state === 'submitting' || state === 'merging') && (
                     <div className="text-center z-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                        </div>
                        <p className="text-xs font-medium text-white">
                            {state === 'merging' ? t('merging') : t('sending')}
                        </p>
                     </div>
                 )}
            </div>
            
            {/* Bottom Area (~32%) - Controls & Actions */}
            <div className="h-[32%] p-6 flex flex-col justify-end gap-2 pointer-events-auto">
                <Controls 
                    state={state}
                    errorMsg={errorMsg}
                    hasClips={clips.length > 0}
                    downloadInfo={downloadInfo}
                    lang={lang}
                    onRequestCamera={requestCamera}
                    onStart={startRecording}
                    onStop={stopRecording}
                    onAddAnother={addAnotherClip}
                    onRetry={retry}
                    onSubmit={submitVideo}
                    onShareFile={handleShareFileDirectly}
                    t={t}
                    needsAuth={needsAuth}
                    isLoggingIn={isLoggingIn}
                    onLogin={handleLogin}
                />
            </div>
        </div>
    </div>
  );
}

function Controls({ 
    state, errorMsg, hasClips, downloadInfo, lang, onRequestCamera, onStart, onStop, onAddAnother, onRetry, onSubmit, onShareFile, t, needsAuth, isLoggingIn, onLogin 
}: {
    state: RecordingState,
    errorMsg: string,
    hasClips: boolean,
    downloadInfo: { url: string, ext: string } | null,
    lang: string,
    onRequestCamera: () => void,
    onStart: () => void,
    onStop: () => void,
    onAddAnother: () => void,
    onRetry: () => void,
    onSubmit: () => void,
    onShareFile: () => void,
    t: (key: string) => string,
    needsAuth: boolean,
    isLoggingIn: boolean,
    onLogin: () => void
}) {
    const Container = ({ children }: { children: React.ReactNode }) => (
        <>
            <div className="flex flex-col gap-2 w-full">
                {children}
            </div>
            <p className="text-[9px] text-center text-white/30 uppercase tracking-tighter mt-2">
                {t('poweredBy')}
            </p>
        </>
    );

    if (needsAuth) {
        return (
            <Container>
                <button 
                    onClick={onLogin}
                    disabled={isLoggingIn}
                    className="w-full py-3 bg-white hover:bg-gray-100 text-slate-800 rounded-xl text-sm font-bold shadow-lg shadow-white/10 transition-all pointer-events-auto flex items-center justify-center gap-2"
                >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    {isLoggingIn ? (lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...') : (lang === 'ar' ? 'سجل بحساب جوجل' : 'Sign in with Google')}
                </button>
            </Container>
        );
    }
    
    if (state === 'idle' || state === 'error') {
        return (
            <Container>
                <button 
                    onClick={onRequestCamera}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all pointer-events-auto"
                >
                    {state === 'error' ? t('retryCamera') : t('allowCamera')}
                </button>
                {errorMsg && (
                    <div className="text-center w-full">
                        <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">{t('cameraError')}</span>
                    </div>
                )}
            </Container>
        );
    }

    if (state === 'requesting' || state === 'submitting' || state === 'merging') {
         return (
            <Container>
                <div className="w-full py-3 bg-white/5 border border-white/10 text-white/50 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    {state === 'requesting' ? t('requesting') : (state === 'merging' ? t('merging') : t('uploading'))}
                </div>
            </Container>
        );
    }

    if (state === 'ready') {
        return (
            <Container>
                <button 
                    onClick={onStart}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                    {t('startRecording')}
                </button>
            </Container>
        );
    }

    if (state === 'recording') {
         return (
            <Container>
                 <button 
                    onClick={onStop}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
                >
                    {t('stopRecording')}
                </button>
            </Container>
        );
    }

    if (state === 'previewing') {
        return (
            <Container>
                <div className="w-full py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {lang === 'ar' ? 'فشل حفظ الفيديو' : 'Failed to save video'}
                </div>
                <button 
                    onClick={onRetry}
                    className="w-full text-xs text-white/50 hover:text-white uppercase font-bold tracking-widest text-center py-2 mt-2 transition-colors"
                >
                    {t('recordAnother')}
                </button>
            </Container>
        );
    }

    if (state === 'success') {
        return (
            <Container>
                <div className="w-full py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {lang === 'ar' ? 'تم حفظ الفيديو بنجاح!' : 'Video Saved Successfully!'}
                </div>
                <button 
                    onClick={onRetry}
                    className="w-full text-xs text-white/50 hover:text-white uppercase font-bold tracking-widest text-center py-2 mt-2 transition-colors"
                >
                    {t('recordAnother')}
                </button>
            </Container>
        );
    }

    return null;
}
