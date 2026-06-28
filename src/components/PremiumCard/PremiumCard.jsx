import "./PremiumCard.css";

export default function PremiumCard({ premium, onSelect }) {
  if (!premium) return null;

  const {
    packageName,
    amount,
    durationDays,
    description,
  } = premium;

  return (
    <div className="premium-card">

      <div className="premium-header">
        <h2>{packageName}</h2>
      </div>

      <div className="premium-price">
        {Number(amount).toLocaleString()} VNĐ
      </div>

      <div className="premium-duration">
        {durationDays} Days
      </div>

      <div className="premium-description">
        {description}
      </div>

      <button
        className="premium-btn"
        onClick={() => onSelect(premium)}
      >
        Buy Now
      </button>

    </div>
  );
}import "./PremiumCard.css";

export default function PremiumCard({ premium, onSelect }) {
  if (!premium) return null;

  const {
    packageName,
    amount,
    durationDays,
    description,
  } = premium;

  return (
    <div className="premium-card">

      <div className="premium-header">
        <h2>{packageName}</h2>
      </div>

      <div className="premium-price">
        {Number(amount).toLocaleString()} VNĐ
      </div>

      <div className="premium-duration">
        {durationDays} Days
      </div>

      <div className="premium-description">
        {description}
      </div>

      <button
        className="premium-btn"
        onClick={() => onSelect(premium)}
      >
        Buy Now
      </button>

    </div>
  );
}