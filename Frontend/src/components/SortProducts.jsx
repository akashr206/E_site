import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Button } from "./ui/button";
import { ChevronDown,  Check } from "lucide-react";

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

const SortProducts = ({ onSortChange }) => {
    return (
        <div className="flex items-center gap-2">
            <SortDown onSortChange={onSortChange} />
        </div>
    );
};

export default SortProducts;
