import React from 'react'
import { FaPause, FaPlay, FaTrash } from 'react-icons/fa'

export default function ActiveStrategies({ strategies, onToggle, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Active Strategies</h2>
      <div className="space-y-3">
        {strategies.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No active strategies. Create one to get started!</p>
        ) : (
          strategies.map((strategy) => (
            <div key={strategy.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{strategy.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggle(strategy.id)}
                    className="p-2 rounded-lg hover:bg-gray-600 transition-colors"
                    title={strategy.active ? 'Pause Strategy' : 'Activate Strategy'}
                  >
                    {strategy.active ? (
                      <FaPause className="text-yellow-500" />
                    ) : (
                      <FaPlay className="text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(strategy.id)}
                    className="p-2 rounded-lg hover:bg-gray-600 transition-colors"
                    title="Delete Strategy"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>
                  <span className="block">Type</span>
                  <span className="text-white">{strategy.type}</span>
                </div>
                <div>
                  <span className="block">Profit</span>
                  <span className={`${strategy.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${strategy.profit?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div>
                  <span className="block">Status</span>
                  <span className={`${strategy.active ? 'text-green-500' : 'text-yellow-500'}`}>
                    {strategy.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div>
                  <span className="block">Created</span>
                  <span className="text-white">
                    {new Date(strategy.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
