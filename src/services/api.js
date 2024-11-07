import axios from 'axios'

export const CHAINS = {
  ethereum: {
    name: 'Ethereum',
    icon: 'ETH',
    markets: ['uniswap_v3', 'sushiswap', 'curve']
  },
  bsc: {
    name: 'BNB Chain',
    icon: 'BNB',
    markets: ['pancakeswap', 'biswap']
  },
  polygon: {
    name: 'Polygon',
    icon: 'MATIC',
    markets: ['quickswap', 'uniswap_v3', 'sushiswap']
  },
  arbitrum: {
    name: 'Arbitrum',
    icon: 'ARB',
    markets: ['uniswap_v3', 'sushiswap', 'camelot']
  },
  avalanche: {
    name: 'Avalanche',
    icon: 'AVAX',
    markets: ['traderjoe', 'pangolin']
  }
}

export const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false
        }
      }
    )

    // Simulate prices across different chains and markets
    return response.data.map(coin => ({
      ...coin,
      chains: Object.keys(CHAINS).reduce((acc, chain) => {
        acc[chain] = {
          name: CHAINS[chain].name,
          icon: CHAINS[chain].icon,
          markets: CHAINS[chain].markets.reduce((markets, market) => {
            // Simulate different prices across markets with small variations
            const basePrice = coin.current_price
            const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
            markets[market] = {
              price: basePrice * (1 + variation),
              volume_24h: coin.total_volume * (Math.random() * 0.5),
              liquidity: coin.market_cap * (Math.random() * 0.3)
            }
            return markets
          }, {})
        }
        return acc
      }, {})
    }))
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return []
  }
}
