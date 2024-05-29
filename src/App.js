import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Componen/Headers";
import Home from "./Pages/Home";
import Category from "./Pages/Category";
import CartSidebar from "./Componen/Cart";
import WishlistPage from "./Pages/WishlistPage";
import WishlistSidebar from "./Componen/Wishlist";
import Product from "./Pages/Product";
import CategoryList from "./Componen/CategoryList";
import CheckoutPage from "./Componen/Checkout/CheckoutPage";
import "./App.css";

import { useState } from "react";

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const increaseItemCount = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decreaseItemCount = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.count > 1
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, count: 1 }];
      }
    });
  };

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const removeCartItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const removeWishlistItem = (id) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleOrderPlaced = () => {
    setCartItems([]);
    alert("Order placed successfully!");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header
          onCartClick={toggleCart}
          onWishlistClick={toggleWishlist}
          cartItemsCount={cartItems.length}
          wishlistItemsCount={wishlistItems.length}
        />
        <CategoryList />
        <CartSidebar
          cartItems={cartItems}
          isOpen={isCartOpen}
          onClose={toggleCart}
          onIncrease={increaseItemCount}
          onDecrease={decreaseItemCount}
          onRemove={removeCartItem}
        />
        <WishlistSidebar
          wishlistItems={wishlistItems}
          isOpen={isWishlistOpen}
          onClose={toggleWishlist}
          onRemove={removeWishlistItem}
        />
        <main className="p-4 max-w-7xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  wishlistItems={wishlistItems}
                />
              }
            />
            <Route
              path="/category/:id"
              element={
                <Category
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  wishlistItems={wishlistItems}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <Product
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  wishlistItems={wishlistItems}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  wishlistItems={wishlistItems}
                  onRemoveFromWishlist={removeWishlistItem}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <CheckoutPage
                  cartItems={cartItems}
                  onOrderPlaced={handleOrderPlaced}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
