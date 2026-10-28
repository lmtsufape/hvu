import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/",
    
})