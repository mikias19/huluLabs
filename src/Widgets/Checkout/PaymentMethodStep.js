import React from "react";

const PaymentMethodStep = ({
  loadingPaymentMethods,
  dataPaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handlePreviousStep,
}) => (
  <>
    <h2 className="text-2xl mb-4 text-gray-800">Payment Information</h2>
    {loadingPaymentMethods ? (
      <p>Loading payment methods...</p>
    ) : dataPaymentMethods ? (
      <div className="mb-4">
        {dataPaymentMethods.cart.available_payment_methods.map((method) => (
          <div key={method.code} className="mb-2">
            <input
              type="radio"
              id={method.code}
              name="paymentMethod"
              value={method.code}
              checked={selectedPaymentMethod === method.code}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor={method.code} className="text-gray-700">
              {method.title}
            </label>
          </div>
        ))}
      </div>
    ) : (
      <p>Error loading payment methods</p>
    )}
    <button
      type="button"
      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
      onClick={handlePreviousStep}
    >
      Back
    </button>
    <button
      type="submit"
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
    >
      Place Order
    </button>
  </>
);

export default PaymentMethodStep;
