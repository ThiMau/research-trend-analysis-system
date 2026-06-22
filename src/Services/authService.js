import axiosClient from "../Api/axiosClient";

const AUTH_TOKEN_KEY = "token";
const AUTH_ROLE_KEY = "role";

const saveAuthData = (token, role) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (role) {
    localStorage.setItem(AUTH_ROLE_KEY, role);
  }
};

const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
};

const authService = {
  // ======================
  // AUTH
  // ======================

  login: async (data) => {
    const response = await axiosClient.post(
      "/auth/login",
      data
    );

    const token =
      response?.data?.result?.token;

    const role =
      response?.data?.result?.role;

    saveAuthData(token, role);

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
    clearAuthData();
    sessionStorage.clear();
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(
      AUTH_TOKEN_KEY
    );
  },

  // ======================
  // USER
  // ======================

  getMe: async () => {
    const response =
      await axiosClient.get(
        "/users/me"
      );

    return response.data;
  },

  changePassword: async (data, config = {}) => {
    const response =
      await axiosClient.put(
        "/users/change-password",
        data,
        config
      );

    return response.data;
  },

  // ======================
  // PAPERS
  // ======================

  getPapers: async (
    params = {}
  ) => {
    const response =
      await axiosClient.get(
        "/api/member/papers",
        {
          params,
        }
      );

    return response.data;
  },

  getPaperById: async (
    paperId
  ) => {
    const response =
      await axiosClient.get(
        `/api/member/papers/${paperId}`
      );

    return response.data;
  },

  // Alias cho PaperDetail.jsx
  getPaperDetail: async (
    paperId
  ) => {
    const response =
      await axiosClient.get(
        `/api/member/papers/${paperId}`
      );

    return response.data;
  },

  // ======================
  // AUTHORS
  // ======================

getAuthorDetail: async (
  authorId
) => {
  const response =
    await axiosClient.get(
      `/api/member/authors/${authorId}`
    );

  return response.data;
},

  // ======================
  // JOURNALS
  // ======================

  getJournalById: async (
    journalId
  ) => {
    const response =
      await axiosClient.get(
        `/api/member/journals/${journalId}`
      );

    return response.data;
  },

  // Journal Detail + Related Papers
  getJournalWithPapers:
    async (journalId) => {
      const journalRes =
        await axiosClient.get(
          `/api/member/journals/${journalId}`
        );

      const journal =
        journalRes.data.result;

      const papersRes =
        await axiosClient.get(
          "/api/member/papers",
          {
            params: {
              journal:
                journal?.name,
              size: 50,
            },
          }
        );

      return {
        journal,
        papers:
          papersRes.data.result
            ?.content || [],
      };
    },

  // ======================
  // REPORTS
  // ======================

  createReport: async (data) => {
    const response = await axiosClient.post(
      "/api/member/reports",
      data
    );

    return response.data;
  },
};

export default authService;
