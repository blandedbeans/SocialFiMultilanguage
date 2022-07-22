import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const FourCryptoTrends: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="FourCryptoTrends • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Four Cryptocurrency Fundraising Trends for Nonprofits in 2022')}{' '}
            <br></br>
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                {t('Crypto Fundraising Trends for Nonprofits and Charities')}
              </div>
              <p className="mb-5">
                {t(
                  'The year 2021 was unlike any other for charities and nonprofits fundraising cryptocurrency. Over the course of the year, more and more organizations made the wise move to accept donations in Bitcoin, Ethereum and other cryptocurrencies.'
                )}
              </p>
              <p className="mb-5">{t('Accepting crypto text3')}</p>
              <ol className="mb-3 space-y-2 list-decimal list-inside">
                <li>{t('Accepting crypto text4')}</li>
                <li>{t('Accepting crypto text5')}</li>
                <li>{t('Accepting crypto text6')}</li>
                <li>{t('Accepting crypto text7')}</li>
                <li>{t('Accepting crypto text8')}</li>
              </ol>
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

export default FourCryptoTrends
