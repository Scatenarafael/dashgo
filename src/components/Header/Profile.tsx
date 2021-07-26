import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Rafael Scatena</Text>
          <Text color="gray.300" fontSize="small">
            rafascatena@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Rafael Scatena"
        src="https://github.com/Scatenarafael.png"
      />
    </Flex>
  );
}
