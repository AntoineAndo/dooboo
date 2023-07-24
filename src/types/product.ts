type Product = {
  id: string;
  name: string;
  fk_country_id: string;
  product_category?: any;
  product_store?: any;
  brand?: any;
  rating: any;
  ratings: any[];
};

export default Product;
