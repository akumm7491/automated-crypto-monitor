import React from 'react'
import { FaChartLine } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <FaChartLine className="text-primary text-3xl" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Crypto Dashboard
        </h1>
      </div>
    </header>
  )
}
