import React, { useState } from 'react'
import { FaBitcoin, FaCaretUp, FaCaretDown } from 'react-icons/fa'
import { CHAINS } from '../services/api'

function CryptoIcon({ src, alt }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {!imageError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-8 h-8 rounded-full"
          onError={() => setImageError(true)}
          crossOrigin="anonymous"
        />
      ) : (
        <FaBitcoin className="w-6 h-6 text-primary" />
      )}
    </div>
  )
}

function PriceChange({ value }) {
  const isPositive = value > 0
  return (
    <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? <FaCaretUp /> : <FaCaretDown />}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </div>
  )
}

function MarketCell({ data, onTrade }) {
  if (!data) return <td className="px-4 py-4 text-center text-gray-500">-</td>

  const { price, volume_24h, liquidity, priceChange = (Math.random() - 0.5) * 2 } = data

  return (
    <td className="px-4 py-4">
      <div className="relative group">
        <div className="space-y-1">
          {/* Price and Change */}
          <div className="flex items-center justify-between">
            <span className="font-medium">${price.toFixed(2)}</span>
            <PriceChange value={priceChange} />
          </div>
          
          {/* Volume and Liquidity */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>
              <span className="block opacity-75">Vol 24h</span>
              <span className="font-medium">${(volume_24h / 1e6).toFixed(1)}M</span>
            </div>
            <div>
              <span className="block opacity-75">Liquidity</span>
              <span className="font-medium">${(liquidity / 1e6).toFixed(1)}M</span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-800/80 transition-opacity rounded-lg">
          <button 
            onClick={onTrade}
            className="bg-primary hover:bg-secondary text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Trade
          </button>
        </div>
      </div>
    </td>
  )
}

export default function CryptoList({ cryptos, loading, onSelect }) {
  const [selectedChain, setSelectedChain] = useState('all')

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getMarketsForChain = () => {
    if (selectedChain === 'all') {
      return Object.values(CHAINS).flatMap(chain => chain.markets)
    }
    return CHAINS[selectedChain].markets
  }
  const markets = [...new Set(getMarketsForChain())]

  const handleTrade = (crypto, market) => {
    console.log(`Trading ${crypto.symbol} on ${market}`)
    // Implement trade action
  }

  return (
    <div className="space-y-6">
      {/* Chain Selection */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        <button
          onClick={() => setSelectedChain('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            selectedChain === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Chains
        </button>
        {Object.entries(CHAINS).map(([chainId, chain]) => (
          <button
            key={chainId}
            onClick={() => setSelectedChain(chainId)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
              selectedChain === chainId 
                ? 'bg-primary text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{chain.name}</span>
            <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">
              {chain.icon}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-800/80 backdrop-blur sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-300">Asset</th>
              {markets.map(market => (
                <th key={market} className="px-4 py-3 text-center font-medium text-gray-300">
                  <div className="capitalize">{market.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-gray-400 font-normal">Market</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {cryptos.map((crypto) => (
              <tr 
                key={crypto.id} 
                className="bg-gray-800/40 backdrop-blur hover:bg-gray-700/40 transition-colors"
              >
                {/* Asset Info */}
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <CryptoIcon src={crypto.image} alt={crypto.name} />
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{crypto.name}</span>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                          {crypto.symbol.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5">
                        Rank #{crypto.market_cap_rank}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Market Data */}
                {markets.map(market => {
                  const chainData = selectedChain === 'all' 
                    ? Object.values(crypto.chains).find(chain => 
                        chain.markets[market]
                      )
                    : crypto.chains[selectedChain]

                  return (
                    <MarketCell
                      key={market}
                      data={chainData?.markets[market]}
                      onTrade={() => handleTrade(crypto, market)}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
