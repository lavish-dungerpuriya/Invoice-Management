import React, { useState } from "react";
import { InvoiceProvider } from "./context/InvoiceContext";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import SearchFilter from "./components/SearchFilter";
// import('tailwindcss').Config
import "./index.css";

const App = () => {
    const [editInvoice, setEditInvoice] = useState(null); // State to hold the invoice being edited

    return (
        <InvoiceProvider>
            <div className="container mt-4">
                {/* <h6>Invoice Management System</h6> */}
               
                <InvoiceList setEditInvoice={setEditInvoice} />
                
                {editInvoice ? (
                    <InvoiceForm invoice={editInvoice} />  
                ) : (
                    <InvoiceForm />  
                )}
            </div>
        </InvoiceProvider>
    );
};

export default App;
