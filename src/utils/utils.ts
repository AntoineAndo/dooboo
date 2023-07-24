//Build the url string given the endpoint
// and the params as an object
export function buildUrl(
  endpoint: string,
  params: {
    [key: string]: any;
  }
): string {
  //TODO check for dev or prod env
  let url = `${endpoint}?`;

  //Loop over the param object to add to the url
  url += Object.keys(params)
    .map((key: string) => {
      if (params[key] == undefined) return;
      return `${key}=${encodeURIComponent(params[key])}`;
    })
    .join("&");

  return url;
}

//Display the brands name based on the user's language
export function brands(product: any, language_code: string) {
  let brandString;
  if (language_code == product.brand.brand_country[0].country.language_code) {
    brandString = product.brand.name_ori;

    if (product.brand2) {
      brandString += ` - ${product.brand2.name_ori}`;
    }
  } else {
    brandString = product.brand.name_rom;

    if (product.brand2) {
      brandString += ` - ${product.brand2.name_rom}`;
    }
  }

  return brandString;
}
