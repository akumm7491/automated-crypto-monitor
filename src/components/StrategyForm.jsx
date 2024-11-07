import React, { useState } from 'react'

export default function StrategyForm({ addStrategy }) {
  const [name, setName] = useState('')
  const [buyCondition, setBuyCondition] = useState('')
  const [sellCondition, setSellCondition] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    addStrategy({ name, buyCondition, sellCondition })
    setName('')
    setBuyCondition('')
    setSellCondition('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
        <input
          type="text"
          id="name"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="buyCondition" className="block text-sm font-medium text-gray-400">Buy Condition</label>
        <input
          type="text"
          id="buyCondition"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
          value={buyCondition}
          onChange={(e) => setBuyCondition(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="sellCondition" className="block text-sm font-medium text-gray-400">Sell Condition</label>
        <input
          type="text"
          id="sellCondition"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
          value={sellCondition}
          onChange={(e) => setSellCondition(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
      >
        Add Strategy
      </button>
    </form>
  )
}
