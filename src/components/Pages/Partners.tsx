import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const Partners: FC = () => {
  return (
    <>
      <SEO title="Privacy • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Organizations partnered with B-Charity
          </h1>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 w-full p-4">
        <div className="p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-black md:text-xl">
            Ecssen Career School
          </h2>
          <a href="https://ecssen.ca/">
            <img
              width="300"
              height="300"
              src="https://ecssen.ca/wp-content/uploads/2022/03/logo_ecssen_title_new.png"
              className="pt-cv-thumbnail img-non skip-lazy no-lazyload"
              alt="Ecssen"
            ></img>
          </a>
        </div>
      </div>
    </>
  )
}

export default Partners
