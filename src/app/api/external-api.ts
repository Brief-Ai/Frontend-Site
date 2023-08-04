const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;

async function apiCall(url: string, options: RequestInit = {}) {
  // console.log(`API call URL: ${url}`);
  try {
    const response = await fetch(url, { mode: "cors", ...options });
    const data = await response.json();
    // console.log(`API call response: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error(`Error in API call: ${error}`);
    return null;
  }
}

// rawApiCall is a fuction similar to apiCall but it does not parse the response as JSON and returns the raw response with the status code and headers
async function rawApiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, { mode: "cors", ...options });
    return response;
  } catch (error) {
    console.error(`Error in API call: ${error}`);
    return null;
  }
}

export async function searchArticles(query: string) {
  // Import backend api url from .env file
  console.log(`Pulling news articles for query: ${query}`);
  // console.log(`Backend API URL: ${backendApiUrl}`);
  let response = await apiCall(`${backendApiUrl}/news/search/?q=${query}`);
  return response;
}

// Create a new user account
export async function createAccount(
  username: string,
  password: string,
  password2: string
) {
  console.log(`Api == Attempting to create user: ${username}`);
  let response = await rawApiCall(`${backendApiUrl}/account/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      password2,
    }),
  });
  return response;
}

export async function login(username: string, password: string) {
  console.log(`Api == Attempting to login user: ${username}`);
  let response = await rawApiCall(`${backendApiUrl}/account/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  return response;
}

export async function validateToken(accessToken: string) {
  // Take in a access token and return true if it is valid, false otherwise
  console.log(`Api == Attempting to validate access token...`);
  let response = await rawApiCall(`${backendApiUrl}/account/validate_token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

// Function called refeshToken that takes in a refresh token and returns a new access token
export async function refreshToken(refreshToken: string) {
  console.log(
    `Api == Attempting to use refresh token to get new access token...`
  );
  let response = await rawApiCall(`${backendApiUrl}/account/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: `${refreshToken}`,
    }),
  });
  return response;
}
