import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const Resources: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="Resources • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Resources')} <br></br>
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white text-center">
                {t('Resources info')}
              </div>
              <div className="flex justify-center">
                <div className="mb-3 xl:w-96">
                  <input
                    type="search"
                    className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none
      "
                    id="exampleSearch"
                    placeholder={t('Search resources')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full h-full">
        <div className="lg:w-1/4 md:w-1/2 w-full p-4">
          <div className="p-8 rounded-xl shadow-lg">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2022/05/UPDATE-Top-Cryptocurrency-Fundraising-Trends-for-Nonprofits-in-2022-1024x576.png"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="TopFundraisingTrends"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-base">
              Four Cryptocurrency Fundraising Trends for Nonprofits in 2022
            </h2>
            <p className="text-base text-grey md:text-base">
              Explore cryptocurrency fundraising trends for nonprofits
              interested in reaching a new donor base of crypto users.
            </p>
          </div>
          <div className="p-8 rounded-xl shadow-lg">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2021/11/RESOURCES-Why-donate-bitcoins-The-Giving-Block@2x-100.jpg"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="WhyDonateCrypto"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-base">
              Why Donate Crypto
            </h2>
            <p className="text-base text-grey md:text-base">
              When you donate Bitcoin and other crypto, you generally owe no
              capital gains tax. In other words, donating crypto is better for
              your balance sheet.
            </p>
          </div>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full p-4">
          <div className="p-8 rounded-xl shadow-lg">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2021/08/RESOURCES-What-is-Cryptocurrrency-1024x576.png"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="WhatisCrypto"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-base">
              What is Cryptocurrency?
            </h2>
            <p className="text-base text-grey md:text-base">
              A cryptocurrency is a form of digital currency that uses
              cryptography and blockchain to encrypt, secure, and verify
              transactions and proof of ownership.
            </p>
          </div>
          <div className="p-8 rounded-xl shadow-lg">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2021/04/NFT-Philanthropy-Growth.png"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="TopFundraisingTrends"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-ba  se">
              NFTs and Charity: How Can You Use NFTs to Donate Cryptocurrency to
              Charity?
            </h2>
            <p className="text-base text-grey md:text-base">
              Explore cryptocurrency fundraising trends for nonprofits
              interested in reaching a new donor base of crypto users.
            </p>
          </div>
        </div>
        <div className="w-1/4 h-1/4 p-4">
          <div className="p-8 rounded-xl shadow-lg">
            <a href="/acceptedcrypto">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2021/07/RESOURCES-List-of-Nonprofits-Accepting-Crypto-Donations.png"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="CryptoWeAccept"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-base">
              Cryptos We Accept
            </h2>
            <p className="text-base text-grey md:text-base">
              Explore cryptocurrency fundraising trends for nonprofits
              interested in reaching a new donor base of crypto users.
            </p>
            <br></br>
          </div>
          <div className="p-8 rounded-xl shadow-lg">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="https://thegivingblock.com/wp-content/uploads/2022/07/Crypto-Volatility-fuels-Philanthropy-1.png"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="CryptoVolatility"
              ></img>
            </a>
            <h2 className="text-base font-semibold text-black md:text-base">
              Why should nonprofits accept cryptocurrency donations?
            </h2>
            <p className="text-base text-grey md:text-base">
              Explore cryptocurrency fundraising trends for nonprofits
              interested in reaching a new donor base of crypto users.
            </p>
            <br></br>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2 pb-6">
        <Footer />
      </div>
    </>
  )
}

export default Resources
