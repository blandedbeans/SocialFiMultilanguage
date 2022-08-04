import React from 'react'

export const ApplicationStatusCell = (props: {
  value: { index: number; value: string; postID: string }
}) => {
  const status = props.value.value
  const index = props.value.index
  const postID = props.value.postID
  return <p className="text-brand-500">{status}</p>
}
