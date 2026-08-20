export const techStacks = [
    'JS',
    'HTML',
    'JS2',
    'HTML',
    'JS3',
    'HTML',
    'JS4',
    'HTML',
    'JS5',
    'HTML',
    'Typescript',
    'Vivek shrivastav',
    'Vivek agrawal',
    'vivek gupta'
]

export const fetchSuggestions = (query, { signal } = {}) => {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'))
            return
        }

        const timer = setTimeout(() => {
            if (query.trim().toLowerCase() === 'error') {
                reject(new Error('Failed to fetch suggestions'))
                return
            }

            const results = techStacks.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            )
            resolve(results)
        }, 400)

        signal?.addEventListener('abort', () => {
            clearTimeout(timer)
            reject(new DOMException('Aborted', 'AbortError'))
        })
    })
}