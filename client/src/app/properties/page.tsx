"use client"

import React, { useEffect, useState } from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import { getReservations } from '../actions/getReservations'
import TripsClient from './PropertiesClient'
import getListings from '../actions/getListings'
import PropertiesClient from './PropertiesClient'
import userUserStore from '@/hooks/useUser'
import axios from 'axios'

const PropertiesPage = () => {
    // const currentUser = await getCurrentUser()
    const currentUser = userUserStore(state => state.currentUser)

    if (!currentUser){
        return (
            <ClientOnly>
                <EmptyState title='Unauthorized' subtitle='Please Login'></EmptyState>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <PropertiesClient 
            // fetchListing={fetchListing}
            // listings={listings} 
            currentUser={currentUser}/>
    </ClientOnly>
  )
}

export default PropertiesPage