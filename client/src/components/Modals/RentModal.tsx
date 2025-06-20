"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '../../hooks/useRentModel'
import Heading from '../Heading'
import { categories } from '../Categories'
import CategoryInput from '../inputs/CategoryInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import Map from '../Map'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'
import ImageUpLoad from '../inputs/ImageUpLoad'
import Input from '../inputs/Input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import userUserStore from '@/hooks/useUser'

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

// const userStore = userUserStore()

const RentModal = () => {
  const currentUser = userUserStore(state => state.currentUser)

  
  const rentModal = useRentModal()

  const router = useRouter()

  const [step, setStep] = useState(STEPS.CATEGORY)

  const [isLoading,setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      userId: '',
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      price: 1,
      title: '',
      description: ''
    }
  })

  const category = watch('category')
  const location = watch('location') 
  const guestCount = watch('guestCount')
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')
  const imageSrc = watch('imageSrc') as File[]

  
  const Map = useMemo(() => dynamic(() => import('../Map'),{
    ssr: false
  }), [location])
  
  //id dai dien cho cac field trong form id= category thi truyen gia tri cho category
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate:true
    })
  }
  
  // useEffect(() => {
  //   if (currentUser?.id) {
  //     setCustomValue('userId', currentUser.id)
  //   }
  // }, [currentUser?.id])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE){
      if (step === STEPS.CATEGORY && !category){
        toast.error("Please choose category")
        return
      }
      else if (step === STEPS.LOCATION && !location){
        toast.error("Please choose location")
        return
      }
      else if(step === STEPS.IMAGES){

        try{
          const formData = new FormData()

          imageSrc.forEach((file: File) => {
            formData.append('images', file); // Sử dụng tên 'images' khớp với API
          });

          const response = await axios.post('/api/sign-cloudinary-params', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setCustomValue("imageSrc", response.data)

        } catch (error) {
          console.error("Error onSubmit Image"+ error);
          return null; 
        }
      }

      return onNext()
    }

    setIsLoading(true)

    console.log(currentUser)
    toast(currentUser.id)


    // axios.post('/api/listings', data)
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing`, data,{
      withCredentials: true
    })
    .then(() => {
      toast.success("Listings Created")
      router.refresh()
      reset()
      setStep(STEPS.CATEGORY)
      rentModal.onClose()
    })
    .catch(() => {
      toast.error("Something went wrong")
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  const onBack = () => {
    setStep((value) => value-1)
  }

  const onNext = () => {
    setStep((value) => value+1)
  } 

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE){
      return 'Create'
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (STEPS.CATEGORY === step){
      return undefined
    }

    return 'Back'
  }, [step])

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading 
      title='Which of these best describe your places'
      subtitle='Pick a category'
      ></Heading>
      <div className='
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3 
          max-h-[50vh] 
          overflow-y-auto
          scrollbar-hide 
          scroll-smooth
          '>
        {categories.map((item) => (
          <div key={item.label} className='col-span-1'>
            {item.label}
            <CategoryInput
            //category o dau duoc truyen len tu component con
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            ></CategoryInput>
          </div>
        ))}
        </div>
    </div>
  )

  if( step == STEPS.LOCATION){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Where is your place located' 
          subtitle='Help guests find you!'>
        </Heading>
        <CountrySelect 
          value={location} 
          onChange={(value) => setCustomValue('location',value)}>
        </CountrySelect>
        <Map center={location?.latlng}/>
      </div>
    )
  }

  if (step === STEPS.INFO){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading 
          title='Share some basics about your place'
          subtitle='What amenities do you have?'
        ></Heading>
        <Counter 
          title='Guests' 
          subtitle='How many guests do you allow?'
          value={guestCount}
          onChange={(value)  => setCustomValue('guestCount', value)}
        ></Counter>
        <hr />
        <Counter 
          title='Rooms' 
          subtitle='How many rooms do you have?'
          value={roomCount}
          onChange={(value)  => setCustomValue('roomCount', value)}
        ></Counter>
        <hr />
        <Counter 
          title='Guests' 
          subtitle='How many bathrooms do you have?'
          value={bathroomCount}
          onChange={(value)  => setCustomValue('bathroomCount', value)}
        ></Counter>
      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading 
          title='Add a photo of your place'
          subtitle='Show guests what your place looks like'
        ></Heading>
        <ImageUpLoad
          value={imageSrc}
          onChange={(value) => {setCustomValue('imageSrc', [...imageSrc, value])
            // const a =imageSrc.length
            // toast.error(a.toString())
          }}
        ></ImageUpLoad>
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='How would you describe your place'
          subtitle='Short and sweet works best'
        ></Heading>
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        ></Input>
        <hr />
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        ></Input>
      </div>
    )
  }

  if (step === STEPS.PRICE){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Now, set your price'
          subtitle='How much do you charge per night'
        ></Heading>
        <Input
          id='price'
          label='Price'
          formatPrice
          type='number'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        ></Input>
      </div>
    )
  }

  

  return (
    <Modal
      body={bodyContent}
      isOpen={rentModal.isOpen}
      title='Airbnb your home'
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      actionLabel={actionLabel}
    ></Modal>
  )
}

export default RentModal