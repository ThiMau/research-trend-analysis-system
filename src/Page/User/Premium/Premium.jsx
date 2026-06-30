import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Premium.css";

import premiumService from "../../../Services/premiumService";
import paymentService from "../../../Services/paymentService";

import PremiumCard from "../../../components/PremiumCard/PremiumCard";
import InvoiceModal from "../../../components/InvoiceModal/InvoiceModal";

export default function Premium() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadPremiums();
  }, []);

  const loadPremiums = async () => {
    try {
      setPageLoading(true);

      const response = await premiumService.getPremiumPackages();

      if (response.code === 1000 || response.code === 0) {
        setPackages(response.result);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot load Premium Packages.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleBuy = (premium) => {
    setSelectedPackage(premium);
  };

  const handleClose = () => {
    setSelectedPackage(null);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const response = await paymentService.createInvoice(
        selectedPackage.premiumId
      );

      if (response.code === 1000 || response.code === 0) {
        navigate("/payment", {
          state: {
            invoice: response.result,
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert("Cannot create invoice.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="premium-loading">
        Loading Premium Packages...
      </div>
    );
  }

  return (
    <div className="premium-page">

      <h1>Premium Packages</h1>

      <p>
        Upgrade your account to unlock Premium features.
      </p>

      <div className="premium-grid">
        {packages.map((item) => (
          <PremiumCard
            key={item.premiumId}
            premium={item}
            onSelect={handleBuy}
          />
        ))}
      </div>

      <InvoiceModal
        open={selectedPackage !== null}
        premium={selectedPackage}
        loading={loading}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

    </div>
  );
}