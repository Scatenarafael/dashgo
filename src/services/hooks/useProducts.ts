import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../api";

export type Product = {
  id: string;
  description: string;
  stock: number;
  price: string;
  createdAt: string;
};

export type GetProductsResponse = {
  totalCount: number;
  products: Product[];
};

export async function getProducts(page: number): Promise<GetProductsResponse> {
  const { data, headers } = await api.get("products", {
    params: {
      page,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  const products = data.products.map(
    (product: {
      id: string;
      description: string;
      stock: number;
      price: string;
      created_at: string;
    }) => {
      return {
        id: product.id,
        description: product.description,
        stock: product.stock,
        price: product.price,
        createdAt: new Date(product.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };
    }
  );

  return {
    products,
    totalCount,
  };
}

export function useProducts(page: number, options?: UseQueryOptions) {
  return useQuery(["products", page], () => getProducts(page), {
    staleTime: 1000 * 60 * 10, //10min
    // ...options,
    // }) as UseQueryResult<GetUsersResponse, unknown>
  });
}
