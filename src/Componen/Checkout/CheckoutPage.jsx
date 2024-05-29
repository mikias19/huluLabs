import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faAddressCard,
  faCreditCard,
  faCalendarAlt,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation } from "@apollo/client";

const CREATE_CART = gql`
  mutation CreateCart {
    createEmptyCart
  }
`;

const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
      }
    ) {
      cart {
        items {
          id
          quantity
        }
      }
    }
  }
`;

const PLACE_ORDER = gql`
  mutation PlaceOrder(
    $cartId: String!
    $email: String!
    $billingAddress: BillingAddressInput!
    $paymentMethod: PaymentMethodInput!
  ) {
    setGuestEmailOnCart(input: { cart_id: $cartId, email: $email })
    setBillingAddressOnCart(
      input: { cart_id: $cartId, billing_address: $billingAddress }
    )
    setPaymentMethodOnCart(
      input: { cart_id: $cartId, payment_method: $paymentMethod }
    ) {
      cart {
        selected_payment_method {
          code
        }
      }
    }
    placeOrder(input: { cart_id: $cartId }) {
      order {
        order_number
      }
    }
  }
`;

const CheckoutPage = ({ cartItems, onOrderPlaced }) => {
  const [cartId, setCartId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    shippingAddress: "",
    billingAddress: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [createCart] = useMutation(CREATE_CART, {
    onError: (error) => console.error("Error creating cart:", error),
  });
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
    onError: (error) => console.error("Error adding item to cart:", error),
  });
  const [placeOrder] = useMutation(PLACE_ORDER, {
    onError: (error) => console.error("Error placing order:", error),
  });

  useEffect(() => {
    const createGuestCart = async () => {
      try {
        const response = await createCart();
        const newCartId = response.data.createEmptyCart;
        setCartId(newCartId);
        console.log("Created new cart with ID:", newCartId);

        for (const item of cartItems) {
          await addItemToCart({
            variables: {
              cartId: newCartId,
              sku: item.sku,
              quantity: item.count,
            },
          });
        }
        console.log("Added items to cart");
      } catch (error) {
        console.error("Error during cart creation or item addition:", error);
      }
    };

    createGuestCart();
  }, [cartItems, createCart, addItemToCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const billingAddress = {
      firstname: userInfo.name.split(" ")[0],
      lastname: userInfo.name.split(" ")[1] || "",
      street: [userInfo.billingAddress],
      city: "City",
      region: "Region",
      postcode: "12345",
      country_code: "US",
      telephone: "1234567890",
    };

    const paymentMethod = {
      code: "cbe", // Example payment method, change as necessary
    };

    try {
      const response = await placeOrder({
        variables: {
          cartId,
          email: userInfo.email,
          billingAddress,
          paymentMethod,
        },
      });
      if (response.data) {
        console.log("Order placed successfully", response.data);
        onOrderPlaced();
      } else {
        console.error("Order failed", response);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price_range.minimum_price.regular_price.value * item.count,
    0
  );

  return (
    <div className="checkout-page p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Checkout
      </h1>
      <form
        onSubmit={handleOrderSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <section className="user-info mb-8">
          <h2 className="text-2xl mb-4 text-gray-800">User Information</h2>
          <div className="mb-4">
            <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faAddressCard}
              className="text-gray-500 mr-2"
            />
            <input
              type="text"
              name="shippingAddress"
              value={userInfo.shippingAddress}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faAddressCard}
              className="text-gray-500 mr-2"
            />
            <input
              type="text"
              name="billingAddress"
              value={userInfo.billingAddress}
              onChange={handleInputChange}
              placeholder="Billing Address"
              className="p-3 border rounded w-full"
              required
            />
          </div>
        </section>
        <section className="order-summary mb-8">
          <h2 className="text-2xl mb-4 text-gray-800">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between mb-4 p-2 bg-white rounded-lg shadow"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-700">
                    ${item.price_range.minimum_price.regular_price.value} x{" "}
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-lg text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        </section>
        <section className="payment-info mb-8">
          <h2 className="text-2xl mb-4 text-gray-800">Payment Information</h2>
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="text-gray-500 mr-2"
            />
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              placeholder="Card Number"
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-gray-500 mr-2"
            />
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handlePaymentChange}
              placeholder="Expiry Date (MM/YY)"
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handlePaymentChange}
              placeholder="CVV"
              className="p-3 border rounded w-full"
              required
            />
          </div>
        </section>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-8 rounded-lg hover:from-blue-600 hover:to-green-600 transition-transform transform hover:scale-105"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
