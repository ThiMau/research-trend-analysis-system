import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

import paymentService from "../../../Services/paymentService";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const invoice = location.state?.invoice;

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoice) {
      navigate("/premium");
      return;
    }

    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      setLoading(true);

      const response = await paymentService.createPayment(
        invoice.invoiceId
      );

      if (response.code === 0) {
        setPayment(response.result);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot create payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        Creating Payment...
      </div>
    );
  }

  return (
    <div className="payment-page">

      <h1>Complete Payment</h1>

      <div className="invoice-card">

        <div className="invoice-row">
          <span>Package</span>
          <strong>{invoice.packageName}</strong>
        </div>

        <div className="invoice-row">
          <span>Original Price</span>
          <strong>
            {Number(invoice.originalAmount).toLocaleString()} VNĐ
          </strong>
        </div>

        <div className="invoice-row">
          <span>Discount</span>
          <strong>
            {Number(invoice.discountAmount).toLocaleString()} VNĐ
          </strong>
        </div>

        <div className="invoice-row total">
          <span>Final Price</span>
          <strong>
            {Number(invoice.finalAmount).toLocaleString()} VNĐ
          </strong>
        </div>

      </div>

      {payment && (
        <div className="payment-card">

          <img
            src={payment.qrCode}
            alt="QR Code"
            className="payment-qr"
          />

          <button
            className="checkout-btn"
            onClick={() =>
              window.open(payment.checkoutUrl, "_blank")
            }
          >
            Open Checkout
          </button>

          <button
            className="subscription-btn"
            onClick={() => navigate("/subscription")}
          >
            Check Subscription
          </button>

        </div>
      )}

    </div>
  );
}