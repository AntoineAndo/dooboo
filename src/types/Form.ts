import Store from "./Store";

type Form = {
  name: string;
  categories: any[];
  store?: Store;
  countryId: string;
  errors: {
    [key: string]: any;
  };
};

export default Form;
