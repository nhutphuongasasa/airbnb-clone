"use client"

import React, { useEffect, useState } from 'react'
import getListingById, { IParam } from '../../actions/getListingById'
import ClientOnly from '@/components/ClientOnly'
import getCurrentUser from '@/app/actions/getCurrentUser'
import ListingClient from './ListingClient'
import { getReservations } from '@/app/actions/getReservations'
import userUserStore from '@/hooks/useUser'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { safeListing, SafeReservation, SafeUser } from '@/types'
import toast from 'react-hot-toast'


const ListingPage =  ({ params }: { params: IParam}) => {
  // const listing = await getListingById(params)
  // const reservations = await getReservations(params)
  // const currentUser = await getCurrentUser()

  const param = useParams()
  const listingId = param!.listingId as string

  const currentUser= userUserStore(state => state.currentUser)

  const [ listing, setListingExisting ] = useState<safeListing & {
          user: SafeUser
      }>()

  const [ reservations, setReservation ] = useState<SafeReservation[]>([])

  useEffect(() => {
    if (!listingId) return

    const fetchListing = async () => {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${listingId}`,{
        withCredentials: true
      })
      .then((res) => {
        // console.log(res.data.data)
        setListingExisting(res.data.data)
      }).catch((error) =>{
        // toast.error(error)
      })
    }

    // console.log(listing)

    const fetchReservation =async () => {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reservation?listingId=${listingId}`,{
        withCredentials: true
      }).then((res) => {
        setReservation(res.data.data)
        // console.log(res.data.data)
      }).catch((error) => {
        // toast.error(error)
      })
    }

    fetchListing()

    fetchReservation()
  }, [listingId])

  if (!listing){
    return (
      <div></div>
    )
  }

  return (
    <ClientOnly>
      <ListingClient 
        listing={listing} 
        currentUser={currentUser}
        reservations={reservations}
      ></ListingClient>
      {/* {listing?.title} */}
    </ClientOnly>
  )
}

export default ListingPage