'use client'

import React from 'react'
import { IconType } from 'react-icons'

interface CategoryInputProps {
  icon: IconType,
  label: string,
  selected?: boolean,
  onClick: (value: string) => void
}

const CategoryInput = ({ icon: Icon, label, selected, onClick}: CategoryInputProps) => {
  return (
    <div onClick={() => onClick(label)} 
    className={`
      rounded-xl
      border-2
      p-4
      flex
      transition
      cursor-pointer
      flex-col
      gap-3
      hover:border-black
      ${selected ? 'border-black' : 'border-neutral-200'}
    `}>
      <Icon size={30}></Icon>
      <div className='font-semibold'>
        {label}
      </div>
    </div>
  )
}

export default CategoryInput