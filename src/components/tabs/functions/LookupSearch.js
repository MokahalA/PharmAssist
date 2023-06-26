import { Input, Box, List, ListItem, Spinner, Heading, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import medicationData from '../../../data/medications.json';
import { fetchMedicationInfo } from '../../../api/open_fda.js'; 

function searchBrandNames(inputName) {
  const medication = medicationData.medications.find(
    (medication) => medication.name.toLowerCase() === inputName.toLowerCase()
  );

  if (medication) {
    return medication.brandNames;
  }

  return [];
}

function LookupSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedTerms, setMatchedTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [dosingInformation, setDosingInformation] = useState('');
  const [medicationDescription, setMedicationDescription] = useState('');

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);

    if (inputValue.trim() === '') {
      setMatchedTerms([]);
      return;
    }

    const filteredTerms = medicationData.medications.filter((medication) =>
      medication.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      medication.brandNames.some((brandName) =>
        brandName.toLowerCase().includes(inputValue.toLowerCase())
      )
    );

    const limitedTerms = filteredTerms.slice(0, 5);

    setMatchedTerms(limitedTerms);
  };

  const handleItemClick = (medication) => {
    setSearchTerm(medication.name);
    setMatchedTerms([]);
    setSelectedMedication(medication);
    setIsLoading(true);
  };

  const handleSearchClick = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (selectedMedication) {
      fetchMedicationInfo(selectedMedication.name)
        .then((data) => {
          setDosingInformation(data.dosages);
          setMedicationDescription(data.description);
        })
        .catch((error) => {
          console.error('Error fetching medication information:', error);
          setDosingInformation('Error fetching dosing information');
        });
    }
  }, [selectedMedication]);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Search input */}
        <Box position="relative" width="60%">
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            size="lg"
            bg="white"
            paddingRight="2.5rem"
            placeholder="Enter a drug name"
          />
          <Box
            position="absolute"
            right="0.75rem"
            top="50%"
            transform="translateY(-50%)"
          >
            {isLoading ? (
              <Spinner color="blue.500" size="md" />
            ) : (
              <SearchIcon
                color="blue.500"
                boxSize={6}
                cursor="pointer"
                onClick={handleSearchClick}
              />
            )}
          </Box>
          {/* Matched terms list */}
          {matchedTerms.length > 0 && (
            <Box
              position="absolute"
              width="100%"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              mt={2}
              zIndex={1}
            >
              <List spacing={2}>
                {matchedTerms.map((medication, index) => (
                  <ListItem
                    key={index}
                    cursor="pointer"
                    _hover={{ background: 'blue.50' }}
                    onClick={() => handleItemClick(medication)}
                    p={2}
                    borderRadius="md"
                  >
                    {medication.brandNames[0]} ({medication.name})
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {/* Selected Medication Information */}
      <Box display="flex" marginTop="60px" textAlign="left" p={4}>
        {selectedMedication && (
          <Box>
            <Heading textAlign="left" size="lg">
              {selectedMedication.name}
            </Heading>
            <Text color="gray.600" marginTop="10px">
              <Text fontWeight="bold" display="inline">
                Brand name(s):
              </Text>{' '}
              {searchBrandNames(selectedMedication.name).join(', ')}
            </Text>
            <Heading textAlign="left" size="md" marginTop="30px">
              What is {selectedMedication.name}?
            </Heading>
            <Text marginTop="10px">{medicationDescription}</Text>
            <Heading textAlign="left" size="md" marginTop="30px">
              Dosing information
            </Heading>
            <Text marginTop="10px">
            {dosingInformation}
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
}

export default LookupSearch;