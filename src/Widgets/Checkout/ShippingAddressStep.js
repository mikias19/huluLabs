import React from "react";

const ShippingAddressStep = ({
  userInfo,
  handleInputChange,
  handlePreviousStep,
  handleNextStep,
  countries,
  regions,
  useBillingAddressForShipping,
  setUseBillingAddressForShipping,
}) => {
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setUseBillingAddressForShipping(checked);
    if (checked) {
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "firstname",
          value: userInfo.billingAddress.firstname,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "lastname",
          value: userInfo.billingAddress.lastname,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "street",
          value: userInfo.billingAddress.street,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "city",
          value: userInfo.billingAddress.city,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "region",
          value: userInfo.billingAddress.region,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "postcode",
          value: userInfo.billingAddress.postcode,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "country_code",
          value: userInfo.billingAddress.country_code,
        },
      });
      handleInputChange({
        target: {
          dataset: { type: "shippingAddress" },
          name: "telephone",
          value: userInfo.billingAddress.telephone,
        },
      });
    }
  };

  return (
    <>
      <h2 className="text-2xl mb-4 text-gray-800">Shipping Address</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useBillingAddressForShipping}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <span>Use billing address for shipping</span>
        </label>
      </div>
      {!useBillingAddressForShipping && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstname"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="p-3 border rounded w-full"
            required
          />
          <input
            type="text"
            name="lastname"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="p-3 border rounded w-full"
            required
          />
          <input
            type="text"
            name="street"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.street}
            onChange={handleInputChange}
            placeholder="Street Address"
            className="p-3 border rounded w-full"
            required
          />
          <input
            type="text"
            name="city"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.city}
            onChange={handleInputChange}
            placeholder="City"
            className="p-3 border rounded w-full"
            required
          />
          <select
            name="region"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.region}
            onChange={handleInputChange}
            className="p-3 border rounded w-full"
            required
          >
            <option value="">Select Region</option>
            {regions.map((region, i) => (
              <option key={`${region.code}-${i}`} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="postcode"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.postcode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="p-3 border rounded w-full"
            required
          />
          <select
            name="country_code"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.country_code}
            onChange={handleInputChange}
            className="p-3 border rounded w-full"
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.full_name_locale}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="telephone"
            data-type="shippingAddress"
            value={userInfo.shippingAddress.telephone}
            onChange={handleInputChange}
            placeholder="Telephone"
            className="p-3 border rounded w-full"
            required
          />
        </div>
      )}
      <button
        type="button"
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
        onClick={handlePreviousStep}
      >
        Back
      </button>
      <button
        type="button"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={handleNextStep}
      >
        Next
      </button>
    </>
  );
};

export default ShippingAddressStep;
