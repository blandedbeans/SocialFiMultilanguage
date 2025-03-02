import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import SEO from '@components/utils/SEO'
import { Erc20 } from '@generated/types'
import Logger from '@lib/logger'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { useAppPersistStore } from 'src/store/app'

import Sidebar from '../Sidebar'
import Allowance from './Allowance'

export const ALLOWANCE_SETTINGS_QUERY = gql`
  query ApprovedModuleAllowanceAmount(
    $request: ApprovedModuleAllowanceAmountRequest!
  ) {
    approvedModuleAllowanceAmount(request: $request) {
      currency
      module
      allowance
      contractAddress
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    collectModules: [
      'LimitedFeeCollectModule',
      'FeeCollectModule',
      'LimitedTimedFeeCollectModule',
      'TimedFeeCollectModule',
      'FreeCollectModule',
      'RevertCollectModule'
    ],
    followModules: ['FeeFollowModule'],
    referenceModules: ['FollowerOnlyReferenceModule']
  }
}

const AllowanceSettings: NextPage = () => {
  const { t } = useTranslation('common')
  const { currentUser } = useAppPersistStore()
  const [currencyLoading, setCurrencyLoading] = useState<boolean>(false)
  const { data, loading, error, refetch } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: getAllowancePayload(DEFAULT_COLLECT_TOKEN)
    },
    skip: !currentUser?.id,
    onCompleted() {
      Logger.log('Query =>', `Fetched allowance settings`)
    }
  })

  if (error) return <Custom500 />
  if (loading) return <PageLoading message={t('Loading settings')} />
  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title={`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-5">
              <div className="text-lg font-bold">
                {t('Allow/revoke modules')}
              </div>
              <p>{t('Allowance description')}</p>
            </div>
            <div className="mt-6 label">{t('Select currency')}</div>
            <select
              className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
              onChange={(e) => {
                setCurrencyLoading(true)
                refetch({
                  request: getAllowancePayload(e.target.value)
                }).finally(() => setCurrencyLoading(false))
              }}
            >
              {data?.enabledModuleCurrencies.map((currency: Erc20) => (
                <option key={currency.address} value={currency.address}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
          {currencyLoading ? (
            <div className="py-10 space-y-3 text-center">
              <Spinner className="mx-auto" />
              <div>{t('Allowance data')}</div>
            </div>
          ) : (
            <Allowance allowance={data} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default AllowanceSettings
