import React, { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './pages/Auth';
import { Routes, Route, Navigate } from 'react-router';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

const App = () => {
  useEffect(() => {
    console.log("hello");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;

const Root = () => {
  return <Navigate to="/auth" />;
};
