import { Input, Box, UnorderedList, ListItem } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import medicationData from '../../../data/medications.json';

function MedAutoComplete({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [matchedTerms, setMatchedTerms] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);

    if (inputValue.trim() === '') {
      setMatchedTerms([]);
      return;
    }

    // Filter the medicationData based on the input value in both names and brandNames
    const filteredTerms = medicationData.medications.filter((medication) =>
      medication.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      medication.brandNames.some((brandName) =>
        brandName.toLowerCase().includes(inputValue.toLowerCase())
      )
    );

    // Limit the matched terms to a maximum of 5 results
    const limitedTerms = filteredTerms.slice(0, 5);

    setMatchedTerms(limitedTerms);

    // Pass the value to the parent component
    onChange(inputValue);
  };

  const handleItemClick = (medication) => {
    setSearchTerm(medication.name);
    setMatchedTerms([]);

    // Pass the value to the parent component
    onChange(medication.name);
  };


  return (
    <>
      <Input
        placeholder="Enter a drug name"
        value={searchTerm}
        onChange={handleInputChange}
      />

      {matchedTerms.length > 0 && (
        <Box mt={2}>
          <UnorderedList listStyleType="none" p={0}>
            {matchedTerms.map((medication, index) => (
              <ListItem
                key={index}
                cursor="pointer"
                _hover={{ boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.3s' }}
                onClick={() => handleItemClick(medication)}
                p={2}
                bg="white"
                borderRadius="md"
                mb={2} // Add margin bottom between list elements
              >
                <SearchIcon color="blue.500" mr={2} />
                {medication.brandNames[0]} ({medication.name})
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </>
  );
}

export default MedAutoComplete;