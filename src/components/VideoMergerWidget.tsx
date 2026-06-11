import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileVideo, Plus, Trash2, Loader2, Check } from 'lucide-react';

export default function VideoMergerWidget() {
  const { t, lang } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedExt, setMergedExt] = useState('mp4');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const mergeFiles = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    setMergedUrl(null);

    const formData = new FormData();
    files.forEach((file, idx) => {
      const ext = file.name.split('.').pop() || 'webm';
      formData.append('videos', file, `clip-${idx}.${ext}`);
    });
    formData.append('quality', '4k');

    try {
      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Merge failed');
      }

      const blob = await response.blob();
      const ext = 'mp4';
      setMergedExt(ext);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error merging videos. Ensure they are in a compatible format.');
    } finally {
      setIsMerging(false);
    }
  };

  const downloadVideo = () => {
    if (!mergedUrl) return;
    const a = document.createElement('a');
    a.href = mergedUrl;
    a.download = `merged-video-${Date.now()}.${mergedExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full h-full min-h-[500px] sm:min-h-[550px] aspect-[9/16] max-h-[75vh] md:max-h-[700px] bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-between">
      <div className="w-full p-6 flex flex-col h-full bg-black/40">
        <div className="flex-1 overflow-y-auto w-full hide-scrollbar flex flex-col gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/*" 
            multiple 
            className="hidden" 
          />
          
          {mergedUrl ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-white font-bold text-center">
                {lang === 'ar' ? 'اكتمل الدمج بنجاح' : 'Merge Completed'}
              </h3>
            </div>
          ) : files.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
               <FileVideo className="w-16 h-16 opacity-50" />
               <p className="text-center text-sm px-4">
                 {lang === 'ar' ? 'أضف مقاطع فيديو لدمجها معاً' : 'Add video clips to merge them together'}
               </p>
             </div>
          ) : (
            <div className="flex flex-col gap-2 w-full pt-4">
               {files.map((file, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="flex flex-col overflow-hidden">
                       <span className="text-white text-xs truncate font-medium">{file.name}</span>
                       <span className="text-indigo-400 text-[10px] mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                    <button onClick={() => removeFile(idx)} className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors ml-2">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col gap-2 w-full mt-auto mb-2 border-t border-white/10 shrink-0">
          {!mergedUrl && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {lang === 'ar' ? 'إضافة مقطع' : 'Add Clip'}
            </button>
          )}

          {mergedUrl ? (
            <div className="flex flex-col gap-2 w-full">
               <button 
                onClick={downloadVideo}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 text-white rounded-xl text-xs font-bold transition-all"
               >
                 {lang === 'ar' ? 'تحميل الفيديو (4K)' : 'Download Video (4K)'}
               </button>
               <button 
                onClick={() => {
                  setMergedUrl(null);
                  setFiles([]);
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
               >
                 {lang === 'ar' ? 'دمج جديد' : 'Merge New'}
               </button>
            </div>
          ) : (
              <button 
               onClick={mergeFiles}
               disabled={files.length < 2 || isMerging}
               className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                 files.length < 2 
                   ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                   : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 text-white'
               }`}
             >
               {isMerging ? (
                 <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === 'ar' ? 'جارٍ الدمج (بجودة 4K)...' : 'Merging (4K)...'}
                 </>
               ) : (
                 lang === 'ar' ? 'ابدأ الدمج (4K)' : 'Merge Videos (4K)'
               )}
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
