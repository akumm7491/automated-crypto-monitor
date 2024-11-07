import React from 'react'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function BotDashboard({ botMetrics, activeStrategies }) {
  const chartData = botMetrics.recentTrades.map(trade => ({
    time: format(trade.time, 'HH:mm:ss'),
    profit: trade.profit
  }))

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Bot Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Profit</h3>
          <p className="text-2xl font-bold text-green-500">
            ${botMetrics.totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Win Rate</h3>
          <p className="text-2xl font-bold text-primary">
            {(botMetrics.winRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Active Trades</h3>
          <p className="text-2xl font-bold">{botMetrics.activeTrades}</p>
        </div>
      </div>

      <h3 className="font-bold mb-2">Profit Over Time</h3>
      <div className="bg-gray-700 p-4 rounded-lg">
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      <h3 className="font-bold mb-2">Recent Trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Time</th>
              <th className="pb-2">Pair</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {botMetrics.recentTrades.map((trade, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="py-2">{format(trade.time, 'HH:mm:ss')}</td>
                <td className="py-2">{trade.pair}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded ${
                    trade.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="py-2">${trade.price.toFixed(2)}</td>
                <td className={`py-2 ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${trade.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
