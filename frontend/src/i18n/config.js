import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.treatments': 'Treatments',
      'nav.upload': 'Upload Scans',
      'nav.video': 'Video Consultation',
      'nav.about': 'About Dr. Jimmy',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Login',
      'hero.title': 'Dr. Jimmy – International Orthopedic & Spine Surgeon',
      'hero.subtitle': 'Bone repair, spine surgery, and telemedicine for patients who cannot travel',
      'hero.upload': 'Upload Your Scans',
      'hero.consult': 'Book Video Meeting',
      'treatments.spine.title': 'Spinal Cord Surgery',
      'treatments.spine.desc': 'Treatment for herniated discs, spinal fractures, and tumors',
      'treatments.ortho.title': 'Orthopedic Bone Repair',
      'treatments.ortho.desc': 'Fracture repair and joint replacement surgery',
      'treatments.tele.title': 'Telemedicine Services',
      'treatments.tele.desc': 'Video consultations for remote patients',
      'upload.title': 'Upload Your Medical Scans',
      'upload.subtitle': 'MRI, X-Ray, or CT-Scan',
      'upload.drag': 'Drag & drop your files here',
      'upload.or': 'or',
      'upload.browse': 'Browse Files',
      'upload.type': 'Scan Type',
      'upload.bodypart': 'Body Part',
      'upload.submit': 'Upload Scan',
      'video.title': 'Video Consultation',
      'video.subtitle': 'Meet with Dr. Jimmy from anywhere',
      'video.book': 'Book Appointment',
      'video.join': 'Join Meeting',
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success!'
    }
  },
  sw: {
    translation: {
      'nav.home': 'Nyumbani',
      'nav.treatments': 'Huduma',
      'nav.upload': 'Pakia Scan',
      'nav.video': 'Ushauri wa Video',
      'nav.about': 'Kuhusu Dk. Jimmy',
      'nav.dashboard': 'Dashibodi',
      'nav.login': 'Ingia',
      'hero.title': 'Dk. Jimmy – Daktari wa Kimataifa wa Upasuaji wa Mifupa na Uti wa Mgongo',
      'hero.subtitle': 'Ukarabati wa mifupa, upasuaji wa uti wa mgongo, na huduma za mbali kwa wagonjwa wasioweza kusafiri',
      'hero.upload': 'Pakia Scan Zako',
      'hero.consult': 'Weka Namba ya Video',
      'treatments.spine.title': 'Upasuaji wa Uti wa Mgongo',
      'treatments.spine.desc': 'Matibabu ya hernia ya diski, mgongo uliojiunika, na uvimbe',
      'treatments.ortho.title': 'Upasuaji wa Mifupa',
      'treatments.ortho.desc': 'Kurekebisha mifupa iliyovunjika na uingizaji wa viungo',
      'treatments.tele.title': 'Huduma za Mbali',
      'treatments.tele.desc': 'Ushauri wa video kwa wagonjwa wa mbali',
      'upload.title': 'Pakia Scan Yako ya Matibabu',
      'upload.subtitle': 'MRI, X-ray, au CT-scan',
      'upload.drag': 'Buruta na uachie faili zako hapa',
      'upload.or': 'au',
      'upload.browse': 'Chagua Faili',
      'upload.type': 'Aina ya Scan',
      'upload.bodypart': 'Sehemu ya Mwili',
      'upload.submit': 'Pakia Scan',
      'video.title': 'Ushauri wa Video',
      'video.subtitle': 'Kutana na Dk. Jimmy popote ulipo',
      'video.book': 'Weka Namba',
      'video.join': 'Ingia Kwenye Kikao',
      'common.loading': 'Inapakia...',
      'common.error': 'Hitilafu imetokea',
      'common.success': 'Imefanikiwa!'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;




