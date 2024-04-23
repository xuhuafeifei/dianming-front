import { http } from "@/utils/http";
import { R } from "./class";
import { baseModuleUrlApi, userModuleUrlApi } from "./utils";

export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
    /** id */
    id: number;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
// export const getLogin = (data?: object) => {
//   return http.request<UserResult>("post", "/login", { data });
// };

export const getLogin = (data?: object) => {
  return http.request<UserResult>(
    "get",
    // `/api/modules/user/login?username=${data.username}&password=${data.password}`,
    userModuleUrlApi(
      `/user/login?username=${data.username}&password=${data.password}`
    ),
    { data }
  );
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

export const getUserInfo = (data?: number) => {
  return http.request<R<any>>(
    "get",
    userModuleUrlApi(`/user/info?userId=${data}`)
  );
};
