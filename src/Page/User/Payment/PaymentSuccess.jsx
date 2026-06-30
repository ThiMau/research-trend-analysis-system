import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Loader } from "lucide-react";
import paymentService from "../../../Services/paymentService";
import premiumService from "../../../Services/premiumService";
import "./Payment.css";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 2000;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(location.search);
    const orderCode = params.get("orderCode");
    const invoiceId = params.get("invoiceId");

    const verifyPayment = async () => {
      if (!orderCode && !invoiceId) {
        if (isMounted) {
          setVerifying(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setError(null);
          setVerifying(true);
        }

        await paymentService.confirmPayment(orderCode ?? invoiceId);

        let verified = false;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
          try {
            const subscriptionResponse = await premiumService.getCurrentSubscription();
            const paymentHistoryResponse = await paymentService.getPaymentHistory();

            const hasActiveSubscription =
              subscriptionResponse?.code === 1000 || subscriptionResponse?.code === 0;
            const hasSuccessfulPayment = Array.isArray(paymentHistoryResponse?.result)
              ? paymentHistoryResponse.result.some((item) => {
                  const status = String(item?.transactionStatus || item?.status || "").toUpperCase();
                  return status === "PAID" || status === "SUCCESS" || status === "COMPLETED";
                })
              : false;

            if (hasActiveSubscription || hasSuccessfulPayment) {
              verified = true;
              break;
            }
          } catch (refreshError) {
            console.warn(`Payment verification attempt ${attempt} failed:`, refreshError);
          }

          if (!isMounted) {
            return;
          }

          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          }
        }

        if (!isMounted) {
          return;
        }

        if (verified) {
          setVerifying(false);
        } else {
          setError("Payment was confirmed, but the latest subscription/payment data is still not available yet. Please wait a moment and try again.");
          setVerifying(false);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to verify payment status:", err);
        setError("Failed to update subscription. Please wait a moment and try again.");
        setVerifying(false);
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  return (
    <div className="payment-page success-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
      <div className="success-card" style={{ background: 'var(--panel-bg, #ffffff)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%' }}>
        {verifying ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <Loader className="animate-spin" size={48} color="#1a73e8" />
            <h1 style={{ color: '#1a73e8', fontSize: '24px', margin: 0 }}>Verifying Payment...</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Please do not close this window. We are updating your subscription details.</p>
          </div>
        ) : error ? (
          <>
            <div style={{ color: '#d32f2f', fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '28px' }}>Verification Failed</h1>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px', lineHeight: '1.6' }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                className="subscription-btn" 
                onClick={() => navigate("/dashboard")}
                style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Go to Dashboard
              </button>
              <button 
                className="checkout-btn" 
                onClick={() => navigate("/premium")}
                style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Try Again
              </button>
            </div>
          </>
        ) : (
          <>
            <CheckCircle size={64} color="#2e7d32" style={{ marginBottom: '20px' }} />
            <h1 style={{ color: '#2e7d32', marginBottom: '16px', fontSize: '28px' }}>Payment Successful!</h1>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px', lineHeight: '1.6' }}>
              Thank you for subscribing to our Premium plan. Your account has been upgraded successfully, and you can now access all premium trends and features.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                className="subscription-btn" 
                onClick={() => navigate("/dashboard")}
                style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Go to Dashboard
              </button>
              <button 
                className="checkout-btn" 
                onClick={() => navigate("/subscription")}
                style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                My Subscription
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
