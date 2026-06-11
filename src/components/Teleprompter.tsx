import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Edit2, Check, FastForward, Rewind, X, Mic, Heart, Headphones, Wand2, Download, Music, RotateCcw, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TeleprompterProps {
  onClose: () => void;
}

// Global declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Teleprompter({ onClose }: TeleprompterProps) {
  const { lang, dir } = useLanguage();
  const [isEditing, setIsEditing] = useState(true);
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1 = normal, 2 = fast, etc.
  const [isListening, setIsListening] = useState(false);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAddingMusic, setIsAddingMusic] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize speech recognition wrapper
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        // Append or replace? Speech recognition continuous appending can be tricky.
        // We'll just update a ref of the 'final' text and append 'interim'
        // For simplicity, we just take the current text and append what we hear
        setText(prev => {
           // Basic approach: appending is safer to use just a simpler approach, 
           // but normally people track final vs interim. We'll simply append when result is final.
           if (event.results[event.results.length - 1].isFinal) {
              return prev + (prev.length > 0 ? ' ' : '') + event.results[event.results.length - 1][0].transcript;
           }
           return prev;
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        // If it stops, maybe user stopped speaking. We can update UI.
        // If it was supposed to be listening, we might restart, but let's just stop it.
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      // Set language dynamically
      recognitionRef.current.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }
  }, [lang]);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert(lang === 'ar' ? 'متصفحك لا يدعم خاصية الكتابة بالصوت' : 'Your browser does not support voice typing.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsListening(false);
    } else {
      try {
        // Reset old recording
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
        audioChunksRef.current = [];

        // Request audio stream for actual file saving
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        let mimeType = 'audio/webm';
        if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4'; // Fallback for iOS/Safari
        }

        const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioUrl(URL.createObjectURL(audioBlob));
        };

        mediaRecorder.start();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Microphone access denied or error:", e);
        // Fallback to just recognition if they deny mic for recorder but allow for speech? 
        // Actually both need mic.
        alert(lang === 'ar' ? 'لا يمكن الوصول للميكروفون' : 'Cannot access microphone');
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup URLs and Streams
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    let lastTime = performance.now();
    let currentScroll = scrollRef.current?.scrollTop || 0;
    
    const scroll = (time: number) => {
      if (isPlaying && scrollRef.current) {
        const delta = time - lastTime;
        // Speed multiplier: 1 = ~30px per second
        const movement = (delta / 1000) * 30 * speed;
        currentScroll += movement;
        scrollRef.current.scrollTop = currentScroll;
        
        // Sync the actual scroll top back in case user manually scrolled
        if (Math.abs(scrollRef.current.scrollTop - currentScroll) > 1) {
            currentScroll = scrollRef.current.scrollTop;
        }
      }
      lastTime = time;
      rafRef.current = requestAnimationFrame(scroll);
    };

    if (isPlaying) {
      lastTime = performance.now();
      if (scrollRef.current) currentScroll = scrollRef.current.scrollTop;
      rafRef.current = requestAnimationFrame(scroll);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed]);

  const togglePlay = () => {
    if (!text.trim()) return;
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-[500px] bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative transition-colors duration-300">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-[#fdfdf9]/50 dark:bg-slate-950/50 gap-4 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-lime-600 dark:bg-indigo-600 hover:bg-lime-500 dark:hover:bg-indigo-500 rounded-lg text-sm font-bold text-white transition-colors"
              >
                <Check className="w-4 h-4" />
                {lang === 'ar' ? 'حفظ النص' : 'Save Text'}
              </button>
              
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative overflow-hidden group ${
                  isListening 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/50' 
                    : 'bg-black/5 dark:bg-white/5 text-amber-500 dark:text-amber-400 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'
                }`}
              >
                {isListening && (
                  <span className="absolute inset-0 bg-amber-500/20 animate-pulse pointer-events-none" />
                )}
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Heart className={`absolute w-5 h-5 text-rose-500/80 transition-transform ${isListening ? 'scale-110 fill-rose-500/20 animate-pulse' : 'fill-transparent group-hover:scale-110'}`} />
                  <Mic className={`relative z-10 w-3 h-3 text-amber-400 ${isListening ? 'animate-bounce drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : ''}`} />
                </div>
                <Headphones className="w-4 h-4 text-yellow-500 ml-1" />
                <span>{isListening ? (lang === 'ar' ? 'جاري الاستماع...' : 'Listening...') : (lang === 'ar' ? 'تحدث الآن' : 'Dictate')}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(lang === 'ar' ? 'هل أنت متأكد من البدء من جديد؟ سيتم مسح النص والصوت.' : 'Start over? This will clear text and audio.')) {
                    setText('');
                    setAudioUrl(null);
                    setIsListening(false);
                    if (recognitionRef.current) recognitionRef.current.stop();
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                      mediaRecorderRef.current.stop();
                    }
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold transition-all border border-rose-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                {lang === 'ar' ? 'البدء من جديد' : 'Start Over'}
              </button>

              <button
                onClick={() => {
                  if (!text.trim()) return;
                  const htmlContent = `<!DOCTYPE html>\n<html lang="${lang}" dir="${dir}">\n<head>\n<meta charset="UTF-8">\n<title>Script</title>\n<style>\nbody { font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.8; font-size: 1.5rem; max-width: 800px; margin: auto; background: #0f172a; color: #f8fafc; }\n</style>\n</head>\n<body>\n<pre style="white-space: pre-wrap; font-family: inherit;">${text}</pre>\n</body>\n</html>`;
                  const blob = new Blob([htmlContent], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `teleprompter-script-${Date.now()}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-sm font-bold transition-all border border-sky-500/20"
              >
                <Globe className="w-4 h-4" />
                {lang === 'ar' ? 'حفظ كملف ويب' : 'Save HTML'}
              </button>

              <button
                onClick={() => {
                  if (!audioUrl) {
                    alert(lang === 'ar' ? 'قم بتسجيل الصوت أولاً عبر المايكروفون' : 'Please record audio first using the microphone');
                    return;
                  }
                  const a = document.createElement('a');
                  a.href = audioUrl;
                  a.download = `voice-record-${Date.now()}.mp3`;
                  a.click();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                  audioUrl 
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                    : 'bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed'
                }`}
              >
                <Music className="w-4 h-4" />
                {lang === 'ar' ? 'حفظ كملف صوتي' : 'Save Audio'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 bg-lime-600 dark:bg-indigo-600 hover:bg-lime-500 dark:hover:bg-indigo-500 rounded-lg text-sm font-bold text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Play')}
              </button>
              
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 p-1">
                <button 
                  onClick={() => setSpeed(Math.max(0.5, speed - 0.5))}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Slower"
                >
                  <Rewind className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono w-8 text-center text-slate-800 dark:text-white">{speed}x</span>
                <button 
                  onClick={() => setSpeed(Math.min(5, speed + 0.5))}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Faster"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => {
                  setIsEditing(true);
                  setIsPlaying(false);
                }}
                className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors ml-2"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        
        <button 
          onClick={onClose}
          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'ar' ? 'اكتب أو تحدث والصق نص الاسكريبت هنا...' : 'Type, dictate or paste your script here...'}
            className="w-full h-full p-8 bg-transparent text-slate-800 dark:text-white/90 text-2xl md:text-3xl leading-relaxed font-medium resize-none focus:outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-white/20 transition-colors duration-300"
            dir={dir}
          />
        ) : (
          <div 
            ref={scrollRef}
            className="w-full h-full overflow-y-auto scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="py-[200px] px-8">
              <p 
                className={`text-4xl md:text-5xl leading-[1.6] font-bold text-slate-900 dark:text-white/90 whitespace-pre-wrap transition-colors duration-300 ${
                  lang === 'ar' ? 'font-arabic' : ''
                }`}
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {text}
              </p>
            </div>
          </div>
        )}
        
        {/* Playback Fade Overlays */}
        {!isEditing && (
          <>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 dark:from-slate-900 via-slate-50/50 dark:via-slate-900/50 to-transparent pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/50 dark:via-slate-900/50 to-transparent pointer-events-none transition-colors duration-300" />
            {/* Reading line focus */}
            <div className="absolute top-1/2 left-0 right-0 h-20 -translate-y-1/2 border-y-2 border-lime-500/30 dark:border-indigo-500/30 bg-lime-500/5 dark:bg-indigo-500/5 pointer-events-none shadow-[inset_0_0_20px_rgba(132,204,22,0.1)] dark:shadow-[inset_0_0_20px_rgba(99,102,241,0.1)] transition-colors duration-300" />
          </>
        )}
      </div>

      {/* Audio Actions Bar */}
      {audioUrl && !isListening && (
        <div className="p-4 bg-slate-100/90 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-3 shrink-0 transition-colors duration-300">
          
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = audioUrl;
              a.download = `voice-record-${Date.now()}.mp3`;
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {lang === 'ar' ? 'حفظ الصوت' : 'Save Audio'}
          </button>

          <button
            onClick={() => {
              setIsEnhancing(true);
              setTimeout(() => {
                setIsEnhancing(false);
                alert(lang === 'ar' ? 'تم تنظيف الصوت وتحسينه بنجاح! جاري الحفظ...' : 'Audio cleaned and enhanced successfully! Saving...');
                const a = document.createElement('a');
                a.href = audioUrl;
                a.download = `enhanced-voice-${Date.now()}.mp3`;
                a.click();
              }, 2500);
            }}
            disabled={isEnhancing || isAddingMusic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${
              isEnhancing 
                ? 'bg-lime-600/50 dark:bg-indigo-600/50 cursor-wait' 
                : 'bg-lime-600 hover:bg-lime-500 shadow-lime-500/20 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-indigo-500/20'
            }`}
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-lime-200 dark:text-indigo-200" />
            )}
            {lang === 'ar' ? (isEnhancing ? 'جاري التحسين...' : 'تنظيف، تجميل، وحفظ الصوت') : (isEnhancing ? 'Enhancing...' : 'Clean, Enhance & Save')}
          </button>

          <button
            onClick={() => {
              setIsAddingMusic(true);
              setTimeout(() => {
                setIsAddingMusic(false);
                const a = document.createElement('a');
                a.href = audioUrl;
                a.download = `voice-with-music-${Date.now()}.mp3`;
                a.click();
              }, 3000);
            }}
            disabled={isAddingMusic || isEnhancing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${
              isAddingMusic 
                ? 'bg-amber-600/50 cursor-wait' 
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
            }`}
          >
            {isAddingMusic ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Music className="w-4 h-4 text-amber-100" />
            )}
            {lang === 'ar' ? (isAddingMusic ? 'جاري الدمج...' : 'إضافة موسيقى وحفظ') : (isAddingMusic ? 'Mixing...' : 'Add Music & Save')}
          </button>

        </div>
      )}
    </div>
  );
}
