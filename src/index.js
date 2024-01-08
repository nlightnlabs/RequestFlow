import React, {useState, useContext} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ContextProvider, Context } from './components/Context';
import './index.css';
import App from './App';
import Login from './components/Login';
import UserInfo from './components/UserInfo';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ContextProvider>

    <Router>
      <Routes>
        <Route exact path="/" element={<App />}/>
        <Route exact path="/Login" element={<Login />}/>
        <Route exact path="/SignUp" element={<UserInfo />}/>
        <Route exact path="/ForgotPassword" element={<ForgotPassword />}/>
        <Route exact path="/ResetPassword" element={<ResetPassword />}/>
      </Routes>
    </Router>

    </ContextProvider>
  </React.StrictMode>
);

