import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import React from 'react'
import { getFavoriteListings } from '../actions/getFavoriteListing'
import getCurrentUser from '../actions/getCurrentUser'
import FavoritesCLient from './FavoritesCLient'

const FavoritePage = async () => {
    const listings = await getFavoriteListings()
    const currentUser = await getCurrentUser()

    if (!listings){
        return (
            <ClientOnly>
                <EmptyState title='No favorites found' subtitle='look like you have no favorite listings'></EmptyState>
            </ClientOnly>
        )
    }


  return (
    <ClientOnly>
        <FavoritesCLient
            listings={listings}
            currentUser={currentUser}
        />
    </ClientOnly>
  )
}

export default FavoritePage