import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import { HeartIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'
import React, { FC, Fragment, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { APP_NAME, STATIC_ASSETS } from 'src/constants'

interface Props {
  name: string
  logo: string
  url: string
  size: number
  children: ReactNode
}

const Brand: FC<Props> = ({ name, logo, url, size, children }) => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="pt-10 space-y-5">
      <img
        className="mx-auto"
        style={{ height: size }}
        src={`${STATIC_ASSETS}/thanks/${logo}-${
          resolvedTheme === 'dark' ? 'dark' : 'light'
        }.svg`}
        alt={`${name}'s Logo`}
      />
      <div className="pt-2 mx-auto sm:w-2/3">{children}</div>
      <div>
        <a
          className="font-bold"
          href={url}
          target="_blank"
          rel="noreferrer noopener"
        >
          ➜ Go to {name}
        </a>
      </div>
    </div>
  )
}

const Thanks: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title={`Thanks • ${APP_NAME}`} />
      <div
        className="flex justify-center items-center w-full h-48 bg-brand-400"
        data-test="thanks-content"
      >
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-3xl font-semibold text-white md:text-4xl">
            <div>{t('Thanks Title')}</div>
            <HeartIcon className="w-7 h-7 text-pink-600" />
          </div>
          <div className="text-white">{t('Thanks Subtitle')}</div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg lg:w-2/4 max-w-3/4">
            <div className="px-5 pb-10 space-y-10 max-w-none text-center text-gray-900 divide-y dark:text-gray-200 dark:divide-gray-700">
              <Brand
                name="Vercel"
                logo="vercel"
                url={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
                size={40}
              >
                {t('Vercel')}
              </Brand>
              <Brand
                name="Gitpod"
                logo="gitpod"
                url="https://gitpod.io"
                size={50}
              >
                {t('Gitpod')}
              </Brand>
              <Brand
                name="Imagekit"
                logo="imagekit"
                url="https://imagekit.io"
                size={50}
              >
                {t('Imagekit')}
              </Brand>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-5 pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Thanks
