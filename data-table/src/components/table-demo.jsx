import React from 'react'
import Table from './table'
import { employees, employeeColumns } from '../utils/helpers'

const TableDemo = () => {
    return (
        <div>
            <h2>Data table</h2>
            <p>Sort columns, filter rows, and page through results.</p>
            <Table
                columns={employeeColumns}
                data={employees}
                pageSize={5}
                placeholder="Search name, role, department..."
            />
        </div>
    )
}

export default TableDemo
