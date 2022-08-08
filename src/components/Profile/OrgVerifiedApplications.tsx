/* eslint-disable react/jsx-key */
import { gql, useQuery } from '@apollo/client'
import { Profile } from '@generated/types'
import React, { FC, useMemo, useState } from 'react'
import { useFilters, useTable } from 'react-table'
import { useAppPersistStore } from 'src/store/app'

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
  callback?: Function
}

interface Data {
  websiteurl: string
  country: string
  category: string
  receivingorganizationname: string
  orgWalletAddress: string
  name: string
  organizationname: string
  reason: string
  message: string
  email: string
  verified: {
    index: number
    value: string
    postID: string
  }
}

const OrgVerifiedApplications: FC<Props> = ({ profile, callback }) => {
  const { currentUser } = useAppPersistStore()
  const [onEnter, setOnEnter] = useState<boolean>(false)
  const [tableData, setTableData] = useState<Data[]>([])
  const [pubIdData, setPubIdData] = useState<string[]>([])
  const [vhrTxnData, setVhrTxnData] = useState<string[]>([])
  const [addressData, setAddressData] = useState<string[]>([])

  const handleTableData = async (data: any) => {
    return Promise.all(
      data.map(async (j: any, index: number) => {
        console.log(j)
        const i = j.mentionPublication
        let verified = false
        if (i.collectNftAddress) verified = true
        return {
          websiteurl: i.metadata.attributes[6].value,
          country: i.metadata.attributes[7].value,
          category: i.metadata.attributes[8].value,
          receivingorganizationname: i.metadata.attributes[1].value,
          orgWalletAddress: i.metadata.attributes[2].value,
          name: i.metadata.attributes[3].value,
          email: i.metadata.attributes[4].value,
          organizationname: i.metadata.attributes[5].value,
          reason: i.metadata.attributes[9].value,
          message: i.metadata.attributes[10].value,
          verified: {
            index: index,
            value: verified ? 'Accepted' : 'Not Accepted',
            postID: i.id
          }
        }
      })
    )
  }

  const tableLimit = 10
  const { fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: {
        profileId: profile?.id,
        limit: tableLimit
      },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !profile?.id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (onEnter) {
        tableData.splice(0, tableData.length)
        setTableData(tableData)
        setOnEnter(false)
      }
      const notifs = data?.notifications?.items.filter((i: any) => {
        return (
          i.__typename === 'NewMentionNotification' &&
          i.mentionPublication.metadata.attributes[0].value ===
            'PartnershipApplication' &&
          !i.mentionPublication.hidden
        )
      })
      handleTableData(notifs).then((result: Data[]) => {
        setTableData([...tableData, ...result])
        if (tableData.length != tableLimit) {
          fetchMore({
            variables: {
              offset: tableLimit - tableData.length
            }
          })
        }
      })
      const pubId: string[] = [],
        vhrTxn: string[] = [],
        addresses: string[] = []
      notifs.map((i: any) => {
        pubId.push(i.mentionPublication.id)
        vhrTxn.push('')
        addresses.push(i.mentionPublication.collectNftAddress)
      })
      setPubIdData([...pubIdData, ...pubId])
      setVhrTxnData([...vhrTxnData, ...vhrTxn])
      setAddressData([...addressData, ...addresses])
      setOnEnter(true)
    }
  })

  const columns = useMemo(
    () => [
      {
        Header: 'Partnership Verification',
        columns: [
          {
            Header: 'Total Hours',
            accessor: 'totalHours'
          },
          {
            Header: 'Status',
            accessor: 'verified'
          }
        ]
      }
    ],
    []
  )

  const { rows } = useTable(
    {
      columns,
      data: tableData
    },
    useFilters
  )

  const Complete = () => {
    return <div />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{<Complete />}</>
}

export default OrgVerifiedApplications
