import axios from 'axios';
import { UserInfo } from './apiUser';

/** Завод (базис отгрузки). */
export interface Factory {
  ID: string;
  NAME: string;
  SHORT_NAME: string;
  /** API возращает число в виде строки, например '25'. */
  MULTIPLICITY: string | null;
}

export const apiFactory = {
  /** Возращает список заводов (базисов отгрузки). */
  getListByUserId({ userId }: { userId?: UserInfo['userId'] } = {}) {
    return axios.get<Factory[]>('rest/factory/getListByUserId/', {
      data: { userId },
    });
  },
};
