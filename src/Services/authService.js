import axiosClient from "../Api/axiosClient";

const authService = {
  // ======================
  // AUTH
  // ======================

  login: async (data) => {
    const response = await axiosClient.post(
      "/auth/login",
      data
    );

    // lưu token
    if (response.data?.result?.token) {
      localStorage.setItem(
        "token",
        response.data.result.token
      );

      localStorage.setItem(
        "role",
        response.data.result.role
      );
    }

    return response.data;
  },

  register: async (data) => {
    const response = await axiosClient.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  verifyEmail: async (data) => {
    const response = await axiosClient.post(
      "/auth/verify-email",
      data
    );

    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await axiosClient.post(
      "/auth/forgot-password",
      data
    );

    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosClient.post(
      "/auth/reset-password",
      data
    );

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },

  // ======================
  // USER
  // ======================

  getMe: async () => {
    const response = await axiosClient.get(
      "/users/me"
    );

    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosClient.put(
      "/users/change-password",
      data
    );

    return response.data;
  },

  // ======================
  // PAPERS
  // ======================

  getPapers: async (params = {}) => {
    const response = await axiosClient.get(
      "/api/member/papers",
      {
        params,
      }
    );

    return response.data;
  },

  getPaperById: async (paperId) => {
    const response = await axiosClient.get(
      `/api/member/papers/${paperId}`
    );

    return response.data;
  },

  createPaper: async (data) => {
    const response = await axiosClient.post(
      "/api/member/papers",
      data
    );

    return response.data;
  },

  updatePaper: async (paperId, data) => {
    const response = await axiosClient.put(
      `/api/member/papers/${paperId}`,
      data
    );

    return response.data;
  },

  deletePaper: async (paperId) => {
    const response = await axiosClient.delete(
      `/api/member/papers/${paperId}`
    );

    return response.data;
  },

  // ======================
  // AUTHOR
  // ======================

  getAuthorById: async (authorId) => {
    const response = await axiosClient.get(
      `/api/member/authors/${authorId}`
    );

    return response.data;
  },

  // ======================
  // JOURNAL
  // ======================

  getJournalById: async (journalId) => {
    const response = await axiosClient.get(
      `/api/member/journals/${journalId}`
    );

    return response.data;
  },
};

export default authService;