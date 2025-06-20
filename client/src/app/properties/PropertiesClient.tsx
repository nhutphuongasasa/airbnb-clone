'use client'

import ClientOnly from '@/components/ClientOnly'
import Container from '@/components/Container'
import EmptyState from '@/components/EmptyState'
import Heading from '@/components/Heading'
import ListingCard from '@/components/ListingCard'
import { safeListing, SafeReservation, SafeUser } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface PropertiesClientProps {
  currentUser?: SafeUser | undefined,
  // listings: safeListing[],
  // fetchListing: () => Promise<void>
}

const PropertiesClient = ({
  currentUser,
  // listings,
  // fetchListing
}: PropertiesClientProps) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')
  const [listings, setListings] = useState<any>()

  // const listings = await getListings({
  //     userId: currentUser.id
  // })

  const fetchListing = async() => {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/me`,{
          withCredentials: true
      }).then((res) => {
          // console.log(res.data.data)
          setListings(res.data.data)
      }).catch((error) => {
          // console.log(error)
      })
  }

  useEffect(() => {
      // if (!currentUser) return;
      fetchListing()
  },[])

  const onCancel= useCallback(async(id: string) => {
    setDeletingId(id)

    await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${id}`,{
      withCredentials: true
    })
    .then((res) => {
      // await fetchListing()
      setListings(res.data.data)
      toast.success("Listing deleted")
      router.refresh()
    })
    .catch((error) => {
      // toast.error(error?.response?.data?.error)
    })
    .finally(() => {
      setDeletingId("")
    })
  },[router])//khi router thay doi se tao 1 phien ban moi cua useCallBack

      if (!listings || listings.length === 0){
        return (
            <ClientOnly>
                <EmptyState title='No trip found' subtitle='Looks like you have no properties'></EmptyState>
            </ClientOnly>
        )
    }

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