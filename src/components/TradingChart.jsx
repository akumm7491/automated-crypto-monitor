import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export default function TradingChart({ data, symbol }) {
  const chartContainerRef = useRef()
  const chart = useRef()

  useEffect(() => {
    if (!chartContainerRef.current) return

    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d2d2d' },
        horzLines: { color: '#2d2d2d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#4caf50',
      wickDownColor: '#ef4444',
    })

    candlestickSeries.setData(data)

    const handleResize = () => {
      chart.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.current.remove()
    }
  }, [data])

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">{symbol} Price Chart</h2>
      <div ref={chartContainerRef} />
    </div>
  )
}
