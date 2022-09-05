import axios from 'axios';
import { type Factory } from './apiFactory';

/**  Номенклатура\Марка БМ\Продукт. */
export type СoncreteType = Omit<Factory, 'MULTIPLICITY'>;

export const apiProducts = {
  /** Возращает список Номенклатур\Марок БМ\Продуктов.  */
  // todo: type the arg.
  getByFactoryId(factoryId?: Factory['ID']) {
    return axios.post<СoncreteType[]>('rest/products/getByFactoryId/', {
      id: factoryId,
    });
  },
};
