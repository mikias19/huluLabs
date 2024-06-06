import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import UserInfoStep from "../../Widgets/Checkout/UserInformation";
import BillingAddressStep from "../../Widgets/Checkout/BillingAddressStep";
import ShippingAddressStep from "../../Widgets/Checkout/ShippingAddressStep";
import PaymentMethodStep from "../../Widgets/Checkout/PaymentMethodStep";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      full_name_locale
    }
  }
`;

const GET_REGIONS = gql`
  query GetRegions($countryCode: String!) {
    country(id: $countryCode) {
      available_regions {
        code
        name
      }
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods($cartId: String!) {
    cart(cart_id: $cartId) {
      available_payment_methods {
        code
        title
      }
    }
  }
`;

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

const SET_GUEST_EMAIL = gql`
  mutation SetGuestEmail($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
      cart {
        email
      }
    }
  }
`;

const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($cartId: String!, $address: CartAddressInput!) {
    setShippingAddressesOnCart(
      input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }
    ) {
      cart {
        shipping_addresses {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          country {
            code
            label
          }
          telephone
        }
      }
    }
  }
`;

const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress($cartId: String!, $address: CartAddressInput!) {
    setBillingAddressOnCart(
      input: { cart_id: $cartId, billing_address: { address: $address } }
    ) {
      cart {
        billing_address {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          country {
            code
            label
          }
          telephone
        }
      }
    }
  }
`;

const SET_PAYMENT_METHOD = gql`
  mutation SetPaymentMethod($cartId: String!, $code: String!) {
    setPaymentMethodOnCart(
      input: { cart_id: $cartId, payment_method: { code: $code } }
    ) {
      cart {
        selected_payment_method {
          code
          title
        }
      }
    }
  }
`;

const PLACE_ORDER = gql`
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order {
        order_number
      }
    }
  }
`;

const CheckoutPage = ({ cartItems, onOrderPlaced }) => {
  const [cartId, setCartId] = useState(null);
  const [step, setStep] = useState(1);
  const [useBillingAddressForShipping, setUseBillingAddressForShipping] =
    useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    shippingAddress: {
      firstname: "",
      lastname: "",
      street: "",
      city: "",
      region: "",
      postcode: "",
      country_code: "US",
      telephone: "",
    },
    billingAddress: {
      firstname: "",
      lastname: "",
      street: "",
      city: "",
      region: "",
      postcode: "",
      country_code: "US",
      telephone: "",
    },
  });
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [createCart] = useMutation(CREATE_CART);
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);
  const [setGuestEmail] = useMutation(SET_GUEST_EMAIL);
  const [setShippingAddress] = useMutation(SET_SHIPPING_ADDRESS);
  const [setBillingAddress] = useMutation(SET_BILLING_ADDRESS);
  const [setPaymentMethod] = useMutation(SET_PAYMENT_METHOD);
  const [placeOrder] = useMutation(PLACE_ORDER);
  const navigate = useNavigate();

  // Fetch countries
  const { loading: loadingCountries, data: dataCountries } = useQuery(
    GET_COUNTRIES,
    {
      onCompleted: (data) => {
        setCountries(data.countries);
      },
    }
  );

  // Lazy query to fetch regions
  const [fetchRegions, { loading: loadingRegions, data: dataRegions }] =
    useLazyQuery(GET_REGIONS, {
      onCompleted: (data) => {
        setRegions(data.country.available_regions);
      },
    });

  // Fetch regions when country changes
  useEffect(() => {
    if (userInfo.shippingAddress.country_code) {
      fetchRegions({
        variables: { countryCode: userInfo.shippingAddress.country_code },
      });
    }
  }, [userInfo.shippingAddress.country_code, fetchRegions]);

  // Fetch payment methods when cart is created
  const { loading: loadingPaymentMethods, data: dataPaymentMethods } = useQuery(
    GET_PAYMENT_METHODS,
    {
      variables: { cartId },
      skip: !cartId,
    }
  );

  const initializeCart = async () => {
    try {
      console.log("Creating cart...");
      const response = await createCart();
      const newCartId = response.data.createEmptyCart;
      console.log("Cart created with ID:", newCartId);
      setCartId(newCartId);

      for (const item of cartItems) {
        await addItemToCart({
          variables: {
            cartId: newCartId,
            sku: item.sku,
            quantity: item.count,
          },
        });
      }
      console.log("Items added to cart:", cartItems);
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  };

  useEffect(() => {
    initializeCart();
  }, [cartItems, createCart, addItemToCart]);

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const addressType = dataset.type;

    if (addressType) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [addressType]: {
          ...prevInfo[addressType],
          [name]: value,
        },
      }));
    } else {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const handleNextStep = async () => {
    console.log("User Info:", userInfo);
    if (step === 1 && !cartId) {
      await initializeCart();
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    console.log("Placing order with info:", userInfo);

    try {
      await setGuestEmail({ variables: { cartId, email: userInfo.email } });

      if (useBillingAddressForShipping) {
        await setShippingAddress({
          variables: { cartId, address: userInfo.billingAddress },
        });
      } else {
        await setShippingAddress({
          variables: { cartId, address: userInfo.shippingAddress },
        });
      }

      await setBillingAddress({
        variables: { cartId, address: userInfo.billingAddress },
      });

      await setPaymentMethod({
        variables: { cartId, code: selectedPaymentMethod },
      });

      const response = await placeOrder({ variables: { cartId } });
      if (response.data) {
        console.log("Order placed successfully:", response.data);
        onOrderPlaced();
        navigate("/order-confirmation", {
          state: { orderNumber: response.data.placeOrder.order.order_number },
        });
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
    <div className="checkout-page p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Checkout
      </h1>
      <form
        className="bg-white p-8 rounded-lg shadow-lg"
        onSubmit={handlePlaceOrder}
      >
        {step === 1 && (
          <UserInfoStep
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handleNextStep={handleNextStep}
          />
        )}
        {step === 2 && (
          <BillingAddressStep
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
            countries={countries}
            regions={regions}
          />
        )}
        {step === 3 && (
          <ShippingAddressStep
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
            countries={countries}
            regions={regions}
            useBillingAddressForShipping={useBillingAddressForShipping}
            setUseBillingAddressForShipping={setUseBillingAddressForShipping}
          />
        )}
        {step === 4 && (
          <PaymentMethodStep
            loadingPaymentMethods={loadingPaymentMethods}
            dataPaymentMethods={dataPaymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handlePreviousStep={handlePreviousStep}
          />
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
