"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Chip,
  Input,
  Textarea,
  Switch,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import {
  HeartPulse,
  User,
  Droplet,
  Stethoscope,
  Pill,
  AlertTriangle,
  Phone,
  Edit,
  Save,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type MedicalHistory = {
  recordID: number;
  patientId: number;
  bloodType: string;
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  bleedingDisorders: boolean;
  osteoporosis: boolean;
  arthritis: boolean;
  asthma: boolean;
  epilepsy: boolean;
  hivAids: boolean;
  hepatitis: boolean;
  thyroidDisorder: boolean;
  pregnancy: boolean | null;
  surgeries: string;
  currentMedications: string;
  drugAllergies: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
};

interface MedicalHistoryButtonProps {
  patientId: number;
}

export default function MedicalHistoryButton({
  patientId,
}: MedicalHistoryButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newMedicalHistory, setNewMedicalHistory] = useState<
    Partial<MedicalHistory>
  >({
    bloodType: "B+",
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    bleedingDisorders: false,
    osteoporosis: false,
    arthritis: false,
    asthma: false,
    epilepsy: false,
    hivAids: false,
    hepatitis: false,
    thyroidDisorder: false,
    pregnancy: null,
    surgeries: "",
    currentMedications: "",
    drugAllergies: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  const fetchMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/${patientId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
    } catch (err) {
      setError("No medical history");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createNewMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/create/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMedicalHistory),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
      setIsEditing(false);
      onCreateClose();
      toast.success("New medical history created successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while creating new medical history: ${errorMessage}`
      );
      console.error("Error creating new medical history:", err);
      toast.error("Failed to create new medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!medicalHistory) {
        throw new Error("No medical history to update");
      }
      const updatePayload = {
        bloodType: medicalHistory.bloodType,
        diabetes: medicalHistory.diabetes,
        hypertension: medicalHistory.hypertension,
        heartDisease: medicalHistory.heartDisease,
        bleedingDisorders: medicalHistory.bleedingDisorders,
        osteoporosis: medicalHistory.osteoporosis,
        arthritis: medicalHistory.arthritis,
        asthma: medicalHistory.asthma,
        epilepsy: medicalHistory.epilepsy,
        hivAids: medicalHistory.hivAids,
        hepatitis: medicalHistory.hepatitis,
        thyroidDisorder: medicalHistory.thyroidDisorder,
        pregnancy: medicalHistory.pregnancy,
        surgeries: medicalHistory.surgeries,
        currentMedications: medicalHistory.currentMedications,
        drugAllergies: medicalHistory.drugAllergies,
        allergies: medicalHistory.allergies,
        medications: medicalHistory.medications,
        medicalConditions: medicalHistory.medicalConditions,
        emergencyContactName: medicalHistory.emergencyContactName,
        emergencyContactNumber: medicalHistory.emergencyContactNumber,
      };
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/update/${medicalHistory.recordID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
      setIsEditing(false);
      toast.success("Medical history updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while updating medical history: ${errorMessage}`
      );
      console.error("Error updating medical history:", err);
      toast.error("Failed to update medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    onOpen();
    fetchMedicalHistory();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMedicalHistory((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleNewInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewMedicalHistory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (isSelected: boolean) => {
    setMedicalHistory((prev) =>
      prev ? { ...prev, [name]: isSelected } : null
    );
  };

  const handleNewSwitchChange = (name: string) => (isSelected: boolean) => {
    setNewMedicalHistory((prev) => ({ ...prev, [name]: isSelected }));
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {content}
    </div>
  );

  const renderEditableField = (
    label: string,
    name: string,
    value: string,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void,
    type: "input" | "textarea" | "select" = "input"
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-400 mb-1"
      >
        {label}
      </label>
      {type === "select" ? (
        <Select
          id={name}
          name={name}
          selectedKeys={[value]}
          onChange={onChange}
          className="w-full"
        >
          <SelectItem key="A+" value="A+">
            A+
          </SelectItem>
          <SelectItem key="A-" value="A-">
            A-
          </SelectItem>
          <SelectItem key="B+" value="B+">
            B+
          </SelectItem>
          <SelectItem key="B-" value="B-">
            B-
          </SelectItem>
          <SelectItem key="AB+" value="AB+">
            AB+
          </SelectItem>
          <SelectItem key="AB-" value="AB-">
            AB-
          </SelectItem>
          <SelectItem key="O+" value="O+">
            O+
          </SelectItem>
          <SelectItem key="O-" value="O-">
            O-
          </SelectItem>
        </Select>
      ) : type === "input" ? (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full"
        />
      ) : (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full"
        />
      )}
    </div>
  );

  const renderEditableSwitches = (
    data: Partial<MedicalHistory>,
    onChange: (name: string) => (isSelected: boolean) => void
  ) => (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(data)
        .filter(([key, value]) => typeof value === "boolean")
        .map(([key, value]) => (
          <Switch
            key={key}
            isSelected={value as boolean}
            onValueChange={onChange(key)}
            size="sm"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Switch>
        ))}
    </div>
  );

  return (
    <>
      <Tooltip content="View Medical History">
        <Button
          color="secondary"
          variant="flat"
          onPress={handleOpen}
          startContent={<HeartPulse size={16} />}
          isIconOnly
        ></Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          header: "border-b border-divider",
          footer: "border-t border-divider",
          body: "p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Medical History</h2>
              </ModalHeader>
              <ModalBody>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning" />
                    <p className="text-lg font-semibold mb-4">{error}</p>
                    <Button
                      color="primary"
                      startContent={<Plus size={16} />}
                      onPress={onCreateOpen}
                    >
                      Create Medical History
                    </Button>
                  </div>
                ) : medicalHistory ? (
                  <div className="space-y-6">
                    {isEditing ? (
                      <>
                        {renderSection(
                          "Patient Information",
                          <User className="w-5 h-5" />,
                          <div className="grid grid-cols-2 gap-4">
                            {renderEditableField(
                              "Blood Type",
                              "bloodType",
                              medicalHistory.bloodType,
                              handleInputChange,
                              "select"
                            )}
                          </div>
                        )}
                        {renderSection(
                          "Medical Conditions",
                          <Stethoscope className="w-5 h-5" />,
                          renderEditableSwitches(
                            medicalHistory,
                            handleSwitchChange
                          )
                        )}
                        {renderSection(
                          "Additional Information",
                          <Pill className="w-5 h-5" />,
                          <>
                            {renderEditableField(
                              "Surgeries",
                              "surgeries",
                              medicalHistory.surgeries,
                              handleInputChange,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Current Medications",
                              "currentMedications",
                              medicalHistory.currentMedications,
                              handleInputChange,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Drug Allergies",
                              "drugAllergies",
                              medicalHistory.drugAllergies,
                              handleInputChange,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Allergies",
                              "allergies",
                              medicalHistory.allergies,
                              handleInputChange,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Medical Conditions",
                              "medicalConditions",
                              medicalHistory.medicalConditions,
                              handleInputChange,
                              "textarea"
                            )}
                          </>
                        )}
                        {renderSection(
                          "Emergency Contact",
                          <Phone className="w-5 h-5" />,
                          <>
                            {renderEditableField(
                              "Name",
                              "emergencyContactName",
                              medicalHistory.emergencyContactName,
                              handleInputChange
                            )}
                            {renderEditableField(
                              "Number",

                              "emergencyContactNumber",
                              medicalHistory.emergencyContactNumber,
                              handleInputChange
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {renderSection(
                          "Patient Information",
                          <User className="w-5 h-5" />,
                          <div className="grid grid-cols-2 gap-2">
                            <p>
                              <span className="font-medium">Patient ID:</span>{" "}
                              {medicalHistory.patientId}
                            </p>
                            <p className="flex gap-2">
                              <Droplet className="w-5 h-5" />
                              <span className="font-medium">
                                Blood Type:
                              </span>{" "}
                              <Chip color="danger" variant="flat">
                                {medicalHistory.bloodType}
                              </Chip>
                            </p>
                          </div>
                        )}
                        {renderSection(
                          "Medical Conditions",
                          <Stethoscope className="w-5 h-5" />,
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(medicalHistory)
                              .filter(
                                ([key, value]) =>
                                  typeof value === "boolean" && value === true
                              )
                              .map(([key]) => (
                                <Chip key={key} color="warning" variant="flat">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Chip>
                              ))}
                          </div>
                        )}
                        {renderSection(
                          "Additional Information",
                          <Pill className="w-5 h-5" />,
                          <div className="grid gap-2">
                            <p>
                              <span className="font-medium">Surgeries:</span>{" "}
                              {medicalHistory.surgeries}
                            </p>
                            <p>
                              <span className="font-medium">
                                Current Medications:
                              </span>{" "}
                              {medicalHistory.currentMedications}
                            </p>
                            <p>
                              <span className="font-medium">
                                Drug Allergies:
                              </span>{" "}
                              {medicalHistory.drugAllergies}
                            </p>
                            <p>
                              <span className="font-medium">Allergies:</span>{" "}
                              {medicalHistory.allergies}
                            </p>
                            <p>
                              <span className="font-medium">
                                Medical Conditions:
                              </span>{" "}
                              {medicalHistory.medicalConditions}
                            </p>
                          </div>
                        )}
                        {renderSection(
                          "Emergency Contact",
                          <Phone className="w-5 h-5" />,
                          <div className="grid gap-2">
                            <p>
                              <span className="font-medium">Name:</span>{" "}
                              {medicalHistory.emergencyContactName}
                            </p>
                            <p>
                              <span className="font-medium">Number:</span>{" "}
                              {medicalHistory.emergencyContactNumber}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                {medicalHistory &&
                  (isEditing ? (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={updateMedicalHistory}
                      startContent={<Save size={16} />}
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => setIsEditing(true)}
                      startContent={<Edit size={16} />}
                    >
                      Edit Medical History
                    </Button>
                  ))}
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        size="lg"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          header: "border-b border-divider",
          footer: "border-t border-divider",
          body: "p-6",
        }}
      >
        <ModalContent>
          {(onCreateClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">
                  Create New Medical History
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {renderSection(
                    "Patient Information",
                    <User className="w-5 h-5" />,
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField(
                        "Blood Type",
                        "bloodType",
                        newMedicalHistory.bloodType || "",
                        handleNewInputChange,
                        "select"
                      )}
                    </div>
                  )}
                  {renderSection(
                    "Medical Conditions",
                    <Stethoscope className="w-5 h-5" />,
                    renderEditableSwitches(
                      newMedicalHistory,
                      handleNewSwitchChange
                    )
                  )}
                  {renderSection(
                    "Additional Information",
                    <Pill className="w-5 h-5" />,
                    <>
                      {renderEditableField(
                        "Surgeries",
                        "surgeries",
                        newMedicalHistory.surgeries || "",
                        handleNewInputChange,
                        "textarea"
                      )}
                      {renderEditableField(
                        "Current Medications",
                        "currentMedications",
                        newMedicalHistory.currentMedications || "",
                        handleNewInputChange,
                        "textarea"
                      )}
                      {renderEditableField(
                        "Drug Allergies",
                        "drugAllergies",
                        newMedicalHistory.drugAllergies || "",
                        handleNewInputChange,
                        "textarea"
                      )}
                      {renderEditableField(
                        "Allergies",
                        "allergies",
                        newMedicalHistory.allergies || "",
                        handleNewInputChange,
                        "textarea"
                      )}
                      {renderEditableField(
                        "Medical Conditions",
                        "medicalConditions",
                        newMedicalHistory.medicalConditions || "",
                        handleNewInputChange,
                        "textarea"
                      )}
                    </>
                  )}
                  {renderSection(
                    "Emergency Contact",
                    <Phone className="w-5 h-5" />,
                    <>
                      {renderEditableField(
                        "Name",
                        "emergencyContactName",
                        newMedicalHistory.emergencyContactName || "",
                        handleNewInputChange
                      )}
                      {renderEditableField(
                        "Number",
                        "emergencyContactNumber",
                        newMedicalHistory.emergencyContactNumber || "",
                        handleNewInputChange
                      )}
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={createNewMedicalHistory}
                  startContent={<Save size={16} />}
                >
                  Create Medical History
                </Button>
                <Button color="danger" variant="flat" onPress={onCreateClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
