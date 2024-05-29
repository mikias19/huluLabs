import React from "react";
import WishlistSidebar from "../../Componen/Wishlist";

const WishlistPage = ({ wishlistItems, onRemoveFromWishlist }) => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <WishlistSidebar
          wishlistItems={wishlistItems}
          isOpen={true}
          onClose={() => {}}
          onRemove={onRemoveFromWishlist}
        />
      </div>
    </div>
  );
};

export default WishlistPage;
