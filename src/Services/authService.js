import axiosClient from "../Api/axiosClient";
import axiosClient from "../Api/axiosClient";

// Folder

const getFolders = () => {
    return axiosClient.get("/bookmarks/folders");
};

const createFolder = (folderName) => {
    return axiosClient.post("/bookmarks/folders", {
        folderName,
    });
};

const updateFolder = (folderId, folderName) => {
    return axiosClient.put(`/bookmarks/folders/${folderId}`, {
        folderName,
    });
};

const deleteFolder = (folderId) => {
    return axiosClient.delete(`/bookmarks/folders/${folderId}`);
};


// Papers

const getFolderPapers = (folderId) => {
    return axiosClient.get(`/bookmarks/folders/${folderId}/papers`);
};

const addPaperToFolder = (folderId, paperId, note = "") => {
    return axiosClient.post(`/bookmarks/folders/${folderId}/papers`, {
        paperId,
        note,
    });
};

const removeBookmark = (bookmarkId) => {
    return axiosClient.delete(`/bookmarks/papers/${bookmarkId}`);
};

const updateNote = (bookmarkId, note) => {
    return axiosClient.put(`/bookmarks/papers/${bookmarkId}/note`, {
        note,
    });
};

const checkBookmark = (paperId) => {
    return axiosClient.get(`/bookmarks/check/${paperId}`);
};

export default {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,

    getFolderPapers,
    addPaperToFolder,
    removeBookmark,
    updateNote,
    checkBookmark,
};

const AUTH_TOKEN_KEY = "token";
const AUTH_ROLE_KEY = "role";

const saveAuthData = (token, role) => {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (role) localStorage.setItem(AUTH_ROLE_KEY, role);
};

const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
};

const authService = {
  login: async (data) => {
    const response = await axiosClient.post("/auth/login", data);

    const token = response?.data?.result?.token;
    const role = response?.data?.result?.role;

    saveAuthData(token, role);

    return response.data;
  },

  register: async (data) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },

  verifyEmail: async (data) => {
    const response = await axiosClient.post("/auth/verify-email", data);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await axiosClient.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
  },

  logout: () => {
    clearAuthData();
    sessionStorage.clear();
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};

export default authService;
