import axios from "axios";

const instance = axios.create({
    baseURL:'https://server.dentaladvisor.ai',
    withCredentials: true,
})

export default instance