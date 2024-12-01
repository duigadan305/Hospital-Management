import { authKey } from "../service/storageKey";
import { decodeToken } from "../service/jwt";
import { getFromLocalStorage, setLocalStorage } from "../service/local-storage";
export const setUserInfo = ({ accessToken }) => {
  return setLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedToken = decodeToken(authToken);
    return decodedToken;
  } else {
    return null;
  }
};
export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};
export const loggedOut = () => {
  return localStorage.removeItem(authKey);
};

export const getRole = () => {
  return getFromLocalStorage("role");
};
