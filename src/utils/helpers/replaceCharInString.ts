/** Возращает новую строку с замененным символом под определенным index. */
export function replaceCharInString(
  string: string,
  index: number,
  replacement: string
) {
  return (
    string.substring(0, index) +
    replacement +
    string.substring(index + replacement.length)
  );
}
