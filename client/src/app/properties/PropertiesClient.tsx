'use client'

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/ListingCard'
import { safeListing, SafeReservation, SafeUser } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface PropertiesClientProps {
  currentUser?: SafeUser | undefined,
  listings: safeListing[]
}

const PropertiesClient = ({
  currentUser,
  listings
}: PropertiesClientProps) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel= useCallback((id: string) => {
    setDeletingId(id)

    axios.delete(`/api/listings/${id}`)
    .then(() => {
      toast.success("Listing deleted")
      router.refresh()
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error)
    })
    .finally(() => {
      setDeletingId("")
    })
  },[router])//khi router thay doi se tao 1 phien ban moi cua useCallBack

  return (
    <Container>
      <Heading title='Trips' subtitle='where you have been and where you are going'></Heading>
      <div className='
        mt-10
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      '>
        {listings.map((listing: safeListing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            currentUser={currentUser}
          ></ListingCard>
        ))}
      </div>
    </Container>
  )
}

export default PropertiesClient