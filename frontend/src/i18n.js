import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'welcome': 'Welcome to Dr. Jimmy Orthopedic Center',
      'upload': 'Upload Scans',
      'video': 'Video Consultation',
      'login': 'Login',
      'logout': 'Logout',
      'services': 'Our Services',
      'spine_surgery': 'Spinal Cord Surgery',
      'orthopedic': 'Orthopedic Bone Repair',
      'telemedicine': 'Telemedicine Services'
    }
  },
  sw: {
    translation: {
      'welcome': 'Karibu Kituo cha Mifupa cha Dk. Jimmy',
      'upload': 'Pakia Scan',
      'video': 'Ushauri wa Video',
      'login': 'Ingia',
      'logout': 'Toka',
      'services': 'Huduma Zetu',
      'spine_surgery': 'Upasuaji wa Uti wa Mgongo',
      'orthopedic': 'Upasuaji wa Mifupa',
      'telemedicine': 'Huduma za Mbali'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;




