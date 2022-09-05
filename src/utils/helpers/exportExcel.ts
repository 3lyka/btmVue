interface QueryParamsLot {
  factoryId: string;
  datePeriodStart: string;
  datePeriodEnd: string;
}

interface QueryParamsInnerLot extends Partial<QueryParamsLot> {
  lotId: string;
  dateStart: string;
}

export type QueryParams = QueryParamsInnerLot & QueryParamsLot;

export const exportToExcel = (queryParams: QueryParams) => {
  const BASE_URL = process.env.VUE_APP_API_CLIENT_BASE_URL;
  const url = new URL(BASE_URL + '/export/v1/tradinglot/');

  if ('lotId' in queryParams) {
    url.searchParams.set('lotId', <string>queryParams.lotId);
  }
  if ('dateStart' in queryParams) {
    url.searchParams.set('dateStart', <string>queryParams.dateStart);
  }
  if ('factoryId' in queryParams) {
    url.searchParams.set('factoryId', <string>queryParams.factoryId);
  }
  if ('datePeriodStart' in queryParams) {
    url.searchParams.set(
      'datePeriodStart',
      <string>queryParams.datePeriodStart
    );
  }
  if ('datePeriodEnd' in queryParams) {
    url.searchParams.set('datePeriodEnd', <string>queryParams.datePeriodEnd);
  }

  window.open(url.toString(), '_blank');
};
