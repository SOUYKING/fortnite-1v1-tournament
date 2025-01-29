import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/account`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateEpicGamesName = async (token, epicGamesName) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/account/update`,
      { epicGamesName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Epic Games Name:', error);
    throw error;
  }
};

export const fetchTournaments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tournament/cups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

// Add more API functions as needed