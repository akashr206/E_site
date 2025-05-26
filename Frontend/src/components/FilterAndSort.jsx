import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Button } from "../components/ui/button";
import { ChevronDown, SlidersHorizontal, Check } from "lucide-react";

const SortDown = ({ onSortChange }) => {
    const [sortby, setSortby] = useState("Newest");

    const sortOptions = [
        "Newest",
        "Oldest",
        "Price: low to high",
        "Price: high to low",
    ];

    const handleSortSelection = (option, close) => {
        setSortby(option);
        onSortChange(option);
        close();
    };

    return (
        <Popover className="relative">
            <Popover.Button
                as={Button}
                variant="outline"
                className="flex items-center gap-2"
            >
                <span>Sort: {sortby}</span>
                <ChevronDown className="h-4 w-4" />
            </Popover.Button>

            <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute right-0 z-10 rounded-md mt-2 w-56 bg-white shadow-lg ring-1 ring-gray-900/5">
                    {({ close }) => (
                        <div className="py-1">
                            {sortOptions.map((option) => (
                                <div
                                    key={option}
                                    className="relative flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                        handleSortSelection(option, close)
                                    }
                                >
                                    <span className="flex-grow">{option}</span>
                                    {sortby === option && (
                                        <Check className="h-4 w-4 text-pink-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

const Filter = ({ onFilterChange }) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState(100000);

    const handleFilterApply = () => {
        onFilterChange({ minPrice, maxPrice });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "min") {
            setMinPrice(
                value ? Math.min(parseFloat(value), maxPrice || Infinity) : ""
            );
        } else if (name === "max") {
            setMaxPrice(
                value ? Math.max(parseFloat(value), minPrice || 0) : ""
            );
        }
    };

    const handleKeyDown = (e, close) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleFilterApply();
            close();
        }
    };

    return (
        <Popover className="relative">
            <Popover.Button
                as={Button}
                variant="outline"
                className="flex items-center gap-2"
            >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
            </Popover.Button>

            <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-0 z-10 rounded-md mt-2 w-72 bg-white shadow-lg ring-1 ring-gray-900/5">
                    {({ close }) => (
                        <div className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-3">
                                        Price Range
                                    </h4>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="grid gap-3">
                                            <div className="grid gap-1">
                                                <label
                                                    htmlFor="min-price"
                                                    className="text-sm font-medium"
                                                >
                                                    Minimum Price
                                                </label>
                                                <input
                                                    id="min-price"
                                                    name="min"
                                                    type="number"
                                                    placeholder="0"
                                                    value={minPrice}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(e, close)
                                                    }
                                                    className="w-full p-2 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <label
                                                    htmlFor="max-price"
                                                    className="text-sm font-medium"
                                                >
                                                    Maximum Price
                                                </label>
                                                <input
                                                    id="max-price"
                                                    name="max"
                                                    type="number"
                                                    placeholder="100000"
                                                    value={maxPrice}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(e, close)
                                                    }
                                                    className="w-full p-2 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        handleFilterApply();
                                        close();
                                    }}
                                    className="w-full"
                                >
                                    Apply Filter
                                </Button>
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
        <div className="flex items-center gap-2">
            <Filter onFilterChange={onFilterChange} />
            <SortDown onSortChange={onSortChange} />
        </div>
    );
};

export default FilterAndSort;
