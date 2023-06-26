import React from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs, Center, Box, Heading } from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';

function LoginRegisterTabs() {
  return (
    <>
      <Center h="100vh" flexDirection="column">
        <Heading size="xl" mb={4} textAlign="center" marginBottom="50px">PharmAssist</Heading>
        <Box
          w="400px"
          p="20px"
          borderWidth="1px"
          borderColor="gray.300"
          borderRadius="md"
          boxShadow="lg"
          rounded={'lg'}
          bg={"white"}
        >
          <Tabs>
            <TabList>
              <Tab>Login</Tab>
              <Tab>Registration</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <Register/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>
    </>
  )
}

export default LoginRegisterTabs;