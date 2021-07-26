import { Flex, Icon, Input } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";

export function SearchBox() {
  //controlledrefs
  // const [search, setSearch] = useState("");
  //uncontrolledrefs
  const searchInputRef = useRef<HTMLInputElement>(null);
  // console.log(searchInputRef.current.value);
  //debounce - evita que cada letra em um formulário gere uma busca

  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml="6"
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        pr="4"
        placeholder="Buscar na Plataforma"
        _placeholder={{ color: "gray.400" }}
        ref={searchInputRef}
      />
      <Icon as={RiSearchLine} fontSize="20" />
    </Flex>
  );
}
