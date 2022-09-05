import axios, { AxiosRequestConfig } from 'axios';
import type { Factory } from './apiFactory';

// todo: обновился ответ, проверить актуальность.
export interface PlanStatus {
  code:
    | 'work'
    | 'approv_direction'
    | 'approv_trader'
    | 'not_agreed'
    | 'distribution';
  tag: '' | 'danger' | 'warning' | 'success' | 'info';
  text: string;
}

export interface ShipmentPlan {
  basis: string;
  id: string;
  owner: string;
  /** @example "06.02.2022" or "06.02.2022\n05.02.2022" */
  date: string;
  weight: string;
  status: PlanStatus['code'];

  prodType: 'Вся продукция'; // todo: отдельное описание возможных статусов.
}

/** Ответ с API */
export interface ShipmentPlans {
  /** Всего записей */
  all_count: number;
  /** Текущая страница @default 1*/
  page: number;
  /** Вхождений на страницу @default 20 */
  page_size: number;

  plans: ShipmentPlan[];
}

export interface GetPlansRequestData {
  factoryId?: Factory['ID'];
  /** Нужная страница @default 1*/
  pageNumber?: number;
  /** Вхождений на страницу @default 20 */
  pageSize?: number;
}

export interface AddPlanRequestData {
  dateOfShipment: string;
  factoryId: string; // type
  bitumType: string; // type
}

export interface PlanDetail {
  id: number;
  transport_type: string;
  recipient: string;
  transport: string;
  bid: string;
  plan: string;
  fact: string;
  balance: string;
  dayly_plan_with_balance: string;
  dayly_plan: string;
  children?: PlanDetail[];
}

/** Может вернуть { success: false, text: string }, в ответе 200, если план уже существует. */
export type AddPlanResponse =
  | { success: true; id: number }
  | { success: false; text: string };

export const apiShipmentPlan = {
  getPlanStatuses() {
    return axios.get<PlanStatus[]>(
      '/rest/trading/shipmentplan/getPlanStatuses/'
    );
  },

  /** Получает список детальных планов. */
  getPlans(requestData: GetPlansRequestData = {}, config?: AxiosRequestConfig) {
    return axios.post<ShipmentPlans>(
      '/rest/trading/shipmentplan/getPlans/',
      requestData,
      config
    );
  },

  add(requestData: AddPlanRequestData) {
    return axios.post<AddPlanResponse>(
      '/rest/trading/shipmentplan/add/',
      requestData
    );
  },

  /** Получает детальный план. */
  getPlan() {
    return axios.post<PlanDetail[]>('/rest/trading/shipmentplan/getPlan/');
  },
};
