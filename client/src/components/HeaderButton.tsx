'use client'

import React from 'react'
import { SafeUser } from '../types'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useFavorite } from '../hooks/useFavorite'

interface HeaderButtonProps {
  listingId: string,
  currentUser?: SafeUser | null
}

const HeaderButton = ({
  listingId,
  currentUser
}: HeaderButtonProps) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
  })

  return (
    <div
      onClick={toggleFavorite}
      className='
        relative
        hover:opacity-80
        transition
        cursor-pointer

      '>
      <AiOutlineHeart
        size={28}
        className='
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        '>
        </AiOutlineHeart>
        <AiFillHeart 
          size={24}
          className={
            hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
          }
        ></AiFillHeart>
    </div>
  )
}

export default HeaderButton