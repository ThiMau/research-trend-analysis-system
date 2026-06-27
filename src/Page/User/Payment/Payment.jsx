import { useEffect, useState } from "react";
import userService from "../../Services/userService";
import "./Payment.css";

function Payment() {
    const [premiums, setPremiums] = useState([]);
    const [selectedPremium, setSelectedPremium] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [qrCode, setQrCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadPremiums();
    }, []);

    const loadPremiums = async () => {
        try {
            const response = await userService.getPremiums();
            setPremiums(response.result || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectPremium = (premium) => {
        setSelectedPremium(premium);
    };

    const handlePayment = async () => {
        if (!selectedPremium) {
            alert("Please select premium package");
            return;
        }

        try {
            setLoading(true);

            const invoiceResponse =
                await userService.createInvoice({
                    premiumId: selectedPremium.premiumId
                });

            const invoiceData = invoiceResponse.result;

            setInvoice(invoiceData);

            const paymentResponse =
                await userService.createPayment(
                    invoiceData.invoiceId
                );

            setQrCode(
                paymentResponse.result.qrCode
            );

        } catch (error) {
            console.log(error);
            alert("Payment creation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckPayment = async () => {
        try {
            const response =
                await userService.getCurrentSubscription();

            if (response.result?.premium) {
                setMessage(
                    "Payment successful. Premium activated!"
                );
            } else {
                setMessage(
                    "Payment not completed yet"
                );
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="payment-container">
            ...
        </div>
    );
}

export default Payment;