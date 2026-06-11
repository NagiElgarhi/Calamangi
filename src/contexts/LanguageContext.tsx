import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Layout
  brand: { en: "Talk to Me", ar: "كلمني" },
  howItWorks: { en: "How it works", ar: "كيف يعمل" },
  features: { en: "Features", ar: "الميزات" },
  pricing: { en: "Pricing", ar: "الأسعار" },
  getStarted: { en: "About the Initiative", ar: "عن المبادرة" },
  badge: { en: "The new standard for async video", ar: "المعيار الجديد للفيديو غير المتزامن" },
  title1: { en: "Initiative:", ar: "مبادرة :" },
  title2: { en: "Tell me about yourself in two minutes.", ar: "كلمني عن نفسك فى دقيقتين." },
  description: { 
    en: "Amidst the noise of life, we often forget that everyone has a story worth hearing. The 'Tell me about yourself in two minutes' initiative is an open invitation—a window into human experiences, sharing stories of resilience, small joys, and hidden triumphs. In just two minutes, you can share your deferred dreams and cherished memories. It's a safe space to speak and revive the art of listening. Open your heart and let your words flow; we are here to listen.", 
    ar: "بين ضجيج الحياة ننسى أحياناً أن لكل إنسان حكاية تستحق أن تُسمع. مبادرة «كلمني عن نفسك في دقيقتين» ليست استعراضاً، بل دعوة صادقة ونافذة تفتح على عوالم البشر لتروي قصص التحدي والأفراح الصغيرة والانتصارات الخفية. في دقيقتين فقط، يمكنك أن تشارك أحلامك، وتستعيد ذكرياتك الجميلة التي تضيء القلوب. إنها مساحة واسعة للبوح وإحياء قيمة الاستماع، فكم من قصة بسيطة منحت الأمل وكم من حكاية صادقة أعادت الثقة. افتح نافذة قلبك وتحدث بعفوية؛ فنحن هنا لنستمع إليك." 
  },
  startRecording: { en: "Start Recording", ar: "ابدأ التسجيل" },
  viewExamples: { en: "View Examples", ar: "شاهد الأمثلة" },
  trust: { en: "Trusted by 2,000+ founders worldwide", ar: "موثوق به من قبل أكثر من ٢٠٠٠ مؤسس حول العالم" },
  footer1: { en: "Encrypted Recording", ar: "تسجيل مشفر" },
  footer2: { en: "Cloud Rendering", ar: "معالجة سحابية" },
  footer3: { en: "Instant API Delivery", ar: "توصيل فوري عبر API" },
  footerStatus: { en: "Service Status: Operational", ar: "حالة الخدمة: تعمل" },

  // Sections
  howItWorksTitle: { en: "How to Participate", ar: "شاركنا" },
  step1Title: { en: "1. Prepare Setup", ar: "١. جهز الكاميرا" },
  step1Desc: { en: "Give permission to use your camera and microphone securely in your browser.", ar: "اسمح للمتصفح باستخدام الكاميرا والميكروفون للبدء في التسجيل." },
  step2Title: { en: "2. Tell your story", ar: "٢. كلمنا عن نفسك" },
  step2Desc: { en: "You have two minutes! Use the teleprompter and keep your face in the middle frame.", ar: "لديك دقيقتين فقط! اقرأ من الملقن وحافظ على وجهك في منتصف الإطار." },
  step3Title: { en: "3. Review", ar: "٣. راجع الفيديو" },
  step3Desc: { en: "Review your recording and hit submit to send it directly to our team.", ar: "تأكد من جودة الفيديو واضغط إرسال لتصل مشاركتك مباشرة لغرفة التقييم." },
  step4Title: { en: "4. Submit Video", ar: "٤. إرسل الفيديو" },
  step4Desc: { en: "Share your recorded video with us securely.", ar: "أرسل الفيديو المسجل الخاص بك ليتم مراجعته والتواصل معك." },

  featuresTitle: { en: "Platform Features", ar: "مميزات التسجيل معنا" },
  feature1Title: { en: "High Quality Capture", ar: "جودة تصوير فائقة" },
  feature1Desc: { en: "Present yourself professionally with crystal clear 4K video.", ar: "تصوير 4K نقي ومباشر من متصفحك يعكس احترافيتك بأفضل صورة." },
  feature2Title: { en: "Smart Teleprompter", ar: "ملقن نصوص مدمج" },
  feature2Desc: { en: "Read your key points smoothly while maintaining perfect eye contact.", ar: "اكتب النقاط الأساسية واقرأها بسلاسة مع الحفاظ على التواصل البصري للمشاهد." },
  feature3Title: { en: "Merge Video Clips", ar: "دمج مقاطع الفيديو" },
  feature3Desc: { en: "Record multiple parts and seamlessy merge them, or upload existing clips.", ar: "سجل عدة مقاطع وادمجهم معاً بكل سهولة، أو ارفع الفيديوهات الموجودة لديك وقم بدمجها." },

  pricingTitle: { en: "Simple Pricing", ar: "باقات الأسعار" },
  pricingDesc: { en: "Start for free, upgrade when you need more power.", ar: "ابدأ مجاناً، وقم بالترقية عندما تحتاج إلى المزيد." },
  freePlan: { en: "Free", ar: "الأساسية" },
  proPlan: { en: "Pro", ar: "الاحترافية" },
  perMonth: { en: "/month", ar: "/شهر" },
  freeFeature1: { en: "Up to 5 videos/month", ar: "حتى ٥ مقاطع شهرياً" },
  freeFeature2: { en: "1080p Resolution", ar: "جودة 1080p" },
  proFeature1: { en: "Unlimited videos", ar: "عدد غير محدود من المقاطع" },
  proFeature2: { en: "4K Resolution", ar: "جودة 4K" },
  proFeature3: { en: "Custom branding", ar: "علامة تجارية مخصصة" },

  // Widget
  live: { en: "Live", ar: "مباشر" },
  ready: { en: "Ready", ar: "جاهز" },
  cameraRequired: { en: "Camera Access Required", ar: "مطلوب الوصول للكاميرا" },
  sending: { en: "Sending your pitch...", ar: "جاري إرسال العرض..." },
  poweredBy: { en: "Powered by Vocalize Secure Upload v2.4", ar: "مدعوم بواسطة الرفع الآمن Vocalize الإصدار ٢.٤" },
  retryCamera: { en: "Retry Camera Access", ar: "إعادة محاولة الوصول للكاميرا" },
  allowCamera: { en: "Allow Camera Access", ar: "السماح بالوصول للكاميرا" },
  requesting: { en: "Requesting...", ar: "جاري الطلب..." },
  uploading: { en: "Uploading...", ar: "جاري الرفع..." },
  stopRecording: { en: "Stop Recording", ar: "إيقاف التسجيل" },
  retake: { en: "Retake", ar: "إعادة التصوير" },
  submit: { en: "Submit", ar: "إرسال" },
  sentSuccessfully: { en: "Sent Successfully", ar: "تم الإرسال بنجاح" },
  recordAnother: { en: "Record Another", ar: "تسجيل مقطع آخر" },
  cameraError: { en: "We need access to your camera to record securely.", ar: "نحتاج إلى الوصول للكاميرا للتسجيل بأمان." },
  mergeVideos: { en: "Merge Clips", ar: "دمج المقاطع" },
  merging: { en: "Merging...", ar: "جارٍ الدمج..." },
  clip: { en: "Clip", ar: "مقطع" }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
