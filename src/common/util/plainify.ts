export function plainify<T>(object: T): any {
  return JSON.parse(JSON.stringify(object));
}
