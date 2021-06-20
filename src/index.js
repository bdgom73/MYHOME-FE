import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./css/init.scss";
import "./App.css";
import reportWebVitals from './reportWebVitals';
import dotenv from "dotenv";
import { BrowserRouter } from 'react-router-dom';
import {CookiesProvider} from "react-cookie";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

toast.configure();
dotenv.config();
ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App/>
      </React.StrictMode>
    </BrowserRouter>
  </CookiesProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
