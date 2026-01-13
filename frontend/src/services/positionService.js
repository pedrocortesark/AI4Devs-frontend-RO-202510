import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

// Get interview flow for a position
export const getInterviewFlow = async (positionId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/position/${positionId}/interviewflow`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching interview flow:', error.response?.data || error.message);
    }
};

// Get candidates for a position
export const getCandidatesByPosition = async (positionId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/position/${positionId}/candidates`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching candidates:', error.response?.data || error.message);
    }
};