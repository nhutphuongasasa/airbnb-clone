'use client'

import ListingCard from '@/components/ListingCard'
import { SafeReservation, SafeUser } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface ReservationsClientProps {
    reservations: SafeReservation[],
    currentUser?: SafeUser | undefined
}

const ReservationsClient = ({
    reservations,
    currentUser
}: ReservationsClientProps) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel = useCallback((id: string) => {
    setDeletingId(id)

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success("Reservation cancelled")
    })
    .catch(() => {
      toast.error("Some thing went wrong")
      setDeletingId('')
    })
    .finally(() => {
      setDeletingId('')
    })
  },[router])

  return (
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
      {reservations.map((reservation) => (
        <ListingCard
          key={reservation.id}
          data={reservation.listing}
          reservation={reservation}
          actionId={reservation.id}
          onAction={onCancel}
          disabled={deletingId === reservation.id}
          actionLabel='Cancel guest reservation'
          currentUser={currentUser}
        ></ListingCard>
      ))}
    </div>
  )
}

export default ReservationsClient