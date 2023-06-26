import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  InputGroup,
  InputRightElement,
  Stack,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import MedAutoComplete from './MedAutoComplete';
import moment from 'moment';
import { auth, firestore } from '../../../firebase/firebase.js';
import firebase from 'firebase/compat/app';

function AddMed() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageUnit, setDosageUnit] = useState('mg');
  const [timesOfDay, setTimesOfDay] = useState([]);
  const [formErrors, setFormErrors] = useState({
    medName: '',
    dosage: '',
    timesOfDay: '',
  });

  const addTimeOfDay = () => {
    setTimesOfDay([...timesOfDay, '']);
  };

  const removeTimeOfDay = (index) => {
    const updatedTimesOfDay = timesOfDay.filter((_, i) => i !== index);
    setTimesOfDay(updatedTimesOfDay);
  };

  const handleTimeOfDayChange = (index, value) => {
    const updatedTimesOfDay = [...timesOfDay];

    // Check if `value` is a Moment object
    if (moment.isMoment(value)) {
      updatedTimesOfDay[index] = value.format('HH:mm');
    } else {
      updatedTimesOfDay[index] = value;
    }

    setTimesOfDay(updatedTimesOfDay);
  };

  const validateForm = () => {
    const errors = {
      medName: '',
      dosage: '',
      timesOfDay: '',
    };
    let isValid = true;

    if (medName.trim() === '') {
      errors.medName = 'Medication name is required';
      isValid = false;
    }

    if (dosage.trim() === '') {
      errors.dosage = 'Dosage is required';
      isValid = false;
    }

    if (timesOfDay.length === 0) {
      errors.timesOfDay = 'At least 1 time is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const user = auth.currentUser;
  
      if (user) {
        const userId = user.uid;
  
        const medicationsRef = firestore.collection(`users/${userId}/medications`);
  
        const medicationData = {
          medName,
          dosage,
          dosageUnit,
          timesOfDay,
          timeEvents: timesOfDay.length,
          selected: Array(timesOfDay.length).fill(0), // Initialize "selected" array with 0 values
        };
  
        medicationsRef
          .add(medicationData)
          .then((docRef) => {
            console.log('Medication stored in Firebase successfully');
  
            // Update the 'totalEvents' property in the user document
            firestore.collection('users').doc(userId).update({
              totalEvents: firebase.firestore.FieldValue.increment(timesOfDay.length),
            });
  
            onClose(); // Close the modal or perform any other necessary actions
          })
          .catch((error) => {
            console.error('Error storing medication in Firebase:', error);
          });
      } else {
        console.error('User not authenticated');
      }
    }
  };
  
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add a medication
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a medication</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={formErrors.medName !== ''} mb={4}>
              <FormLabel>Medication name</FormLabel>
              <MedAutoComplete value={medName} onChange={setMedName} />
              <FormErrorMessage>{formErrors.medName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formErrors.dosage !== ''} mb={4}>
              <FormLabel>Dosage</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
                <InputRightElement width="auto">
                  <Select value={dosageUnit} onChange={(e) => setDosageUnit(e.target.value)}>
                    <option value="mg">mg</option>
                    <option value="mL">mL</option>
                  </Select>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formErrors.dosage}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formErrors.timesOfDay !== ''} mb={4}>
              <FormLabel>Frequency</FormLabel>
              <Stack spacing={2}>
                {timesOfDay.map((time, index) => (
                  <HStack key={index}>
                    <Datetime
                      dateFormat={false}
                      inputProps={{
                        placeholder: 'HH : mm',
                      }}
                      onChange={(momentObj) =>
                        handleTimeOfDayChange(index, momentObj)
                      }
                      renderInput={(props) => <Input {...props} />}
                    />
                    <IconButton
                      aria-label="Remove time"
                      icon={<MinusIcon />}
                      onClick={() => removeTimeOfDay(index)}
                    />
                  </HStack>
                ))}
                <FormErrorMessage>{formErrors.timesOfDay}</FormErrorMessage>
                <IconButton
                  aria-label="Add time"
                  icon={<AddIcon />}
                  onClick={addTimeOfDay}
                />
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddMed;