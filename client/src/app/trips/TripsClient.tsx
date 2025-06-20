'use client'

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/ListingCard'
import { SafeReservation, SafeUser } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface TripsClientProps {
  currentUser?: SafeUser | undefined,
  reservations: SafeReservation[],
  fetchReservation: () => Promise<void>
}

const TripsClient = ({
  currentUser,
  reservations,
  fetchReservation
}: TripsClientProps) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel= useCallback(async(id: string) => {
    setDeletingId(id)

    await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reservation/${id}`,{
      withCredentials: true
    })
    .then(async() => {
      await fetchReservation()
      toast.success("Reservation deleted")
      router.refresh()
    }) 
    .catch((error) => {
      // toast.error(error?.response?.data?.error)
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
        {reservations.map((reservation: SafeReservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel Reservation"
            currentUser={currentUser}
          ></ListingCard>
        ))}
      </div>
    </Container>
  )
}

export default TripsClient