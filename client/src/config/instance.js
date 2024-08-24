import axios from "axios";

// const url='https://server.dentaladvisor.ai'
const url='http://localhost:5000'
const instance = axios.create({
    baseURL:url,
    withCredentials: true,
})

export default instance