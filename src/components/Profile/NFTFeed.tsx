import { gql, useQuery } from '@apollo/client'
import SingleNFT from '@components/NFT/SingleNFT'
import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Nft, PaginatedResultInfo, Profile } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useTranslation } from 'react-i18next'
import { CHAIN_ID, IS_MAINNET } from 'src/constants'
import { chain } from 'wagmi'

const PROFILE_NFT_FEED_QUERY = gql`
  query ProfileNFTFeed($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        name
        collectionName
        contractAddress
        tokenId
        chainId
        originalContent {
          uri
          animatedUrl
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
`

interface Props {
  profile: Profile
}

const NFTFeed: FC<Props> = ({ profile }) => {
  const { t } = useTranslation('common')
  const [nfts, setNfts] = useState<Nft[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(PROFILE_NFT_FEED_QUERY, {
    variables: {
      request: {
        chainIds: [CHAIN_ID, IS_MAINNET ? chain.mainnet.id : chain.kovan.id],
        ownerAddress: profile?.ownedBy,
        limit: 10
      }
    },
    skip: !profile?.ownedBy,
    onCompleted(data) {
      setPageInfo(data?.nfts?.pageInfo)
      setNfts(data?.nfts?.items)
      Logger.log('Query =>', `Fetched first 10 nfts Profile:${profile?.id}`)
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            chainIds: [
              CHAIN_ID,
              IS_MAINNET ? chain.mainnet.id : chain.kovan.id
            ],
            ownerAddress: profile?.ownedBy,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
      setPageInfo(data?.nfts?.pageInfo)
      setNfts([...nfts, ...data?.nfts?.items])
      Logger.log(
        'Query =>',
        `Fetched next 10 nfts Profile:${profile?.id} Next:${pageInfo?.next}`
      )
    }
  })

  return (
    <>
      {loading && <NFTSShimmer />}
      {data?.nfts?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile?.handle}</span>
              <span>{t('No NFT')}</span>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load nft feed" error={error} />
      {!error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {nfts?.map((nft: Nft) => (
              <SingleNFT
                key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
                nft={nft}
              />
            ))}
          </div>
          {pageInfo?.next && nfts.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default NFTFeed
