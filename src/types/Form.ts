import Brand from "./Brand";
import Store from "./Store";

type Form = {
  name: string;
  brand1?: Brand;
  brand2?: Brand;
  brand3?: Brand;
  existingProduct?: any;
  categories: any[];
  store?: Store;
  countryId: number;
  errors: {
    [key: string]: any;
  };
};

export default Form;
