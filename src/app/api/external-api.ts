async function apiCall(url: string) {
  console.log(`API call URL: ${url}`);
  try {
    const response = await fetch(url, { mode: "cors" }); // Add the 'mode' option
    const data = await response.json();
    console.log(`API call response: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error(`Error in API call: ${error}`);
    return null;
  }
}

export default async function searchArticles(query: string) {
  // Import backend api url from .env file
  const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
  // console.log(`Backend API URL: ${backendApiUrl}`);
  let response = await apiCall(`${backendApiUrl}/news/search/?q=${query}`);
  return response;
}
