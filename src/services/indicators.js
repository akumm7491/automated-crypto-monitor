export class TechnicalIndicators {
  static calculateSMA(prices, period) {
    if (prices.length < period) return null
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0)
    return sum / period
  }

  static calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null

    let gains = 0
    let losses = 0

    // Calculate initial gains and losses
    for (let i = 1; i <= period; i++) {
      const difference = prices[i] - prices[i - 1]
      if (difference >= 0) {
        gains += difference
      } else {
        losses -= difference
      }
    }

    // Calculate initial averages
    let avgGain = gains / period
    let avgLoss = losses / period

    // Calculate RSI
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  static calculateBollingerBands(prices, period = 20, standardDeviations = 2) {
    if (prices.length < period) return null

    const sma = this.calculateSMA(prices, period)
    
    // Calculate standard deviation
    const squaredDifferences = prices
      .slice(0, period)
      .map(price => Math.pow(price - sma, 2))
    
    const standardDeviation = Math.sqrt(
      squaredDifferences.reduce((a, b) => a + b, 0) / period
    )

    return {
      upper: sma + (standardDeviation * standardDeviations),
      middle: sma,
      lower: sma - (standardDeviation * standardDeviations)
    }
  }

  static calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (prices.length < slowPeriod) return null

    const fastEMA = this.calculateEMA(prices, fastPeriod)
    const slowEMA = this.calculateEMA(prices, slowPeriod)
    
    const macdLine = fastEMA - slowEMA
    return macdLine
  }

  static calculateEMA(prices, period) {
    if (prices.length < period) return null

    const multiplier = 2 / (period + 1)
    let ema = this.calculateSMA(prices, period)

    for (let i = period - 1; i >= 0; i--) {
      ema = (prices[i] - ema) * multiplier + ema
    }

    return ema
  }
}
