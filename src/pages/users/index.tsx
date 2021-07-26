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
import React, { useCallback, useEffect, useState } from "react";
import { RiAddLine, RiPencilLine, RiRefreshLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";

export default function UserList() {
  const [page, setPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const { data, isLoading, isFetching, error, refetch } = useUsers(
    page
    //,
    //    {
    //   initialData: users,
    // }
  );
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  useEffect(() => {
    if (!isLoading && !isFetching && !error) {
      replaceAllCheckArrayFalse();
    }
  }, []);
  function handleRefresh() {
    refetch({ throwOnError: false, cancelRefetch: true });
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ["user", userId],
      async () => {
        const response = await api.get(`users/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10minutes
      }
    );
  }
  const replaceCheckArray = (checkdata, index) => {
    let allCheckBoxes = checkedItems;
    allCheckBoxes[index] = checkdata;
    setCheckedItems(allCheckBoxes);
    console.log(checkedItems);
  };

  const replaceAllCheckArray = (checkdata) => {
    let allCheckBoxes = Array(data?.users.length).fill(checkdata);
    setCheckedItems(allCheckBoxes);
    console.log(allCheckBoxes);
  };
  const replaceAllCheckArrayFalse = () => {
    let allCheckBoxes = Array(data?.users.length).fill(false);
    setCheckedItems(allCheckBoxes);
    console.log(allCheckBoxes);
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
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
              <NextLink href="/users/create" passHref>
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
            <Flex justify="center">Falha ao obter dados do usuário</Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox
                        colorScheme="pink"
                        isIndeterminate={isIndeterminate}
                        onChange={(e) => {
                          replaceAllCheckArray(e.target.checked);
                        }}
                      />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th w="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.users.map((user, index) => {
                    return (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox
                            colorScheme="pink"
                            isChecked={checkedItems[index]}
                            onChange={(e) => {
                              replaceCheckArray(e.target.checked, index);
                            }}
                          />
                        </Td>
                        <Td>
                          <Box>
                            <Link
                              color="purple.400"
                              onMouseEnter={() => handlePrefetchUser(user.id)}
                            >
                              <Text fontWeight="bold">{user.name}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">
                              {user.email}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{user.createdAt}</Td>}
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
