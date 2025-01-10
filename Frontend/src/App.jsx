import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// components
import Home from './components/Home'
import Navbar from './components/Navbar';
// pages
import ProductsGrid from './components/ProductsGrid';
import ProductView from './pages/ProductView';
import Login from './pages/Login'
import Cart from './pages/Cart'
import Account from './pages/Account';
import Search from './pages/Search';
import Category from './pages/Category';

function App() {
  return (
    <Router>
      <Navbar className="fixed"></Navbar>
      <main className='pb-9'>
        <Routes>
          <Route path='/' element={<ProductsGrid />}></Route>
          <Route path='/account' element={<Account />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/products/:id' element={<ProductView/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/search' element={<Search/>}></Route>
          <Route path='/category/:query' element={<Category/>}></Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
