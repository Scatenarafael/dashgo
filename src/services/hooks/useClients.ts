import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../api";

type Client = {
  id: string;
  name: string;
  address: number;
  country: string;
  phone: string;
  gender: string;
  createdAt: string;
};

export type GetClientsResponse = {
  totalCount: number;
  clients: Client[];
};

export async function getClients(page: number): Promise<GetClientsResponse> {
  const { data, headers } = await api.get("clients", {
    params: {
      page,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  const clients = data.clients.map(
    (client: {
      id: string;
      name: string;
      address: number;
      country: string;
      phone: string;
      gender: string;
      created_at: string;
    }) => {
      return {
        id: client.id,
        name: client.name,
        address: client.address,
        country: client.country,
        phone: client.phone,
        gender: client.gender,
        createdAt: new Date(client.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };
    }
  );

  return {
    clients,
    totalCount,
  };
}

export function useClients(page: number, options?: UseQueryOptions) {
  return useQuery(["clients", page], () => getClients(page), {
    staleTime: 1000 * 60 * 10, //10min
    // ...options,
    // }) as UseQueryResult<GetUsersResponse, unknown>
  });
}
