import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 5;
    const [searchQuery, setSearchQuery] = useState("");

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/invoices/", {
                params: {
                    search: searchQuery,
                    page: currentPage
                }
            });
            if (response.status === 200) {
                setInvoices(response.data);
                setFilteredInvoices(response.data);
            } else {
                setError("Failed to fetch invoices. Please try again later.");
            }
        } catch (err) {
            console.error("Error fetching invoices:", err);
            setError("Failed to fetch invoices. Ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const searchInvoices = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredInvoices(invoices);
        } else {
            setFilteredInvoices(
                invoices.filter(
                    (invoice) =>
                        invoice.customer_name.toLowerCase().includes(query.toLowerCase()) ||
                        invoice.invoice_number.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
        setCurrentPage(1);
    };

    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * invoicesPerPage,
        currentPage * invoicesPerPage
    );

    useEffect(() => {
        fetchInvoices();
    }, [searchQuery, currentPage]);

    return (
        <InvoiceContext.Provider
            value={{
                invoices,
                filteredInvoices,
                paginatedInvoices,
                searchInvoices,
                setSearchQuery,
                currentPage,
                setCurrentPage,
                invoicesPerPage,
                loading,
                error,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};
