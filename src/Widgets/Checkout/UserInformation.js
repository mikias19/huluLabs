import React from "react";

const UserInfoStep = ({ userInfo, handleInputChange, handleNextStep }) => (
  <>
    <h2 className="text-2xl mb-4 text-gray-800">User Information</h2>
    <div className="mb-4">
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
    <button
      type="button"
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      onClick={handleNextStep}
    >
      Next
    </button>
  </>
);

export default UserInfoStep;
