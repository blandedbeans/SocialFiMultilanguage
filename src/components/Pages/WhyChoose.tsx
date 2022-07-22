import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const WhyChoose: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="WhyChoose • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Why choose title')} <br></br>
          </h1>
          <h2 className="text-3xl font-semibold text-white py-3 md:text-xl">
            {t('Why choose subtitle')}
          </h2>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Why choose text')}
              </div>
              <p className="mb-5">{t('Why choose text2')}</p>
              <p className="mb-5">{t('Why choose text3')}</p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>{t('Why choose text4')}</li>
                <li>{t('Why choose text5')}</li>
                <li>{t('Why choose text6')}</li>
                <li className="linkify">{t('Why choose text7')}</li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Why choose text8')}
              </div>
              <p className="mb-5">{t('Why choose text9')}</p>
              <p className="mb-5">{t('Why choose text10')}</p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>{t('Why choose text11')}</li>
                <li>{t('Why choose text12')}</li>
                <li>{t('Why choose text13')}</li>
              </ul>
              <p className="mb-5">{t('Why choose text14')}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default WhyChoose
