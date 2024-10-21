export type Patient = {
  id: string;
  name: string;
  age: string;
  bloodType: string;
  surgeries: string;
  chronicConditions: string;
  previousIllnesses: string;
  currentMedications: string;
  previousMedications: string;
  drugAllergies: string;
  cardiovascularIssues: string;
  treatment: string;
  appointmentDate: string;
  appointmentTime: string;
};

export const patients: Patient[] = [
  {
    id: "P0001",
    name: "Minindu Pasan",
    age: "23",
    bloodType: "O+",
    surgeries: "None",
    chronicConditions: "Diabetes",
    previousIllnesses: "None",
    currentMedications: "For Blood Pressure",
    previousMedications: "None",
    drugAllergies: "Local Anaesthetic Allergy",
    cardiovascularIssues: "High blood pressure",
    treatment: "Orthodontic",
    appointmentDate: "2024-09-02",
    appointmentTime: "11:00 AM",
  },
  {
    id: "P0002",
    name: "Anjula Dabarera",
    age: "30",
    bloodType: "A+",
    surgeries: "Appendectomy",
    chronicConditions: "None",
    previousIllnesses: "Asthma",
    currentMedications: "None",
    previousMedications: "Inhaler",
    drugAllergies: "Penicillin",
    cardiovascularIssues: "None",
    treatment: "Root Canal",
    appointmentDate: "2024-09-03",
    appointmentTime: "09:00 AM",
  },
  // Add more patients as needed
];

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};
