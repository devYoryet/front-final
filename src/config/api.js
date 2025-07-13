
import axios from 'axios';
// const DEPLOYED=''
const LOCALHOST=process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log("log REACT_APP_API_URL",process.env.REACT_APP_API_URL);

export const API_BASE_URL = LOCALHOST

const api = axios.create({
  baseURL: API_BASE_URL,
});
console.log("api", api);

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;