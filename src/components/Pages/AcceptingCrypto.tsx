import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const AcceptingCrypto: FC = () => {
  return (
    <>
      <SEO title="Privacy • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            An All-in-One Solution to Track Volunteer Hours <br></br>
          </h1>
          <h2 className="text-3xl font-semibold text-white py-3 md:text-xl">
            Tracking volunteer hours should be transparent, easy and impactful.
            B-Charity was built to make that possible.
          </h2>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                Tracking Volunteer Hours Made Simple
              </div>
              <p className="mb-5">
                B-Charity provides an easy to use system that allows for
                transparent, simple, and effective way to track volunteer hours.
              </p>
              <p className="mb-5">
                Once connected, tracking volunteer hours can be accomplished in
                a few easy steps:
              </p>
              <ol className="mb-3 space-y-2 list-decimal list-inside">
                <li>Register your organization by contacting B-Charity</li>
                <li>
                  B-Charity hosts fundraising campaigns and B-Charity receives
                  DAI, a cryptocurrency
                </li>
                <li>
                  Partnered charities receisAve Volunteer Tokens in the form of
                  VHR and a portion of DAI
                </li>
                <li>
                  Charities can then host volunteer activities and send VHR to
                  volunteers after completed service
                </li>
                <li>
                  VHR is then stored on the blockchain and organizations and
                  volunteers can see their VHR at any time
                </li>
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

export default AcceptingCrypto
