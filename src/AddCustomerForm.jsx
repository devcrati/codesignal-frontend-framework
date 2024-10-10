import React, { useState } from "react";

const AddCustomerForm = ({handleAddNewCustomer}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!!firstName && !!lastName && !!email) {
      handleAddNewCustomer(firstName, lastName, email, phoneNumber);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
    }
  };

  return (
    <form className="add-customer-form">
      <input
        name="firstName"
        placeholder="First name*"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        name="lastName"
        placeholder="Last name*"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        name="email"
        placeholder="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="phoneNumber"
        placeholder="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        className="btn btn--primary"
        type="submit"
        value="Add"
        onClick={handleSubmit}
      />
    </form>
  );
};

export default AddCustomerForm;
