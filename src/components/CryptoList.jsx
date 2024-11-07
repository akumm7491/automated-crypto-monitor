import React, { useState } from 'react'
import { FaBitcoin } from 'react-icons/fa'

function CryptoIcon({ src, alt }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {!imageError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-8 h-8"
          onError={() => setImageError(true)}
          crossOrigin="anonymous"
        />
      ) : (
        <FaBitcoin className="w-6 h-6 text-primary" />
      )}
    </div>
  )
}

export default function CryptoList({ cryptos, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cryptos.map((crypto) => (
        <div
          key={crypto.id}
          className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-primary transition-colors"
        >
          <div className="flex items-center space-x-3 mb-3">
            <CryptoIcon 
              src={crypto.image} 
              alt={crypto.name}
            />
            <div>
              <h3 className="font-semibold">{crypto.name}</h3>
              <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Price</span>
              <span>${crypto.current_price?.toLocaleString() || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">24h Change</span>
              <span className={crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                {crypto.price_change_percentage_24h?.toFixed(2) || 0}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span>${crypto.market_cap?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
