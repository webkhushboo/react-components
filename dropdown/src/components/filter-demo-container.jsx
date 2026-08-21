import React from 'react'
import { useProductFilters } from '../hooks/useProductFilters'
import FilterDemoView from './filter-demo'
import './filter-demo.css'

const FilterDemo = () => {
    const filters = useProductFilters()
    return <FilterDemoView {...filters} />
}

export default FilterDemo
