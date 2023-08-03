export function setAccessTokenInCookie(token: string) {
  const oneDay = 24 * 60 * 60 * 1000; // Set the cookie expiration time (e.g., 1 day)
  const expirationDate = new Date(Date.now() + oneDay).toUTCString();
  console.log("Added Accses Token:", token);
  console.log("Expiration date:", expirationDate);
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
    console.log("Found Token:", accessToken);
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

export function addRefreshTokenInCookie(token: string) {
  const oneDay = 24 * 60 * 60 * 1000; // Set the cookie expiration time (e.g., 1 day)
  const expirationDate = new Date(Date.now() + oneDay).toUTCString();
  console.log("Added Refresh Token:", token);
  console.log("Expiration date:", expirationDate);
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
    console.log("Found Token:", refreshToken);
    return refreshToken;
  }
}

export function removeRefreshTokenFromCookie() {
  // Remove the cookie with the name 'refreshToken'
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function generateNewAccessToken(refresh: string) {
  // Takes in an access token and returns a new access token
}

export function logout() {
  // Remove the access token and refresh token from the cookies
  removeAccessTokenFromCookie();
  removeRefreshTokenFromCookie();

  // Redirect the user to the login page
  window.location.href = "/login";
}
