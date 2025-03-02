import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { StarIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Loader from '../Loader'
import Slug from '../Slug'

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading super follow" />
})

interface Props {
  profile: Profile
  setFollowing: Dispatch<boolean>
  followersCount?: number
  setFollowersCount?: Dispatch<number>
  showText?: boolean
  again?: boolean
}

const SuperFollow: FC<Props> = ({
  profile,
  setFollowing,
  followersCount,
  setFollowersCount,
  showText = false,
  again = false
}) => {
  const { t } = useTranslation('common')
  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5"
        variant="super"
        outline
        onClick={() => setShowFollowModal(!showFollowModal)}
        aria-label={t('Super follow')}
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText && `Super follow`}
      </Button>
      <Modal
        title={
          <span>
            {t('Super follow')} <Slug slug={profile?.handle} prefix="@" />{' '}
            {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="w-5 h-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(!showFollowModal)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          followersCount={followersCount}
          setFollowersCount={setFollowersCount}
          again={again}
        />
      </Modal>
    </>
  )
}

export default SuperFollow
