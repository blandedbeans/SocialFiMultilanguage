import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation, useQuery } from '@apollo/client'
import { CREATE_COMMENT_TYPED_DATA_MUTATION } from '@components/Comment/NewComment'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { BCharityPost } from '@generated/bcharitytypes'
import {
  CreateCollectBroadcastItemResult,
  CreateCommentBroadcastItemResult,
  EnabledModule
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { CollectModuleFields } from '@gql/CollectModuleFields'
import { CommentFields } from '@gql/CommentFields'
import { UserAddIcon } from '@heroicons/react/outline'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import Logger from '@lib/logger'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import uploadToArweave from '@lib/uploadToArweave'
import { ethers } from 'ethers'
import { t } from 'i18next'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  APP_NAME,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { v4 as uuid } from 'uuid'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

export const COLLECT_QUERY = gql`
  query CollectModule($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
      ... on Comment {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
      ... on Mirror {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
    }
  }
  ${CollectModuleFields}
`

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData(
    $options: TypedDataOptions
    $request: CreateCollectRequest!
  ) {
    createCollectTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
          pubId
          data
        }
      }
    }
  }
`

const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`

interface Props {
  post: BCharityPost
}

const Accept: FC<Props> = ({ post }) => {
  // const { t } = useTranslation('common')
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const { address } = useAccount()
  const [hoursAddressDisable, setHoursAddressDisable] = useState<boolean>(false)
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [txnData, setTxnData] = useState<string>()
  const [hasVhrTxn, setHasVrhTxn] = useState<boolean>(false)
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: { commentsOf: post.id },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const publications = data.publications.items.filter((i: any) =>
        ethers.utils.isHexString(i.metadata.content)
      )
      if (publications.length !== 0) {
        setHasVrhTxn(true)
      }
    }
  })

  useQuery(COLLECT_QUERY, {
    variables: { request: { publicationId: post?.pubId ?? post?.id } },
    onCompleted() {
      if (
        post?.metadata.attributes[0].value === 'PartnershipApplication' &&
        post?.metadata.attributes[2].value !== currentUser?.ownedBy
      ) {
        setHoursAddressDisable(true)
      }
      Logger.log(
        '[Query]',
        `Fetched collect module details Publication:${post?.pubId ?? post?.id}`
      )
    }
  })

  const { isLoading: writeLoading, write: writeVhrTransfer } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy,
      functionName: 'transfer',
      args: [post.profile.ownedBy],
      onSuccess(data) {
        setTxnData(data.hash)
        createComment(data.hash)
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const { isLoading: commentWriteLoading, write: commentWrite } =
    useContractWrite({
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy,
      functionName: 'commentWithSig',
      onSuccess() {
        setSelectedModule(defaultModuleData)
        setFeeData(defaultFeeData)
      },
      onError(error: any) {
        if (txnData) createComment(txnData)
        toast.error(error?.data?.message ?? error?.message)
      }
    })

  const [commentBroadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('[Relay Error]', error.message)
      }
    }
  )
  const [createCommentTypedData] = useMutation(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createCommentTypedData
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult
      }) {
        Logger.log('[Mutation]', 'Generated createCommentTypedData')
        const { id, typedData } = createCommentTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
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
            profileIdPointed,
            pubIdPointed,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await commentBroadcast({
              variables: { request: { id, signature } }
            })

            if ('reason' in result) commentWrite({ args: inputStruct })
          } else {
            commentWrite({ args: inputStruct })
          }
        } catch (error) {
          Logger.warn('[Sign Error]', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createComment = async (hash: string) => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    // TODO: Add animated_url support
    const id = await uploadToArweave({
      version: '1.0.0',
      metadata_id: uuid(),
      description: 'Partnership Acceptance token',
      content: hash,
      name: `Partnership Acceptance token`,
      contentWarning: null, // TODO
      attributes: [
        {
          traitType: 'string',
          key: 'type',
          value: 'comment'
        }
      ],
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => {})
    createCommentTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          publicationId:
            post?.__typename === 'Mirror'
              ? post?.mirrorOf?.id
              : post?.pubId ?? post?.id,
          contentURI: `https://arweave.net/${id}`,
          collectModule: feeData.recipient
            ? {
                [getModule(selectedModule.moduleName).config]: feeData
              }
            : getModule(selectedModule.moduleName).config,
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  const onCompleted = () => {
    toast.success('Transaction submitted successfully!')
  }
  const {
    data: collectWriteData,
    isLoading: collectWriteLoading,
    write: collectWrite
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'collectWithSig',
    onSuccess() {
      onCompleted()
    },
    onError(error: any) {
      createCollect()
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const [
    collectBroadcast,
    { data: collectBroadcastData, loading: collectBroadcastLoading }
  ] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError(error) {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message)
      }
      Logger.error('[Relay Error]', error.message)
    }
  })
  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        Logger.log('[Mutation]', 'Generated createCollectTypedData')
        const { id, typedData } = createCollectTypedData
        const { deadline } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { profileId, pubId, data: collectData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            collector: address,
            profileId,
            pubId,
            data: collectData,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await collectBroadcast({
              variables: { request: { id, signature } }
            })

            if ('reason' in result) collectWrite({ args: inputStruct })
          } else {
            collectWrite({ args: inputStruct })
          }
        } catch (error) {
          Logger.warn('[Sign Error]', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createCollect = () => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { publicationId: post?.pubId ?? post?.id }
      }
    })
  }

  return (
    <div className="flex items-center mt-3 space-y-0 space-x-3 sm:block sm:mt-0 sm:space-y-2">
      {!hoursAddressDisable && (
        <>
          <Button
            className="text-sm !px-3 !py-1.5"
            outline
            onClick={createCollect}
            disabled={
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading
            }
            variant="success"
            aria-label={t('Accept')}
            icon={
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <UserAddIcon className="w-4 h-4" />
              )
            }
          >
            Accept
          </Button>
        </>
      )}
    </div>
  )
}

export default Accept
