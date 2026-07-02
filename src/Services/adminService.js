import axiosClient from "../Api/axiosClient";

const adminService = {
  getUsers: async () => {
    const response = await axiosClient.get("/api/admin/users");
    return response.data;
  },

  activateUser: async (id) => {
    const response = await axiosClient.put(`/api/admin/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await axiosClient.put(`/api/admin/users/${id}/deactivate`);
    return response.data;
  },

  banUser: async (id) => {
    const response = await axiosClient.put(`/api/admin/users/${id}/ban`);
    return response.data;
  },
};

export default adminService;
