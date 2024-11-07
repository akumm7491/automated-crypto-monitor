import React from 'react'
import { format } from 'date-fns'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { FaChartLine, FaExchangeAlt, FaPercentage } from 'react-icons/fa'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
        <p className="text-gray-300">{`Time: ${label}`}</p>
        <p className="text-primary">{`Profit: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    )
  }
  return null
}

export default function BotDashboard({ botMetrics }) {
  const hasData = botMetrics.recentTrades.length > 0
  const profitData = botMetrics.recentTrades.map(trade => ({
    time: format(new Date(trade.time), 'HH:mm:ss'),
    profit: trade.profit,
    cumulative: trade.profit // You would calculate cumulative here
  }))

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Bot Performance</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <FaChartLine className="text-primary text-xl" />
            <h3 className="text-gray-400 text-sm">Total Profit</h3>
          </div>
          <p className={`text-2xl font-bold ${botMetrics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${botMetrics.totalProfit.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <FaPercentage className="text-primary text-xl" />
            <h3 className="text-gray-400 text-sm">Win Rate</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {(botMetrics.winRate * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <FaExchangeAlt className="text-primary text-xl" />
            <h3 className="text-gray-400 text-sm">Active Trades</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {botMetrics.activeTrades}
          </p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-4">Profit Over Time</h3>
        <div className="h-[300px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="profit"
                  stroke="#6366f1"
                  fill="url(#profitGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FaChartLine className="text-4xl mx-auto mb-2 text-gray-500" />
                <p>No trade data available yet.</p>
                <p className="text-sm">Start trading to see your profit chart!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h3 className="font-bold mb-4">Recent Trades</h3>
        {hasData ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Pair</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {botMetrics.recentTrades.map((trade, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3">{format(new Date(trade.time), 'HH:mm:ss')}</td>
                    <td className="py-3">{trade.pair}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        trade.type === 'BUY' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3">${trade.price.toFixed(2)}</td>
                    <td className={`py-3 ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${trade.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-700 rounded-lg">
            <FaExchangeAlt className="text-4xl mx-auto mb-2 text-gray-500" />
            <p className="text-gray-400">No trades executed yet.</p>
            <p className="text-sm text-gray-400">Your recent trades will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
