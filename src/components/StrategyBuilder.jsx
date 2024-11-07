import React, { useState } from 'react'
import { FaChartLine, FaBolt, FaCog, FaRegClock } from 'react-icons/fa'

const strategyTemplates = {
  trendFollowing: {
    name: "Trend Following",
    icon: <FaChartLine className="text-blue-500" />,
    description: "Follows market momentum and trends",
    presets: [
      {
        name: "Simple Moving Average Crossover",
        buyCondition: "price > sma20 && sma20 > sma50",
        sellCondition: "price < sma20 && sma20 < sma50",
        params: {
          shortPeriod: 20,
          longPeriod: 50
        }
      },
      {
        name: "RSI Momentum",
        buyCondition: "rsi < 30 && priceChange > 0",
        sellCondition: "rsi > 70",
        params: {
          rsiPeriod: 14
        }
      }
    ]
  },
  volatility: {
    name: "Volatility Trading",
    icon: <FaBolt className="text-yellow-500" />,
    description: "Capitalizes on market volatility",
    presets: [
      {
        name: "Bollinger Bands Bounce",
        buyCondition: "price < bollingerLower",
        sellCondition: "price > bollingerUpper",
        params: {
          period: 20,
          standardDeviations: 2
        }
      }
    ]
  },
  meanReversion: {
    name: "Mean Reversion",
    icon: <FaCog className="text-purple-500" />,
    description: "Trades price returns to average",
    presets: [
      {
        name: "Oversold Bounce",
        buyCondition: "rsi < 20 && price < sma20",
        sellCondition: "rsi > 60 || price > sma20 * 1.05",
        params: {
          rsiPeriod: 14,
          smaPeriod: 20
        }
      }
    ]
  },
  timeBasedTrading: {
    name: "Time-Based Trading",
    icon: <FaRegClock className="text-green-500" />,
    description: "Trades based on time patterns",
    presets: [
      {
        name: "Daily Range Trader",
        buyCondition: "hour >= 9 && price < dailyLow * 1.02",
        sellCondition: "hour >= 15 || price > dailyHigh * 0.98",
        params: {
          tradingHours: {
            start: 9,
            end: 16
          }
        }
      }
    ]
  }
}

export default function StrategyBuilder({ onCreateStrategy }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [customParams, setCustomParams] = useState({})

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset)
    setCustomParams(preset.params)
  }

  const handleParamChange = (key, value) => {
    setCustomParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCreateStrategy = () => {
    if (!selectedPreset) return

    const strategy = {
      name: `${selectedTemplate.name} - ${selectedPreset.name}`,
      buyCondition: selectedPreset.buyCondition,
      sellCondition: selectedPreset.sellCondition,
      params: customParams
    }

    onCreateStrategy(strategy)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Strategy Builder</h2>
      
      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(strategyTemplates).map(([key, template]) => (
            <div
              key={key}
              onClick={() => setSelectedTemplate(template)}
              className="p-4 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 mb-2">
                {template.icon}
                <h3 className="font-semibold">{template.name}</h3>
              </div>
              <p className="text-sm text-gray-400">{template.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
            <button
              onClick={() => {
                setSelectedTemplate(null)
                setSelectedPreset(null)
              }}
              className="text-gray-400 hover:text-white"
            >
              Back to Templates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.presets.map((preset, index) => (
              <div
                key={index}
                onClick={() => handlePresetSelect(preset)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedPreset === preset
                    ? 'border-primary bg-gray-700'
                    : 'border-gray-700 bg-gray-700 hover:border-gray-600'
                }`}
              >
                <h4 className="font-semibold mb-2">{preset.name}</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Buy: {preset.buyCondition}</p>
                  <p>Sell: {preset.sellCondition}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedPreset && (
            <div className="space-y-4">
              <h4 className="font-semibold">Customize Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedPreset.params).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm text-gray-400">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      value={customParams[key] || value}
                      onChange={(e) => handleParamChange(key, Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateStrategy}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
              >
                Create Strategy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
