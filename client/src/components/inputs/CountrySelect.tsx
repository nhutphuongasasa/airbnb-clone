import React from 'react'
import { useCountries } from '../../hooks/useCountries'
import Select from 'react-select';
import toast from 'react-hot-toast';


export type CountrySelectValue = {
  flag: string
  label: string
  latlng: number[]
  region: string
  value: string
}

interface CountrySelectProps {
  value?: CountrySelectValue,
  onChange: (value: CountrySelectValue) => void
}

const CountrySelect = ({value, onChange }: CountrySelectProps) => {
  const { getAll } = useCountries()

  return (
    <div>
      <Select 
      placeholder="AnyWhere" 
      isClearable 
      options={getAll()}
      value={value}
      onChange={(value) => {
        if(!value.latlng){
          // toast.error("no latlng")
        }
        onChange(value as CountrySelectValue)
      }}
      formatOptionLabel={(option: any) => (
        <div className='flex flex-row items-center gap-3'>
          <div>{option.flag}</div>
          <div>
            {option.label}
            <span className='text-neutral-800 ml-1'>
              {option.region}
            </span>
          </div>
        </div>
      )}
      classNames={{
        control: () => 'p-3 border-2',
        input: () => 'text-lg',
        option: () => 'text-lg'
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: 'black',
          primary25: '#ffe4e6'
        }
      })}
      ></Select>
    </div>
  )
}

export default CountrySelect