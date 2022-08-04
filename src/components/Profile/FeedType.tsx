import { Profile, ProfileStats } from '@generated/types'
import {
  ChatAlt2Icon,
  ClockIcon,
  PencilAltIcon,
  PhotographIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline'
import isVerified from '@lib/isVerified'
import nFormatter from '@lib/nFormatter'
import clsx from 'clsx'
import React, { Dispatch, FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import OrgVerifiedApplications from './OrgVerifiedApplications'

interface Props {
  stats: ProfileStats
  setFeedType: Dispatch<string>
  feedType: string
  id: string
  profile: Profile
}

const FeedType: FC<Props> = ({ stats, setFeedType, feedType, id, profile }) => {
  interface FeedLinkProps {
    name: string
    icon: ReactNode
    type: string
    count?: number
    testId: string
  }
  const { t } = useTranslation('common')
  const FeedLink: FC<FeedLinkProps> = ({
    name,
    icon,
    type,
    count = 0,
    testId
  }) => (
    <button
      type="button"
      onClick={() => {
        setFeedType(type)
      }}
      className={clsx(
        {
          'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
            feedType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
      aria-label={name}
      data-test={testId}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
      {count ? (
        <div className="px-2 text-xs font-medium rounded-full bg-brand-200 dark:bg-brand-800">
          {nFormatter(count)}
        </div>
      ) : null}
    </button>
  )

  return (
    <div className="flex overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
      <FeedLink
        name={t('Posts')}
        icon={<PencilAltIcon className="w-4 h-4" />}
        type="POST"
        count={stats?.totalPosts}
        testId="type-posts"
      />
      <FeedLink
        name={t('Comments')}
        icon={<ChatAlt2Icon className="w-4 h-4" />}
        type="COMMENT"
        count={stats?.totalComments}
        testId="type-comments"
      />
      <FeedLink
        name={t('Mirrors')}
        icon={<SwitchHorizontalIcon className="w-4 h-4" />}
        type="MIRROR"
        count={stats?.totalMirrors}
        testId="type-mirrors"
      />
      <FeedLink
        name={t('NFTs')}
        icon={<PhotographIcon className="w-4 h-4" />}
        type="NFT"
        testId="type-nfts"
      />

      {isVerified(id) ? (
        <>
          <OrgVerifiedApplications profile={profile} />
          <FeedLink
            name="Pending Partnerships"
            icon={<ClockIcon className="w-4 h-4" />}
            type="OrgApplicationFeed"
            testId="type-partnershipapplication"
          />
        </>
      ) : (
        <FeedLink
          name="Partnership Applications"
          icon={<ClockIcon className="w-4 h-4" />}
          type="ApplicationFeed"
          testId="type-partnershipapplication"
        />
      )}
    </div>
  )
}

export default FeedType
