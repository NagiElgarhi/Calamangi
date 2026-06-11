import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { getAccessToken, initAuth, googleSignIn } from "../lib/googleAuth";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setIsAuthenticated(true);
        fetchVideos(token);
      },
      () => setIsAuthenticated(false)
    );
    return () => unsubscribe();
  }, []);

  const fetchVideos = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/drive/v3/files?fields=files(id,name,createdTime,webContentLink,webViewLink)", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data.files || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsAuthenticated(true);
        fetchVideos(result.accessToken);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        lang === "ar"
          ? "هل أنت متأكد من حذف هذا الفيديو نهائياً من جوجل درايف؟"
          : "Are you sure you want to permanently delete this video from Google Drive?"
      )
    )
      return;

    try {
      const token = await getAccessToken();
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
      } else {
         alert("Error deleting file.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting video");
    }
  };

  const handleDownload = (link: string) => {
     if (link) {
         window.open(link, "_blank");
     }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
            Admin Login
          </h2>
          <div className="flex flex-col gap-4">
             <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-3 bg-white hover:bg-gray-100 text-slate-800 rounded-xl text-sm font-bold shadow-lg shadow-white/10 transition-all pointer-events-auto flex items-center justify-center gap-2 border border-slate-200"
             >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                   <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                   <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                   <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                   <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                   <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                {isLoggingIn ? "Signing in..." : "Sign in with Google"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full max-h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Drive Videos
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="p-4 font-semibold uppercase text-xs">Date</th>
                  <th className="p-4 font-semibold uppercase text-xs">Name</th>
                  <th className="p-4 font-semibold uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20"
                  >
                    <td className="p-4 text-sm text-slate-900 dark:text-white">
                      {new Date(video.createdTime).toLocaleString(
                        lang === "ar" ? "ar-EG" : "en-US"
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-900 dark:text-white">
                       {video.name}
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleDownload(video.webContentLink || video.webViewLink)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold"
                      >
                        {lang === "ar" ? "عرض/تنزيل" : "Open"}
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-500/10 dark:text-red-400 rounded-lg text-sm font-bold"
                      >
                        {lang === "ar" ? "حذف نهائي" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">
                      {lang === "ar"
                        ? "لا يوجد فيديوهات محفوظة."
                        : "No videos saved yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
