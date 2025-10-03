import { axiosAuthInstance } from "../utils/authUtil";

interface ILoginInput {
  email: string;
  password: string;
}

interface IRegisterInput {
  profile_name: string;
  email: string;
  password: string;
}

export const registerUser = async (registerInput: IRegisterInput) => {
  const { profile_name, email, password } = registerInput;
  const res = await axiosAuthInstance.post("/auth/register", {
    profile_name,
    email,
    password,
  });
  return res.data; // { accessToken, user }
};

export const loginUser = async (loginInput: ILoginInput) => {
  const { email, password } = loginInput;
  const res: any = await axiosAuthInstance.post("/auth/login", {
    email,
    password,
  });
  // Setting the new access token in the Session Storage
  sessionStorage.setItem("accessToken", res?.data?.accessToken);
  return res.data; // { accessToken, user }
};

export const refreshAccessToken = async () => {
  const res: any = await axiosAuthInstance.post("/auth/refresh");
  return res?.data?.accessToken; // { accessToken }
};

export const logoutUser = async () => {
  await axiosAuthInstance.post("/auth/logout");
};

export const getUserData = async (userId: string) => {
  const res: any = await axiosAuthInstance.get(`/auth/user/${userId}`);
  return res?.data?.data;
};

export const updateUserData = async (payload: any) => {
  const res: any = await axiosAuthInstance.put(`/auth/user/update`, payload);
  
  return res?.data?.data;
}