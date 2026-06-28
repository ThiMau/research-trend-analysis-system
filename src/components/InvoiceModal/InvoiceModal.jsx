import "./InvoiceModal.css";

export default function InvoiceModal({
    open,
    premium,
    onClose,
    onConfirm,
    loading,
}) {

    if (!open || !premium) return null;

    return (
        <div className="invoice-overlay">

            <div className="invoice-modal">

                <h2>Purchase Confirmation</h2>

                <div className="invoice-row">
                    <span>Package</span>
                    <strong>{premium.packageName}</strong>
                </div>

                <div className="invoice-row">
                    <span>Duration</span>
                    <strong>{premium.durationDays} Days</strong>
                </div>

                <div className="invoice-row">
                    <span>Price</span>
                    <strong>
                        {Number(premium.amount).toLocaleString()} VNĐ
                    </strong>
                </div>

                <div className="invoice-description">
                    {premium.description}
                </div>

                <div className="invoice-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>

                </div>

            </div>

        </div>
    );
}