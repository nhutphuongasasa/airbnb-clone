'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import Heading from './Heading'
import Button from './Button'

interface EmptyStateProps {
  title?: string,
  subtitle?: string,
  showReset?: boolean
}

const EmptyState = ({ 
  title = 'No extra matches', 
  subtitle = "Try changing or removing some of your filters",
  showReset }: EmptyStateProps) => {
  
  const router = useRouter()
  
  return (
    <div className='
      h-[60vh]
      flex
      flex-col
      gap-2
      justify-center
      items-center
    '>
      <Heading
        center
        title={title}
        subtitle={subtitle}
      ></Heading>
      <div className='
        w-48
        mt-4
      '>
        {showReset && (
          <Button
            outline
            label='Remove all filters'
            onClick={() => router.push('/')}
          ></Button>
        )}
      </div>
    </div>
  )
}

export default EmptyState