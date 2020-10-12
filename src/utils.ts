
export function urlEncode(payload: any) {
  return Object.keys(payload)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])
    })
    .join('&')
}