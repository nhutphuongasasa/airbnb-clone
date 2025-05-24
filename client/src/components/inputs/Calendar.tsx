
'use client'
import React from 'react'
import { DateRange, Range } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface CalendarProps {
    value: any,
    onChange: (value: Range) => void,
    disabledDates?: Date[]
}

const Calendar = ({
    value,
    onChange,
    disabledDates
}: CalendarProps) => {
  return (
    <DateRange
        rangeColors={['#262626']}
        ranges={[value]}
        date={new Date()}
        onChange={onChange}// tu dong truyen tham so cua react-date-range
        direction='vertical'
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
    ></DateRange>
  )
}

export default Calendar