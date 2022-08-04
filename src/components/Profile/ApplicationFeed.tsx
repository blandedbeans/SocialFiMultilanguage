/* eslint-disable react/jsx-key */
import { gql } from '@apollo/client'
import { Profile } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import React, { FC, useMemo, useState } from 'react'

import ApplicationTable from './ApplicationTable'
import { ApplicationStatusCell } from './ApplicationTable/Cells'

const PROFILE_FEED_QUERY = gql`
  query ProfileFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

interface Props {
  profile: Profile
}

const ApplicationFeed: FC<Props> = ({ profile }) => {
  const [addressData, setAddressData] = useState<string[]>([])

  const columns = useMemo(
    () => [
      {
        Header: 'Partnership Applications',
        columns: [
          {
            Header: 'Receiving Org',
            accessor: 'receivingorganizationname'
          },
          {
            Header: 'Applicant Name',
            accessor: 'name'
          },
          {
            Header: 'Country',
            accessor: 'country'
          },
          {
            Header: 'Category',
            accessor: 'category'
          },
          {
            Header: 'Applicant Org Name',
            accessor: 'organizationname'
          },
          {
            Header: 'Applicant Email',
            accessor: 'email'
          },
          {
            Header: 'Applicant Message',
            accessor: 'message'
          },
          {
            Header: 'Status',
            accessor: 'verified',
            Cell: (props: {
              value: { index: number; value: string; postID: string }
            }) => ApplicationStatusCell(props)
          }
        ]
      }
    ],
    [addressData]
  )

  const tableLimit = 10

  return (
    <ApplicationTable
      profile={profile}
      handleQueryComplete={(data: any) => {
        return data?.publications?.items.filter((i: any) => {
          return i.metadata.attributes[0].value == 'PartnershipApplication'
        })
      }}
      getColumns={(add: string[]) => {
        setAddressData(add)
        return columns
      }}
      query={PROFILE_FEED_QUERY}
      request={{
        publicationTypes: 'POST',
        profileId: profile?.id,
        limit: tableLimit
      }}
      tableLimit={tableLimit}
      from={false}
    />
  )
}

export default ApplicationFeed
