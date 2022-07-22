import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const SupportDonors: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="Support For Donors • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Support for Donors')}
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <p className="className=mb-3 linkify">
                {t('Support for donors text')}{' '}
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

export default SupportDonors
