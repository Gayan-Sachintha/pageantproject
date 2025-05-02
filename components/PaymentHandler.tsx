"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentHandler = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (
    ContestantId: number,
    packageType: string,
    votes: number,
    price: number
  ) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/genie-create-transaction", {
        ContestantId,
        packageType,
        votes,
        price,
      });

      const { url } = response.data;

      if (url) {
        window.location.href = url; 
      } else {
        toast.error("Payment URL not received.");
      }
    } catch (err) {
      console.error("Genie payment error:", err);
      toast.error("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading };
};

export default PaymentHandler;
