import { BrowserRouter } from "react-router-dom";
//import { createRoot } from 'react-dom/client';
//import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/cartProvider.jsx";
import { CartAnimationProvider } from "./context/animationprovider.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <CartAnimationProvider>
          <App />
        </CartAnimationProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
);
