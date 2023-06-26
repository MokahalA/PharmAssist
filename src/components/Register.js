import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  Heading,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { auth, firestore } from '../firebase/firebase.js'; // Import auth and firestore from firebase.js
import { validateEmail, validatePassword } from '../utils/validation.js'; // Import validation functions

function Register() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isFirstNameValid, setFirstNameValid] = useState(true);
  const [isLastNameValid, setLastNameValid] = useState(true);
  const [isRegisterClicked, setRegisterClicked] = useState(false);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleRegister = async () => {
    setRegisterClicked(true);

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isFirstNameValid = firstName.trim() !== '';
    const isLastNameValid = lastName.trim() !== '';

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);
    setFirstNameValid(isFirstNameValid);
    setLastNameValid(isLastNameValid);

    if (isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid) {
      try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Get the newly created user's UID
        const userId = userCredential.user.uid;

        // Store the first, last name, totalEvents in Firestore
        await firestore.collection('users').doc(userId).set({
          firstName,
          lastName,
          totalEvents: 0,
        });

        // Add "analytics/data" collection and first document with today's date
        const analyticsCollectionRef = firestore.collection('users').doc(userId).collection('dates');
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });


        const analyticsDocRef = analyticsCollectionRef.doc(currentDate);
        await analyticsDocRef.set({
          completed: 0,
          percentage: 0,
        });

        // Sign in the user
        await auth.signInWithEmailAndPassword(email, password);

        toast({
          title: 'Account Created',
          description: 'Your account has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error registering user:', error);
        toast({
          title: 'Registration Failed',
          description: 'There was an error creating your account. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <Stack spacing={4}>
      <Heading fontSize={'xl'} align="center" marginTop="5px" marginBottom="10px">
        Create an account
      </Heading>
      <FormControl id="firstName" isInvalid={!isFirstNameValid}>
        <FormLabel>First name</FormLabel>
        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </FormControl>
      <FormControl id="lastName" isInvalid={!isLastNameValid}>
        <FormLabel>Last name</FormLabel>
        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </FormControl>
      <FormControl id="email" isInvalid={!isEmailValid}>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isEmailValid && <FormErrorMessage>Email should be in a valid format.</FormErrorMessage>}
      </FormControl>
      <FormControl id="password" isInvalid={!isPasswordValid}>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input pr="4.5rem" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        {!isPasswordValid && <FormErrorMessage>Password must be at least 6 characters long.</FormErrorMessage>}
      </FormControl>
      <Stack spacing={10}>
        <Button
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          marginTop="10px"
          onClick={handleRegister}
          disabled={isRegisterClicked}
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
}

export default Register;