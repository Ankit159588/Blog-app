import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const LoginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, userData, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const VerifyEmailUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-email`, data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const createPost = async (postData, accessToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const getAllPosts = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-all-posts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      data: error.response?.data,
    };
  }
};

export const getPostById = async (id, accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-post/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      data: error.response?.data,
    };
  }
};
