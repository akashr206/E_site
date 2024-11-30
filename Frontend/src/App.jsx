import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Card from './components/Card';
import Login from './components/Login'
import Home from './components/Home'
import './App.css';
import Navbar from './components/Navbar';
import Product from './components/Product';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <main className='py-[75px]'>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/' element={<Product />}></Route>
        </Routes>

      </main>
    </Router>
  );
}

export default App;
