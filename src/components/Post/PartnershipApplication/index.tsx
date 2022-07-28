import { Card } from '@components/UI/Card'
import { BCharityPost } from '@generated/bcharitytypes'
import React, { FC, useState } from 'react'
import { useAppPersistStore } from 'src/store/app'

interface Props {
  post: BCharityPost
}

const PartnershipApplication: FC<Props> = ({ post }) => {
  // const { t } = useTranslation('common')
  const { currentUser } = useAppPersistStore()
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false)
  if (post.metadata.attributes.length < 11) return <div />
  return (
    <Card forceRounded testId="partnershipapplication">
      <div className="p-5">
        <div className="mr-0 space-y-1 sm:mr-16"></div>
        <div className="block justify-between items-center sm:flex">
          <div className="text-xl font-bold">
            {' '}
            Partnership Form Submitted By {post.profile.name} (
            {post.profile.handle}):
          </div>
        </div>
        <div>
          <table className="border border-violet-500 w-10 whitespace-nowrap">
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Receiving Organization
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[1].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Organization Wallet Address
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[2].value?.substring(0, 30) + '...'}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Applicant Name
              </th>

              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[3].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Applicant Email
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[4].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Applicant Organization Name
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[5].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Website URL
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[6].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">Country</th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[7].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">Category</th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[8].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">
                Method of Discovery
              </th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[9].value}
              </th>
            </tr>
            <tr className="text-center font-bold bg-violet-200">
              <th className="border border-violet-500 px-6 py-2">Message</th>
              <th className="border border-violet-500 px-6 py-2">
                {post.metadata.attributes[10].value}
              </th>
            </tr>
          </table>
        </div>
      </div>
    </Card>
  )
}

export default PartnershipApplication
