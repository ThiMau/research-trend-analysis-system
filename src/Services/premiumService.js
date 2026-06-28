import axiosClient from "../Api/axiosClient";

const premiumService = {
  /**
   * Lấy danh sách Premium Packages
   * GET /premiums
   */
  async getPremiumPackages() {
    try {
      const response = await axiosClient.get("/premiums");
      return response.data;
    } catch (error) {
      console.error("Get Premium Packages Error:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin gói Premium hiện tại
   * GET /api/member/subscription/current
   */
  async getCurrentSubscription() {
    try {
      const response = await axiosClient.get(
        "/api/member/subscription/current"
      );
      return response.data;
    } catch (error) {
      console.error("Get Current Subscription Error:", error);
      throw error;
    }
  },
};

export default premiumService;