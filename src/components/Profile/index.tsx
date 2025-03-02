import { gql, useQuery } from '@apollo/client'
import {
  GridItemEight,
  GridItemFour,
  GridItemTwelve,
  GridLayout
} from '@components/GridLayout'
import NFTShimmer from '@components/Shared/Shimmer/NFTShimmer'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import SEO from '@components/utils/SEO'
import isVerified from '@lib/isVerified'
import Logger from '@lib/logger'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { useAppPersistStore } from 'src/store/app'

import ApplicationFeed from './ApplicationFeed'
import Cover from './Cover'
import Details from './Details'
import FeedType from './FeedType'
import OrgApplicationFeed from './OrgApplicationFeed'
import ProfilePageShimmer from './Shimmer'

const Feed = dynamic(() => import('./Feed'), {
  loading: () => <PostsShimmer />
})
const NFTFeed = dynamic(() => import('./NFTFeed'), {
  loading: () => <NFTShimmer />
})

export const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!, $who: ProfileId) {
    profile(request: $request) {
      id
      handle
      ownedBy
      name
      metadata
      followNftAddress
      isFollowedByMe
      isFollowing(who: $who)
      attributes {
        key
        value
      }
      bio
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
        }
      }
      coverPicture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      followModule {
        __typename
      }
    }
  }
`

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter()
  const { currentUser } = useAppPersistStore()
  const [feedType, setFeedType] = useState<string>(
    type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
      ? type?.toString().toUpperCase()
      : 'POST'
  )
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handle: username }, who: currentUser?.id ?? null },
    skip: !username,
    onCompleted(data) {
      Logger.log(
        'Query =>',
        `Fetched profile details Profile:${data?.profile?.id}`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <ProfilePageShimmer />
  if (!data?.profile) return <Custom404 />

  const profile = data?.profile

  return (
    <>
      {profile?.name ? (
        <SEO title={`${profile?.name} (@${profile?.handle}) • ${APP_NAME}`} />
      ) : (
        <SEO title={`@${profile?.handle} • ${APP_NAME}`} />
      )}
      <Cover cover={profile?.coverPicture?.original?.url} />
      <GridLayout className="pt-6">
        {feedType === 'OrgApplicationFeed' || feedType == 'ApplicationFeed' ? (
          <GridItemTwelve className="space-y-5">
            <FeedType
              stats={profile?.stats}
              setFeedType={setFeedType}
              feedType={feedType}
              id={profile?.id} //profile={profile}
              profile={profile}
            />
            {isVerified(profile?.id)
              ? feedType === 'OrgApplicationFeed' && (
                  <OrgApplicationFeed profile={profile} />
                )
              : feedType === 'ApplicationFeed' && (
                  <ApplicationFeed profile={profile} />
                )}
          </GridItemTwelve>
        ) : (
          <>
            <GridItemFour>
              <Details profile={profile} />
            </GridItemFour>
            <GridItemEight className="space-y-5">
              <FeedType
                stats={profile?.stats}
                setFeedType={setFeedType}
                profile={profile}
                feedType={feedType}
                id={profile?.id} //profile={profile}
              />
              {(feedType === 'POST' ||
                feedType === 'COMMENT' ||
                feedType === 'MIRROR') && (
                <Feed profile={profile} type={feedType} />
              )}
              {feedType === 'NFT' && <NFTFeed profile={profile} />}
            </GridItemEight>
          </>
        )}
      </GridLayout>
    </>
  )
}

export default ViewProfile
