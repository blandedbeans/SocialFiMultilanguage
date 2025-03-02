/* eslint-disable react/jsx-key */
import { DocumentNode, useQuery } from '@apollo/client'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Profile } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import React, { FC, useState } from 'react'
import { useFilters, useTable } from 'react-table'
import { useAppPersistStore } from 'src/store/app'

import App from '../App'
import NFTDetails from './NFTdetails'

interface Props {
  profile: Profile
  handleQueryComplete: Function
  getColumns: Function
  query: DocumentNode
  request: any
  tableLimit: number
  from: boolean
}

export interface Data {
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

const ApplicationTable: FC<Props> = ({
  profile,
  handleQueryComplete,
  getColumns,
  query,
  request,
  tableLimit,
  from
}) => {
  const { currentUser } = useAppPersistStore()
  const [tableData, setTableData] = useState<Data[]>([])
  const [pubIdData, setPubIdData] = useState<string[]>([])
  const [appTxnData, setAppTxnData] = useState<string[]>([])
  const [addressData, setAddressData] = useState<string[]>([])

  const handleTableData = async (data: any) => {
    return Promise.all(
      data.map(async (i: any, index: number) => {
        console.log(i)
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

  const handleNFTData = (data: any, index: number, id: string, name = '') =>
    fetch(data)
      .then((i) => i)
      .then((result) => {
        result.json().then((metadata) => {
          tableData[index] = {
            websiteurl: metadata.attributes[6].value,
            country: metadata.attributes[7].value,
            category: metadata.attributes[8].value,
            receivingorganizationname: metadata.attributes[1].value,
            orgWalletAddress: metadata.attributes[2].value,
            name: metadata.attributes[3].value,
            email: metadata.attributes[4].value,
            organizationname: metadata.attributes[5].value,
            reason: metadata.attributes[9].value,
            message: metadata.attributes[10].value,
            verified: {
              index: index,
              value: 'Accepted',
              postID: id
            }
          }
        })
      })

  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: {
      request: request,
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !profile?.id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const hours = handleQueryComplete(data)

      handleTableData(hours).then((result: Data[]) => {
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
        appTxn: string[] = [],
        addresses: string[] = []
      hours.map((i: any) => {
        pubId.push(i.id)
        appTxn.push('')
        addresses.push(i.collectNftAddress)
      })
      setPubIdData([...pubIdData, ...pubId])
      setAppTxnData([...appTxnData, ...appTxn])
      setAddressData([...addressData, ...addresses])
    }
  })

  const columns = getColumns(addressData)

  const Table = () => {
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
      useTable(
        {
          columns,
          data: tableData
        },
        useFilters
      )
    return (
      <table
        className="w-full text-md text-center mb-2 mt-2"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, index) => {
            return index === 0 ? (
              <tr>
                <th
                  className="p-4"
                  {...headerGroup.headers[0].getHeaderProps()}
                >
                  {headerGroup.headers[0] &&
                    headerGroup.headers[0].render('Header')}
                  <p>Submissions</p>
                </th>
              </tr>
            ) : (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className="p-4" {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            )
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td className="p-4" {...cell.getCellProps()}>
                        {cell.render('Cell', { app: appTxnData })}
                      </td>
                    )
                  })}
                </tr>
                <App
                  pubId={pubIdData[index]}
                  callback={(data: any) => {
                    const publications = data.publications.items.filter(
                      (i: any) => ethers.utils.isHexString(i.metadata.content)
                    )
                    if (publications.length !== 0) {
                      if (
                        appTxnData[index] != publications[0].metadata.content
                      ) {
                        appTxnData[index] = publications[0].metadata.content
                        setAppTxnData(appTxnData)
                        setTableData([...tableData])
                      }
                    }
                  }}
                />
                <NFTDetails
                  address={addressData[index]}
                  callback={(data: any) => {
                    handleNFTData(
                      data,
                      index,
                      tableData[index].verified.postID,
                      tableData[index].organizationname
                    )
                  }}
                />
              </>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <>
      {loading && <PostsShimmer />}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile?.handle}</span>
              <span>seems like not {'POST'.toLowerCase()}ed yet!</span>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load hours" error={error} />
      {!error && !loading && data?.publications?.items?.length !== 0 && (
        <Card>
          <Table />
        </Card>
      )}
    </>
  )
}

export default ApplicationTable
