import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for auth token if needed later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapScholarshipKeys = (s) => {
  if (!s) return null;
  return {
    ...s,
    kategori_nama: s.nama_kategori || s.kategori_nama,
    penyedia_nama: s.nama_penyedia || s.penyedia_nama,
  };
};

// --- Scholarships ---
export const getScholarships = async (params = {}) => {
  const response = await api.get('/scholarships', { params });
  const list = response.data?.data || [];
  return list.map(mapScholarshipKeys);
};

export const getScholarshipById = async (id) => {
  const response = await api.get(`/scholarships/${id}`);
  return mapScholarshipKeys(response.data?.data || null);
};

export const createScholarship = async (data) => {
  let payload = data;
  let headers = {};
  
  if (data.gambar instanceof File) {
    payload = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    }
    headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await api.post('/scholarships', payload, { headers });
  return mapScholarshipKeys(response.data?.data || null);
};

export const updateScholarship = async (id, data) => {
  let payload = data;
  let headers = {};
  
  if (data.gambar instanceof File) {
    payload = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    }
    headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await api.put(`/scholarships/${id}`, payload, { headers });
  return mapScholarshipKeys(response.data?.data || null);
};

export const deleteScholarship = async (id) => {
  const response = await api.delete(`/scholarships/${id}`);
  return response.data;
};

// --- Categories ---
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data?.data || [];
};

export const createCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data?.data || null;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data?.data || null;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// --- Providers ---
export const getProviders = async () => {
  const response = await api.get('/providers');
  return response.data?.data || [];
};

export const createProvider = async (data) => {
  const response = await api.post('/providers', data);
  return response.data?.data || null;
};

export const updateProvider = async (id, data) => {
  const response = await api.put(`/providers/${id}`, data);
  return response.data?.data || null;
};

export const deleteProvider = async (id) => {
  const response = await api.delete(`/providers/${id}`);
  return response.data;
};

// --- Requirements ---
export const getRequirements = async () => {
  const response = await api.get('/requirements');
  return response.data?.data || [];
};

export const getRequirementsByScholarshipId = async (scholarshipId) => {
  const response = await api.get(`/requirements/scholarship/${scholarshipId}`);
  return response.data?.data || null;
};

export const createRequirement = async (data) => {
  const response = await api.post('/requirements', data);
  return response.data?.data || null;
};

export const updateRequirement = async (id, data) => {
  const response = await api.put(`/requirements/${id}`, data);
  return response.data?.data || null;
};

export const deleteRequirement = async (id) => {
  const response = await api.delete(`/requirements/${id}`);
  return response.data;
};

// --- Admin Auth ---
export const loginAdmin = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const checkSession = async () => {
  const response = await api.get('/auth/session');
  return response.data?.data || null;
};

export const logoutAdmin = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// --- Admins ---
export const getAdmins = async () => {
  const response = await api.get('/admins');
  return response.data?.data || [];
};

export const createAdmin = async (data) => {
  const response = await api.post('/admins', data);
  return response.data?.data || null;
};

export const updateAdmin = async (id, data) => {
  const response = await api.put(`/admins/${id}`, data);
  return response.data?.data || null;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`/admins/${id}`);
  return response.data;
};

// --- Dashboard ---
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data?.data || null;
};

export const getDashboardRecent = async (limit = 5) => {
  const response = await api.get('/dashboard/recent', { params: { limit } });
  const list = response.data?.data || [];
  return list.map(mapScholarshipKeys);
};

export default api;
