import React from "react";
import CartSidebar from "../../Componen/CartSidebar";

const CartPage = ({
  cartItems,
  onIncreaseItem,
  onDecreaseItem,
  onRemoveItem,
}) => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <CartSidebar
          cartItems={cartItems}
          isOpen={true}
          onClose={() => {}}
          onIncrease={onIncreaseItem}
          onDecrease={onDecreaseItem}
          onRemove={onRemoveItem}
        />
      </div>
    </div>
  );
};

export default CartPage;
