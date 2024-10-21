import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  medicalRecords: string;
  dob: string;
}

export default function CreatePatientPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    medicalRecords: "",
    dob: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/patients/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Patient created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          medicalRecords: "",
          dob: "",
        });
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(
        "Error submitting form: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger>
        <Button>Create New Patient</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit} className="p-4 w-80">
          <div className="space-y-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Medical Records"
              name="medicalRecords"
              value={formData.medicalRecords}
              onChange={handleChange}
              required
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <Button type="submit" color="primary" isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
