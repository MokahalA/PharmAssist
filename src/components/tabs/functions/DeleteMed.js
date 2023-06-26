import { IconButton, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { firestore, auth } from '../../../firebase/firebase.js';

export default function DeleteMed({ id }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const user = auth.currentUser; // Get the currently logged-in user

  async function handleDelete() {
    setLoading(true);

    try {
      // Get the medication document from Firestore to obtain timeEvents
      const medicationRef = firestore.collection(`users/${user.uid}/medications`).doc(id);
      const medicationDoc = await medicationRef.get();
      const { timeEvents } = medicationDoc.data();

      // Delete the medication from the user's medications collection in Firestore
      await medicationRef.delete();

      // Decrement the totalEvents variable by timeEvents
      await firestore.runTransaction(async (transaction) => {
        const userDocRef = firestore.collection('users').doc(user.uid);
        const userDoc = await transaction.get(userDocRef);
        let totalEvents = userDoc.data().totalEvents;

        const newTotalEvents = totalEvents - timeEvents;

        // Set the totalEvents to 0 if it would become NaN
        const updatedTotalEvents = isNaN(newTotalEvents) ? 0 : newTotalEvents;

        // Update the totalEvents value in the transaction
        transaction.update(userDocRef, { totalEvents: updatedTotalEvents });
      });

      toast({
        title: 'Medication deleted!',
        position: 'top',
        status: 'warning',
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: 'An error occurred',
        description: 'Failed to delete medication',
        position: 'top',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <IconButton
      isRound="true"
      icon={<FiTrash2 />}
      onClick={handleDelete}
      isLoading={loading}
    />
  );
}