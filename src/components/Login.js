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
} from '@chakra-ui/react';
import { auth, firestore } from '../firebase/firebase';
import { validateEmail, validatePassword } from '../utils/validation';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    // Validate email and password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      try {
        // Sign in user with email and password
        await auth.signInWithEmailAndPassword(email, password);

        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const datesRef = firestore.collection(`users/${userId}/dates`);
          const docRef = datesRef.doc(currentDate);

          // Check if today's date document exists
          const docSnapshot = await docRef.get();
          if (!docSnapshot.exists) {
            // Create a new document for today's date
            await docRef.set({
              completed: 0,
              percentage: 0,
            });
          }

          // Get the number of selected medications with selected = 1
          const medicationsRef = firestore.collection(`users/${userId}/medications`);
          const medicationsSnapshot = await medicationsRef.where('selected', '==', 1).get();
          const selectedCount = medicationsSnapshot.size;

          // Get the total number of events from the user's data
          const userRef = firestore.collection('users').doc(userId);
          const userSnapshot = await userRef.get();
          const totalEvents = userSnapshot.data().totalEvents;

          // Calculate the completion percentage
          const completionPercentage = (selectedCount / totalEvents) * 100;

          // Get the dates collection and query for the latest date entry
          const datesQuerySnapshot = await datesRef.orderBy('timestamp', 'desc').limit(1).get();
          if (!datesQuerySnapshot.empty) {
            const latestDateEntry = datesQuerySnapshot.docs[0];
            const latestDateEntryRef = latestDateEntry.ref;

            // Update the latest date entry with the completion and percentage values
            await latestDateEntryRef.update({
              completed: selectedCount,
              percentage: completionPercentage,
            });
          }

          // Reset all selected properties for the user's medications to 0
          const batch = firestore.batch();
          medicationsSnapshot.forEach((doc) => {
            const docRef = medicationsRef.doc(doc.id);
            batch.update(docRef, { selected: 0 });
          });
          await batch.commit();
        }

        toast({
          title: 'Login Successful',
          description: 'You have been successfully logged in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error logging in:', error);

        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Stack spacing={4}>
      <Heading fontSize={'xl'} align="center" marginTop="5px" marginBottom="10px">
        Sign in to your account
      </Heading>
      <FormControl id="loginEmail" isInvalid={!isEmailValid}>
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="loginPassword" isInvalid={!isPasswordValid}>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Stack spacing={10}>
        <Button
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          marginTop="10px"
          onClick={handleLogin}
        >
          Sign in
        </Button>
      </Stack>
    </Stack>
  );
}

export default Login;