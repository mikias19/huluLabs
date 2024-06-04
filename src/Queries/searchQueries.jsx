import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!) {
    products(filter: { name: { match: $search } }) {
      items {
        id
        name
        sku
        image {
          url
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;
