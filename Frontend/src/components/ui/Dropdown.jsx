import {  Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const Dropdown = ({ title, items }) => {
    return (
    <Popover className="relative">
        <Popover.Button className="flex items-center text-lg md:text-sm leading-6 text-gray-900">
            {title}
            <ChevronDownIcon className="h-5 w-5 text-gray-500 ml-1" />
        </Popover.Button>
        <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
        >
            <Popover.Panel className="absolute left-0 z-10 mt-2 w-40 bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="py-2">
                    {items.map((item) => (
                        <Link
                            onClick={() => setMobileMenuOpen(false)}
                            key={item}
                            to={`/category/${item.toLowerCase().replace(/\s+/g, " ")}`}
                            className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>
)};

export default Dropdown