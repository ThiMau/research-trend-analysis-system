import axiosClient from "../Api/axiosClient";

const paymentService = {
  /**
   * Tạo Invoice
   * POST /invoices
   */
  async createInvoice(premiumId) {
    try {
      const response = await axiosClient.post("/invoices", {
        premiumId,
      });

      return response.data;
    } catch (error) {
      console.error("Create Invoice Error:", error);
      throw error;
    }
  },

  /**
   * Tạo Payment
   * POST /api/member/payments/{invoiceId}
   */
  async createPayment(invoiceId) {
    try {
      const response = await axiosClient.post(
        `/api/member/payments/${invoiceId}`
      );

      return response.data;
    } catch (error) {
      console.error("Create Payment Error:", error);
      throw error;
    }
  },

  /**
   * Lịch sử thanh toán
   * GET /api/member/payment/history
   */
  async getPaymentHistory() {
    try {
      const response = await axiosClient.get(
        "/api/member/payment/history"
      );

      return response.data;
    } catch (error) {
      console.error("Get Payment History Error:", error);
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán qua Webhook (FE gọi trực tiếp hỗ trợ localhost)
   * POST /api/payment/webhook
   */
  async confirmPayment(orderCode) {
    try {
      const response = await axiosClient.post("/api/payment/webhook", {
        data: {
          orderCode: Number(orderCode),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Confirm Payment Error:", error);
      throw error;
    }
  },
};

export default paymentService;