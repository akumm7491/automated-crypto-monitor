import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FaSort } from 'react-icons/fa'

export default function Filters({ filters, setFilters }) {
  const sortOptions = [
    { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
  ]

  return (
    <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        className="w-full sm:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      
      <div className="flex space-x-4">
        <input
          type="number"
          placeholder="Min Price"
          className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700">
          <FaSort />
          <span>Sort</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
            <div className="px-1 py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => setFilters({ ...filters, sortBy: option.value })}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
