import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from 'src/constants'

const Privacy: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title={`Privacy • ${APP_NAME}`} />
      <div
        className="flex justify-center items-center w-full h-48 bg-brand-400"
        data-test="privacy-content"
      >
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Privacy Title')}
          </h1>
          <div className="flex justify-center mt-4">
            <div className="py-0.5 px-2 text-xs text-white bg-gray-800 rounded-md">
              {t('Last Updated')}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <p>{t('Policy')}</p>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Information Collection')}
              </div>
              <p className="mb-5">{t('Information Collection1')}</p>
              <p className="mb-5">{t('Information Collection2')}</p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>{t('Information Collection3')}</li>
                <li>{t('Information Collection4')}</li>
                <li>{t('Information Collection5')}</li>
                <li className="linkify">{t('Information Collection6')}</li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Information Use')}
              </div>
              <p className="mb-5">{t('Information Use1')}</p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>{t('Information Use2')}</li>
                <li>{t('Information Use3')}</li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Updating Policy')}
              </div>
              <p className="mb-5">{t('Updating Policy1')}</p>
              <p className="mb-5">{t('Updating Policy2')}</p>
              <p className="mb-5">{t('Updating Policy3')}</p>
              <p className="mb-5">{t('Updating Policy4')}</p>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Contact Us')}
              </div>
              <p className="mb-3 linkify">
                {t('Contact Us Description')}
                <a href="mailto:admin@bcharity.net">admin@bcharity.net</a>.
              </p>
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

export default Privacy
