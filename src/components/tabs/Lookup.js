import React from 'react';
import { Heading } from '@chakra-ui/react';
import LookupSearch from './functions/LookupSearch.js';

function Lookup() {
  return (
    <>
      <Heading size="lg" marginBottom="50px" marginTop="10px" textAlign="center">
        Find Drugs & Medications
      </Heading>
      <LookupSearch/>
    </>
  );
}

export default Lookup;