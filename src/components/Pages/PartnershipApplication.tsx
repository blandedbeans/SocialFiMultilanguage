import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { CREATE_POST_TYPED_DATA_MUTATION } from '@components/Post/NewPost'
import Pending from '@components/Shared/Pending'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { OrganizationNameInput } from '@components/UI/OrganizationNameInput'
import { TextArea } from '@components/UI/TextArea'
import SEO from '@components/utils/SEO'
import { CreatePostBroadcastItemResult } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { PencilAltIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import uploadToIPFS from '@lib/uploadToIPFS'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  APP_NAME,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import Custom404 from 'src/pages/404'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { v4 as uuid } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string } from 'zod'

export const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      ownedBy
    }
  }
`

const PartnershipApplication: NextPage = () => {
  const { t } = useTranslation('common')
  const { push } = useRouter()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [cover, setCover] = useState<string>()
  const [coverType, setCoverType] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const newContactSchema = object({
    name: string()
      .max(50, {
        message: 'Name should not exceed 50 characters'
      })
      .min(2, { message: 'Name should be at least 2 characters' }),
    email: string()
      .max(256, {
        message: 'Email should not exceed 256 characters'
      })
      .email({ message: 'Invalid email address' }),
    organizationname: string()
      .max(100, {
        message: 'Organization name should not exceed 100 characters'
      })
      .min(2, { message: 'Name should be at least 2 characters' }),
    receivingorganizationname: string()
      .max(100, {
        message: 'Organization name should not exceed 100 characters'
      })
      .min(2, { message: 'Name should be at least 2 characters' }),
    websiteurl: string()
      .max(1000, {
        message: 'Website URL should not exceed 1000 characters'
      })
      .url({ message: 'Invalid url' }),
    country: string()
      .max(1000, {
        message: 'Country should not exceed 1000 characters'
      })
      .nonempty(),
    category: string()
      .max(1000, {
        message: 'Category should not exceed 1000 characters'
      })
      .nonempty(),
    reason: string()
      .max(1000, {
        message: 'Reason should not exceed 1000 characters'
      })
      .nonempty(),
    message: string().max(1000, {
      message: 'Message should not exceed 1000 characters'
    }),
    orgWalletAddress: string()
      .max(42, {
        message: 'Wallet Address should be within 42 characters'
      })
      .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' })
  })

  const form = useZodForm({
    schema: newContactSchema
  })
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const selectCountryHandler = (value: React.SetStateAction<string>) =>
    setSelectedCountry(value)

  const selectCategoryHandler = (value: React.SetStateAction<string>) =>
    setSelectedCategory(value)

  const selectReasonHandler = (value: React.SetStateAction<string>) =>
    setSelectedReason(value)

  // Have to register the languages you want to use
  countries.registerLocale(enLocale)

  // Returns an object not a list
  const countryObj = countries.getNames('en', { select: 'official' })

  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key
    }
  })
  const [getWalletAddress] = useLazyQuery(PROFILE_QUERY, {
    onCompleted(data) {
      Logger.log('Lazy Query =>', `Fetched ${data?.id} profile result`)
    }
  })
  const fetchWalletAddress = (username: string) =>
    getWalletAddress({
      variables: {
        request: { handle: username }
      }
    }).then(({ data }) => {
      return data.profile.ownedBy
    })

  const {
    data,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'postWithSig',
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
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
  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        Logger.log('Mutation =>', 'Generated createPostTypedData')
        const { id, typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          deadline
        } = typedData?.value

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
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
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
    }
  )

  const createHours = async (
    receivingorganizationname: string,
    orgWalletAddress: string,
    name: string,
    email: string,
    organizationname: string,
    websiteurl: string,
    country: string,
    category: string,
    reason: string,
    message: string
  ) => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    setIsUploading(true)
    const { path } = await uploadToIPFS({
      version: '1.0.0',
      metadata_id: uuid(),
      content: `@${receivingorganizationname} Partnership Application`,
      external_url: null,
      imageMimeType: coverType,
      name: organizationname,
      contentWarning: null, // TODO
      attributes: [
        {
          traitType: 'string',
          key: 'type',
          value: 'PartnershipApplication'
        },
        {
          traitType: 'string',
          key: 'receivingorganizationname',
          value: receivingorganizationname
        },
        {
          traitType: 'string',
          key: 'orgWalletAddress',
          value: orgWalletAddress
        },
        {
          traitType: 'string',
          key: 'name',
          value: name
        },
        {
          traitType: 'string',
          key: 'email',
          value: email
        },
        {
          traitType: 'string',
          key: 'organizationname',
          value: organizationname
        },
        {
          traitType: 'string',
          key: 'websiteurl',
          value: websiteurl
        },
        {
          traitType: 'string',
          key: 'country',
          value: country
        },
        {
          traitType: 'string',
          key: 'category',
          value: category
        },
        {
          traitType: 'string',
          key: 'reason',
          value: reason
        },
        {
          traitType: 'string',
          key: 'message',
          value: message
        }
      ],
      media: [],
      createdOn: new Date(),
      appId: `${APP_NAME} PartnershipForm`
    }).finally(() => setIsUploading(false))
    createPostTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          contentURI: `https://ipfs.infura.io/ipfs/${path}`,
          collectModule: {
            freeCollectModule: {
              followerOnly: false
            }
          },
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }
  if (!isAuthenticated) return <Custom404 />
  return (
    <GridLayout>
      <SEO title={t('Apply for a Partnership • BCharity')} />
      <GridItemFour>
        <SettingsHelper
          heading={t('Become a BCharity Partner')}
          description={t('Fill out this form to become a parter with BCharity')}
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {data?.hash ?? broadcastData?.broadcast?.txHash ? (
            <Pending
              txHash={
                data?.hash ? data?.hash : broadcastData?.broadcast?.txHash
              }
              indexing="Form Submission in progress, please wait!"
              indexed="Form Submission created successfully"
              type="PartnershipApplication"
              urlPrefix="posts"
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({
                receivingorganizationname,
                orgWalletAddress,
                name,
                email,
                organizationname,
                websiteurl,
                country,
                category,
                reason,
                message
              }) => {
                createHours(
                  receivingorganizationname,
                  orgWalletAddress,
                  name,
                  email,
                  organizationname,
                  websiteurl,
                  country,
                  category,
                  reason,
                  message
                )
              }}
            >
              <Controller
                control={form.control}
                name="receivingorganizationname"
                render={({
                  field: { value, onChange },
                  fieldState: { error }
                }) => (
                  <OrganizationNameInput
                    label={t('Receiving Organization Name')}
                    error={error?.message}
                    placeholder={'BCharity'}
                    value={value}
                    onChange={onChange}
                    onAdd={async (e: string) => {
                      form.setValue(
                        'orgWalletAddress',
                        await fetchWalletAddress(e)
                      )
                    }}
                  />
                )}
              />
              <Input
                label={t('Organization Wallet Address')}
                type="text"
                placeholder={'0x3A5bd...5e3'}
                {...form.register('orgWalletAddress')}
              />
              <Input
                label={t('Your Name')}
                placeholder="Arnold"
                {...form.register('name')}
              />
              <Input
                label={t('Your Email')}
                placeholder=""
                {...form.register('email')}
              />
              <Input
                label={t('Your Organization Name')}
                placeholder=""
                {...form.register('organizationname')}
              />
              <Input
                label={t('Website URL')}
                placeholder=""
                {...form.register('websiteurl')}
              />
              <div>
                <div className="label">{t('Select Country')}</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedCountry}
                  {...form.register('country')}
                  onChange={(e) => selectCountryHandler(e.target.value)}
                >
                  {!!countryArr?.length &&
                    countryArr.map(({ label, value }) => (
                      <option key={value} value={label}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <div className="label">{t('Select Category')}</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedCategory}
                  {...form.register('category')}
                  onChange={(e) => selectCategoryHandler(e.target.value)}
                >
                  <option>{t('Nonprofit')}</option>
                  <option>{t('Corporate Partner')}</option>
                  <option>{t('Media Partner')}</option>
                  <option>{t('Influencer')}</option>
                  <option>{t('Donor')}</option>
                  <option>{t('Financial Service')}</option>
                  <option>{t('Crypto Project')}</option>
                  <option>{t('NFT Project or Artist')}</option>
                  <option>{t('Crypto Exchange')}</option>
                  <option>{t('Other')}</option>
                </select>
              </div>
              <div>
                <div className="label">{t('How did you hear about us?')}</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedReason}
                  {...form.register('reason')}
                  onChange={(e) => selectReasonHandler(e.target.value)}
                >
                  <option>{t('Search Engine')}</option>
                  <option>{t('Social Media')}</option>
                  <option>{t('Advertising')}</option>
                  <option>{t('News')}</option>
                  <option>{t('Newsletter')}</option>
                  <option>{t('Online Event')}</option>
                  <option>{t('In-person Event')}</option>
                  <option>{t('Word of Mouth')}</option>
                </select>
              </div>
              <TextArea label={t('Message')} {...form.register('message')} />
              <div className="ml-auto">
                <Button
                  type="submit"
                  icon={<PencilAltIcon className="w-4 h-4" />}
                  disabled={
                    typedDataLoading ||
                    isUploading ||
                    signLoading ||
                    writeLoading ||
                    broadcastLoading
                  }
                >
                  {t('Submit')}
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default PartnershipApplication
