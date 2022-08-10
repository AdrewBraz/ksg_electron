import i18n from 'i18n';
import path from 'path';

export default () => {
   const i18 = new i18n()
   i18.configure({
    locales: ['en', 'de'],
    directory: path.join(__dirname, 'locales')
   })
  return i18
}

