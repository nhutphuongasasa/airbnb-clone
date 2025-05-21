

import React from 'react'
import getListingById, { IParam } from '../../actions/getListingById'
import ClientOnly from '@/components/ClientOnly'
import getCurrentUser from '@/app/actions/getCurrentUser'
import ListingClient from './ListingClient'
import { getReservations } from '@/app/actions/getReservations'


const ListingPage = async ({ params }: { params: IParam}) => {
  const listing = await getListingById(params)
  const currentUser = await getCurrentUser()
  const reservations = await getReservations(params)

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