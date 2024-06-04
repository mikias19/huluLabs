// import React, { useState, useEffect } from "react";
// import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import "./checkout.css";

// const GET_COUNTRIES = gql`
//   query GetCountries {
//     countries {
//       id
//       full_name_locale
//     }
//   }
// `;

// const GET_REGIONS = gql`
//   query GetRegions($countryCode: String!) {
//     country(id: $countryCode) {
//       available_regions {
//         code
//         name
//       }
//     }
//   }
// `;

// const GET_PAYMENT_METHODS = gql`
//   query GetPaymentMethods($cartId: String!) {
//     cart(cart_id: $cartId) {
//       available_payment_methods {
//         code
//         title
//       }
//     }
//   }
// `;

// const CREATE_CART = gql`
//   mutation CreateCart {
//     createEmptyCart
//   }
// `;

// const ADD_ITEM_TO_CART = gql`
//   mutation AddItemToCart($cartId: String!, $sku: String!, $quantity: Float!) {
//     addSimpleProductsToCart(
//       input: {
//         cart_id: $cartId
//         cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
//       }
//     ) {
//       cart {
//         items {
//           id
//           quantity
//         }
//       }
//     }
//   }
// `;

// const SET_GUEST_EMAIL = gql`
//   mutation SetGuestEmail($cartId: String!, $email: String!) {
//     setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
//       cart {
//         email
//       }
//     }
//   }
// `;

// const SET_SHIPPING_ADDRESS = gql`
//   mutation SetShippingAddress(
//     $cartId: String!
//     $address: ShippingAddressInput!
//   ) {
//     setShippingAddressesOnCart(
//       input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }
//     ) {
//       cart {
//         shipping_addresses {
//           firstname
//           lastname
//           street
//           city
//           region {
//             code
//             label
//           }
//           postcode
//           country {
//             code
//             label
//           }
//           telephone
//         }
//       }
//     }
//   }
// `;

// const SET_BILLING_ADDRESS = gql`
//   mutation SetBillingAddress($cartId: String!, $address: BillingAddressInput!) {
//     setBillingAddressOnCart(
//       input: { cart_id: $cartId, billing_address: { address: $address } }
//     ) {
//       cart {
//         billing_address {
//           firstname
//           lastname
//           street
//           city
//           region {
//             code
//             label
//           }
//           postcode
//           country {
//             code
//             label
//           }
//           telephone
//         }
//       }
//     }
//   }
// `;

// const SET_PAYMENT_METHOD = gql`
//   mutation SetPaymentMethod($cartId: String!, $code: String!) {
//     setPaymentMethodOnCart(
//       input: { cart_id: $cartId, payment_method: { code: $code } }
//     ) {
//       cart {
//         selected_payment_method {
//           code
//           title
//         }
//       }
//     }
//   }
// `;

// const PLACE_ORDER = gql`
//   mutation PlaceOrder($cartId: String!) {
//     placeOrder(input: { cart_id: $cartId }) {
//       order {
//         order_number
//       }
//     }
//   }
// `;

// const CheckoutPage = ({ cartItems, onOrderPlaced }) => {
//   const [cartId, setCartId] = useState(null);
//   const [step, setStep] = useState(1);
//   const [userInfo, setUserInfo] = useState({
//     email: "",
//     shippingAddress: {
//       firstname: "",
//       lastname: "",
//       street: "",
//       city: "",
//       region: "",
//       postcode: "",
//       country_code: "US",
//       telephone: "",
//     },
//     billingAddress: {
//       firstname: "",
//       lastname: "",
//       street: "",
//       city: "",
//       region: "",
//       postcode: "",
//       country_code: "US",
//       telephone: "",
//     },
//   });
//   const [countries, setCountries] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

//   const [createCart] = useMutation(CREATE_CART);
//   const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);
//   const [setGuestEmail] = useMutation(SET_GUEST_EMAIL);
//   const [setShippingAddress] = useMutation(SET_SHIPPING_ADDRESS);
//   const [setBillingAddress] = useMutation(SET_BILLING_ADDRESS);
//   const [setPaymentMethod] = useMutation(SET_PAYMENT_METHOD);
//   const [placeOrder] = useMutation(PLACE_ORDER);
//   const navigate = useNavigate();

//   // Fetch countries
//   const { loading: loadingCountries, data: dataCountries } = useQuery(
//     GET_COUNTRIES,
//     {
//       onCompleted: (data) => {
//         setCountries(data.countries);
//       },
//     }
//   );

//   // Lazy query to fetch regions
//   const [fetchRegions, { loading: loadingRegions, data: dataRegions }] =
//     useLazyQuery(GET_REGIONS, {
//       onCompleted: (data) => {
//         setRegions(data.country.available_regions);
//       },
//     });

//   // Fetch regions when country changes
//   useEffect(() => {
//     if (userInfo.shippingAddress.country_code) {
//       fetchRegions({
//         variables: { countryCode: userInfo.shippingAddress.country_code },
//       });
//     }
//   }, [userInfo.shippingAddress.country_code, fetchRegions]);

//   // Fetch payment methods when cart is created
//   const { loading: loadingPaymentMethods, data: dataPaymentMethods } = useQuery(
//     GET_PAYMENT_METHODS,
//     {
//       variables: { cartId },
//       skip: !cartId,
//     }
//   );

//   useEffect(() => {
//     const initializeCart = async () => {
//       try {
//         const response = await createCart();
//         const newCartId = response.data.createEmptyCart;
//         setCartId(newCartId);

//         for (const item of cartItems) {
//           await addItemToCart({
//             variables: {
//               cartId: newCartId,
//               sku: item.sku,
//               quantity: item.count,
//             },
//           });
//         }
//       } catch (error) {
//         console.error("Error initializing cart:", error);
//       }
//     };

//     initializeCart();
//   }, [cartItems, createCart, addItemToCart]);

//   const handleInputChange = (e) => {
//     const { name, value, dataset } = e.target;
//     const addressType = dataset.type;

//     setUserInfo((prevInfo) => ({
//       ...prevInfo,
//       [addressType]: {
//         ...prevInfo[addressType],
//         [name]: value,
//       },
//     }));
//   };

//   const handleNextStep = () => {
//     console.log("User Info:", userInfo);
//     setStep(step + 1);
//   };

//   const handlePreviousStep = () => {
//     setStep(step - 1);
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     console.log("Placing order with info:", userInfo);

//     try {
//       await setGuestEmail({ variables: { cartId, email: userInfo.email } });
//       await setShippingAddress({
//         variables: { cartId, address: userInfo.shippingAddress },
//       });
//       await setBillingAddress({
//         variables: { cartId, address: userInfo.billingAddress },
//       });
//       await setPaymentMethod({
//         variables: { cartId, code: selectedPaymentMethod },
//       });

//       const response = await placeOrder({ variables: { cartId } });
//       if (response.data) {
//         console.log("Order placed successfully:", response.data);
//         onOrderPlaced();
//         navigate("/order-confirmation", {
//           state: { orderNumber: response.data.placeOrder.order.order_number },
//         });
//       } else {
//         console.error("Order failed", response);
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) =>
//       total + item.price_range.minimum_price.regular_price.value * item.count,
//     0
//   );

//   return (
//     <div className="checkout-page p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
//         Checkout
//       </h1>
//       <form
//         className="bg-white p-8 rounded-lg shadow-lg"
//         onSubmit={handlePlaceOrder}
//       >
//         {step === 1 && (
//           <>
//             <h2 className="text-2xl mb-4 text-gray-800">User Information</h2>
//             <div className="mb-4">
//               <input
//                 type="email"
//                 name="email"
//                 value={userInfo.email}
//                 onChange={handleInputChange}
//                 placeholder="Email"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//             </div>
//             <button
//               type="button"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
//               onClick={handleNextStep}
//             >
//               Next
//             </button>
//           </>
//         )}
//         {step === 2 && (
//           <>
//             <h2 className="text-2xl mb-4 text-gray-800">Shipping Address</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               <input
//                 type="text"
//                 name="firstname"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.firstname}
//                 onChange={handleInputChange}
//                 placeholder="First Name"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastname"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.lastname}
//                 onChange={handleInputChange}
//                 placeholder="Last Name"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.street}
//                 onChange={handleInputChange}
//                 placeholder="Street Address"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.city}
//                 onChange={handleInputChange}
//                 placeholder="City"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <select
//                 name="region"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.region}
//                 onChange={handleInputChange}
//                 className="p-3 border rounded w-full"
//                 required
//               >
//                 <option value="">Select Region</option>
//                 {regions.map((region) => (
//                   <option key={region.code} value={region.code}>
//                     {region.name}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="postcode"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.postcode}
//                 onChange={handleInputChange}
//                 placeholder="Postal Code"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <select
//                 name="country_code"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.country_code}
//                 onChange={handleInputChange}
//                 className="p-3 border rounded w-full"
//                 required
//               >
//                 <option value="">Select Country</option>
//                 {countries.map((country) => (
//                   <option key={country.id} value={country.id}>
//                     {country.full_name_locale}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="telephone"
//                 data-type="shippingAddress"
//                 value={userInfo.shippingAddress.telephone}
//                 onChange={handleInputChange}
//                 placeholder="Telephone"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//             </div>
//             <button
//               type="button"
//               className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
//               onClick={handlePreviousStep}
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
//               onClick={handleNextStep}
//             >
//               Next
//             </button>
//           </>
//         )}
//         {step === 3 && (
//           <>
//             <h2 className="text-2xl mb-4 text-gray-800">Billing Address</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               <input
//                 type="text"
//                 name="firstname"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.firstname}
//                 onChange={handleInputChange}
//                 placeholder="First Name"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastname"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.lastname}
//                 onChange={handleInputChange}
//                 placeholder="Last Name"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.street}
//                 onChange={handleInputChange}
//                 placeholder="Street Address"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.city}
//                 onChange={handleInputChange}
//                 placeholder="City"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <select
//                 name="region"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.region}
//                 onChange={handleInputChange}
//                 className="p-3 border rounded w-full"
//                 required
//               >
//                 <option value="">Select Region</option>
//                 {regions.map((region) => (
//                   <option key={region.code} value={region.code}>
//                     {region.name}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="postcode"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.postcode}
//                 onChange={handleInputChange}
//                 placeholder="Postal Code"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//               <select
//                 name="country_code"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.country_code}
//                 onChange={handleInputChange}
//                 className="p-3 border rounded w-full"
//                 required
//               >
//                 <option value="">Select Country</option>
//                 {countries.map((country) => (
//                   <option key={country.id} value={country.id}>
//                     {country.full_name_locale}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="telephone"
//                 data-type="billingAddress"
//                 value={userInfo.billingAddress.telephone}
//                 onChange={handleInputChange}
//                 placeholder="Telephone"
//                 className="p-3 border rounded w-full"
//                 required
//               />
//             </div>
//             <button
//               type="button"
//               className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
//               onClick={handlePreviousStep}
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
//               onClick={handleNextStep}
//             >
//               Next
//             </button>
//           </>
//         )}
//         {step === 4 && (
//           <>
//             <h2 className="text-2xl mb-4 text-gray-800">Payment Information</h2>
//             {loadingPaymentMethods ? (
//               <p>Loading payment methods...</p>
//             ) : dataPaymentMethods ? (
//               <div className="mb-4">
//                 {dataPaymentMethods.cart.available_payment_methods.map(
//                   (method) => (
//                     <div key={method.code} className="mb-2">
//                       <input
//                         type="radio"
//                         id={method.code}
//                         name="paymentMethod"
//                         value={method.code}
//                         checked={selectedPaymentMethod === method.code}
//                         onChange={(e) =>
//                           setSelectedPaymentMethod(e.target.value)
//                         }
//                         className="mr-2"
//                       />
//                       <label htmlFor={method.code} className="text-gray-700">
//                         {method.title}
//                       </label>
//                     </div>
//                   )
//                 )}
//               </div>
//             ) : (
//               <p>Error loading payment methods</p>
//             )}
//             <button
//               type="button"
//               className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
//               onClick={handlePreviousStep}
//             >
//               Back
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
//             >
//               Place Order
//             </button>
//           </>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CheckoutPage;
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
