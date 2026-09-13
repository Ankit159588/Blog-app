export const registerUser = async (userData) => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  return data;
};

export const userEmailVerify = async (userData) => {
  const response = await fetch("http://localhost:3000/api/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return {
    success: response.ok,
    data,
  };
};

export const userLogin = async (userData) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  return {
    success: response.ok,
    data,
  };
};

export const refreshAccessToken = async () => {
  const response = await fetch("http://localhost:3000/api/auth/refresh", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  return {
    success: response.ok,
    data,
  };
};

export const getAllPosts = async (accessToken, setAccessToken) => {
  let response = await fetch("http://localhost:3000/api/posts/get-all-posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Access token expired
  if (response.status === 401) {
    const refreshResponse = await refreshAccessToken();

    if (!refreshResponse.success) {
      return {
        success: false,
        data: refreshResponse.data,
      };
    }

    const newAccessToken = refreshResponse.data.accessToken;

    // Update token in App.jsx
    setAccessToken(newAccessToken);

    // Try the original request again
    response = await fetch("http://localhost:3000/api/posts/get-all-posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  const data = await response.json();

  return {
    success: response.ok,
    data,
  };
};
