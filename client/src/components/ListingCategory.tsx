import React from 'react'
import { IconType } from 'react-icons'

interface ListingCategoryProps {
    icon: IconType,
    label: string,
    description: string
}

const ListingCategory = ({
    icon: Icon,
    label,
    description
}: ListingCategoryProps) => {
  return (
    <div className='flex flex-col hap-6'>
        <div className='flex flex-row items-center gap-4'>
            <Icon size={40} className='text-neutral-600'></Icon>
            <div className='flex flex-col'>
                <div className='text-lg font-semibold'>
                    {label}
                </div>
                <div className='text-neutral-500 font-light'>
                    {description}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListingCategory