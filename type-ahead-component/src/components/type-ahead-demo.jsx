import React from 'react'
import TypeAhead from './type-ahead'
import { fetchSuggestions } from '../utils/helpers'

const TypeAheadDemo = () => {
    const handleSelect = (selectedItem) => {
        console.log(selectedItem)
    }

    return (
      <div className='flex flex-col gap-12 items-center justify-center'>
          <h2 className='text-2xl text-neutral-800 font-semibold'>
            Type ahead component
          </h2>
          <TypeAhead fetchSuggestions={fetchSuggestions} placeholder="Search here" onSelect={handleSelect} />
      </div>
     );
}

export default TypeAheadDemo;
