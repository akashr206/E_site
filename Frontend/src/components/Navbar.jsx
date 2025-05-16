import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

import { Dialog } from "@headlessui/react";
import { Input } from "./ui/input";
import MobileSearch from "./MobileSearch";
import Dropdown from "./ui/Dropdown";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";

import logo from "../assets/logo.png";
import { ShoppingCart, UserRound, Search, Heart, Menu, X } from "lucide-react";
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

    useEffect(() => {
        const handleResize = (e) => {
            if (window.innerWidth <= 762) {
                setMobileSearch(false);
            }
        };

        const handleClick = (e) => {
            const targetElement = document.getElementById("search-nav");

            if (!targetElement.contains(e.target) && e.target.id !== "search") {
                setMobileSearch(false)
            } 
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("click", handleClick);
        };
    }, []);

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
                    to="/wishlist"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Button variant={"ghost"} className="p-2 px-3">
                        <Heart></Heart>
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
                onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                }}
            >
                Log in
            </Button>
        );
    };

    if (pathName.includes("admin")) {
        return;
    }

    if (mobileSearch) {
        return (
            <header
                id="search-nav"
                className="bg-white bg-opacity-70 backdrop-blur-md w-full fixed top-0 left-0 z-[999] shadow-sm flex items-center h-[76px]"
            >
                <nav className="w-full">
                    <form
                        className="flex items-center w-full relative"
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
                        <X
                            className="ml-4 mr-2"
                            onClick={() => setMobileSearch(false)}
                        ></X>
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search"
                            className="w-full py-2 px-2 mr-4 ml-2 border-none shadow-none focus-visible:ring-0 focus-visible:border-b-pink-500"
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
                            className="absolute z-[200] right-4 cursor-pointer w-8"
                        />
                    </form>
                </nav>
            </header>
        );
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
                <div>
                </div>
                <div className="hidden lg:flex">
                    <UserActions />
                </div>
                <div className="flex items-center justify-center gap-1 lg:hidden">
                    <Button
                        onClick={() => setMobileSearch(true)}
                        variant={"ghost"}
                        className="py-2 px-3"
                        id="search"
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
                    <Link
                        to="/wishlist"
                        className="flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Button variant={"ghost"} className="p-2 px-3">
                            <Heart></Heart>
                        </Button>
                    </Link>
                    <Button
                        variant={"ghost"}
                        type="button"
                        className="p-2 px-3"
                        onClick={() => {
                            setMobileMenuOpen((prev) => !prev);
                            setMobileSearch(false);
                        }}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="w-screen relative h-screen ">
                    <motion.div
                        className="fixed inset-0 overflow-y-auto bg-white px-4 py-4 lg:hidden"
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
                            <Button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </div>
                        <motion.div
                            className="mt-6 ml-6  flex flex-col gap-2 space-y-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        >
                            <Accordion type="single" collapsible>
                                <AccordionItem value="Sarees">
                                    <AccordionTrigger className="text-base">
                                        Sarees
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {sareeProducts.map((item, index) => (
                                            <Link
                                                to={`/category/${item
                                                    .toLowerCase()
                                                    .replace(/\s+/g, " ")}`}
                                                key={index}
                                                className="block px-3 py-2 text-sm font-medium text-gray-900"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="Salwar Suits">
                                    <AccordionTrigger className="text-base">
                                        Salwar Suits
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {salwarProducts.map((item, index) => (
                                            <Link
                                                to={`/category/${item
                                                    .toLowerCase()
                                                    .replace(/\s+/g, " ")}`}
                                                key={index}
                                                className="block px-3 py-2 text-sm font-medium text-gray-900"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="Kurtis">
                                    <AccordionTrigger className="text-base">
                                        Kurtis
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {kurtiProducts.map((item, index) => (
                                            <Link
                                                to={`/category/${item
                                                    .toLowerCase()
                                                    .replace(/\s+/g, " ")}`}
                                                key={index}
                                                className="block px-3 py-2 text-sm font-medium text-gray-900"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="Ready-Made">
                                    <AccordionTrigger className="text-base">
                                        Ready Made
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {readyMadeProducts.map(
                                            (item, index) => (
                                                <Link
                                                    to={`/category/${item
                                                        .toLowerCase()
                                                        .replace(/\s+/g, " ")}`}
                                                    key={index}
                                                    className="block px-3 py-2 text-sm font-medium text-gray-900"
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                >
                                                    {item}
                                                </Link>
                                            )
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </motion.div>
                        <motion.div
                            className="mt-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                        >
                            <div className="ml-3">
                                <UserActions />
                            </div>
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
