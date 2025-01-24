import { useState } from 'react';
import { Popover, Transition } from "@headlessui/react";

const SortDown = ({ onSortChange }) => {
  const [sortby, setSortby] = useState('Newest');

  const ActiveDot = () => (
    <div className="w-2.5 h-2.5 absolute top-[50%] translate-y-[-50%] left-0 bg-indigo-600 rounded-full"></div>
  );

  const sortOptions = [
    'Newest',
    'Oldest',
    'Price: low to high',
    'Price: high to low',
  ];

  const handleSortSelection = (option, close) => {
    setSortby(option);
    onSortChange(option);
    close();
  };

  return (
    <Popover className="relative">
      <Popover.Button
        className="flex p-2 m-2 outline-none border rounded-md border-gray-300 items-center text-md leading-6 text-gray-900"
      >
        Sort by: {sortby}
      </Popover.Button>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-0 z-10 rounded-md mt-2 w-max bg-white shadow-lg ring-1 ring-gray-900/5">
          {({ close }) => (
            <div className="py-2 px-2">
              <ul className="flex flex-col py-2 text-lg">
                {sortOptions.map((option) => (
                  <li
                    key={option}
                    className="px-5 py-2 relative cursor-pointer hover:bg-gray-200 rounded-sm"
                    onClick={() => handleSortSelection(option, close)}
                  >
                    {sortby === option && <ActiveDot />}
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

const Filter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);

  const handleFilterApply = () => {
    onFilterChange({ minPrice, maxPrice });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'min') {
      setMinPrice(value ? Math.min(value, maxPrice || Infinity) : '');
    } else if (name === 'max') {
      setMaxPrice(value ? Math.max(value, minPrice || 0) : '');
    }
  };

  const handleKeyDown = (e, close) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFilterApply();
      close();
    }
  };

  return (
    <Popover className="relative">
      <Popover.Button
        className="p-2 m-2 border outline-none rounded-md border-gray-300 text-md leading-6 text-gray-900"
      >
        Filter
      </Popover.Button>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-0 z-10 rounded-md mt-2 w-max bg-white shadow-lg ring-1 ring-gray-900/5">
          {({ close }) => (
            <div className="p-4">
              <div className="flex flex-col space-y-3">
                <label className="flex flex-col text-sm">
                  Min Price:
                  <input
                    type="number"
                    name="min"
                    value={minPrice}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => handleKeyDown(e, close)}
                    className="p-2 border bg-transparent w-[160px] focus:outline focus:outline-indigo-600 rounded-md border-gray-300"
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Max Price:
                  <input
                    type="number"
                    name="max"
                    value={maxPrice}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => handleKeyDown(e, close)}
                    className="p-2 border bg-transparent focus:outline focus:outline-indigo-600 w-[160px] rounded-md border-gray-300"
                  />
                </label>
                <button
                  onClick={() => {
                    handleFilterApply();
                    close();
                  }}
                  className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

const FilterAndSort = ({ onSortChange, onFilterChange }) => {
  return (
    <div className="flex">
      <Filter onFilterChange={onFilterChange} />
      <SortDown onSortChange={onSortChange} />
    </div>
  );
};

export default FilterAndSort
