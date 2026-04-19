/**
 * In-memory storage for the current access token.
 *
 * This approach avoids persisting the token in localStorage/sessionStorage,
 * reducing exposure to XSS attacks. However, it is volatile and will be lost
 * on page refresh.
 */
let accessToken: string | null = null;

// Updates the current access token in memory.
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Retrieves the current in-memory access token.
export const getAccessToken = () => accessToken;
