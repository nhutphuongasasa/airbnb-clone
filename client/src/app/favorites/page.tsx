"use client"

import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import React, { useEffect, useState } from 'react'
import { getFavoriteListings } from '../actions/getFavoriteListing'
import getCurrentUser from '../actions/getCurrentUser'
import FavoritesCLient from './FavoritesCLient'
import userUserStore from '@/hooks/useUser'
import axios from 'axios'

const FavoritePage = () => {
    // const listings = await getFavoriteListings()
    // const currentUser = await getCurrentUser()

    const currentUser = userUserStore(state => state.currentUser)

    const [listings, setListings] = useState()

    const fetchFavoriteListing= async() => {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/favorites`,{
            withCredentials: true
        }).then((res) => {
            // console.log(res)
            setListings(res.data.data)
        })
    }

    useEffect(() => {
        fetchFavoriteListing()
    },[])

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