import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { logError } from '@/utils/helpers/logError';
import { AxiosResponse } from 'axios';
import { ref, UnwrapRef } from 'vue';

type CallbackArg<T> = () => Promise<AxiosResponse<UnwrapRef<T>>>;

export function useApi<T>(callback: CallbackArg<T>, { immediate = true } = {}) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  async function doFetch() {
    data.value = null;
    error.value = null;

    try {
      loading.value = true;
      const response = await callback();
      data.value = response.data;
    } catch (e) {
      error.value = getErrorMessage(e);
      logError(e);
    } finally {
      loading.value = false;
    }
  }

  if (immediate) doFetch();

  return {
    data,
    error,
    loading,
    doFetch,
  };
}
