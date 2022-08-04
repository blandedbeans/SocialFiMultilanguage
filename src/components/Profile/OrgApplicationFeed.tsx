/* eslint-disable react/jsx-key */
import { gql } from '@apollo/client'
import { Profile } from '@generated/types'
import React, { FC, useMemo, useState } from 'react'

import ApplicationTable from './ApplicationTable'
import { ApplicationStatusCell } from './ApplicationTable/Cells'

/*import {
  DateSearch,
  FuzzySearch,
  fuzzyTextFilterFn,
  getStatusFn,
  greaterThanEqualToFn,
  lessThanEqualToFn,
  NoFilter,
  SelectColumnFilter
} from './VHRTable/Filters' */

const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewMentionNotification {
          mentionPublication {
            ... on Post {
              id
              collectNftAddress
              metadata {
                name
                description
                content
                media {
                  original {
                    url
                    mimeType
                  }
                }
                attributes {
                  value
                }
              }
              profile {
                handle
              }
              hidden
            }
          }
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
`

interface Props {
  profile: Profile
}

const OrgApplicationFeed: FC<Props> = ({ profile }) => {
  const [addressData, setAddressData] = useState<string[]>([])

  const columns = useMemo(
    () => [
      {
        Header: 'Pending Partnership',
        columns: [
          {
            Header: 'From',
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
        return data?.notifications?.items
          .filter((i: any) => {
            return (
              i.__typename === 'NewMentionNotification' &&
              i.mentionPublication.metadata.attributes[0].value ===
                'PartnershipApplication' &&
              !i.mentionPublication.hidden
            )
          })
          .map((i: any) => {
            return i.mentionPublication
          })
      }}
      getColumns={(add: string[]) => {
        setAddressData(add)
        return columns
      }}
      query={NOTIFICATIONS_QUERY}
      request={{
        profileId: profile?.id,
        limit: tableLimit
      }}
      tableLimit={tableLimit}
      from={true}
    />
  )
}

export default OrgApplicationFeed
