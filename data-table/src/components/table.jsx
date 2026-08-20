import React from 'react'
import './table.css'

const Table = ({ columns = [], data = [], pageSize = 5, placeholder = 'Search table' }) => {
    const [query, setQuery] = React.useState('')
    const [sortKey, setSortKey] = React.useState(null)
    const [sortDir, setSortDir] = React.useState('asc')
    const [page, setPage] = React.useState(1)

    const filteredData = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return data

        return data.filter((row) =>
            columns.some((column) =>
                String(row[column.key] ?? '').toLowerCase().includes(q)
            )
        )
    }, [data, columns, query])

    const sortedData = React.useMemo(() => {
        if (!sortKey) return filteredData

        const next = [...filteredData]
        next.sort((a, b) => {
            const left = a[sortKey]
            const right = b[sortKey]
            const dir = sortDir === 'asc' ? 1 : -1

            if (typeof left === 'number' && typeof right === 'number') {
                return (left - right) * dir
            }

            return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
                numeric: true,
                sensitivity: 'base',
            }) * dir
        })

        return next
    }, [filteredData, sortKey, sortDir])

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * pageSize
    const pageRows = sortedData.slice(start, start + pageSize)

    React.useEffect(() => {
        setPage(1)
    }, [query, sortKey, sortDir])

    const handleSort = (column) => {
        if (!column.sortable) return

        if (sortKey !== column.key) {
            setSortKey(column.key)
            setSortDir('asc')
            return
        }

        if (sortDir === 'asc') {
            setSortDir('desc')
            return
        }

        setSortKey(null)
        setSortDir('asc')
    }

    const sortIcon = (column) => {
        if (!column.sortable) return null
        if (sortKey !== column.key) return <span className="table-sort-icon">↕</span>
        return (
            <span className="table-sort-icon active">
                {sortDir === 'asc' ? '↑' : '↓'}
            </span>
        )
    }

    return (
        <div className="table-wrap">
            <div className="table-toolbar">
                <input
                    className="table-search"
                    type="text"
                    value={query}
                    placeholder={placeholder}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <p className="table-meta">
                    {sortedData.length} result{sortedData.length === 1 ? '' : 's'}
                </p>
            </div>

            <div className="table-scroll">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>
                                    <button
                                        type="button"
                                        className="table-sort-btn"
                                        disabled={!column.sortable}
                                        onClick={() => handleSort(column)}
                                    >
                                        {column.label}
                                        {sortIcon(column)}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td className="table-empty" colSpan={columns.length}>
                                    No matching rows
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((row) => (
                                <tr key={row.id ?? JSON.stringify(row)}>
                                    {columns.map((column) => (
                                        <td key={column.key}>{row[column.key]}</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-pagination">
                <p className="table-meta">
                    Page {currentPage} of {totalPages}
                </p>
                <div className="table-page-btns">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        return (
                            <button
                                type="button"
                                key={pageNumber}
                                className={pageNumber === currentPage ? 'active' : ''}
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        )
                    })}
                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Table
