import axios from "axios";

const api = axios.create({
    baseURL: "https://dashboard-api-1-nnoj.onrender.com/api",
})

export default api