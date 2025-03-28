// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "YouTube Downloader",
      youtubeUrl: "YouTube URL",
      format: "Format",
      downloadClip: "Download a specific clip",
      startTime: "Start Time (HH:MM:SS)",
      endTime: "End Time (HH:MM:SS)",
      download: "Download",
      downloading: "Downloading...",
      cancel: "Cancel and Start New Download",
      downloadComplete: "Download Complete!",
      downloadVideo: "Download Video",
      downloadThumbnail: "Download Thumbnail",
      error: "Error",
      tryAgain: "Try Again",
      selectLanguage: "Select Language",
      info1: "Supports multiple platforms such as YouTube, Vimeo, and Dailymotion.",
      info2: "Allows downloading full videos or specific clips.",
      info3: "Offers options for video formats and quality.",
      info4: "Provides fast downloads using a scalable backend.",
      footerText: "Follow me on social media:",
      intro: "Download and convert YouTube videos quickly and easily in multiple formats.",
      getStarted: "Get Started",
      downloadYourVideo: "Download Your Video",
      supportedPlatforms: "Supported Platforms",
      step1Title: "Step 1: Enter URL",
      step1Desc: "Paste the YouTube URL into the input field.",
      step2Title: "Step 2: Choose Format",
      step2Desc: "Select your preferred video or audio format.",
      step3Title: "Step 3: Download",
      step3Desc: "Click on download to start the process and then get the file.",
      introFeatures: "What You Can Do With This Site",
      introDesc: "This website allows you to download YouTube videos in various formats, create clips, and even download thumbnails. It supports multiple platforms and provides a fast, scalable solution for video conversion.",
      feature1: "Download full videos in multiple formats",
      feature2: "Extract and download specific clips",
      feature3: "Get high-quality thumbnails",
      feature4: "User-friendly and responsive design"
    }
  },
  es: {
    translation: {
      title: "Descargador de YouTube",
      youtubeUrl: "URL de YouTube",
      format: "Formato",
      downloadClip: "Descargar un clip específico",
      startTime: "Hora de inicio (HH:MM:SS)",
      endTime: "Hora de fin (HH:MM:SS)",
      download: "Descargar",
      downloading: "Descargando...",
      cancel: "Cancelar y comenzar nueva descarga",
      downloadComplete: "¡Descarga completa!",
      downloadVideo: "Descargar video",
      downloadThumbnail: "Descargar miniatura",
      error: "Error",
      tryAgain: "Intentar de nuevo",
      selectLanguage: "Seleccionar idioma",
      info1: "Soporta múltiples plataformas como YouTube, Vimeo y Dailymotion.",
      info2: "Permite descargar videos completos o clips específicos.",
      info3: "Ofrece opciones para formatos y calidades de video.",
      info4: "Proporciona descargas rápidas con un backend escalable.",
      footerText: "Sígueme en las redes sociales:",
      intro: "Descarga y convierte videos de YouTube rápida y fácilmente en múltiples formatos.",
      getStarted: "Comenzar",
      downloadYourVideo: "Descarga tu video",
      supportedPlatforms: "Plataformas Soportadas",
      step1Title: "Paso 1: Introduce la URL",
      step1Desc: "Pega la URL de YouTube en el campo de entrada.",
      step2Title: "Paso 2: Elige el formato",
      step2Desc: "Selecciona el formato de video o audio que prefieras.",
      step3Title: "Paso 3: Descarga",
      step3Desc: "Haz clic en descargar para iniciar el proceso y obtener el archivo.",
      introFeatures: "Lo que puedes hacer con este sitio",
      introDesc: "Este sitio web te permite descargar videos de YouTube en varios formatos, crear clips y descargar miniaturas. Soporta múltiples plataformas y ofrece una solución rápida y escalable para la conversión de videos.",
      feature1: "Descargar videos completos en múltiples formatos",
      feature2: "Extraer y descargar clips específicos",
      feature3: "Obtener miniaturas de alta calidad",
      feature4: "Diseño intuitivo y responsivo"
    }
  },
  hi: {
    translation: {
      title: "YouTube डाउनलोडर",
      youtubeUrl: "YouTube URL",
      format: "फ़ॉर्मेट",
      downloadClip: "एक विशिष्ट क्लिप डाउनलोड करें",
      startTime: "प्रारंभ समय (HH:MM:SS)",
      endTime: "समाप्ति समय (HH:MM:SS)",
      download: "डाउनलोड करें",
      downloading: "डाउनलोड हो रहा है...",
      cancel: "रद्द करें और नई डाउनलोड शुरू करें",
      downloadComplete: "डाउनलोड पूरा हुआ!",
      downloadVideo: "वीडियो डाउनलोड करें",
      downloadThumbnail: "थंबनेल डाउनलोड करें",
      error: "त्रुटि",
      tryAgain: "पुनः प्रयास करें",
      selectLanguage: "भाषा चुनें",
      info1: "YouTube, Vimeo, और Dailymotion जैसे कई प्लेटफ़ॉर्म का समर्थन करता है।",
      info2: "पूरे वीडियो या विशिष्ट क्लिप डाउनलोड करने की अनुमति देता है।",
      info3: "वीडियो फ़ॉर्मेट और गुणवत्ता के विकल्प प्रदान करता है।",
      info4: "स्केलेबल बैकएंड का उपयोग करके तेज डाउनलोड प्रदान करता है।",
      footerText: "सोशल मीडिया पर मेरा अनुसरण करें:",
      intro: "कई फ़ॉर्मेट में YouTube वीडियो को जल्दी और आसानी से डाउनलोड और कन्वर्ट करें।",
      getStarted: "शुरू करें",
      downloadYourVideo: "अपना वीडियो डाउनलोड करें",
      supportedPlatforms: "समर्थित प्लेटफ़ॉर्म",
      step1Title: "चरण 1: URL दर्ज करें",
      step1Desc: "YouTube URL को इनपुट फील्ड में पेस्ट करें।",
      step2Title: "चरण 2: फ़ॉर्मेट चुनें",
      step2Desc: "अपने पसंदीदा वीडियो या ऑडियो फ़ॉर्मेट का चयन करें।",
      step3Title: "चरण 3: डाउनलोड करें",
      step3Desc: "डाउनलोड पर क्लिक करें और फ़ाइल प्राप्त करें।",
      introFeatures: "इस साइट से आप क्या कर सकते हैं",
      introDesc: "यह वेबसाइट आपको विभिन्न फ़ॉर्मेट में YouTube वीडियो डाउनलोड करने, क्लिप बनाने और थंबनेल डाउनलोड करने की अनुमति देती है।",
      feature1: "कई फ़ॉर्मेट में पूरे वीडियो डाउनलोड करें",
      feature2: "विशिष्ट क्लिप्स को एक्सट्रैक्ट और डाउनलोड करें",
      feature3: "उच्च गुणवत्ता वाले थंबनेल प्राप्त करें",
      feature4: "यूजर-फ्रेंडली और रिस्पॉन्सिव डिजाइन"
    }
  },
  te: {
    translation: {
      title: "YouTube డౌన్లోడర్",
      youtubeUrl: "YouTube URL",
      format: "ఫార్మాట్",
      downloadClip: "ఒక ప్రత్యేక క్లిప్ డౌన్లోడ్ చేయండి",
      startTime: "ప్రారంభ సమయం (HH:MM:SS)",
      endTime: "అవసాన సమయం (HH:MM:SS)",
      download: "డౌన్లోడ్ చేయండి",
      downloading: "డౌన్లోడ్ అవుతోంది...",
      cancel: "రద్దు చేసి కొత్త డౌన్లోడ్ ప్రారంభించండి",
      downloadComplete: "డౌన్లోడ్ పూర్తి!",
      downloadVideo: "వీడియో డౌన్లోడ్ చేయండి",
      downloadThumbnail: "థంబ్‌నెయిల్ డౌన్లోడ్ చేయండి",
      error: "లోపం",
      tryAgain: "మళ్లీ ప్రయత్నించండి",
      selectLanguage: "భాషను ఎంచుకోండి",
      info1: "YouTube, Vimeo, మరియు Dailymotion వంటి అనేక ప్లాట్‌ఫారమ్‌లకు మద్దతు ఇస్తుంది.",
      info2: "పూర్తి వీడియోలు లేదా ప్రత్యేక క్లిప్స్‌ను డౌన్లోడ్ చేయడానికి అనుమతిస్తుంది.",
      info3: "వీడియో ఫార్మాట్లు మరియు నాణ్యత కోసం ఎంపికలను అందిస్తుంది.",
      info4: "స్కేలబుల్ బ్యాకెండ్ ఉపయోగించి వేగవంతమైన డౌన్లోడ్‌లను అందిస్తుంది.",
      footerText: "సోషల్ మీడియా‌లో నన్ను అనుసరించండి:",
      intro: "ఎక్కువ ఫార్మాట్లలో YouTube వీడియోలను త్వరగా మరియు సులభంగా డౌన్లోడ్ మరియు కన్వర్ట్ చేయండి.",
      getStarted: "ప్రారంభించండి",
      downloadYourVideo: "మీ వీడియోను డౌన్లోడ్ చేయండి",
      supportedPlatforms: "మద్దతు ఇవ్వబడిన ప్లాట్‌ఫారమ్‌లు",
      step1Title: "దశ 1: URL నమోదు చేయండి",
      step1Desc: "ఇన్పుట్ ఫీల్డ్‌లో YouTube URL ని పేస్ట్ చేయండి.",
      step2Title: "దశ 2: ఫార్మాట్ ఎంచుకోండి",
      step2Desc: "మీ ఇష్టమైన వీడియో లేదా ఆడియో ఫార్మాట్‌ని ఎంచుకోండి.",
      step3Title: "దశ 3: డౌన్లోడ్ చేయండి",
      step3Desc: "డౌన్లోడ్ పై క్లిక్ చేసి ఫైల్ పొందండి.",
      introFeatures: "ఈ సైట్‌తో మీరు చేయగలిగేది ఏమిటి",
      introDesc: "ఈ వెబ్‌సైట్ వివిధ ఫార్మాట్లలో YouTube వీడియోలను, క్లిప్స్‌ని డౌన్లోడ్ చేయడం, మరియు థంబ్‌నెయిల్స్‌ని డౌన్లోడ్ చేయడం వంటి పనులను నిర్వహిస్తుంది. ఇది అనేక ప్లాట్‌ఫారమ్‌లకు మద్దతు ఇస్తుంది మరియు వేగవంతమైన, స్కేలబుల్ పరిష్కారాన్ని అందిస్తుంది.",
      feature1: "అనేక ఫార్మాట్లలో పూర్తి వీడియోలను డౌన్లోడ్ చేయండి",
      feature2: "ప్రత్యేక క్లిప్స్‌ని ఎక్స్‌ట్రాక్ట్ చేసి డౌన్లోడ్ చేయండి",
      feature3: "ఉన్నత నాణ్యత గల థంబ్‌నెయిల్స్ పొందండి",
      feature4: "సులభమైన మరియు స్పందించే డిజైన్"
    }
  },
  ta: {
    translation: {
      title: "YouTube டவுன்லோடர்",
      youtubeUrl: "YouTube URL",
      format: "வடிவம்",
      downloadClip: "ஒரு குறிப்பிட்ட கிளிப் பதிவிறக்கம் செய்",
      startTime: "தொடக்க நேரம் (HH:MM:SS)",
      endTime: "முடிவு நேரம் (HH:MM:SS)",
      download: "பதிவிறக்கம் செய்",
      downloading: "பதிவிறக்கம் ஆகி வருகிறது...",
      cancel: "ரத்துசெய்து புதிய பதிவிறக்கம் துவங்கு",
      downloadComplete: "பதிவிறக்கம் முடிந்தது!",
      downloadVideo: "வீடியோ பதிவிறக்கம் செய்",
      downloadThumbnail: "தம்ப்னெயில் பதிவிறக்கம் செய்",
      error: "பிழை",
      tryAgain: "மீண்டும் முயற்சி செய்",
      selectLanguage: "மொழியை தேர்வு செய்",
      info1: "YouTube, Vimeo மற்றும் Dailymotion போன்ற பல தளங்களை ஆதரிக்கிறது.",
      info2: "முழு வீடியோக்களையும் அல்லது குறிப்பிட்ட கிளிப்புகளையும் பதிவிறக்கம் செய்ய அனுமதிக்கிறது.",
      info3: "வீடியோ வடிவங்கள் மற்றும் தரத்திற்கான விருப்பங்களை வழங்குகிறது.",
      info4: "அளவுகோலுக்கு ஏற்ப வேகமாக பதிவிறக்கம் செய்ய உதவுகிறது.",
      footerText: "சமூக ஊடகங்களில் என்னைப் பின்தொடரவும்:",
      intro: "பல வடிவங்களில் YouTube வீடியோக்களை விரைவாகவும் எளிதாகவும் பதிவிறக்கம் மற்றும் மாற்றவும்.",
      getStarted: "தொடங்கு",
      downloadYourVideo: "உங்கள் வீடியோவை பதிவிறக்கம் செய்",
      supportedPlatforms: "ஆதரிக்கப்படும் தளங்கள்",
      step1Title: "படி 1: URL ஐ உள்ளிடுக",
      step1Desc: "YouTube URL ஐ உள்ளீட்டு புலத்தில் ஒட்டுக.",
      step2Title: "படி 2: வடிவத்தை தேர்வு செய்",
      step2Desc: "உங்கள் விருப்பமான வீடியோ அல்லது ஒலி வடிவத்தை தேர்வு செய்.",
      step3Title: "படி 3: பதிவிறக்கம் செய்",
      step3Desc: "பதிவிறக்கத்தை துவங்கு 'பதிவிறக்கம்' பொத்தானை அழுத்துங்கள்.",
      introFeatures: "இந்த தளத்தில் நீங்கள் செய்யக்கூடியவை",
      introDesc: "இந்த இணையதளம் பல வடிவங்களில் YouTube வீடியோக்களை பதிவிறக்கம் செய்ய, கிளிப்புகளை உருவாக்க, தம்ப்னெயில்களை பதிவிறக்கம் செய்ய உதவுகிறது. இது பல தளங்களையும் ஆதரிக்கிறது மற்றும் வேகமான, அளவுகோலான தீர்வை வழங்குகிறது.",
      feature1: "பல வடிவங்களில் முழு வீடியோக்களை பதிவிறக்கம் செய்",
      feature2: "குறிப்பிட்ட கிளிப்புகளை எடுத்து பதிவிறக்கம் செய்",
      feature3: "உயர் தரமான தம்ப்னெயில்களைப் பெறுங்கள்",
      feature4: "பயனருக்கு உகந்த, பதிலளிக்கும் வடிவமைப்பு"
    }
  },
  bn: {
    translation: {
      title: "YouTube ডাউনলোডার",
      youtubeUrl: "YouTube URL",
      format: "ফরম্যাট",
      downloadClip: "একটি নির্দিষ্ট ক্লিপ ডাউনলোড করুন",
      startTime: "শুরুর সময় (HH:MM:SS)",
      endTime: "শেষ সময় (HH:MM:SS)",
      download: "ডাউনলোড করুন",
      downloading: "ডাউনলোড হচ্ছে...",
      cancel: "বাতিল করুন এবং নতুন ডাউনলোড শুরু করুন",
      downloadComplete: "ডাউনলোড সম্পন্ন!",
      downloadVideo: "ভিডিও ডাউনলোড করুন",
      downloadThumbnail: "থাম্বনেইল ডাউনলোড করুন",
      error: "ত্রুটি",
      tryAgain: "পুনরায় চেষ্টা করুন",
      selectLanguage: "ভাষা নির্বাচন করুন",
      info1: "YouTube, Vimeo, এবং Dailymotion সহ একাধিক প্ল্যাটফর্ম সমর্থন করে।",
      info2: "পূর্ণ ভিডিও বা নির্দিষ্ট ক্লিপ ডাউনলোড করতে দেয়।",
      info3: "ভিডিও ফরম্যাট এবং মানের বিকল্প প্রদান করে।",
      info4: "স্কেলযোগ্য ব্যাকএন্ড ব্যবহার করে দ্রুত ডাউনলোড সরবরাহ করে।",
      footerText: "সোশ্যাল মিডিয়ায় আমার অনুসরণ করুন:",
      intro: "বিভিন্ন ফরম্যাটে YouTube ভিডিও দ্রুত এবং সহজে ডাউনলোড ও রূপান্তর করুন।",
      getStarted: "শুরু করুন",
      downloadYourVideo: "আপনার ভিডিও ডাউনলোড করুন",
      supportedPlatforms: "সমর্থিত প্ল্যাটফর্ম",
      step1Title: "ধাপ ১: URL প্রবেশ করুন",
      step1Desc: "ইনপুট ফিল্ডে YouTube URL পেস্ট করুন।",
      step2Title: "ধাপ ২: ফরম্যাট নির্বাচন করুন",
      step2Desc: "আপনার পছন্দসই ভিডিও বা অডিও ফরম্যাট নির্বাচন করুন।",
      step3Title: "ধাপ ৩: ডাউনলোড করুন",
      step3Desc: "ডাউনলোডে ক্লিক করুন এবং ফাইলটি পান।",
      introFeatures: "এই সাইট দিয়ে আপনি যা করতে পারেন",
      introDesc: "এই ওয়েবসাইটটি আপনাকে বিভিন্ন ফরম্যাটে YouTube ভিডিও ডাউনলোড, ক্লিপ তৈরি এবং থাম্বনেইল ডাউনলোড করতে দেয়। এটি একাধিক প্ল্যাটফর্ম সমর্থন করে এবং দ্রুত, স্কেলযোগ্য সমাধান প্রদান করে।",
      feature1: "বিভিন্ন ফরম্যাটে পুরো ভিডিও ডাউনলোড করুন",
      feature2: "নির্দিষ্ট ক্লিপগুলি বের করে ডাউনলোড করুন",
      feature3: "উচ্চমানের থাম্বনেইল পান",
      feature4: "ব্যবহারকারী-বান্ধব এবং প্রতিক্রিয়াশীল ডিজাইন"
    }
  },
  mr: {
    translation: {
      title: "YouTube डाउनलोडर",
      youtubeUrl: "YouTube URL",
      format: "फॉरमॅट",
      downloadClip: "विशिष्ट क्लिप डाउनलोड करा",
      startTime: "सुरुवातीचा वेळ (HH:MM:SS)",
      endTime: "शेवटचा वेळ (HH:MM:SS)",
      download: "डाउनलोड करा",
      downloading: "डाउनलोड होत आहे...",
      cancel: "रद्द करा आणि नवीन डाउनलोड सुरू करा",
      downloadComplete: "डाउनलोड पूर्ण!",
      downloadVideo: "व्हिडिओ डाउनलोड करा",
      downloadThumbnail: "थंबनेल डाउनलोड करा",
      error: "त्रुटी",
      tryAgain: "पुन्हा प्रयत्न करा",
      selectLanguage: "भाषा निवडा",
      info1: "YouTube, Vimeo, आणि Dailymotion सारख्या अनेक प्लॅटफॉर्मना समर्थन करते.",
      info2: "पूर्ण व्हिडिओ किंवा विशिष्ट क्लिप डाउनलोड करण्याची परवानगी देते.",
      info3: "व्हिडिओ फॉरमॅट आणि गुणवत्ता यासाठी पर्याय देते.",
      info4: "स्केलेबल बॅकएंड वापरून जलद डाउनलोड प्रदान करते.",
      footerText: "सोशल मीडियावर माझे अनुसरण करा:",
      intro: "विविध फॉरमॅटमध्ये YouTube व्हिडिओ जलद आणि सोप्या पद्धतीने डाउनलोड आणि कन्व्हर्ट करा.",
      getStarted: "सुरू करा",
      downloadYourVideo: "आपला व्हिडिओ डाउनलोड करा",
      supportedPlatforms: "समर्थित प्लॅटफॉर्म",
      step1Title: "पाऊल १: URL प्रविष्ट करा",
      step1Desc: "इनपुट फील्डमध्ये YouTube URL पेस्ट करा.",
      step2Title: "पाऊल २: फॉरमॅट निवडा",
      step2Desc: "आपल्या आवडत्या व्हिडिओ किंवा ऑडिओ फॉरमॅटची निवड करा.",
      step3Title: "पाऊल ३: डाउनलोड करा",
      step3Desc: "डाउनलोडवर क्लिक करा आणि फाइल मिळवा.",
      introFeatures: "या साइटने आपण काय करू शकता",
      introDesc: "ही वेबसाइट आपल्याला विविध फॉरमॅटमध्ये YouTube व्हिडिओ डाउनलोड करण्यास, क्लिप तयार करण्यास आणि थंबनेल डाउनलोड करण्यास मदत करते. ती अनेक प्लॅटफॉर्मना समर्थन करते आणि जलद, स्केलेबल समाधान देते.",
      feature1: "विविध फॉरमॅटमध्ये संपूर्ण व्हिडिओ डाउनलोड करा",
      feature2: "विशिष्ट क्लिप्स काढून डाउनलोड करा",
      feature3: "उच्च दर्जाचे थंबनेल मिळवा",
      feature4: "वापरकर्ता-मित्र आणि प्रतिसादक्षम डिझाइन"
    }
  },
  fr: {
    translation: {
      title: "Téléchargeur YouTube",
      youtubeUrl: "URL YouTube",
      format: "Format",
      downloadClip: "Télécharger un clip spécifique",
      startTime: "Heure de début (HH:MM:SS)",
      endTime: "Heure de fin (HH:MM:SS)",
      download: "Télécharger",
      downloading: "Téléchargement en cours...",
      cancel: "Annuler et recommencer le téléchargement",
      downloadComplete: "Téléchargement terminé !",
      downloadVideo: "Télécharger la vidéo",
      downloadThumbnail: "Télécharger la miniature",
      error: "Erreur",
      tryAgain: "Réessayer",
      selectLanguage: "Choisir la langue",
      info1: "Prend en charge plusieurs plateformes telles que YouTube, Vimeo et Dailymotion.",
      info2: "Permet de télécharger des vidéos complètes ou des clips spécifiques.",
      info3: "Offre des options pour le format et la qualité de la vidéo.",
      info4: "Fournit des téléchargements rapides à l'aide d'un backend évolutif.",
      footerText: "Suivez-moi sur les réseaux sociaux :",
      intro: "Téléchargez et convertissez rapidement et facilement des vidéos YouTube dans plusieurs formats.",
      getStarted: "Commencer",
      downloadYourVideo: "Téléchargez votre vidéo",
      supportedPlatforms: "Plateformes supportées",
      step1Title: "Étape 1 : Entrez l'URL",
      step1Desc: "Collez l'URL YouTube dans le champ de saisie.",
      step2Title: "Étape 2 : Choisissez le format",
      step2Desc: "Sélectionnez votre format vidéo ou audio préféré.",
      step3Title: "Étape 3 : Téléchargez",
      step3Desc: "Cliquez sur télécharger pour démarrer le processus et obtenir le fichier.",
      introFeatures: "Ce que vous pouvez faire avec ce site",
      introDesc: "Ce site vous permet de télécharger des vidéos YouTube dans divers formats, de créer des clips et même de télécharger des miniatures. Il prend en charge plusieurs plateformes et offre une solution rapide et évolutive pour la conversion vidéo.",
      feature1: "Téléchargez des vidéos complètes dans plusieurs formats",
      feature2: "Extrait et téléchargez des clips spécifiques",
      feature3: "Obtenez des miniatures de haute qualité",
      feature4: "Conception conviviale et réactive"
    }
  },
  zh: {
    translation: {
      title: "YouTube下载器",
      youtubeUrl: "YouTube网址",
      format: "格式",
      downloadClip: "下载特定剪辑",
      startTime: "开始时间 (HH:MM:SS)",
      endTime: "结束时间 (HH:MM:SS)",
      download: "下载",
      downloading: "下载中...",
      cancel: "取消并开始新的下载",
      downloadComplete: "下载完成！",
      downloadVideo: "下载视频",
      downloadThumbnail: "下载缩略图",
      error: "错误",
      tryAgain: "再试一次",
      selectLanguage: "选择语言",
      info1: "支持YouTube、Vimeo和Dailymotion等多个平台。",
      info2: "允许下载完整视频或特定剪辑。",
      info3: "提供视频格式和质量选项。",
      info4: "使用可扩展的后端提供快速下载。",
      footerText: "关注我的社交媒体：",
      intro: "快速轻松地下载和转换YouTube视频为多种格式。",
      getStarted: "开始使用",
      downloadYourVideo: "下载您的视频",
      supportedPlatforms: "支持的平台",
      step1Title: "步骤1：输入网址",
      step1Desc: "将YouTube网址粘贴到输入框中。",
      step2Title: "步骤2：选择格式",
      step2Desc: "选择您偏好的视频或音频格式。",
      step3Title: "步骤3：下载",
      step3Desc: "点击下载开始处理并获取文件。",
      introFeatures: "您可以用此网站做什么",
      introDesc: "该网站允许您以多种格式下载YouTube视频、制作剪辑以及下载缩略图。它支持多个平台，并提供快速、可扩展的视频转换解决方案。",
      feature1: "以多种格式下载完整视频",
      feature2: "提取并下载特定剪辑",
      feature3: "获取高质量缩略图",
      feature4: "用户友好且响应迅速的设计"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
         