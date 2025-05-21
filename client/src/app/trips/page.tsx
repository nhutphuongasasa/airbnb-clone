import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import { getReservations } from '../actions/getReservations'
import TripsClient from './TripsClient'

const TripPage = async() => {
    const currentUser = await getCurrentUser()

    if (!currentUser){
        return (
            <ClientOnly>
                <EmptyState title='Unauthorized' subtitle='Please Login'></EmptyState>
            </ClientOnly>
        )
    }

    const reservation = await getReservations({
        userId: currentUser.id
    })

    if (reservation.length === 0){
        return (
            <ClientOnly>
                <EmptyState title='No trip found' subtitle='Looks like you haven reserved any trips'></EmptyState>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <TripsClient reservations={reservation} currentUser={currentUser}></TripsClient>
    </ClientOnly>
  )
}

export default TripPage