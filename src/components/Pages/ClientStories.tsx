import SEO from '@components/utils/SEO'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const ClientStories: FC = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <SEO title="ClientStories • BCharity" />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {t('Client stories title')}
          </h1>
        </div>
      </div>
    </>
  )
}

export default ClientStories
