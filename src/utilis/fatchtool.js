const fetch = require('node-fetch');
require('dotenv').config();
 async function fetchFromAPI(endpoint) {
    const baseUrl = process.env.CONTENT_URL_id; 
  try {
    console.log(`Fetching data from: ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { error: `Failed to fetch data from endpoint: ${endpoint}` };
  }
}
async function fetchFromAPIByManufacture(endpoint) 
{
  const baseUrl = process.env.CONTENT_URL_Manufacture; 
  try {
    console.log(`Fetching data from: ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { error: `Failed to fetch data from endpoint: ${endpoint}` };
  }
}
async function fetchFromAPIByCategory(endpoint) 
{
  const baseUrl = process.env.CONTENT_URL_Category; 
  try {
    console.log(`Fetching data from: ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { error: `Failed to fetch data from endpoint: ${endpoint}` };
  }
}
async function fetchFromAPIByName(endpoint) 
{
  const baseUrl = process.env.CONTENT_URL_Name; 
  try {
    console.log(`Fetching data from: ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { error: `Failed to fetch data from endpoint: ${endpoint}` };
  }
}


module.exports = { fetchFromAPI, fetchFromAPIByManufacture , fetchFromAPIByCategory, fetchFromAPIByName};