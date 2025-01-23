import { useState} from 'react'
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
          className="flex p-2 m-2 border rounded-md border-gray-300 items-center text-md  leading-6 text-gray-900"
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

const FilterAndSort = ({onSortChange}) => {
    return (
        <div className="flex">
            <button className="p-2 m-2 border rounded-md border-gray-800">
                Filter
            </button>
            <SortDown onSortChange={onSortChange} />
        </div>
    )
}

export default FilterAndSort