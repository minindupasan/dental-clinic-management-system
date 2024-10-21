"use client"

import React, { useState } from "react"
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react"
import { CirclePlus } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

type Patient = {
  id: string
  firstName: string
  lastName: string
  email: string
  gender: string
  medicalRecords: string
  dob: string
  isRegistered: boolean
}

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

export default function AddPatientButton({
  onPatientAdded,
}: {
  onPatientAdded: () => void
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    medicalRecords: "",
    dob: "",
    isRegistered: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPatient((prev) => ({
      ...prev,
      gender: e.target.value,
    }))
    setErrors((prev) => ({ ...prev, gender: "" }))
  }

  const handleIsRegisteredChange = (checked: boolean) => {
    setNewPatient((prev) => ({
      ...prev,
      isRegistered: checked,
    }))
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Patient, string>> = {}
    if (!newPatient.firstName.trim()) newErrors.firstName = "First name is required"
    if (!newPatient.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!newPatient.email.trim()) newErrors.email = "Email is required"
    if (!newPatient.gender) newErrors.gender = "Gender is required"
    if (!newPatient.dob) newErrors.dob = "Date of birth is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    const toastId = toast.loading("Adding new patient...")
    try {
      const response = await fetch(
        "http://localhost:8080/api/patients/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPatient),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          // 409 Conflict - usually means duplicate data
          toast.error("A patient with this email already exists", { id: toastId })
        } else {
          throw new Error(data.message || "Failed to add new patient")
        }
      } else {
        toast.success("New patient added successfully!", { id: toastId })
        setNewPatient({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          medicalRecords: "",
          dob: "",
          isRegistered: false,
        })
        onClose()
        onPatientAdded()
      }
    } catch (error) {
      console.error("Error adding new patient:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new patient. Please try again.",
        { id: toastId }
      )
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <Button
        className="bg-secondary-300"
        onPress={onOpen}
        radius="full"
        startContent={<CirclePlus />}
      >
        Add New Patient
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Add New Patient
              </ModalHeader>
              <ModalBody>
                <Input
                  label="First Name"
                  name="firstName"
                  value={newPatient.firstName}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={newPatient.lastName}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={[newPatient.gender]}
                  onChange={handleGenderChange}
                  required
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender}
                >
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Medical Records"
                  name="medicalRecords"
                  value={newPatient.medicalRecords}
                  onChange={handleInputChange}
                />
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={newPatient.dob}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.dob}
                  errorMessage={errors.dob}
                />
                <div className="flex items-center justify-between">
                  <span>Registered</span>
                  <Switch
                    isSelected={newPatient.isRegistered}
                    onValueChange={handleIsRegisteredChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Add Patient
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}