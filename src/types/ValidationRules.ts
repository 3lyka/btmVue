import { FormItemRule } from 'element-plus';

/** Правила валидации Element-Plus
 * @example 
 * const formRules = ref<ValidationRules>({
    username: { required: true, type: 'email'},
    password: { required: true },
  });
 */
export type ValidationRules = Partial<
  Record<string, FormItemRule | FormItemRule[]>
>;
