
export const extractUsername = (): string | null => {
  try {
    // Get the current URL
    const url = window.location.href;
    
    // Parse the URL
    const parsedUrl = new URL(url);
    
    // Extract the search parameters (everything after '?')
    const searchParams = parsedUrl.search;
    
    // If there's no search parameter, return null
    if (!searchParams || searchParams.length <= 1) return null;
    
    // Remove the '?' character and split by '&'
    const paramParts = searchParams.substring(1).split('&');
    
    // The username is expected to be the first part without an equals sign
    for (const part of paramParts) {
      // If there's no '=' in this part, it might be our username
      if (!part.includes('=')) {
        return decodeURIComponent(part);
      }
    }
    
    // Check for any parameter that might contain a username (fallback)
    for (const part of paramParts) {
      const [key, value] = part.split('=');
      if (value) {
        return decodeURIComponent(value);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting username:", error);
    return null;
  }
};
