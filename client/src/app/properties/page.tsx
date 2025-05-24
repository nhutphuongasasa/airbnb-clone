

import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import { getReservations } from '../actions/getReservations'
import TripsClient from './PropertiesClient'
import getListings from '../actions/getListings'
import PropertiesClient from './PropertiesClient'

const PropertiesPage = async() => {
    const currentUser = await getCurrentUser()

    if (!currentUser){
        return (
            <ClientOnly>
                <EmptyState title='Unauthorized' subtitle='Please Login'></EmptyState>
            </ClientOnly>
        )
    }

    const listings = await getListings({
        userId: currentUser.id
    })

    if (listings.length === 0){
        return (
            <ClientOnly>
                <EmptyState title='No trip found' subtitle='Looks like you have no properties'></EmptyState>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <PropertiesClient 
            listings={listings} 
            currentUser={currentUser}/>
    </ClientOnly>
  )
}

export default PropertiesPage