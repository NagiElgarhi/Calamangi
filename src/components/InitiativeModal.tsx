import React, { useState } from 'react';
import { X, Heart, Sparkles, HelpCircle, ArrowRight, Play, Compass, Users, Mic } from 'lucide-react';

interface InitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  onStartAction: () => void;
}

export default function InitiativeModal({ isOpen, onClose, lang, onStartAction }: InitiativeModalProps) {
  const [activeTab, setActiveTab] = useState<'poem' | 'analysis' | 'guide'>('poem');

  if (!isOpen) return null;

  const handleStart = () => {
    onClose();
    onStartAction();
  };

  const poemStanzasAr = [
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "طَمِّنِّي عَلى أَحْوَالَكْ",
        "فَضْفَضْ عَنْ أَحْلَامَكْ",
        "وَدَعْوِتَكْ إِيهْ لِرَبَّكْ",
        "لِيِحَأأ بِيهَا آمَالَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "أُو إِيهْ شَاغِلْ بَالَكْ",
        "وِإِيهْ بَهْجِةْ أَيَّامَكْ",
        "وِإِيهْ طَرِيئَكْ فِي الدُّنْيَا",
        "وِازَّايْ هَتْحَأأ أَحلامك"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "إِحْكِي عَنْ أَجْمَلْ ذِكْرَى",
        "سَاكْنَةْ جُوَّهْ وِجْدَانَكْ",
        "وَاحْكِي عَنْ حِلْمْ بُكْرَهْ",
        "شَايْفُو فِي طِيْفْ خَيَالَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "يُمْكِنْ كِلْمَةْ تِفْتَحْ بَابْ",
        "وِ تِأََوِّي بِيهَا أَأدَامَكْ",
        "هِنِسْمَعَكْ مِنْ أَلْبِنَا",
        "وْنِشَارٰكَك كل أَحْلَامَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "إِحْكِي عَنْ نَاسْ عليك غَالْيِينْ",
        "مَالْيِينْ  عليك بِالْحُبّْ حَيَاتَكْ",
        "وَعَنْ موقِف عَلِّمْ فِيكْ",
        "وْ اترَسَمْ على هُدَاه خُطُوَاتَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "وَاحْكِي عَنْ لَحْظِةْ أَمَلْ",
        "فَرْحِتْ أَلْبَكْ وْذَاتَكْ",
        "وْإِنْ كَانْ عَنْدَكْ تَحَدِّي",
        "رَبِّنَا يِأَوِّي عَزمَاتَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "يْمْكِنْ صَوْتَكْ يِدِّي أَمَلْ",
        "لِيائس إستبشر بحِكَايَاتَكْ",
        "وْيُمْكِنْ حَرْفْ مِنْ كَلَامَكْ",
        " يبأَا الحل لمُشْكِلَاتَكْ"
      ]
    },
    {
      lines: [
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "وِتٰبأا  الصَّرَاحَةْ طَرِيأَك",
        "وِتٰبأََا  الْبَشَاشَةْ  عِنْوَانَكْ",
        "كَلِّمْنِي عَنْ نَفْسَكْ فِي دِئأتِينْ",
        "أكيد حِكَايَاتَكْ هَتْلْهِمْ نَاسْ تَايِهِينْ"
      ]
    }
  ];

  const poemStanzasEn = [
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Reassure me of how you are,",
        "Open up and speak of your dreams,",
        "And tell me your innermost prayers to your Lord,",
        "With which your hopes will be realized."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "And what is occupying your mind,",
        "What brings utter joy to your days,",
        "What is your path in this world,",
        "And how you will achieve your dreams."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Recall the most beautiful memory",
        "Residing deep inside your soul,",
        "And speak of tomorrow's dream",
        "Visible in the spectrum of your imagination."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Perhaps a single word opens wide gates,",
        "And strengthens your standing footing,",
        "We will listen to you with all our hearts,",
        "And partake in every single dream of yours."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Speak of the people so dear to you,",
        "Filling your entire life with love,",
        "And about an event that changed you,",
        "Upon whose guidance your steps are engraved."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "And speak of a moment of hope",
        "That brought bliss to your heart and being,",
        "And if you are facing any challenge,",
        "May the Lord strengthen your resolve."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Maybe your voice gives a ray of hope",
        "To a weary soul inspired by your stories,",
        "And perhaps a single syllable of your words",
        "Becomes the ultimate key to your problems."
      ]
    },
    {
      lines: [
        "Talk to me about yourself in two minutes,",
        "Let absolute sincerity be your way,",
        "And radiant joy be your address,",
        "Talk to me about yourself in two minutes,",
        "Surely, your stories will guide the wanderers home."
      ]
    }
  ];

  const activePoem = lang === 'ar' ? poemStanzasAr : poemStanzasEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] max-w-4xl h-[80%] bg-lime-600/10 dark:bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10 transition-colors duration-300" />

      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#fdfdf9] dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl transition-all duration-300"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lime-500/10 dark:bg-indigo-500/10 flex items-center justify-center text-lime-600 dark:text-indigo-400 transition-colors duration-300">
              <Heart className="w-5 h-5 fill-lime-600/20 dark:fill-indigo-400/20 transition-colors duration-300" />
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300 ${lang === 'ar' ? 'font-arabic' : ''}`}>
                {lang === 'ar' ? 'مبادرة "كلمني عن نفسك في دقيقتين"' : '"Tell Me About Yourself in Two Minutes" Initiative'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                {lang === 'ar' ? 'منبر للتواصل الإنساني والفضفضة الصادقة' : 'A platform for human connection and heartfelt sharing'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all"
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/5 bg-[#fdfdf9]/80 dark:bg-slate-900/50 px-6 py-2 gap-2 text-xs md:text-sm transition-colors duration-300">
          <button
            onClick={() => setActiveTab('poem')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'poem'
                ? 'bg-lime-600 dark:bg-indigo-600 text-white shadow-lg shadow-lime-600/20 dark:shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'ar' ? 'عن المبادرة' : 'About the Initiative'}
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'analysis'
                ? 'bg-lime-600 dark:bg-indigo-600 text-white shadow-lg shadow-lime-600/20 dark:shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            {lang === 'ar' ? 'تحليل الكلمات وأبعادها' : 'Analysis & Meaning'}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-lime-600 dark:bg-indigo-600 text-white shadow-lg shadow-lime-600/20 dark:shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {lang === 'ar' ? 'كيف أشارك؟' : 'How to Participate'}
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          {activeTab === 'poem' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {lang === 'ar' ? (
                /* Arabic Presentation */
                <div className="space-y-6 text-right font-arabic" dir="rtl">
                  {/* Decorative Header with logo */}
                  <div className="flex flex-col items-center text-center space-y-4 mb-2">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-amber-500/25 rounded-full blur-xl animate-pulse" />
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950/95 border border-[#D4AF37]/35 flex items-center justify-center relative group shadow-2xl backdrop-blur-sm">
                        <Heart className="w-10 h-10 text-rose-500/20 absolute fill-rose-500/10 group-hover:scale-110 transition-transform duration-500" />
                        <Mic className="w-6 h-6 text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] relative z-10 animate-bounce" />
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-400 drop-shadow-sm">
                      مبادرة كلمني عن نفسك في دقيقتين
                    </h2>
                    <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"></div>
                  </div>

                  {/* Main Container with Deep Slate/Charcoal background and Light Gray Text */}
                  <div className="bg-slate-900 border border-[#D4AF37]/15 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                    {/* Abstract background decorative lights */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

                    {/* Introductory elegant block quote */}
                    <p className="text-base md:text-lg text-slate-200 border-r-4 border-[#D4AF37] pr-4 py-2 italic font-medium leading-relaxed bg-white/[0.03] rounded-l-xl">
                      في المدينة ، تتقاطع فيها الوجوه كما تتقاطع الأزقة القديمة، يمضي الناس كل يوم حاملين فوق أكتافهم حكايات لا يراها أحد. يبتسمون أحيانًا، ويخفون خلف الابتسامة أحلامًا مؤجلة، وذكريات عزيزة، وأسئلة تبحث عن جواب. وبين ضجيج الحياة وصخب الأيام، يظل الإنسان في حاجة إلى من ينصت إليه، لا ليسمع صوته فقط، بل ليسمع ما وراء الكلمات.
                    </p>

                    {/* Core description text in clean light gray and spacious paragraph separation */}
                    <div className="space-y-5 text-slate-300 text-sm md:text-base leading-loose">
                      <p>
                        من هنا جاءت مبادرة <strong className="text-amber-400 font-bold">"كلمني عن نفسك في دقيقتين"</strong>، كنافذة صغيرة تفتح على عوالم كبيرة تسكن داخل البشر. ليست المبادرة مسابقة ولا استعراضًا للقدرات، وإنما دعوة صادقة لكل إنسان أن يمنح نفسه لحظتين من الصدق، يحكي فيهما عن رحلته في هذه الحياة، وعن الأشياء التي صنعت منه ما هو عليه اليوم.
                      </p>

                      <p>
                        في دقيقتين فقط، قد يستعيد أحدهم ذكرى جميلة ما زالت تضيء قلبه كلما أظلمت الأيام. وقد يروي آخر حلمًا يطارده منذ سنوات، ينتظر له بابًا يُفتح أو فرصة تأتي في موعدها. وربما يتحدث شخص عن أم كانت دعواتها زاد الطريق، أو عن أب ترك في روحه أثرًا لا يمحوه الزمن، أو عن صديق كان سندًا في ساعة ضيق.
                      </p>

                      <p className="border-r border-slate-800 pr-3">
                        هذه الدقائق القليلة ليست زمنًا محدودًا بقدر ما هي مساحة واسعة للبوح. مساحة يتحدث فيها الإنسان عن أفراحه الصغيرة التي لا يلتفت إليها أحد، وعن انتصاراته الخفية التي لم تُكتب في الصحف، وعن معاركه التي خاضها بصمت حتى خرج منها أكثر قوة ونضجًا.
                      </p>

                      <p>
                        تؤمن المبادرة بأن لكل إنسان قصة تستحق أن تُسمع، وأن الكلمات الصادقة تملك قدرة عجيبة على مد الجسور بين القلوب. فكم من تجربة بسيطة منحت الأمل لشخص كان يوشك أن يفقده، وكم من حكاية صادقة أعادت الثقة إلى نفس أنهكها اليأس، وكم من ذكرى جميلة جعلت الآخرين يتذكرون أن في الحياة ما يستحق الامتنان.
                      </p>

                      <p>
                        ولأن المشاركة يجب أن تكون سهلة ومريحة، يكفي أن يجهز المشارك الكاميرا والميكروفون، ثم يقف أمام العدسة كما يقف أمام صديق قديم يعرف كيف ينصت. يتحدث بعفوية، ويستعين بملقن النصوص إن أراد ترتيب أفكاره، ثم يراجع تسجيله ويرسله لتصل حكايته إلى غرفة التقييم، ومنها إلى قلوب المستمعين.
                      </p>

                      <p className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                        إن <strong className="text-white">"كلمني عن نفسك في دقيقتين"</strong> ليست مجرد مبادرة إعلامية، بل محاولة لإحياء قيمة إنسانية أصيلة كادت تضيع وسط العجلة والانشغال؛ قيمة الاستماع للآخرين والاهتمام بحكاياتهم. إنها دعوة مفتوحة لكل صاحب حلم، ولكل من يحمل ذكرى جميلة، ولكل من يريد أن يترك أثرًا طيبًا في نفوس الناس.
                      </p>

                      <p className="text-slate-200 font-medium pt-2">
                        فلا تتردد. اجلس أمام الكاميرا، وافتح نافذة قلبك، واترك كلماتك تمضي في طريقها. قد تكون دقيقتان من وقتك سببًا في ابتسامة إنسان، أو بارقة أمل في قلب متعب، أو بداية حكاية جديدة لشخص كان يبحث عن النور. تكلم عن نفسك، فنحن هنا لنستمع.
                      </p>
                    </div>

                    {/* Elegant Official Call to Action panel with link */}
                    <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-2xl p-5 w-full">
                        <p className="text-amber-300 font-bold text-base mb-2">
                          شارك معنا المبادرة وكن صاحب السبق.
                        </p>
                        <p className="text-slate-400 text-xs mb-4">
                          إضغط على الصفحة الرسمية للمبادرة ⤵️ وابدأ الآن
                        </p>
                        <a
                          href="https://www.facebook.com/share/1LR9z917XK/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                          </svg>
                          الصفحة الرسمية للمبادرة على فيسبوك
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* English Presentation */
                <div className="space-y-8 text-left font-sans" dir="ltr">
                  <div className="flex flex-col items-center text-center space-y-6 mb-8">
                    {/* Heart-Microphone Logo */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-red-500/25 rounded-full blur-xl animate-pulse" />
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-950/80 border border-amber-500/30 flex items-center justify-center relative group shadow-2xl backdrop-blur-sm">
                        <Heart className="w-12 h-12 text-rose-500/30 absolute fill-rose-500/10 group-hover:scale-110 transition-transform duration-500" />
                        <Mic className="w-7 h-7 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] relative z-10 animate-bounce" />
                      </div>
                    </div>

                    <h2 className="text-[30px] leading-snug font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      "Tell Me About Yourself in Two Minutes": A Warm Space for Listening and Inspiring Hope
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"></div>
                  </div>

                  <div className="space-y-8 text-slate-200 leading-relaxed">
                    <p className="text-sm md:text-base text-slate-300 border-l-4 border-amber-500/50 pl-4 py-1 italic bg-white/[0.02] rounded-r-xl">
                      In a fast-paced world where everyone is running non-stop, we rarely find someone who listens to us with a sincere heart, or gives us a moment to express what is in our hearts. Hence, the initiative <strong className="text-amber-300">"Tell Me About Yourself in Two Minutes"</strong> launches as a warm invitation and a pure human space, aiming to restore the value of the sincere word and the impact of listening on human life.
                    </p>
                    
                    <p className="text-sm md:text-base text-slate-300 pl-1">
                      The initiative is not just a fleeting meeting, but a bridge spanning from hearts to hearts, seeking to explore forgotten stories in the details of daily life, and to listen to the street pulse, and the dreams of both simple folk and creative minds alike.
                    </p>

                    {/* Pillars/Axes Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-bold text-amber-300 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Initiative Pillars: What do those two minutes hold?
                      </h3>
                      <p className="text-xs text-slate-400">
                        With deep yet simple questions, the initiative goes beyond superficial greetings to dive into human experience through several dimensions:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group">
                          <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">✨ Dreams & Aspirations:</span>
                          <p className="text-xs text-slate-400 mt-1">A free space for everyone to talk about their plans, and how they seek to achieve them, wishing for acceptance and fulfillment from God.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group">
                          <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">🧠 Vault of Memories:</span>
                          <p className="text-xs text-slate-400 mt-1">Returning to the sweet memories of the past that still dwell in the spirit, and sharing glimpses of tomorrow's dream on the horizon.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group">
                          <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">🤝 Gratitude for Bonds:</span>
                          <p className="text-xs text-slate-400 mt-1">Speaking about dear people who overflow life with love, and core moments engraved in memory that drew today's pathways.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group">
                          <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">🦾 Welcoming Challenges:</span>
                          <p className="text-xs text-slate-400 mt-1">Encouraging individuals to share their hopes and current difficulties as a badge of mutual support to strengthen resolve.</p>
                        </div>
                      </div>
                    </div>

                    {/* Vision & Objectives */}
                    <div className="space-y-4">
                      <h3 className="text-lg md:text-xl font-bold text-amber-300 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Compass className="w-5 h-5 text-amber-400" />
                        Vision of the Initiative
                      </h3>
                      <p className="text-xs text-slate-400">
                        We believe in the magical power of a sincere voice:
                      </p>
                      
                      <div className="p-4 border-l-4 border-r-0 border-amber-500 bg-amber-500/10 rounded-r-2xl my-4 italic text-sm md:text-base text-slate-200">
                        <strong>Deep Listening:</strong> We are here to hear you from our hearts without judgment, partaking in all details of your dreams and ambitions.
                      </div>

                      <div className="space-y-3 pl-1">
                        <div className="flex items-start gap-2.5">
                          <span className="text-amber-400 mt-1">💡</span>
                          <p className="text-sm text-slate-300"><strong className="text-white">Opening Gates of Hope:</strong> A simple word or a memory shared in two minutes can become a ray of light, opening closed doors or aiding tired feet.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-amber-400 mt-1">💡</span>
                          <p className="text-sm text-slate-300"><strong className="text-white">Inspiring Lost Souls:</strong> Stories of resilience and absolute joy spoken with raw sincerity guide wanderers back home.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-amber-400 mt-1">💡</span>
                          <p className="text-sm text-slate-300"><strong className="text-white">Sparking Solutions:</strong> Sometimes, just vocalizing a challenge and listening to one's own voice unlocks the answer.</p>
                        </div>
                      </div>
                    </div>

                    {/* Invitation card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-tl from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      <h3 className="text-lg font-bold text-amber-300 mb-2">📢 Invitation to Join</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">
                        The "Tell Me About Yourself in Two Minutes" initiative is open to every passerby, dreamer, and storyteller. Our banner is <strong>Sincerity and Cheerfulness</strong>, and we guarantee that two minutes of your time will light up the lives of many.
                      </p>
                      <p className="text-sm text-amber-300 font-extrabold text-center border-t border-white/5 pt-4">
                        Speak, vent, and share... We are waiting to hear you from the heart!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {lang === 'ar' ? 'تحليل كلمات المبادرة ورسالتها الإنسانية' : 'Deep Analysis of the Initiative Message'}
                </h2>
                <p className="text-slate-400 text-xs mt-2">
                  {lang === 'ar' ? 'أربعة أبعاد وجدانية ونفسية تقدمها الكلمات' : 'Four sentimental and psychological dimensions conveyed by the lyrics'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Point 1 */}
                <div className="p-6 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
                    <Heart className="w-4 h-4 fill-red-500/10 dark:fill-red-400/10" />
                  </div>
                  <h3 className={`text-base font-bold text-slate-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {lang === 'ar' ? '١. الاطمئنان وبث الأمان ومساحة الفضفضة' : '1. Mutual Comfort & Deep Venting'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'ar' 
                      ? 'تمثل الكلمات (طَمِّنِّي عَلى أَحْوَالَكْ، فَضْفَضْ عَنْ أَحْلَامَكْ) ملاذاً وهدنةً من تسارع الحياة الرقمية. المبادرة تسلب الستار عما يثقل القلوب وتدعو للتجرد ومشاركة أصدق الدعوات في دقيقتين تجعلان الإنسان يشعر بتقدير ذاتي عظيم.'
                      : '"Reassure me... Open up of your dreams" — representing a sanctuary and a truce from the rush of modern digital life. It strips away the facades of corporate pressure and invites raw, beautiful sincerity.'
                    }
                  </p>
                </div>

                {/* Point 2 */}
                <div className="p-6 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-lime-500/10 dark:bg-indigo-500/10 flex items-center justify-center text-lime-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className={`text-base font-bold text-slate-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {lang === 'ar' ? '٢. قوة الاستماع الحقيقي المخلص بالحب والقلب' : '2. Empathetic and Devoted Listening'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'ar' 
                      ? 'في زمن تتحدث فيه الشاشات ولا تصغي، تعلن المبادرة ميثاق الاستماع: (هِنِسْمَعَكْ مِنْ أَلْبِنَا، وْنِشَارٰكَك كل أَحْلَامَكْ). إنها وعدٌ بأن لكل إنسان قصة تستحق أن تروى، وأننا لا نهمل تفاصيل من غمروا حياتنا بالحب (إِحْكِي عَنْ نَاسْ عليك غَالْيِينْ).'
                      : '"We shall listen from our hearts, and share your dreams" — a covenant of sincere, non-judgmental listening in a hyper-connected yet disconnected world. Every story deserves to be heard, and every loving relationship honored.'
                    }
                  </p>
                </div>

                {/* Point 3 */}
                <div className="p-6 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className={`text-base font-bold text-slate-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {lang === 'ar' ? '٣. النور والبركة في أجمل الذكريات وحكايات الغد' : '3. Reliving Memory & Hope for Tomorrow'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'ar' 
                      ? 'التركيز على الوجدان البشري (إِحْكِي عَنْ أَجْمَلْ ذِكْرَى سَاكْنَةْ جُوَّهْ وِجْدَانَكْ، وَاحْكِي عَنْ حِلْمْ بُكْرَهْ شَايْفُو فِي طِيْفْ خَيَالَكْ) يشيد جسراً بين الماضي الدافئ والمستقبل الواعد، محفزاً العقل الباطن على التمسك بالأمل ومقاومة عقبات الحاضر.'
                      : '"Recall the most beautiful memory... And speak of tomorrow\'s dream" — bridging a warm past with a promising future. Reliving blissful moments stimulates positive neuro-networks and builds resilience against challenges.'
                    }
                  </p>
                </div>

                {/* Point 4 */}
                <div className="p-6 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Play className="w-4 h-4" />
                  </div>
                  <h3 className={`text-base font-bold text-slate-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {lang === 'ar' ? '٤. التأثير المجتمعي الإيجابي والإرشاد والصراحة' : '4. Healing Others through Sincere Sharing'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'ar' 
                      ? 'تختتم الكلمات برسالة سامية: (يْمْكِنْ صَوْتَكْ يِدِّي أَمَلْ لِيائس، وَيُمْكِنْ حَرْفْ مِنْ كَلَامَكْ يبأَا الحل). مشاركتك الصادقة بابتسامة وبشاشة (وِتٰبأَا الصَّرَاحَةْ طَرِيأَكْ) ليست مجرد فضفضة، بل قد تلهم شخصاً تائهاً وتجيب على تساؤلاته المعلقة.'
                      : '"Perhaps your voice gives hope... Sincerity is your way" — your raw, authentic self-expression could be the exact answer or lifeline a struggling soul needed. Vigor and joy are highly contagious and healing.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-8 max-w-5xl mx-auto py-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="text-center space-y-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mx-auto animate-pulse">
                  <Heart className="w-8 h-8 fill-[#D4AF37]/20" />
                </div>
                <h2 className={`text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-400 drop-shadow-sm ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {lang === 'ar' ? 'كيف تبدأ مشاركتك في المبادرة؟' : 'How Do You Participate?'}
                </h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  {lang === 'ar' 
                    ? 'اتبع هذا الدليل الإرشادي المبسط للبدء في صياغة قصتك وتوثيقها بأدوات احترافية مدمجة.'
                    : 'Follow this simplified guide to craft and document your story using our professional built-in tools.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Step 1 */}
                <div className="p-6 md:p-8 border border-slate-800 bg-slate-900/60 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center group shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold flex items-center justify-center text-lg mb-4 border border-[#D4AF37]/35 shadow-inner">
                    {lang === 'ar' ? '١' : '1'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {lang === 'ar' ? 'اكتب الملقن ونظّم أفكارك' : 'Prepare the Teleprompter'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-loose text-justify font-normal">
                    {lang === 'ar' 
                      ? 'ابدأ أولى خطواتك بكتابة وترتيب أفكارك ونقاط حكايتك الأساسية داخل أداة ملقن النصوص الذكية المدمجة في المنصة. تتيح لك هذه الأداة ضبط حجم الخط والسرعة المناسبة لقراءة الكلمات بسلاسة تامة أثناء جلوسك بثقة أمام الكاميرا، مما يساعدك على التحدث بتدفق طبيعي وعفوية مطلقة دون تشتت أو نسيان لأي تفاصيل ملهمة من قصتك الشخصية.'
                      : 'Begin your journey by writing and organizing your main ideas and key talking points inside our intelligent, custom-built teleprompter tool. Set the perfect font size and scroll speed to comfortably read your message while maintaining confident eye contact with the camera, ensuring a natural, eloquent delivery that speaks directly from your heart.'
                    }
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 md:p-8 border border-slate-800 bg-slate-900/60 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center group shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold flex items-center justify-center text-lg mb-4 border border-[#D4AF37]/35 shadow-inner">
                    {lang === 'ar' ? '٢' : '2'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {lang === 'ar' ? 'سجّل دقيقتين ببشاشة وتلقائية' : 'Spontaneous 2-Min Record'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-loose text-justify font-normal">
                    {lang === 'ar' 
                      ? 'قم بتشغيل الكاميرا والميكروفون للبدء في توثيق مقطعك المصور بمدة أقصاها دقيقتان. تذكر دائماً ألا تتكلف، بل تحدّث ببساطة وبشاشة وعفوية كاملة كأنك تجلس وتتحدث مع صديق قديم يثق بك وينصت إليك بقلب مفتوح. عبّر بمصداقية عن ذكرياتك وجوانب قوتك وأحلامك الملهمة ليلمس صدق حروفك قلوب جميع مستمعيك.'
                      : 'Activate your camera and microphone to easily record your video message with a maximum length of two minutes. Speak with natural cheerfulness, absolute sincerity, and spontaneity, as if sharing your authentic life journey, dear memories, or hopeful aspirations with an old friend who listens with ultimate warmth and respect.'
                    }
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 md:p-8 border border-slate-800 bg-slate-900/60 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center group shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold flex items-center justify-center text-lg mb-4 border border-[#D4AF37]/35 shadow-inner">
                    {lang === 'ar' ? '٣' : '3'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {lang === 'ar' ? 'دمج واستلام مقطعك بجودة كافية' : 'Render and Get Your 4K Video'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-loose text-justify font-normal">
                    {lang === 'ar' 
                      ? 'بعد انتهائك من التسجيل، استخدم محرك المعالجة والدمج الخاص بالمنصة لتركيب الفيديو والصوت بسلاسة لتنتج مقطعاً نهائياً مصمماً بطريقة احترافية وجودة فائقة تصل إلى 4K. يمكنك بعد ذلك تحميل هذا الفيديو مباشرةً لمشاركته مع مجتمع المبادرة وإرساله لغرف الاستماع وصناع الأثر، لتخلد قصتك وتلهم بها كل من يحتاج إلى طاقة أمل جديدة.'
                      : 'Once you finish recording, utilize our high-performance rendering engine to perfectly merge your audio track and video frames. Export your finished video in an ultra-high-definition format up to 4K resolution, ready to download instantly and share with the entire initiative community, spreading hope and inspiring countless listeners.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-slate-950/70 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between transition-colors duration-300">
          <p className="text-slate-500 text-xs text-center sm:text-right">
            {lang === 'ar' ? 'مبادرة لتخليد اللحظات وبث طاقة الأمل من الفرد للمجتمع' : 'An initiative to immortalize heartfelt moments of human hope'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-white/10 rounded-full text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-gradient-to-r from-lime-600 to-emerald-500 hover:from-lime-500 hover:to-emerald-400 dark:from-teal-500 dark:to-emerald-500 dark:hover:from-teal-400 dark:hover:to-emerald-400 text-white dark:text-slate-950 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all font-bold text-xs rounded-full flex items-center justify-center gap-2"
            >
              {lang === 'ar' ? 'ابدأ الآن' : 'Get Started Now'}
              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
