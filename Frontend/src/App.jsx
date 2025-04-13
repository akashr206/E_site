import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// components
import Home from "./components/Home";
import Navbar from "./components/Navbar";
// pages
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Category from "./pages/Category";
import Dashboard from "./pages/admin/dashboard";

function App() {

    return (
        <Router>
            <Navbar className="fixed"></Navbar>
            <main className="pb-9">
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/account" element={<Account />}></Route>
                    <Route
                        path="/products/:id"
                        element={<ProductView />}
                    ></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/search" element={<Search />}></Route>
                    <Route
                        path="/admin/:page"
                        element={<Dashboard />}
                    ></Route>
                    <Route
                        path="/category/:query"
                        element={<Category />}
                    ></Route>
                </Routes>
            </main>
        </Router>
    );
}

export default App;
