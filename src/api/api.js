import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/api/manager/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/api/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/api/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/api/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.post(`${base}/api/user/batchremove`, params).then(res => res.data); };

export const editUser = params => { return axios.post(`${base}/api/user/edit`, params).then(res => res.data); };

export const addUser = params => { return axios.post(`${base}/api/user/add`, params).then(res => res.data); };

export const getHomeList = params => { return axios.get(`${base}/api/home/list`, { params: params }); };

export const addHomeItem = params => { return axios.post(`${base}/api/home/add`,params).then(res => res.data); };

export const editHomeItem = params => { return axios.post(`${base}/api/home/edit`,params).then(res => res.data); };

export const removeHomeItem = params => { return axios.get(`${base}/api/home/remove`, { params: params }); };

export const batchRemoveHomeItem = params => { return axios.post(`${base}/api/home/batchRemove`, params ); };

export const getCategoryList = params => { return axios.get(`${base}/api/category/list`, { params: params }); };

export const addCategory = params => { return axios.post(`${base}/api/category/add`,params).then(res => res.data); };

export const editCategory = params => { return axios.post(`${base}/api/category/edit`,params).then(res => res.data); };

export const removeCategory = params => { return axios.get(`${base}/api/category/remove`, { params: params }); };

export const batchRemoveCategory = params => { return axios.post(`${base}/api/category/batchRemove`, params ); };

export const getCityList = params => { return axios.get(`${base}/api/city/list`, { params: params }); };

export const addCity = params => { return axios.post(`${base}/api/city/add`,params).then(res => res.data); };

export const editCity = params => { return axios.post(`${base}/api/city/edit`,params).then(res => res.data); };

export const removeCity = params => { return axios.get(`${base}/api/city/remove`, { params: params }); };

export const batchRemoveCity = params => { return axios.post(`${base}/api/city/batchRemove`, params ); };

