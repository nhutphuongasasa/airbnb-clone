import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import { getReservations } from '../actions/getReservations'
import ReservationsClient from './ReservationsClient'

const ReservationPage = async () => {
    const currentUser = await getCurrentUser()

    if(! currentUser){
        return (
            <ClientOnly>
                <EmptyState title='Unauthorized' subtitle='Please login'></EmptyState>
            </ClientOnly>
        )
    }

    const reservations = await getReservations({
        authorId: currentUser.id
    })

    if(reservations.length === 0){
        return (
            <ClientOnly>
                <EmptyState title='No reservations found' subtitle='Looks like you have no reservation on your property'></EmptyState>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
        ></ReservationsClient>
    </ClientOnly>
  )
}

export default ReservationPage