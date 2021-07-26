import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { RiAddLine, RiPencilLine, RiRefreshLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useClients } from "../../services/hooks/useClients";
import { queryClient } from "../../services/queryClient";

export default function ClientsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, refetch } = useClients(
    page
    //,
    //    {
    //   initialData: users,
    // }
  );

  function handleRefresh() {
    refetch({ throwOnError: false, cancelRefetch: true });
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefetchClient(clientId: string) {
    await queryClient.prefetchQuery(
      ["client", clientId],
      async () => {
        const response = await api.get(`clients/${clientId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10minutes
      }
    );
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Clientes
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            <Flex>
              <Button
                size="sm"
                fontSize="small"
                colorScheme="purple"
                mr="4"
                leftIcon={<Icon as={RiRefreshLine} fontSize="20" />}
                onClick={handleRefresh}
              >
                Atualizar
              </Button>
              <NextLink href="/clients/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="small"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar novo
                </Button>
              </NextLink>
            </Flex>
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">Falha ao obter dados dos Clientes</Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink"></Checkbox>
                    </Th>
                    {isWideVersion && (
                      <Th>
                        <Text align="center">Código</Text>
                      </Th>
                    )}
                    <Th>Cliente</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th w="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.clients.map((client) => {
                    return (
                      <Tr key={client.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Text align="center">{client.id}</Text>
                        </Td>
                        <Td>
                          <Box>
                            <Link
                              color="purple.400"
                              onMouseEnter={() =>
                                handlePrefetchClient(client.id)
                              }
                            >
                              <Text fontWeight="bold">{client.name}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">
                              {client.address}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{client.createdAt}</Td>}
                        <Td>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          >
                            {isWideVersion ? "Editar" : ""}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <Pagination
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const { users, totalCount } = await getUsers(1);

//   return {
//     props: {
//       users,
//     },
//   };
// };
