import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import CryptoList from './components/CryptoList'
import Header from './components/Header'
import Filters from './components/Filters'
import StrategyBuilder from './components/StrategyBuilder'
import TradingChart from './components/TradingChart'
import BotDashboard from './components/BotDashboard'
import ActiveStrategies from './components/ActiveStrategies'
import { fetchCryptoData } from './services/api'
import { TradingBot } from './services/tradingBot'

function App() {
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [strategies, setStrategies] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'market_cap_desc'
  })

  const { data: cryptos = [], isLoading } = useQuery(
    'cryptoData',
    fetchCryptoData,
    {
      refetchInterval: 30000,
    }
  )

  const [bot, setBot] = useState(null)
  const [botMetrics, setBotMetrics] = useState({
    totalProfit: 0,
    winRate: 0,
    activeTrades: 0,
    recentTrades: []
  })

  useEffect(() => {
    if (cryptos.length > 0 && bot) {
      cryptos.forEach(crypto => {
        bot.evaluatePrice(crypto)
      })
      setBotMetrics(bot.getMetrics())
    }
  }, [cryptos, bot])

  const addStrategy = (strategy) => {
    const newStrategy = {
      ...strategy,
      id: Date.now(),
      active: true,
      profit: 0,
      type: strategy.name.split(' - ')[0],
      createdAt: new Date()
    }

    const newBot = new TradingBot({
      buyCondition: (price, priceChange) => {
        try {
          return eval(strategy.buyCondition)
        } catch (error) {
          console.error('Buy condition evaluation error:', error)
          return false
        }
      },
      sellCondition: (price, priceChange) => {
        try {
          return eval(strategy.sellCondition)
        } catch (error) {
          console.error('Sell condition evaluation error:', error)
          return false
        }
      },
      params: strategy.params
    })
    
    setBot(newBot)
    setStrategies(prev => [...prev, newStrategy])
  }

  const toggleStrategy = (strategyId) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, active: !strategy.active }
        : strategy
    ))
  }

  const deleteStrategy = (strategyId) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId))
  }

  const filteredCryptos = React.useMemo(() => {
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

    return result
  }, [cryptos, filters])

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BotDashboard botMetrics={botMetrics} activeStrategies={strategies} />
            <ActiveStrategies 
              strategies={strategies}
              onToggle={toggleStrategy}
              onDelete={deleteStrategy}
            />
          </div>
          <StrategyBuilder onCreateStrategy={addStrategy} />
          {selectedCrypto && (
            <TradingChart 
              data={selectedCrypto.chartData} 
              symbol={selectedCrypto.symbol}
            />
          )}
          <div className="bg-gray-800 rounded-lg p-6">
            <Filters filters={filters} setFilters={setFilters} />
            <CryptoList 
              cryptos={filteredCryptos} 
              loading={isLoading}
              onSelect={setSelectedCrypto}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
