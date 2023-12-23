import React from "react";
import { useParams } from "react-router-dom";

const CustomerInfo = () => {
    const { customerId } = useParams();

    return (
        <div>
        <h1>Customer Info: {customerId}</h1>
        </div>
    );
}

export default CustomerInfo;