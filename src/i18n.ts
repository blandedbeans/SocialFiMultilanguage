import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import zhCN from '../public/locales/common_chZN.json'
//import store from './utils/store'
import en from '../public/locales/common_en.json'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  preload: ['en'],
  keySeparator: false,
  interpolation: { escapeValue: false },

  lng: 'en',
  resources: {
    en: {
      common: en
    },
    zhCN: {
      common: zhCN
    }
  }
})

export default i18n
// setting to english by default
// i18nextLng is default create
//const language = store.get('i18nextLng') || 'en'

//i18next.changeLanguage(language)
