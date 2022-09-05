export const exportToExcel = (queryParams) => {
  window.location.href =
    process.env.VUE_APP_API_CLIENT_BASE_URL +
    `/export/v1/tradinglot/?lotId=${queryParams.lotId}&datePeriodStart=${queryParams.datePeriodStart}&datePeriodEnd=${queryParams.datePeriodEnd}`;
};
