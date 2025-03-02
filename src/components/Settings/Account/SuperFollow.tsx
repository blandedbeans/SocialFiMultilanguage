import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation, useQuery } from '@apollo/client'
import IndexStatus from '@components/Shared/IndexStatus'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import {
  CreateSetFollowModuleBroadcastItemResult,
  Erc20
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { StarIcon, XIcon } from '@heroicons/react/outline'
import getTokenImage from '@lib/getTokenImage'
import Logger from '@lib/logger'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  CONNECT_WALLET,
  DEFAULT_COLLECT_TOKEN,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string } from 'zod'

const MODULES_CURRENCY_QUERY = gql`
  query EnabledCurrencyModules($request: SingleProfileQueryRequest!) {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
    profile(request: $request) {
      followModule {
        __typename
      }
    }
  }
`

export const CREATE_SET_FOLLOW_MODULE_TYPED_DATA_MUTATION = gql`
  mutation CreateSetFollowModuleTypedData(
    $options: TypedDataOptions
    $request: CreateSetFollowModuleRequest!
  ) {
    createSetFollowModuleTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          followModule
          followModuleInitData
        }
      }
    }
  }
`

const SuperFollow: FC = () => {
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const { t } = useTranslation('common')
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    DEFAULT_COLLECT_TOKEN
  )
  const [selectedCurrencySymobol, setSelectedCurrencySymobol] =
    useState<string>('WMATIC')
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: currencyData, loading } = useQuery(MODULES_CURRENCY_QUERY, {
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id,
    onCompleted() {
      Logger.log('Query =>', `Fetched enabled module currencies`)
    }
  })

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setFollowModuleWithSig',
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const newCrowdfundSchema = object({
    amount: string().min(1, { message: t('Invalid amount') }),
    recipient: string()
      .max(42, { message: t('Within than 32') })
      .regex(/^0x[a-fA-F0-9]{40}$/, { message: t('Invalid address') })
  })

  const form = useZodForm({
    schema: newCrowdfundSchema,
    defaultValues: {
      recipient: currentUser?.ownedBy
    }
  })

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('Relay Error =>', error.message)
      }
    })
  const [createSetFollowModuleTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_FOLLOW_MODULE_TYPED_DATA_MUTATION, {
      async onCompleted({
        createSetFollowModuleTypedData
      }: {
        createSetFollowModuleTypedData: CreateSetFollowModuleBroadcastItemResult
      }) {
        Logger.log('Mutation =>', 'Generated createSetFollowModuleTypedData')
        const { id, typedData } = createSetFollowModuleTypedData
        const { profileId, followModule, followModuleInitData, deadline } =
          typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            profileId,
            followModule,
            followModuleInitData,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result) write({ args: inputStruct })
          } else {
            write({ args: inputStruct })
          }
        } catch (error) {
          Logger.warn('Sign Error =>', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const setSuperFollow = (amount: string | null, recipient: string | null) => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    createSetFollowModuleTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          followModule: amount
            ? {
                feeFollowModule: {
                  amount: {
                    currency: selectedCurrency,
                    value: amount
                  },
                  recipient
                }
              }
            : {
                freeFollowModule: true
              }
        }
      }
    })
  }

  if (loading)
    return (
      <Card>
        <div className="p-5 py-10 space-y-2 text-center">
          <Spinner size="md" className="mx-auto" />
          <div>{t('Loading super follow settings')}</div>
        </div>
      </Card>
    )

  const followType = currencyData?.profile?.followModule?.__typename
  return (
    <Card>
      <Form
        form={form}
        className="p-5 space-y-4"
        onSubmit={({ amount, recipient }) => {
          setSuperFollow(amount, recipient)
        }}
      >
        <div className="text-lg font-bold">{t('Set super follow title')}</div>
        <p>{t('Super follow description')}</p>
        <div className="pt-2">
          <div className="label">{t('Select currency')}</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => {
              const currency = e.target.value.split('-')
              setSelectedCurrency(currency[0])
              setSelectedCurrencySymobol(currency[1])
            }}
          >
            {currencyData?.enabledModuleCurrencies?.map((currency: Erc20) => (
              <option
                key={currency.address}
                value={`${currency.address}-${currency.symbol}`}
              >
                {currency.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label={t('Follow amount')}
          type="number"
          step="0.0001"
          min="0"
          max="100000"
          prefix={
            <img
              className="w-6 h-6"
              height={24}
              width={24}
              src={getTokenImage(selectedCurrencySymobol)}
              alt={selectedCurrencySymobol}
            />
          }
          placeholder="5"
          {...form.register('amount')}
        />
        <Input
          label={t('Funds recipient')}
          type="text"
          placeholder="0x3A5bd...5e3"
          {...form.register('recipient')}
        />
        <div className="ml-auto flex flex-col space-y-2">
          <div className="block space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2">
            {followType === 'FeeFollowModuleSettings' && (
              <Button
                type="button"
                variant="danger"
                outline
                onClick={() => {
                  setSuperFollow(null, null)
                }}
                disabled={
                  typedDataLoading ||
                  signLoading ||
                  writeLoading ||
                  broadcastLoading
                }
                icon={<XIcon className="w-4 h-4" />}
              >
                {t('Disable super follow')}
              </Button>
            )}
            <Button
              type={t('Submit')}
              disabled={
                typedDataLoading ||
                signLoading ||
                writeLoading ||
                broadcastLoading
              }
              icon={<StarIcon className="w-4 h-4" />}
            >
              {followType === 'FeeFollowModuleSettings'
                ? t('Update super follow')
                : t('Set super follow')}
            </Button>
          </div>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <IndexStatus
              txHash={
                writeData?.hash
                  ? writeData?.hash
                  : broadcastData?.broadcast?.txHash
              }
            />
          ) : null}
        </div>
      </Form>
    </Card>
  )
}

export default SuperFollow
