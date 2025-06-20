"use client"

import React, { useEffect, useState } from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import { getReservations } from '../actions/getReservations'
import TripsClient from './TripsClient'
import userUserStore from '@/hooks/useUser'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const TripPage = () => {
    // const currentUser = await getCurrentUser()
    const currentUser = userUserStore(state => state.currentUser)
    const [reservation, setReservation] = useState<any>()
    // const router = useRouter()

    const fetchReservation = async() => {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reservation`,{
            withCredentials: true
        }).then((res) => {
            // console.log(res)
            setReservation(res.data.data)
        })
    }

    useEffect(() => {
        fetchReservation()
        // router.refresh()
    },[])

    if (!currentUser){
        return (
            <ClientOnly>
                <EmptyState title='Unauthorized' subtitle='Please Login'></EmptyState>
            </ClientOnly>
        )
    }



    // const reservation = await getReservations({
    //     userId: currentUser.id
    // })

    if (!reservation  || reservation.length === 0){
        return (
            <ClientOnly>
                <EmptyState title='No trip found' subtitle='Looks like you haven reserved any trips'></EmptyState>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <TripsClient fetchReservation={fetchReservation} reservations={reservation} currentUser={currentUser}></TripsClient>
    </ClientOnly>
  )
}

export default TripPage