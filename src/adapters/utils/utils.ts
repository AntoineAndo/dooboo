//Build the url string given the endpoint
// and the params as an object
export function buildUrl(
  endpoint: string,
  params: {
    [key: string]: any;
  }
): string {
  //TODO check for dev or prod env
  // let url = `${process.env.REACT_APP_PROXY_URL}/${endpoint}?`;
  let url = `${endpoint}?`;

  //Loop over the param object to add to the url
  Object.keys(params).forEach((key: string) => {
    if (params[key] == undefined) return;
    url += `${key}=${encodeURIComponent(params[key])}&`;
  });

  return url;
}
