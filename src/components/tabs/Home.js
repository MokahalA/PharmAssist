import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Box, Card, CardBody, Flex, Text, Heading } from '@chakra-ui/react';
import { firestore, auth } from '../../firebase/firebase.js';
import liquid from '../../images/liquid.svg';
import pill from '../../images/pill.svg';
import MedAlert from './functions/MedAlert';

function MedicationCard({ medicationName, dosage, time }) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const medicationsRef = firestore.collection(`users/${userId}/medications`);
      const query = medicationsRef.where('timesOfDay', 'array-contains', time);

      const unsubscribe = query.onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          const selected = doc.data().selected || [];
          const timeIndex = doc.data().timesOfDay.indexOf(time);
          if (timeIndex > -1) {
            setIsChecked(selected[timeIndex] === 1);
          } else {
            setIsChecked(false);
          }
        });
      });

      return () => unsubscribe();
    }
  }, [time]);

  const handleCardClick = async () => {
    setIsChecked(!isChecked);
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const medicationsRef = firestore.collection(`users/${userId}/medications`);
        const query = medicationsRef.where('timesOfDay', 'array-contains', time);
        const snapshot = await query.get();

        snapshot.forEach((doc) => {
          const selected = doc.data().selected || [];
          const timeIndex = doc.data().timesOfDay.indexOf(time);

          if (timeIndex > -1) {
            selected[timeIndex] = !isChecked ? 1 : 0;
            doc.ref.update({ selected });
          }
        });
      }
    } catch (error) {
      console.log('Error updating medication selection:', error);
    }
  };

  const getDosageIcon = () => {
    if (dosage.includes('mL')) {
      return <img src={liquid} alt="Liquid" width="32" height="32" />;
    } else if (dosage.includes('mg')) {
      return <img src={pill} alt="Pill" width="32" height="32" />;
    }
    return null;
  };

  const convertTimeToAMPM = (time) => {
    if (time) {
      const [hours, minutes] = time.split(':');
      const parsedHours = parseInt(hours);
      const suffix = parsedHours >= 12 ? 'PM' : 'AM';
      const displayHours = parsedHours > 12 ? parsedHours - 12 : parsedHours;
      return `${displayHours}:${minutes} ${suffix}`;
    }
    return '';
  };

  return (
    <Card
      boxShadow="md"
      p={2}
      borderRadius="md"
      onClick={handleCardClick}
      opacity={isChecked ? 0.5 : 1}
      cursor="pointer"
      marginBottom={2}
      width="60%"
      margin="auto"
      marginTop={3}
    >
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            {getDosageIcon() && (
              <Box marginRight={6} marginTop={1}>
                {getDosageIcon()}
              </Box>
            )}
            <Box>
              <Text fontWeight="bold" fontSize="md" mb={1}>
                {medicationName}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={1}>
                {dosage}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {convertTimeToAMPM(time)}
              </Text>
            </Box>
          </Flex>
          {isChecked && <FaCheck color="green" fontSize="24px" />}
        </Flex>
      </CardBody>
    </Card>
  );
}

function Home() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const medicationsRef = firestore.collection(`users/${userId}/medications`);
          const snapshot = await medicationsRef.get();
          const fetchedMedications = snapshot.docs.map((doc) => doc.data());

          const medicationData = fetchedMedications.flatMap((medication) => {
            return medication.timesOfDay.map((time) => ({
              medicationName: medication.medName,
              dosage: `${medication.dosage} ${medication.dosageUnit}`,
              time: time,
            }));
          });

          const sortedMedications = medicationData.sort((a, b) => {
            const timeA = a.time.split(':').join('');
            const timeB = b.time.split(':').join('');
            return timeA.localeCompare(timeB);
          });

          setMedications(sortedMedications);
        }
      } catch (error) {
        console.log('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Box p="2">
        <Heading marginBottom="20px" size="lg" marginLeft="5px">
          Today's reminders
        </Heading>
        <Text fontSize="md" color="#605e5c" fontWeight="200" padding={2}>
          {currentDate}
        </Text>
      </Box>

      <Box p={4}>
        {loading ? (
          <Text>Loading medications...</Text>
        ) : medications.length > 0 ? (
          medications.map((medication, index) => (
            <MedicationCard
              key={`${medication.medicationName}-${index}`}
              medicationName={medication.medicationName}
              dosage={medication.dosage}
              time={medication.time}
            />
          ))
        ) : (
          <MedAlert />
        )}
      </Box>
    </>
  );
}

export default Home;