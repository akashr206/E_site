import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.jpg";
import cartImg from "../assets/cart.svg";
import accountImg from "../assets/account.svg";
import searchImg from "../assets/search.svg";
import MobileSearch from "./MobileSearch";

const API_BASE_URL = import.meta.env.VITE_APIURL;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [user, setUser] = useState(false);
  const sareeProducts = ["Silk Sarees", "Cotton Sarees", "Designer Sarees"];
  const salwarProducts = ["Anarkali", "Churidar", "Palazzo"];
  const kurtiProducts = ["Long Kurtis", "Short Kurtis", "Party Wear"];
  const readyMadeProducts = ["Lehengas", "Gowns", "Skirts"];
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        let response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          credentials: "include",
        });
        if (response.status === 200) {
          setUser(true);
        }
      } catch (error) { }
    };
    isAuthenticated();
  }, [user]);

  const Dropdown = ({ title, items }) => (
    <Popover className="relative">
      <Popover.Button className="flex items-center text-lg md:text-sm font-semibold leading-6 text-gray-900">
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
                to={`/category/${item.toLowerCase().replace(/\s+/g, "")}`}
                className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
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
      <div className="flex">
        <Link to="/cart" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <img src={cartImg} alt="Cart" className="h-6 w-6 mr-3" />
        </Link>
        <Link to="/account" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <img src={accountImg} alt="Account" className="h-6 w-6 mr-3" />
        </Link>
      </div>
    ) : (
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/login"
        className="text-lg md:text-sm font-semibold text-gray-900 flex items-center"
      >
        Log in{" "}
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </Link>
    );
  };

  return (
    <header className="bg-white z-15 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 md:p-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img className="h-10 rounded-full w-auto" src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-4">
          <Dropdown title="Sarees" items={sareeProducts} />
          <Dropdown title="Salwar Suits" items={salwarProducts} />
          <Dropdown title="Kurtis" items={kurtiProducts} />
          <Dropdown title="Ready-Made" items={readyMadeProducts} />
        </div>
        <div className="hidden lg:flex">
          <form
            className="relative border rounded mx-4 p-1 w-[250px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                navigate(`/search?query=${encodeURIComponent(search.trim())}`);
              }
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="w-48 border-none outline-none bg-transparent border-gray-300 rounded-md px-2 py-1 text-sm"
            />
            <button type="submit" className="hidden" />
            <img
              src={searchImg}
              onClick={() => search && navigate(`/search?query=${encodeURIComponent(search.trim())}`)}
              alt="Search"
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
            />
          </form>
          <UserActions />
        </div>
        <div className="flex items-center justify-center gap-2 lg:hidden">
          <img
            onClick={() => setMobileSearch(true)}
            src={searchImg}
            alt="Search"
            className="w-7 h-7 cursor-pointer"
          />
          <Link to="/cart" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <img src={cartImg} alt="Cart" className="h-7 w-7" />
          </Link>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => {
              setMobileMenuOpen(true);
              setMobileSearch(false);
            }}
          >
            <Bars3Icon className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <motion.div
          className="fixed inset-0 z-10 overflow-y-auto bg-white px-4 py-4 lg:hidden"
          initial={{ x: '100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '100%' }} 
          transition={{ duration: 0.2 }} 
        >
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="-m-1.5 p-1.5">
              <img className="h-8 w-auto rounded-full" src={logo} alt="Logo" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }} 
            transition={{ duration: 0.2, delay: 0.1 }} 
          >
            <Dropdown title="Sarees" items={sareeProducts} />
            <Dropdown title="Salwar Suits" items={salwarProducts} />
            <Dropdown title="Kurtis" items={kurtiProducts} />
            <Dropdown title="Ready-Made" items={readyMadeProducts} />
          </motion.div>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }} 
            transition={{ duration: 0.2, delay: 0.2 }} 
          >
            <UserActions />
          </motion.div>
        </motion.div>
      </Dialog>
      {mobileSearch && <MobileSearch closeSearch={() => setMobileSearch(false)} />}
    </header>
  );
};

export default Navbar;
