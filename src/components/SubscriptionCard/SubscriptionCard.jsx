import "./SubscriptionCard.css";

export default function SubscriptionCard({ subscription }) {
  if (!subscription) return null;

  const { premium, packageName, startDate, endDate, status } = subscription;

  return (
    <div className="subscription-card">
      <div className="subscription-header">
        <h2>{premium ? "Premium Active" : "Free Account"}</h2>
      </div>

      <div className="subscription-item">
        <span>Package</span>
        <strong>{packageName || "-"}</strong>
      </div>

      <div className="subscription-item">
        <span>Start Date</span>
        <strong>
          {startDate ? new Date(startDate).toLocaleDateString() : "-"}
        </strong>
      </div>

      <div className="subscription-item">
        <span>End Date</span>
        <strong>
          {endDate ? new Date(endDate).toLocaleDateString() : "-"}
        </strong>
      </div>

      <div className="subscription-status">
        {status || "N/A"}
      </div>
    </div>
  );
}