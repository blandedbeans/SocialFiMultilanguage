import { Modal } from '@components/UI/Modal'
import { PencilAltIcon } from '@heroicons/react/outline'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import NewPost from '..'

const NewPostModal: FC = () => {
  const { t } = useTranslation('common')
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <button
        type="button"
        className="flex items-start"
        onClick={() => {
          setShowModal(!showModal)
        }}
      >
        <PencilAltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <Modal
        title={t('New post')}
        icon={<PencilAltIcon className="w-5 h-5 text-brand" />}
        size="md"
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <NewPost setShowModal={setShowModal} hideCard />
      </Modal>
    </>
  )
}

export default NewPostModal
