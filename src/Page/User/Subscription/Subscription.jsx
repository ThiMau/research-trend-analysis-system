import { useEffect, useState } from "react";
import "./Subscription.css";

import premiumService from "../../../Services/premiumService";
import SubscriptionCard from "../../../components/SubscriptionCard/SubscriptionCard";

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);

      const response = await premiumService.getCurrentSubscription();

      if (response.code === 0) {
        setSubscription(response.result);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot load subscription.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-loading">
        Loading Subscription...
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <h1>My Subscription</h1>

      <SubscriptionCard
        subscription={subscription}
      />
    </div>
  );
}