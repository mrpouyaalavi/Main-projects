import NetInfo from "@react-native-community/netinfo";
import cache from "./Caching";


// Root URL for the API backend
const apiUrl = "http://localhost:5000/api/v1";

// Use caching for semi-offline operation - set high TTL (time to live)
cache.ttlMinutes = 60;

//localhost:7215/api/v1
/**
 * Create a GET request to a URL.
 * @param {string} url The request URL.
 * @param {object} data The data to pass through.
 * @param {bool} returnsData True if the response should return data.
 * @returns {Promise} The response promise.
 */
async function getRequest(url, data = {}, returnsData = true) {
    
    // Build URL with data attached
    url += '?' + new URLSearchParams(data);
    
    // Make request, wait for response
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache', // Ignore caching
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    // Check for errors, e.g. 400, 500
    .then(handleFetchError)

    // Return response data if available
    return returnsData ? response.json() : Promise.resolve();
}


/**
 * Create a GET request to a URL while using the AsyncCache for offline data loading.
 * @param {string} url The request URL.
 * @param {object} data The data to pass through.
 * @param {bool} returnsData True if the response should return data.
 * @returns {Promise} The response promise.
 */
async function getRequestWithCaching(url, data = {}, returnsData = true) {
    
    // Use the original URL as the cache key
    const cacheKey = url

    // Get network state
    const networkState = await NetInfo.fetch()

    // Check if currently offline
    if (!networkState.isConnected) {

        // Load from cache if available (null if not)
        console.log(`OFFLINE: Load from cache: ${cacheKey}`)
        return Promise.resolve(await cache.getItem(cacheKey))
    }
    
    // Build URL with data attached
    url += '?' + new URLSearchParams(data);
    
    // Make request, wait for response
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache', // Ignore caching
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    // Check for errors, e.g. 400, 500
    .then(handleFetchError)

    // Update cache
    console.log(`Updating cache: ${cacheKey}`)
    cache.setItem(cacheKey, await response.clone().json())

    // Return response data if available
    return returnsData ? response.json() : Promise.resolve();
}


/**
 * Create a POST request to a URL.
 * @param {string} url The request URL.
 * @param {object} data The data to pass through.
 * @param {bool} returnsData True if the response should return data.
 * @returns {Promise} The response promise.
 */
async function postRequest(url, data = {}, returnsData = true) {
    
    // Make request, wait for response
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-cache', // Ignore caching
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    // Check for errors, e.g. 400, 500
    .then(handleFetchError);

    // Return response data if available
    return returnsData ? response.json() : Promise.resolve();
}


/**
 * Create a PUT request to a URL.
 * @param {string} url The request URL.
 * @param {object} data The data to pass through.
 * @param {bool} returnsData True if the response should return data.
 * @returns {Promise} The response promise.
 */
async function putRequest(url, data = {}, returnsData = false) {
    
    // Make request, wait for response
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        cache: 'no-cache', // Ignore caching
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    // Check for errors, e.g. 400, 500
    .then(handleFetchError);

    // Return response data if available
    return returnsData ? response.json() : Promise.resolve();
}


/**
 * Create a DELETE request to a URL.
 * @param {string} url The request URL.
 * @param {object} data The data to pass through.
 * @param {bool} returnsData True if the response should return data.
 * @returns {Promise} The response promise.
 */
async function deleteRequest(url, data = {}, returnsData = false) {
    
    // Make request, wait for response
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
        cache: 'no-cache', // Ignore caching
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    // Check for errors, e.g. 400, 500
    .then(handleFetchError);

    // Return response data if available
    return returnsData ? response.json() : Promise.resolve();
}


/**
 * Check for 400-500 errors and custom messages from the server.
 * @param {Response} response The Fetch API Response object.
 * @returns {Response} The original Response object.
 */
async function handleFetchError(response) {

    // Check for errors, e.g. 400, 500
    if (!response.ok) {

        // Check for custom error message from API
        if (response.message) {
            throw Error(`API ${response.status} error: ${response.message}`);
        } else {
            throw Error(`API ${response.status} error: ${response.statusText}`);
        }
    }

    return response;
}


/*
 * ADD YOUR API CALLING METHODS HERE
 */
// Get all departments
export function RoiGetDepartments() {

    // Call API endpoint: GET /Departments
    return getRequestWithCaching(`${apiUrl}/Departments`)
        .then(response => {
            // If request/response is successful, return JSON data
            return response
        })

}

// Get People
export function RoiGetPeople() {

    // Call API endpoint: GET /People
    return getRequestWithCaching(`${apiUrl}/People`)
        .then(response => {
            // If request/response is successful, return JSON data
            return response
        })

}
// Get Person
export function RoiGetPerson(id) {

    // Call API endpoint: GET /People/{id}
    return getRequestWithCaching(`${apiUrl}/People/${id}`)
        .then(response => {
            // If request/response is successful, return JSON data
            return response
        })

}
// Delete person
export function RoiDeletePerson(id) {

    // Call API endpoint: Delete /People/{id}
    return deleteRequest(`${apiUrl}/People/${id}`, {id})
        .then(response => {
            // If request/response is successful, return JSON true(no data in response)
            return true
        })

}
// Add person
export function RoiAddPerson(name,phone,departmentId,street,city,state,zip,country) {

    // Call API endpoint: POST /People
    return postRequest(`${apiUrl}/People`,{name,phone,departmentId,street,city,state,zip,country})
        .then(response => {
            // If request/response is successful, return JSON data
            return response
        })

}
// Update person
export function RoiUpdatePerson(id,name,phone,departmentId,street,city,state,zip,country) {

    // Call API endpoint: PUT /People/{id}
    return putRequest(`${apiUrl}/People/${id}`,{id,name,phone,departmentId,street,city,state,zip,country})
        .then(response => {
            // If request/response is successful, return JSON true(no data in response)
            return true
        })

}