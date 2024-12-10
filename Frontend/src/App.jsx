import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// components
import Home from './components/Home'
import Navbar from './components/Navbar';
// pages
import ProductsGrid from './components/ProductsGrid';
import ProductView from './pages/ProductView';
import Login from './pages/Login'
import Cart from './pages/Cart'
import Account from './pages/Account';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <main className='py-[75px]'>
        <Routes>
          <Route path='/' element={<ProductsGrid />}></Route>
          <Route path='/account' element={<Account />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/products/:id' element={<ProductView/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
        </Routes>

      </main>
    </Router>
  );
}

export default App;
