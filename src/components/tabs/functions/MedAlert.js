import { InfoIcon } from '@chakra-ui/icons'
import { Alert, AlertDescription, AlertTitle, Box } from '@chakra-ui/react'
import React from 'react'

function MedAlert() {
  return (
    <Box align="center" marginTop="45px">
        <Alert
        status='info'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
        maxWidth="60%"
        boxShadow="lg"
        >
        <InfoIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
            No medications yet.
        </AlertTitle>
        <AlertDescription maxWidth='sm' color="#605e5c" fontWeight="300" marginTop="10px">
            Visit the Medications tab to add your medications list before you can view your daily reminders.
        </AlertDescription>
        </Alert>
    </Box>
  )
}

export default MedAlert