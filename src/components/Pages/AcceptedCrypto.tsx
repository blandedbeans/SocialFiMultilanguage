import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const AcceptedCrypto: FC = () => {
  return (
    <>
      <SEO title="Privacy • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Accepted Cryptocurrencies <br></br>
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white text-center">
                Current cryptocurrencies that B-Charity accepts:
              </div>
              <div className="flex justify-center"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full h-full">
        <div className="lg:w-1/4 md:w-1/2 w-full p-4">
          <div className="p-8 rounded-xl shadow-lg flex justify-center">
            <a href="https://ecssen.ca/">
              <img
                width="300"
                height="300"
                src="VHR_logo.jpg"
                className="pt-cv-thumbnail img-non skip-lazy no-lazyload rounded"
                alt="VHR"
              ></img>
              <h2 className="text-base font-semibold text-black md:text-base flex justify-center">
                Volunteer Hour Token (VHR)
              </h2>
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2 pb-6">
        <Footer />
      </div>
    </>
  )
}

export default AcceptedCrypto
