import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.jpg";
import cartImg from "../assets/cart.svg";
import accountImg from "../assets/account.svg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(false);

  const sareeProducts = ["Silk Sarees", "Cotton Sarees", "Designer Sarees"];
  const salwarProducts = ["Anarkali", "Churidar", "Palazzo"];
  const kurtiProducts = ["Long Kurtis", "Short Kurtis", "Party Wear"];
  const readyMadeProducts = ["Lehengas", "Gowns", "Skirts"];

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        let response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          credentials: "include",
        });
        if (response.status === 200) {
          setUser(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    isAuthenticated();
  }, []);

  const Dropdown = ({ title, items }) => (
    <Popover className="relative">
      <Popover.Button className="flex items-center text-sm font-semibold leading-6 text-gray-900">
        {title}
        <ChevronDownIcon className="h-5 w-5 text-gray-500 ml-1" />
      </Popover.Button>
      <Transition
        as={Transition}
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
                key={item}
                to={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );

  const UserActions = () => {
    return user ? (
      <Link to="/cart" className="flex items-center">
        <img src={cartImg} alt="Cart" className="h-6 w-6 mr-2" />
        <span className="text-sm font-semibold">Cart</span>
      </Link>
    ) : (
      <Link
        to="/login"
        className="text-sm font-semibold text-gray-900 flex items-center"
      >
        Log in <span aria-hidden="true" className="ml-1">&rarr;</span>
      </Link>
    );
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img className="h-8 w-auto" src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Dropdown title="Sarees" items={sareeProducts} />
          <Dropdown title="Salwar Suits" items={salwarProducts} />
          <Dropdown title="Kurtis" items={kurtiProducts} />
          <Dropdown title="Ready-Made" items={readyMadeProducts} />
        </div>

        <div className="hidden lg:flex lg:gap-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-48 border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <UserActions />
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-4 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src={logo} alt="Logo" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <Dropdown title="Sarees" items={sareeProducts} />
            <Dropdown title="Salwar Suits" items={salwarProducts} />
            <Dropdown title="Kurtis" items={kurtiProducts} />
            <Dropdown title="Ready-Made" items={readyMadeProducts} />
          </div>
          <div className="mt-6">
            <UserActions />
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;
