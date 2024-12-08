import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

export const fetchAggregatedData = async () => {
    try {
        const response = await API.get("dynamic-aggregation/");
        return response.data;
    } catch (error) {
        console.error("Error fetching aggregated data:", error);
        return [];
    }
};

export default API;
