import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const WhyChoose: FC = () => {
  return (
    <>
      <SEO title="Privacy • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Cryptocurrency is Going Mainstream. For Nonprofits, Too. <br></br>
          </h1>
          <h2 className="text-3xl font-semibold text-white py-3 md:text-xl">
            Every nonprofit needs to know why cryptocurrency donations are the
            next big opportunity.
          </h2>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                Why Accept Cryptocurrency Donations?
              </div>
              <p className="mb-5">
                Cryptocurrencies are on their way to achieving mainstream
                status. And believe it or not, but nonprofits like Save the
                Children led the way by being among the first institutions to
                accept Bitcoin and other cryptocurrencies. Today, charitable
                organizations of all sizes are fundraising cryptocurrency, from
                one-person teams to international operations.
              </p>
              <p className="mb-5">
                Nonprofits that take cryptocurrency donations today will have
                the early-mover advantage on their peer organizations. That
                means greater access to a relatively young, affluent crypto
                donor base that is:
              </p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>
                  Increasing its wealth via the growing crypto market cap, which
                  hit an all-time-high of $3T in 2021
                </li>
                <li>
                  Experiencing exponential user growth, similar to the wave of
                  Internet adoption in the late 1990s
                </li>
                <li>
                  Excited about using cryptocurrency and NFTs as a way to
                  support their favorite causes
                </li>
                <li className="linkify">
                  More generous on average than their cash donor counterparts
                </li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                More than Bitcoin
              </div>
              <p className="mb-5">
                Bitcoin may be “digital gold,” but the recent rise of Ethereum
                and other altcoins has opened up a new world of possibilities
                for nonprofits.
              </p>
              <p className="mb-5">
                By accepting cryptocurrency donations with B-Charity, your
                nonprofit can take advantage of a variety of innovative
                fundraising techniques that are unique to the cryptocurrency and
                blockchain ecosystem, such as:
              </p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>NFT virtual auctions</li>
                <li>Charity token donations</li>
                <li>Smart contract giving</li>
              </ul>
              <p className="mb-5">
                Of course, you can continue to fundraise with testimonials and
                dollars-to-impact appeals that have been successful in the past.
                Just be ready to answer when crypto donors ask: what can one
                Bitcoin do to support your mission?
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

export default WhyChoose
