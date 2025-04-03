import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import MobileSearch from "./MobileSearch";
import Dropdown from "./ui/Dropdown";

import logo from "../assets/logo.jpg";
import accountImg from "../assets/account.svg";
import searchImg from "../assets/search.svg";
import googleImg from "../assets/google.png";
import { ShoppingCart, UserRound, Search } from "lucide-react";

import { useAuth } from "../Contexts/AuthContext";
import { API_URL } from "../config/api";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const { user, logout } = useAuth();
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
                    <Button variant={"ghost"} className="p-2 px-3">
                        <ShoppingCart></ShoppingCart>
                    </Button>
                </Link>
                <Link
                    to="/account"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Button variant={"ghost"} className="p-2 px-3">
                        <UserRound></UserRound>
                    </Button>
                </Link>
            </div>
        ) : (
            <Link
                onClick={() => setMobileMenuOpen(false)}
                to={`${API_URL}/auth/google`}
                className="text-lg md:text-sm font-semibold text-gray-900 flex gap-2 items-center"
            >
                <span aria-hidden="true" className="ml-1">
                    <img className="w-6 h-6" src={googleImg} alt="" />
                </span>
                Log in{" "}
            </Link>
        );
    };

    return (
        <header className="bg-white z-15 shadow-sm">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-3 md:p-4"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <img
                            className="h-10 rounded-full w-auto"
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
                        className="relative border rounded mx-4 p-1 w-[250px]"
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
                            className="w-48 border-none outline-none bg-transparent border-gray-300 rounded-md px-2 py-1 text-sm"
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
                            alt="Search"
                            className="absolute cursor-pointer w-4 mx-1 right-2 top-1/2 transform -translate-y-1/2"
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
                    <Link
                        to="/cart"
                        className="flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ShoppingCart></ShoppingCart>
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
