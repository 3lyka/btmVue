/** Добавляет разрядность к числам */
export function prettify(str: string | number): string {
  try {
    str = String(str);
    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  } catch (e) {
    console.error('Error in helpers prettify', e);
    return String(str);
  }
}
