import { useEffect, useState } from "react";
import "./PaymentHistory.css";

import paymentService from "../../../Services/paymentService";
import PaymentHistoryTable from "../../../components/PaymentHistoryTable/PaymentHistoryTable";

export default function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response = await paymentService.getPaymentHistory();

      if (response.code === 1000 || response.code === 0) {
        setHistory(response.result);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot load payment history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-history-loading">
        Loading Payment History...
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <h1>Payment History</h1>

      <PaymentHistoryTable history={history} />
    </div>
  );
}
