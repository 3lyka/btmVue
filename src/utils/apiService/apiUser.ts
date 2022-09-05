import axios from 'axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

/** При успешном выходе, возращается 'true' */
export type LogoutResponse = 'true';

export type UserGroups = Array<
  | 'Portal_BMM_ARM_Trader'
  | 'Portal_BMM_ARM_Head_Trader'
  | 'Portal_BMM_ARM_Head_Direction'
  | 'Portal_BMM_ARM_UMIOP'
  | 'Portal_BBM_ARM_BO'
>;

/**  Данные о пользователе */
export interface UserInfo {
  userId: string;
  email: string;
  fullname: string;
  position: string;
  groups: UserGroups;
}

export interface RestorePasswordData {
  email: string;
}

export const apiUser = {
  login(loginCredentials: LoginCredentials) {
    return axios.post<TokenResponse>('rest/user/login/', null, {
      auth: loginCredentials,
    });
  },

  logout() {
    return axios.get<LogoutResponse>('rest/user/logout/');
  },

  /** Получает пользователя.  */
  getInfo() {
    return axios.post<UserInfo>('rest/user/info/');
  },

  restorePassword({ email }: RestorePasswordData) {
    return axios.post('rest/user/restorePassword/', { form: { email } });
  },

  /** Проверяет, если сессия не закрыта на backend - возращает token. */
  checkToken() {
    return axios.get<TokenResponse>('rest/user/checkToken/');
  },
};
