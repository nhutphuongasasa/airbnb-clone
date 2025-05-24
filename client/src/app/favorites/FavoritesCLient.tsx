import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/ListingCard'
import { safeListing, SafeUser } from '@/types'
import React from 'react'

interface FavoritesCLientProps {
    currentUser?: SafeUser | null,
    listings: safeListing[]
}

const FavoritesCLient = ({
    currentUser,
    listings
}: FavoritesCLientProps) => {
  return (
    <Container>
        <Heading
            title='Favorites'
            subtitle='List of places you have favorites!'
        ></Heading>
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
            {listings.map((listing) => (
                <ListingCard
                    currentUser={currentUser}
                    key={listing.id}
                    data={listing}
                ></ListingCard>
            ))}
        </div>
    </Container>
  )
}

export default FavoritesCLient