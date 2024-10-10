import React, { useState } from "react";

const CustomerCard = ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  loyaltyPoints,
  numberOfPurchases,
  personalManager,
  managers,
  handleEditCustomer,
}) => {
  const [isEditMode, setEditMode] = useState(false);
  const [newFirstName, setFirstName] = useState(firstName);
  const [newLastName, setLastName] = useState(lastName);
  const [newEmail, setEmail] = useState(email);
  const [newPhoneNumber, setPhoneNumber] = useState(phoneNumber);
  const [managerId, setManagerId] = useState(personalManager?.id);

  const handleEdit = (e) => {
    e.preventDefault();

    if (!!newFirstName && !!newLastName && !!newEmail) {
      let manager = null;
      if (managerId) {
        manager = managers.find((item) => item.id === managerId);
      }
      handleEditCustomer(
        id,
        newFirstName,
        newLastName,
        newEmail,
        phoneNumber,
        manager
      );
      setEditMode(false);
    }
  };

  if (isEditMode)
    return (
      <article className="customer--edit">
        <form className="customer-edit-form">
          <input
            name="firstName"
            placeholder="First name*"
            value={newFirstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            name="lastName"
            placeholder="Last name*"
            value={newLastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="Email*"
            value={newEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="phoneNumber"
            placeholder="Phone number"
            value={newPhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          >
            <option value=""></option>
            <option value="a9f39c40-b073-11ec-b909-0242ac12002">
              Philip Hilton
            </option>
            <option value="a5caa712-b073-11ec-b909-0242ac12002">
              Lynda Olson
            </option>
            {managers.map((item) => (
              <option key={item.id} value={item.id}>
                {`${item.firstName} ${item.lastName}`}
              </option>
            ))}
          </select>

          <input
            className="btn btn--secondary"
            type="reset"
            value="Cancel"
            onClick={() => setEditMode(false)}
          />
          <input
            className="btn btn--primary"
            type="submit"
            value="Save"
            onClick={handleEdit}
          />
        </form>
      </article>
    );

  return (
    <article className="customer">
      <span className="customer__edit-btn" onClick={() => setEditMode(true)}>
        edit
      </span>
      <h3>{`${firstName} ${lastName}`}</h3>
      <div className="customer__stats">
        <div className="stats">
          <span className="stats__number">{loyaltyPoints ?? 0}</span>
          <span className="stats__description">loyalty points</span>
        </div>
        <div className="stats">
          <span className="stats__number">{numberOfPurchases ?? 0}</span>
          <span className="stats__description">purchases</span>
        </div>
      </div>

      <h4 className="customer__key">Email</h4>
      <span className="customer__value customer__email">{email}</span>

      {!!phoneNumber && (
        <>
          <h4 className="customer__key">Phone number</h4>
          <span className="customer__value customer__phone-number">
            {phoneNumber}
          </span>
        </>
      )}

      {!!personalManager && (
        <>
          <h4 className="customer__key">Personal manager</h4>
          <span className="customer__value customer__personal-manager">
            {`${personalManager.firstName} ${personalManager.lastName}`}
          </span>
        </>
      )}
    </article>
  );
};

export default CustomerCard;
