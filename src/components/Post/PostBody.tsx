import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import Markup from '@components/Shared/Markup'
import FundraiseShimmer from '@components/Shared/Shimmer/FundraiseShimmer'
import { BCharityPost } from '@generated/bcharitytypes'
import { UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import getURLs from '@lib/getURLs'
import imagekitURL from '@lib/imagekitURL'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Fundraise = dynamic(() => import('./Fundraise'), {
  loading: () => <FundraiseShimmer />
})

const PartnershipApplication = dynamic(
  () => import('./PartnershipApplication'),
  {}
)

interface Props {
  post: BCharityPost
}

const PostBody: FC<Props> = ({ post }) => {
  const { t } = useTranslation('common')
  const { pathname } = useRouter()
  const postType = post?.metadata?.attributes[0]?.value
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 450
  )

  return (
    <div className="break-words">
      {postType === 'group' ? (
        <div className="block items-center space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2 linkify">
          <span className="flex items-center space-x-1.5">
            {post?.collectedBy ? (
              <UserAddIcon className="w-4 h-4 text-brand" />
            ) : (
              <UsersIcon className="w-4 h-4 text-brand" />
            )}
            {post?.collectedBy ? (
              <span>{t('Joined')}</span>
            ) : (
              <span>{t('Launched group')}</span>
            )}
          </span>
          <Link href={`/groups/${post?.id}`}>
            <a
              href={`/groups/${post?.id}`}
              className="flex items-center space-x-1.5 font-bold"
            >
              <img
                src={imagekitURL(
                  post?.metadata?.cover?.original?.url
                    ? post?.metadata?.cover?.original?.url
                    : `https://avatar.tobi.sh/${post?.id}.png`,
                  'avatar'
                )}
                className="bg-gray-200 rounded ring-2 ring-gray-50 dark:bg-gray-700 dark:ring-black w-[19px] h-[19px]"
                height={19}
                width={19}
                alt={post?.id}
              />
              <div>{post?.metadata?.name}</div>
            </a>
          </Link>
        </div>
      ) : postType === 'fundraise' ? (
        <Fundraise fund={post} />
      ) : postType === 'PartnershipApplication' ? (
        <PartnershipApplication post={post} />
      ) : (
        <>
          <div
            className={clsx({
              'line-clamp-5 text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-400 dark:to-gray-900':
                showMore && pathname !== '/posts/[id]'
            })}
          >
            <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
              <Markup>{post?.metadata?.content}</Markup>
            </div>
          </div>
          {showMore && pathname !== '/posts/[id]' && (
            <button
              type="button"
              className="mt-2 text-sm font-bold"
              onClick={() => setShowMore(!showMore)}
            >
              {t('Show more')}
            </button>
          )}
        </>
      )}
      {post?.metadata?.media?.length > 0 ? (
        <Attachments attachments={post?.metadata?.media} />
      ) : (
        post?.metadata?.content &&
        postType !== 'fundraise' &&
        postType !== 'group' &&
        getURLs(post?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(post?.metadata?.content)[0]} />
        )
      )}
    </div>
  )
}

export default PostBody
