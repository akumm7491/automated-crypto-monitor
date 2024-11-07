import React, { useState, useEffect } from 'react'
import CryptoList from './components/CryptoList'
import Header from './components/Header'
import Filters from './components/Filters'
import { fetchCryptoData } from './services/api'

function App() {
  const [cryptos, setCryptos] = useState([])
  const [filteredCryptos, setFilteredCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'market_cap_desc'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData()
        setCryptos(data)
        setFilteredCryptos(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = [...cryptos]

    if (filters.search) {
      result = result.filter(crypto => 
        crypto.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.minPrice) {
      result = result.filter(crypto => crypto.current_price >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter(crypto => crypto.current_price <= Number(filters.maxPrice))
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.current_price - b.current_price)
        break
      case 'price_desc':
        result.sort((a, b) => b.current_price - a.current_price)
        break
      case 'market_cap_desc':
        result.sort((a, b) => b.market_cap - a.market_cap)
        break
      default:
        break
    }

    setFilteredCryptos(result)
  }, [filters, cryptos])

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <Header />
      <Filters filters={filters} setFilters={setFilters} />
      <CryptoList cryptos={filteredCryptos} loading={loading} />
    </div>
  )
}

export default App
