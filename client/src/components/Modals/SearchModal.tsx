'use client'

import qs from 'query-string'
import React, { useCallback, useMemo, useState } from 'react'
import Modal from './Modal'
import useSearchModal from '@/hooks/useSearchModal'
import { useRouter, useSearchParams } from 'next/navigation'
import { Range } from 'react-date-range'
import dynamic from 'next/dynamic'
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect'
import { formatISO, setDate } from 'date-fns'
import Heading from '../Heading'
import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const router = useRouter()
    const params = useSearchParams()
    const searchModal = useSearchModal()

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(1)
    const [guestCount, setGuestCount] = useState(1)
    const [roomCount, setRoomCount] = useState(1)
    const [bathRoomCount, setBathRoomCount] = useState(1)
    const [dateRange,setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const onBack = useCallback(() => {
        setStep((value) => value-1)
    },[])

    const onNext = useCallback(async() => {
        setStep((value) => value+1)
    },[])

    const onSubmit = useCallback(() => {
        if (step !== STEPS.INFO){
            return onNext()
        }

        let currentQuery = {}

        if (params){
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathRoomCount
        }

        if(dateRange.startDate){
            updatedQuery.startDate= formatISO(dateRange.startDate)
        }

        if(dateRange.endDate){
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        },{ skipNull: true})

        setStep(STEPS.LOCATION)
        searchModal.onClose()

        router.push(url)
    },[step, searchModal,location,router,guestCount,roomCount, bathRoomCount, dateRange, onNext,params])

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO){
            return 'Search'
        }

        return 'Next'
    },[step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION){
            return undefined
        }

        return 'Back'
    },[step])

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading title='Where do you wanna go' subtitle='Find perfect location!'></Heading>
            <CountrySelect value={location} onChange={(value) => setLocation(value as CountrySelectValue)}></CountrySelect>
            <hr />
            <Map center={location?.latlng}></Map>
        </div>
    )

    if (step === STEPS.DATE){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='When do you plan to go' subtitle='Make sure everyone is free'></Heading>
                <Calendar
                    value={dateRange}
                    onChange={(value: any) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    if(step === STEPS.INFO){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='More information' subtitle='Find your perfect place'></Heading>
                <Counter 
                    title='Guest' 
                    subtitle='How many guests are coming'
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                ></Counter>
                <Counter 
                    title='Guest' 
                    subtitle='How many room are need'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                ></Counter>
                <Counter 
                    title='Guest' 
                    subtitle='How many bathroom are need'
                    value={bathRoomCount}
                    onChange={(value) => setBathRoomCount(value)}
                ></Counter>
            </div>
        )
    }

  return (
    <Modal
        isOpen={searchModal.isOpen}
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        title='Filters'
        actionLabel='Search'
        secondaryAction={step === STEPS.LOCATION ?  undefined : onBack}
        secondaryActionLabel={secondaryActionLabel}
        body={bodyContent}
    ></Modal>
  )
}

export default SearchModal