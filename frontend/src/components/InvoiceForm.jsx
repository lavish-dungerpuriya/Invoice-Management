import React, { useState, useEffect } from "react";

const InvoiceForm = ({ invoice = null }) => {
  const [formData, setFormData] = useState({
    invoice_number: "",
    customer_name: "",
    date: "",
    invoice_details: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/invoices/");
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
          setNextInvoiceNumber(data); 
        } else {
          console.error("Failed to fetch invoices.");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();

    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        date: invoice.date,
        invoice_details: invoice.invoice_details || [{ description: "", quantity: 1, unit_price: 0 }],
      });
    }
  }, [invoice]);

  const setNextInvoiceNumber = (existingInvoices) => {
    const highestInvoice = existingInvoices.reduce((max, invoice) => {
      const num = parseInt(invoice.invoice_number.replace("inv", ""), 10);
      return num > max ? num : max;
    }, 0);
    const nextInvoiceNumber = `inv${(highestInvoice + 1).toString().padStart(3, "0")}`;
    setFormData((prevData) => ({
      ...prevData,
      invoice_number: nextInvoiceNumber,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = invoice ? "PUT" : "POST";
    const url = invoice
      ? `http://127.0.0.1:8000/api/invoices/${invoice.id}/update/`
      : "http://127.0.0.1:8000/api/invoices/create/";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(invoice ? "Invoice updated successfully" : "Invoice created successfully");
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert("Failed to save invoice");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the invoice");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.invoice_details];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };
    setFormData({ ...formData, invoice_details: updatedDetails });
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      invoice_details: [...formData.invoice_details, { description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = formData.invoice_details.filter((_, idx) => idx !== index);
    setFormData({ ...formData, invoice_details: updatedDetails });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 mb-6 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {invoice ? "Edit Invoice" : "Create Invoice"}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
        <input
          type="text"
          name="invoice_number"
          value={formData.invoice_number}
          onChange={handleChange}
          disabled
          className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h3>
      {formData.invoice_details.map((detail, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={detail.description}
            onChange={(e) => handleDetailsChange(e, index)}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={detail.quantity}
            onChange={(e) => handleDetailsChange(e, index)}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">Unit Price</label>
          <input
            type="number"
            name="unit_price"
            value={detail.unit_price}
            onChange={(e) => handleDetailsChange(e, index)}
            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={() => handleRemoveDetail(index)}
            className="mt-2 text-red-500 hover:text-red-700"
          >
            Remove Detail
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddDetail}
        className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
      >
        Add Detail
      </button>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Save Invoice
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
