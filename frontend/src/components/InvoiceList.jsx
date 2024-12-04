import React, { useContext, useState, useEffect } from "react";
import { InvoiceContext } from "../context/InvoiceContext";
import Pagination from "./Pagination";
import Loader from "./Loader";

const InvoiceList = () => {
  const {
    paginatedInvoices,
    currentPage,
    setCurrentPage,
    invoicesPerPage,
    loading,
    error,
    fetchInvoices,
  } = useContext(InvoiceContext);

  const [editInvoice, setEditInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(paginatedInvoices);
  const [formData, setFormData] = useState({
    customer_name: "",
    invoice_number: "",
    invoice_details: [],
  });

  useEffect(() => {
    setFilteredInvoices(
      paginatedInvoices.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, paginatedInvoices]);

  useEffect(() => {
    if (editInvoice) {
      setFormData({
        customer_name: editInvoice.customer_name,
        invoice_number: editInvoice.invoice_number,
        invoice_details: editInvoice.invoice_details,
      });
    }
  }, [editInvoice]);

  const handleDeleteInvoice = async (id) => {
    if (!id) {
      console.error("Invalid invoice ID for deletion");
      alert("Error: Invalid invoice selected for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/delete/`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Invoice deleted successfully");
          // fetchInvoices(); // Refresh the list
        } else if (response.headers.get("content-type").includes("text/html")) {
          alert("Unexpected error occurred. Check the backend logs.");
        } 
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Error deleting invoice");
      }
    }
  };

  const handleEditClick = (invoice) => {
    setEditInvoice(invoice);
  };

  const handleCloseEditForm = () => {
    setEditInvoice(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInvoiceDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.invoice_details];
    updatedDetails[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      invoice_details: updatedDetails,
    }));
  };

  const handleAddItem = () => {
    const newItem = { description: "", quantity: 1, unit_price: 0 };
    setFormData((prevData) => ({
      ...prevData,
      invoice_details: [...prevData.invoice_details, newItem],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedDetails = formData.invoice_details.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      invoice_details: updatedDetails,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editInvoice ? "PUT" : "POST"; // Use PUT if editing, POST if creating
    const url = editInvoice
      ? `http://127.0.0.1:8000/api/invoices/${editInvoice.id}/update/`
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
        alert("Invoice saved successfully");
        // fetchInvoices(); // Refresh the list
        setEditInvoice(null); // Close the edit form after success
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

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 font-medium">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoices</h2>

      <div className="mb-4">
        <label htmlFor="search-bar" className="block text-sm font-medium text-gray-700">
          Search Invoices:
        </label>
        <input
          id="search-bar"
          type="text"
          placeholder="Search by invoice number or customer name"
          className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="invoice-list divide-y divide-gray-200">
        {filteredInvoices.map((invoice) => (
          <li
            key={invoice.id}
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer rounded-lg flex justify-between items-center"
            onClick={() => handleEditClick(invoice)}
          >
            <div>
              <p className="font-medium text-gray-800">
                {invoice.invoice_number} - {invoice.customer_name}
              </p>
              <p className="text-sm text-gray-600">
                Total: $
                {invoice.invoice_details.reduce(
                  (total, item) => total + item.quantity * item.unit_price,
                  0
                )}
              </p>
            </div>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(invoice);
              }}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:text-red-800 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInvoice(invoice.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Invoice: {editInvoice.invoice_number}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="customer-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="invoice-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Invoice Number
                </label>
                <input
                  id="invoice-number"
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleInputChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <h4 className="text-lg font-medium text-gray-800 mb-2">Invoice Details</h4>
              {formData.invoice_details.map((item, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleInvoiceDetailChange(index, "description", e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleInvoiceDetailChange(index, "quantity", e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2">Unit Price</label>
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleInvoiceDetailChange(index, "unit_price", e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Remove Item
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Add Item
              </button>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Save Invoice
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-500 ml-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={filteredInvoices.length}
        itemsPerPage={invoicesPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InvoiceList;
