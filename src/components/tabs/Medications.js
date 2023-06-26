import { Box, Card, CardBody, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AddMed from './functions/AddMed';
import DeleteMed from './functions/DeleteMed';
import { firestore, auth } from '../../firebase/firebase.js';

function Medications() {
  const [medications, setMedications] = useState([]);
  const user = auth.currentUser; // Get the currently logged-in user

  useEffect(() => {
    const unsubscribe = firestore
      .collection(`users/${user.uid}/medications`)
      .onSnapshot((snapshot) => {
        const meds = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedications(meds);
      });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <Box borderWidth="1px" borderRadius="lg" boxShadow="md" maxWidth="100%" minHeight="100vh" p="4">
      <Heading marginBottom="40px" size="lg" marginLeft="5px">
        Your Medications
      </Heading>
      <AddMed />

      {/* List all the medications in this grid */}
      <SimpleGrid spacing={2} templateColumns="repeat(auto-fill, minmax(230px, 1fr))" marginTop="30px">
        {medications.map((medication) => (
          <Card key={medication.id}>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontWeight="bold">{medication.medName}</Text>
                  <Text>{medication.dosage} {medication.dosageUnit}</Text>
                  <Text>{medication.timesOfDay.join(', ')}</Text>
                </Box>
                <Spacer />
                <DeleteMed id={medication.id} />
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Medications;