import axios from 'axios';

// 🚀 Chỉ sửa duy nhất 1 nơi này khi đổi IP máy tính hoặc khi dùng Ngrok/Localtunnel
export const API_URL = 'http://172.27.192.1:3000'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Quá 10 giây không phản hồi thì ngắt kết nối
});

export default api;