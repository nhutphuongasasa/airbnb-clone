'use client'

import { categories } from '@/components/Categories'
import Container from '@/components/Container'
import ListingHead from '@/components/ListingHead'
import ListingInfo from '@/components/ListingInfo'
import ListingReservation from '@/components/ListingReservation'
import { useCheckoutStore } from '@/hooks/useCheckout'
import useLoginModal from '@/hooks/useLoginModal'
import { safeListing, SafeReservation, SafeUser } from '@/types'
import { Reservation } from '@prisma/client'
import axios from 'axios'
import { differenceInCalendarDays, differenceInDays, eachDayOfInterval } from 'date-fns'
import { difference } from 'next/dist/build/utils'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Range } from 'react-date-range'
import toast from 'react-hot-toast'
import { persist } from 'zustand/middleware'

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: SafeReservation[]
    listing: safeListing & {
        user: SafeUser
    },
    currentUser?: SafeUser | null
}

const ListingClient = ({
    listing,
    reservations = [],
    currentUser
}: ListingClientProps) => {
    const loginModal = useLoginModal()

    const router = useRouter()

    const disabledDates = useMemo(() => {
        let dates: Date[] = []

         reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })

            dates = [...dates, ...range]
         })

         return dates
    }, [reservations])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        setIsLoading(true)

        // axios.get('/api/create_payment_url')

        // axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reservation`, {
        //     totalPrice,
        //     startDate: dateRange.startDate,
        //     endDate: dateRange.endDate,
        //     listingId: listing?.id
        // }, {
        //     withCredentials: true
        // }).then(() => {
        //     toast.success("Listing reserved!")
        //     setDateRange(initialDateRange)
        //     router.push("/trips")
        // }).catch(() => {
        //     toast.error("Something went wrong!")
        // }).finally(() => {
        //     setIsLoading(false)
        // })


        useCheckoutStore.getState().setData({
            listingId: listing.id,
            totalPrice: totalPrice,
            dateRange: dateRange,
            listing: listing
        })

        router.replace(`/checkout?listingId=${listing.id}`)
    }, [
        totalPrice,
        dateRange,
        listing.id,
        router,
        currentUser,
        loginModal
    ])

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate){
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            )

            if (dayCount && listing.price){
                setTotalPrice( dayCount*listing.price)
            }else{
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price])

    const category = useMemo(() => {
        return categories.find((item) => 
            item.label === listing.category
        )
    }, [listing.category, dateRange])

  return (
    <Container>
        <div className='max-w-screen-lg mx-auto'>
            <div className='flex flex-col gap-6'>
                <ListingHead
                    title={listing.title}
                    imageSrc={listing.imageSrc}
                    locationValue={listing.locationValue}
                    id={listing.id}
                    currentUser={currentUser}
                />
                <div className='
                    grid
                    grid-cols-1
                    md:grid-cols-7
                    md:gap-10
                    mt-6
                '>
                    <ListingInfo
                        user={listing.user}
                        category={category}
                        description={listing.description}
                        roomCount={listing.roomCount}
                        bathroomCount={listing.bathroomCount}
                        guestCount={listing.guestCount}
                        locationValue={listing.locationValue}
                    />
                    <div className='
                        order-first
                        mb-10
                        md:order-last
                        md:col-span-3'>
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value: any) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                    </div>
                </div>
            </div>
        </div>
    </Container>
  )
}

export default ListingClient