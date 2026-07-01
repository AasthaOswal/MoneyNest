
import axios from "../axios/axios.js";

export const getSocketToken = async () => {
  const { data } = await axios.get(
    "/auth/socket-token",
    {
      withCredentials: true,
    }
  );

  localStorage.setItem(
    "socketToken",
    data.socketToken
  );

  return data.socketToken;
};