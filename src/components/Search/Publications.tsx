import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { BCharityPost } from '@generated/bcharitytypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { PostFields } from '@gql/PostFields'
import { CollectionIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useTranslation } from 'react-i18next'
import { useAppPersistStore } from 'src/store/app'

const SEARCH_PUBLICATIONS_QUERY = gql`
  query SearchPublications(
    $request: SearchQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    search(request: $request) {
      ... on PublicationSearchResult {
        items {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
        pageInfo {
          next
          totalCount
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
`

interface Props {
  query: string | string[]
}

const Publications: FC<Props> = ({ query }) => {
  const { t } = useTranslation('common')
  const { currentUser } = useAppPersistStore()
  const [publications, setPublications] = useState<BCharityPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(
    SEARCH_PUBLICATIONS_QUERY,
    {
      variables: {
        request: { query, type: 'PUBLICATION', limit: 10 },
        reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
        profileId: currentUser?.id ?? null
      },
      onCompleted(data) {
        setPageInfo(data?.search?.pageInfo)
        setPublications(data?.search?.items)
        Logger.log(
          'Query =>',
          `Fetched first 10 publication for search Keyword:${query}`
        )
      }
    }
  )

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            query,
            type: 'PUBLICATION',
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
          profileId: currentUser?.id ?? null
        }
      })
      setPageInfo(data?.search?.pageInfo)
      setPublications([...publications, ...data?.search?.items])
      Logger.log(
        'Query =>',
        `Fetched next 10 publications for search Keyword:${query} Next:${pageInfo?.next}`
      )
    }
  })

  return (
    <>
      {loading && <PostsShimmer />}
      {data?.search?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              {t('No publications for')} <b>&ldquo;{query}&rdquo;</b>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load publications list" error={error} />
      {!error && !loading && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: BCharityPost, index: number) => (
              <SinglePost key={`${post?.id}_${index}`} post={post} />
            ))}
          </Card>
          {pageInfo?.next && publications.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Publications
