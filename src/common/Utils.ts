export function copyFields(data: any, target: any) {
  if (typeof data === 'object') {
    for (const key in data) {
      if (target.hasOwnProperty(key) && data.hasOwnProperty(key) && data[key] !== undefined) {
        target[key] = data[key]
      }
    }
  }
}