import axiosClient from "../Api/axiosClient";

// ======================
// FOLDERS
// ======================

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

// ======================
// PAPERS IN FOLDER
// ======================

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

const bookmarkService = {
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

export default bookmarkService;
