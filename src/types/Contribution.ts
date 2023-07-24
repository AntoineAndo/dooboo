import Store from "./Store";

type Contribution = {
  id: number;
  fk_product_id: number;
  fk_profile_id: string;
  fk_store_id: string;
};

export default Contribution;
