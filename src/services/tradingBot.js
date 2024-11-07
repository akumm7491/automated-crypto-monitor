export class TradingBot {
  constructor(strategy) {
    this.strategy = strategy
    this.trades = []
    this.activeTrades = new Map()
    this.metrics = {
      totalProfit: 0,
      winCount: 0,
      totalTrades: 0,
      activeTrades: 0
    }
  }

  evaluatePrice(crypto) {
    const price = crypto.current_price
    const symbol = crypto.symbol

    // Example strategy evaluation
    if (this.shouldBuy(crypto)) {
      this.executeBuy(symbol, price, crypto)
    } else if (this.shouldSell(crypto)) {
      this.executeSell(symbol, price, crypto)
    }
  }

  shouldBuy(crypto) {
    const price = crypto.current_price
    const priceChange = crypto.price_change_percentage_24h

    return this.strategy.buyCondition(price, priceChange)
  }

  shouldSell(crypto) {
    const price = crypto.current_price
    const priceChange = crypto.price_change_percentage_24h

    return this.strategy.sellCondition(price, priceChange)
  }

  executeBuy(symbol, price, crypto) {
    if (!this.activeTrades.has(symbol)) {
      const trade = {
        entryPrice: price,
        time: new Date(),
        symbol,
        pair: `${symbol}/USD`,
        type: 'BUY',
        price: price,
        profit: 0
      }
      this.activeTrades.set(symbol, trade)
      this.metrics.activeTrades++
      this.trades.unshift(trade) // Add to beginning of array
      if (this.trades.length > 50) this.trades.pop() // Keep only last 50 trades
    }
  }

  executeSell(symbol, price, crypto) {
    const trade = this.activeTrades.get(symbol)
    if (trade) {
      const profit = price - trade.entryPrice
      this.metrics.totalProfit += profit
      this.metrics.totalTrades++
      if (profit > 0) this.metrics.winCount++
      
      const sellTrade = {
        ...trade,
        type: 'SELL',
        exitPrice: price,
        price: price,
        profit: profit,
        exitTime: new Date(),
        time: new Date()
      }
      
      this.trades.unshift(sellTrade) // Add to beginning of array
      if (this.trades.length > 50) this.trades.pop() // Keep only last 50 trades
      
      this.activeTrades.delete(symbol)
      this.metrics.activeTrades--
    }
  }

  getMetrics() {
    return {
      totalProfit: this.metrics.totalProfit,
      winRate: this.metrics.totalTrades > 0 ? this.metrics.winCount / this.metrics.totalTrades : 0,
      activeTrades: this.metrics.activeTrades,
      recentTrades: this.trades
    }
  }
}
