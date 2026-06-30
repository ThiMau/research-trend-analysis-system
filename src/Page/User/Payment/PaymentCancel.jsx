import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import "./Payment.css";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="payment-page cancel-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
      <div className="cancel-card" style={{ background: 'var(--panel-bg, #ffffff)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%' }}>
        <XCircle size={64} color="#d32f2f" style={{ marginBottom: '20px' }} />
        <h1 style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '28px' }}>Payment Cancelled</h1>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px', lineHeight: '1.6' }}>
          Your payment process has been cancelled. No charges were made. You can try again whenever you are ready.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            className="subscription-btn" 
            onClick={() => navigate("/premium")}
            style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Back to Packages
          </button>
          <button 
            className="checkout-btn" 
            onClick={() => navigate("/dashboard")}
            style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: '#ccc', color: '#333' }}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
