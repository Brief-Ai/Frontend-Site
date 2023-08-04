import { refreshToken } from "../api/external-api";

export function setAccessTokenInCookie(token: string) {
  const oneDay = 24 * 60 * 60 * 1000; // Set the cookie expiration time (e.g., 1 day)
  const expirationDate = new Date(Date.now() + oneDay).toUTCString();
  // console.log("Added Accses Token:", token);
  // console.log("Expiration date:", expirationDate);
  // Set the cookie with the token and expiration date
  document.cookie = `accessToken=${token}; expires=${expirationDate}; path=/`;
}

export function getAccessTokenFromCookie() {
  // Get the cookie with the name 'accessToken'
  const accessTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken"));
  // If the cookie exists, return the token
  if (accessTokenCookie) {
    const accessToken = accessTokenCookie.split("=")[1];
    // console.log("Found Token:", accessToken);
    return accessToken;
  }
  // If the cookie does not exist, return null
  return null;
}

export function removeAccessTokenFromCookie() {
  // Remove the cookie with the name 'accessToken'
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function setRefreshTokenInCookie(token: string) {
  const oneDay = 24 * 60 * 60 * 1000; // Set the cookie expiration time (e.g., 1 day)
  const expirationDate = new Date(Date.now() + oneDay).toUTCString();
  // console.log("Added Refresh Token:", token);
  // console.log("Expiration date:", expirationDate);
  // Set the cookie with the token and expiration date
  document.cookie = `refreshToken=${token}; expires=${expirationDate}; path=/`;
}

export function getRefreshTokenFromCookie() {
  // Get the cookie with the name 'refreshToken'
  const refreshTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken"));
  // If the cookie exists, return the token
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.split("=")[1];
    // console.log("Found Token:", refreshToken);
    return refreshToken;
  }
}

export function removeRefreshTokenFromCookie() {
  // Remove the cookie with the name 'refreshToken'
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export async function generateNewAccessToken() {
  // Check for a refresh token
  let token = undefined;
  let finalResp = undefined;

  const refreshTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken"));
  // If the cookie exists, return the token
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.split("=")[1];
    // console.log("Found Existing Refresh Token");
    token = refreshToken;
  }

  // If no refresh token, return null
  if (!token) {
    // console.log("No refresh token found");
    return null;
  }

  // console.log(`Auth Utils == Refreshing access token...`);

  // Takes in an access token and returns a new access token
  const response = await refreshToken(token);
  let respData = response ? await response.json() : null;
  // If no response, return null
  if (!response) {
    return null;
  }

  if (response.status === 200) {
    // console.log(`Successfully refreshed access token`, respData);
    const newAccessToken = respData.token.access;
    const oneDay = 24 * 60 * 60 * 1000; // Set the cookie expiration time (e.g., 1 day)
    const expirationDate = new Date(Date.now() + oneDay).toUTCString();
    // console.log("Added Access Token:", newAccessToken);
    // console.log("Expiration date:", expirationDate);
    // Set the cookie with the token and expiration date
    document.cookie = `accessToken=${newAccessToken}; expires=${expirationDate}; path=/`;
    finalResp = newAccessToken;
  } else {
    // console.log("Failed to refresh token");
    finalResp = null;
  }

  // console.log(`End of Auth Utils == Refreshing access token...`);
  return finalResp;
}

export function logout() {
  // Remove the access token and refresh token from the cookies
  removeAccessTokenFromCookie();
  removeRefreshTokenFromCookie();

  // Redirect the user to the login page
  window.location.href = "/login";
}
