import { useMutation } from '@apollo/client'
import { HIDE_POST_MUTATION } from '@components/Post/Actions/Menu/Delete'
import { Button } from '@components/UI/Button'
import { WarningMessage } from '@components/UI/WarningMessage'
import { Group } from '@generated/bcharitytypes'
import { TrashIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  group: Group
}

const Settings: FC<Props> = ({ group }) => {
  const { push } = useRouter()
  const [hidePost] = useMutation(HIDE_POST_MUTATION, {
    onCompleted() {
      push('/')
    }
  })
  const { t } = useTranslation('common')
  return (
    <div className="p-5 space-y-5">
      <div>
        <WarningMessage message="Only delete settings is available now, you can't edit any part of the group right now!" />
      </div>
      <div className="space-y-2">
        <div className="font-bold text-red-500">{t('Danger Zone')}</div>
        <p>{t('Delete info')}</p>
        <Button
          className="!mt-5"
          icon={<TrashIcon className="w-5 h-5" />}
          variant="danger"
          onClick={() => {
            if (confirm(t('Delete confirmation'))) {
              hidePost({
                variables: { request: { publicationId: group?.id } }
              })
            }
          }}
        >
          {t('Delete group')}
        </Button>
      </div>
    </div>
  )
}

export default Settings
