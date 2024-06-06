import React from "react";

const BillingAddressStep = ({
  userInfo,
  handleInputChange,
  handlePreviousStep,
  handleNextStep,
  countries,
  regions,
}) => (
  <>
    <h2 className="text-2xl mb-4 text-gray-800">Billing Address</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <input
        type="text"
        name="firstname"
        data-type="billingAddress"
        value={userInfo.billingAddress.firstname}
        onChange={handleInputChange}
        placeholder="First Name"
        className="p-3 border rounded w-full"
        required
      />
      <input
        type="text"
        name="lastname"
        data-type="billingAddress"
        value={userInfo.billingAddress.lastname}
        onChange={handleInputChange}
        placeholder="Last Name"
        className="p-3 border rounded w-full"
        required
      />
      <input
        type="text"
        name="street"
        data-type="billingAddress"
        value={userInfo.billingAddress.street}
        onChange={handleInputChange}
        placeholder="Street Address"
        className="p-3 border rounded w-full"
        required
      />
      <input
        type="text"
        name="city"
        data-type="billingAddress"
        value={userInfo.billingAddress.city}
        onChange={handleInputChange}
        placeholder="City"
        className="p-3 border rounded w-full"
        required
      />
      <select
        name="region"
        data-type="billingAddress"
        value={userInfo.billingAddress.region}
        onChange={handleInputChange}
        className="p-3 border rounded w-full"
        required
      >
        <option value="">Select Region</option>
        {regions.map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="postcode"
        data-type="billingAddress"
        value={userInfo.billingAddress.postcode}
        onChange={handleInputChange}
        placeholder="Postal Code"
        className="p-3 border rounded w-full"
        required
      />
      <select
        name="country_code"
        data-type="billingAddress"
        value={userInfo.billingAddress.country_code}
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
        data-type="billingAddress"
        value={userInfo.billingAddress.telephone}
        onChange={handleInputChange}
        placeholder="Telephone"
        className="p-3 border rounded w-full"
        required
      />
    </div>
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

export default BillingAddressStep;
