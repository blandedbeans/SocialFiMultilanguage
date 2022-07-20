import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const Support: FC = () => {
  return (
    <>
      <SEO title="Privacy • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Support For Organizations
          </h1>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <p className="mb-5">
                B-Charity provides and maintains the medium used to transfer
                volunteer hours
              </p>
              <p className="className=mb-3 linkify">
                If you have any questions or require assistance you can contact
                us at <a href="mailto:admin@bcharity.net">admin@bcharity.net</a>
                .
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

export default Support
