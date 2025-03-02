import { Card, CardBody } from '@components/UI/Card'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import isVerified from '@lib/isVerified'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppPersistStore } from 'src/store/app'
const Verification: FC = () => {
  const { t } = useTranslation('common')
  const { currentUser } = useAppPersistStore()

  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="text-lg font-bold">{t('Verified title')}</div>
        {isVerified(currentUser?.id) ? (
          <div className="flex items-center space-x-1.5">
            <span>{t('Is verified2')}</span>
            <BadgeCheckIcon className="w-5 h-5 text-brand" />
          </div>
        ) : (
          <div>
            {t('Is verified1')}{' '}
            <a
              href="https://tally.so/r/wgDajK"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('Request verification')}
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default Verification
