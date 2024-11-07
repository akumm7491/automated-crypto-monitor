import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FaSort } from 'react-icons/fa'

export default function Filters({ filters, setFilters }) {
  const sortOptions = [
    { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'volume_desc', label: 'Volume (High to Low)' }
  ]

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search tokens..."
        className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Min Price"
          className="w-28 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="w-28 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-primary"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600">
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
          <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-700 border border-gray-600 shadow-lg z-10">
            <div className="px-1 py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-600' : ''
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
