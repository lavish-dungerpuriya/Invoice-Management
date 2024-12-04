import React, { useState, useContext } from "react";
import { InvoiceContext } from "../context/InvoiceContext";

const SearchFilter = () => {
    const [query, setQuery] = useState("");
    const { searchInvoices } = useContext(InvoiceContext);

    const handleSearch = (e) => {
        e.preventDefault(); 
        searchInvoices(query);
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                placeholder="Search by customer name or invoice number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control"
            />
            <button type="submit" className="btn btn-primary mt-2">
                Search
            </button>
        </form>
    );
};

export default SearchFilter;
