import axiosClient from "../Api/axiosClient";

const userService = {
  // ======================
  // USER
  // ======================

  getMe: async () => {
    const response = await axiosClient.get("/users/me");
    return response.data;
  },

  changePassword: async (data, config = {}) => {
    const response = await axiosClient.put("/users/change-password", data, config);
    return response.data;
  },

  // ======================
  // PAPERS
  // ======================

  getPapers: async (params = {}) => {
    const response = await axiosClient.get("/api/member/papers", { params });
    return response.data;
  },

  getPaperById: async (paperId) => {
    const response = await axiosClient.get(`/api/member/papers/${paperId}`);
    return response.data;
  },

  getPaperDetail: async (paperId) => {
    const response = await axiosClient.get(`/api/member/papers/${paperId}`);
    return response.data;
  },

  // ======================
  // AUTHORS
  // ======================

  getAuthorDetail: async (authorId) => {
    const response = await axiosClient.get(`/api/member/authors/${authorId}`);
    return response.data;
  },

  // ======================
  // JOURNALS
  // ======================

  getJournalById: async (journalId) => {
    const response = await axiosClient.get(`/api/member/journals/${journalId}`);
    return response.data;
  },

  getJournalWithPapers: async (journalId) => {
    const journalRes = await axiosClient.get(`/api/member/journals/${journalId}`);
    const journal = journalRes.data.result;
    const papersRes = await axiosClient.get("/api/member/papers", { params: { journal: journal?.name, size: 50 } });
    return {
      journal,
      papers: papersRes.data.result?.content || [],
    };
  },

  // ======================
  // REPORTS
  // ======================

  createReport: async (data) => {
    const response = await axiosClient.post("/api/member/reports", data);
    return response.data;
  },
};

export default userService;
