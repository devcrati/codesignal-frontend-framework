import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./index.scss";
import customers from "./customerData.json";
import CustomerCard from "./CustomerCard";
import AddCustomerForm from "./AddCustomerForm";

const App = () => {
  const [customerData, setCustomerData] = useState(customers);
  cosnt[(managers, setManagers)] = useState([]);

  const fetchManagers = async () => {
    const response = await fetch(
      "https://api-regional.codesignalcontent.com/crm-system-1/managers"
    );
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setManagers(data);
  };

  const fetchCustomers = async () => {
    const response = await fetch(
      "https://api-regional.codesignalcontent.com/crm-system-1/customers"
    );
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    const pmResponses = await Promise.all(
      data.map((item) =>
        fetch(
          `https://api-regional.codesignalcontent.com/crm-system-1/managers/${item.personalManagerId}`
        )
          .then((data) => data.json())
          .catch((err) => {})
      )
    );
    const filtered = pmResponses.filter(Boolean);
    const result = data.map((item) => {
      return {
        ...item,
        personalManager: filtered.find(
          (pm) => pm.id === item.personalManagerId
        ),
      };
    });
    setCustomerData(result);
  };

  useEffect(() => {
    fetchCustomers();
    fetchManagers();
  }, []);

  const handleAddNewCustomer = (firstName, lastName, email, phoneNumber) => {
    const newCustomer = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    setCustomerData((prev) => [...prev, newCustomer]);
  };

  const handleEditCustomer = (
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    personalManager
  ) => {
    setCustomerData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            firstName,
            lastName,
            email,
            phoneNumber,
            personalManager,
          };
        }
        return item;
      })
    );
  };

  return (
    <main>
      <h2>Add a new customer</h2>

      <h2>Customers</h2>
      <div className="customers-container">
        <AddCustomerForm handleAddNewCustomer={handleAddNewCustomer} />
        {customerData.map((customer) => (
          <CustomerCard
            key={customer.id}
            {...customer}
            managers={managers}
            handleEditCustomer={handleEditCustomer}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
