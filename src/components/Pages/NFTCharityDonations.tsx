import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const SupportDonors: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="How NFTs can be used to donate to charities • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            NFT creators continue to contribute auction proceeds to charities
            around the world
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <p className="className=mb-3">
                If you have eyes and an internet connection, you’ve probably
                seen the buzz about NFTs. The recent influx of wealth and
                interest in NFTs has resulted in a tsunami of NFT related
                cryptocurrency donations. NFTs have even sold for $69+ million
                which is leaving some creators with a large tax bill. Many of
                those artists have come to us looking for ways to offset some of
                their tax burdens. It isn’t surprising to hear that traditional
                art donations are common in the world of nonprofits, in large
                part due to the tax benefits of donating appreciated property.
                Some of the nonprofits working with us have raised over $100,000
                from NFT related cryptocurrency donations alone.
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
