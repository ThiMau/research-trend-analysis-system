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
    const response = await axiosClient.put(
      "/users/change-password",
      data,
      config
    );
    return response.data;
  },

  // ======================
  // PAPERS
  // ======================

  getPapers: async (params = {}) => {
    const response = await axiosClient.get(
      "/api/member/papers",
      { params }
    );
    return response.data;
  },

  getPaperById: async (paperId) => {
    const response = await axiosClient.get(
      `/api/member/papers/${paperId}`
    );
    return response.data;
  },

  getPaperDetail: async (paperId) => {
    const response = await axiosClient.get(
      `/api/member/papers/${paperId}`
    );
    return response.data;
  },

  // ======================
  // AUTHORS
  // ======================

  getAuthorDetail: async (authorId) => {
    const response = await axiosClient.get(
      `/api/member/authors/${authorId}`
    );
    return response.data;
  },

  // ======================
  // JOURNALS
  // ======================

  getJournalById: async (journalId) => {
    const response = await axiosClient.get(
      `/api/member/journals/${journalId}`
    );
    return response.data;
  },

  getJournalWithPapers: async (journalId) => {

    const journalRes = await axiosClient.get(
      `/api/member/journals/${journalId}`
    );

    const journal = journalRes.data.result;

    const papersRes = await axiosClient.get(
      "/api/member/papers",
      {
        params: {
          journal: journal?.name,
          size: 50,
        },
      }
    );

    return {

      journal,

      papers: papersRes.data.result?.content || [],

    };

  },

  // ======================
  // FOLLOW
  // ======================

  getFollowTopics: async () => {
    const response = await axiosClient.get(
      "/api/member/follow/topics"
    );
    return response.data;
  },

  getFollowAuthors: async () => {
    const response = await axiosClient.get(
      "/api/member/follow/authors"
    );
    return response.data;
  },

  getFollowJournals: async () => {
    const response = await axiosClient.get(
      "/api/member/follow/journals"
    );
    return response.data;
  },

  followTopic: async (topicId) => {
    const response = await axiosClient.post(
      "/api/member/follow/topics",
      {
        topicId,
      }
    );
    return response.data;
  },

  unfollowTopic: async (topicId) => {
    const response = await axiosClient.delete(
      `/api/member/follow/topics/${topicId}`
    );
    return response.data;
  },

  followAuthor: async (authorId) => {
    const response = await axiosClient.post(
      "/api/member/follow/authors",
      {
        authorId,
      }
    );
    return response.data;
  },

  unfollowAuthor: async (authorId) => {
    const response = await axiosClient.delete(
      `/api/member/follow/authors/${authorId}`
    );
    return response.data;
  },

  followJournal: async (journalId) => {
    const response = await axiosClient.post(
      "/api/member/follow/journals",
      {
        journalId,
      }
    );
    return response.data;
  },

  unfollowJournal: async (journalId) => {
    const response = await axiosClient.delete(
      `/api/member/follow/journals/${journalId}`
    );
    return response.data;
  },
  // ======================
  // TREND ANALYTICS
  // ======================

  getPublicationTrend: async (params = {}) => {
    const response = await axiosClient.get(
      "/api/member/publication-trends",
      {
        params,
      }
    );
    return response.data;
  },

  getTopKeywords: async () => {
    const response = await axiosClient.get(
      "/api/member/publication-trends/top-keywords"
    );
    return response.data;
  },

  getTopJournals: async (fieldId = null) => {
    const response = await axiosClient.get(
      "/api/member/publication-trends/top-journals",
      {
        params: {
          fieldId,
        },
      }
    );
    return response.data;
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

export default userService;
