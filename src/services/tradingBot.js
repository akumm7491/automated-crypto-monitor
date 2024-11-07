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
      this.executeBuy(symbol, price)
    } else if (this.shouldSell(crypto)) {
      this.executeSell(symbol, price)
    }
  }

  shouldBuy(crypto) {
    // Implement strategy buy conditions
    const price = crypto.current_price
    const priceChange = crypto.price_change_percentage_24h

    return this.strategy.buyCondition(price, priceChange)
  }

  shouldSell(crypto) {
    // Implement strategy sell conditions
    const price = crypto.current_price
    const priceChange = crypto.price_change_percentage_24h

    return this.strategy.sellCondition(price, priceChange)
  }

  executeBuy(symbol, price) {
    if (!this.activeTrades.has(symbol)) {
      const trade = {
        entryPrice: price,
        time: new Date(),
        symbol
      }
      this.activeTrades.set(symbol, trade)
      this.metrics.activeTrades++
    }
  }

  executeSell(symbol, price) {
    const trade = this.activeTrades.get(symbol)
    if (trade) {
      const profit = price - trade.entryPrice
      this.metrics.totalProfit += profit
      this.metrics.totalTrades++
      if (profit > 0) this.metrics.winCount++
      
      this.trades.push({
        ...trade,
        exitPrice: price,
        profit,
        exitTime: new Date()
      })
      
      this.activeTrades.delete(symbol)
      this.metrics.activeTrades--
    }
  }

  getMetrics() {
    return {
      totalProfit: this.metrics.totalProfit,
      winRate: this.metrics.totalTrades > 0 ? this.metrics.winCount / this.metrics.totalTrades : 0,
      activeTrades: this.metrics.activeTrades,
      recentTrades: this.trades.slice(-10).reverse()
    }
  }
}
