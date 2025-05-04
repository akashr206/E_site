import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import MobileSearch from "./MobileSearch";
import Dropdown from "./ui/Dropdown";

import logo from "../assets/logo.png";
import { ShoppingCart, UserRound, Search } from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";
import { useContext } from "react";
import { CartLength } from "../Contexts/CartContext";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const pathName = location.pathname;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const { user, logout } = useAuth();
    const sareeProducts = ["Silk Sarees", "Cotton Sarees", "Designer Sarees"];
    const salwarProducts = ["Anarkali", "Churidar", "Palazzo"];
    const kurtiProducts = ["Long Kurtis", "Short Kurtis", "Party Wear"];
    const readyMadeProducts = ["Lehengas", "Gowns", "Skirts"];
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const { cartLen } = useContext(CartLength);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && search.trim()) {
            e.preventDefault();
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const UserActions = () => {
        return user ? (
            <div className="flex">
                <Link
                    to="/cart"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Button variant={"ghost"} className="p-2 relative px-3">
                        <ShoppingCart></ShoppingCart>

                        {cartLen > 0 && (
                            <span className="w-3.5 h-3.5 rounded-full bg-pink-500 top-1 right-1 absolute flex items-center justify-center text-[10px] text-white">
                                {cartLen}
                            </span>
                        )}
                    </Button>
                </Link>
                <Link
                    to="/account?tab=info"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Button variant={"ghost"} className="p-2 px-3">
                        <UserRound></UserRound>
                    </Button>
                </Link>
            </div>
        ) : (
            <Button 
            className="h-8"
                onClick={() => navigate("/login")}
            >
                Log in
            </Button>
        );
    };

    if(pathName.includes("admin")){
        return
    }

    return (
        <header className="bg-white bg-opacity-70 backdrop-blur-md fixed top-0 left-0 w-full z-[999] shadow-sm">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-3"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5">
                        <img
                            className=" h-16 object-fit rounded-lg w-full"
                            src={logo}
                            alt="Logo"
                        />
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
                        className="flex items-center relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (search.trim()) {
                                navigate(
                                    `/search?query=${encodeURIComponent(
                                        search.trim()
                                    )}`
                                );
                            }
                        }}
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search"
                            className="relative border mx-4 p-1 w-[250px] focus:ring-2 focus:ring-pink-500 focus:border-none outline-none bg-transparent border-black/50 placeholder:text-black  rounded px-2 py-1.5 text-sm"
                        />
                        <button type="submit" className="hidden" />
                        <Search
                            onClick={() =>
                                search &&
                                navigate(
                                    `/search?query=${encodeURIComponent(
                                        search.trim()
                                    )}`
                                )
                            }
                            className="absolute z-10 cursor-pointer w-4 mx-1.5 right-5 top-1/2 transform -translate-y-1/2"
                        />
                    </form>
                    <UserActions />
                </div>
                <div className="flex items-center justify-center gap-1 lg:hidden">
                    <Button
                        onClick={() => setMobileSearch(true)}
                        variant={"ghost"}
                        className="py-2 px-3"
                    >
                        <Search size={32} />
                    </Button>

                    <Link
                        to="/cart"
                        className="flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Button
                            variant={"ghost"}
                            className="py-2 relative px-3"
                        >
                            <ShoppingCart></ShoppingCart>

                            {cartLen > 0 && (
                                <span className="w-3.5 h-3.5 rounded-full bg-pink-500 top-1 right-1 absolute flex items-center justify-center text-[10px] text-white">
                                    {cartLen}
                                </span>
                            )}
                        </Button>
                    </Link>
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => {
                            setMobileMenuOpen(true);
                            setMobileSearch(false);
                        }}
                    >
                        <Bars3Icon className="h-5 w-5 m-1" aria-hidden="true" />
                    </button>
                </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="w-screen relative h-screen ">
                    <motion.div
                        className="fixed inset-0 z-10 overflow-y-auto bg-white px-4 py-4 lg:hidden"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-1.5 p-1.5"
                            >
                                <img
                                    className="h-10 w-auto rounded-full"
                                    src={logo}
                                    alt="Logo"
                                />
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <motion.div
                            className="mt-6 ml-6  flex flex-col gap-2 space-y-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        >
                            <Dropdown title="Sarees" items={sareeProducts} />
                            <Dropdown
                                title="Salwar Suits"
                                items={salwarProducts}
                            />
                            <Dropdown title="Kurtis" items={kurtiProducts} />
                            <Dropdown
                                title="Ready-Made"
                                items={readyMadeProducts}
                            />
                        </motion.div>
                        <motion.div
                            className="mt-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                        >
                            <div className="ml-6">
                                <UserActions />
                                {user && (
                                    <p
                                        className="text-lg cursor-pointer md:text-sm text-red-500 my-3 font-semibold flex items-center"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </p>
                                )}
                            </div>
                            <div></div>
                        </motion.div>
                    </motion.div>
                </div>
            </Dialog>
            {mobileSearch && (
                <MobileSearch closeSearch={() => setMobileSearch(false)} />
            )}
        </header>
    );
};

export default Navbar;
