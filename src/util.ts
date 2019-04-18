export function convertToPlainObject(obj: any) {
  const keys = Object.keys(obj);
  const target = {};
  for (const k of keys) {
    if (typeof obj[k] !== 'function') {
      target[k] = obj[k];
    }
  }
  return target;
}
