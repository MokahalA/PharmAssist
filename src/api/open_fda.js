export async function fetchMedicationInfo(drugName) {
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.substance_name:${drugName}&limit=1`
      );
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const medication = data.results[0];
        const description = medication.description || '';
        let dosages = medication.dosage_and_administration || [];
  
        // Cut the dosages down by half
        dosages = dosages.slice(0, Math.ceil(dosages.length / 2));
  
        return {
          description,
          dosages,
        };
      } else {
        console.error('No medication data found for', drugName);
      }
    } catch (error) {
      console.error('Error fetching medication information:', error);
    }
    return null;
  }