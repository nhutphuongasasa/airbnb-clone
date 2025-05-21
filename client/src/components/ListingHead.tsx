'use client'

import { useCountries } from '@/hooks/useCountries'
import { SafeUser } from '@/types'
import React from 'react'
import Heading from './Heading'
import Image from 'next/image'
import HeaderButton from './HeaderButton'

interface ListingHeadProps {
    title: string,
    locationValue: string,
    imageSrc: string[],
    id: string,
    currentUser?: SafeUser | null
}

const ListingHead = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser
}: ListingHeadProps) => {
    const { getByValue } = useCountries()

    const location = getByValue(locationValue)

  return (
    <>
        <Heading
            title={title}
            subtitle={`${location?.region}, ${location?.label}`}
        />
        <div className='
            w-full
            h-[60vh]
            overflow-hidden
            rounded-xl
            relative
        '>
            <Image
                alt='Image'
                src={imageSrc[0]}
                fill
                className='object-cover w-full'
            />
            <div className='absolute top-5 right-5'>
                <HeaderButton
                    listingId={id}
                    currentUser={currentUser}
                ></HeaderButton>
            </div>
        </div>
    </>
  )
}

export default ListingHead