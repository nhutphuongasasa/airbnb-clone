import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'
import { IconType } from 'react-icons'
import qs from 'query-string'

interface CategoryBoxProps {
  label: string,
  description?: string,
  selected?: boolean,
  icon: IconType
  tooltipPosition: "right" | "left"
}

const CategoryBox = ({ label, description, icon: Icon, selected,tooltipPosition }: CategoryBoxProps) => {
  const router = useRouter()
  const params = useSearchParams()//lay cac tham so trong query co ?

  const handleClick = useCallback(() => {
    let currentQuery = {}

    console.log(label)

    if(params){
      currentQuery = qs.parse(params.toString())//qs chuyan thanh object
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label
    }

    if(params?.get('category') === label){
      delete updatedQuery.category
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, {skipNull: true})

    console.log(url)

    router.push(url)
  },[label,params,router])

  return (
    <div onClick={handleClick} className={`flex flex-col items-center justify-center cursor-pointer group relative transition hover:text-neutral-800 hover:border-2 gap-1 p-3 border-b-4
      ${selected ? 'border-b-neutral-300' : 'border-transparent'}
      ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}>
      <Icon size={26} />
      <div className='font-medium text-sm'>{label}</div>
      {description &&(
        <div className={`absolute bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-111
        ${tooltipPosition === 'right' ? "right-1/4 top-1/2" : "left-1/2 top-2/4 "}
        `}>
          {description}
        </div>
      )}
    </div>
  )
}

export default CategoryBox
