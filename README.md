# Dental Clinic Management System - Dr. Preethi Gunsekara

Welcome to the **Dental Clinic Management System** designed for **Dental Clinic by Dr. Preethi Gunsekara**. This project aims to streamline the management of patient records, appointments, billing, and inventory for the clinic.

## Project Overview

This system provides a comprehensive solution to manage:
- **Patient Records**: Capture and maintain patient details and medical history.
- **Appointment Scheduling**: Schedule, view, and manage patient appointments with notifications.
- **Billing & Payments**: Generate invoices, track payments, and manage payment histories.
- **Inventory Management**: Monitor and manage dental supplies, with low-stock alerts.

## Technology Stack

- **Front-End**: [React](https://reactjs.org/)
- **Back-End**: [Spring Boot](https://spring.io/projects/spring-boot)
- **Database**: MySQL
- **Version Control**: GitHub

## Features

- **Patient Management**: Register new patients, update records, and view patient history.
- **Appointment Scheduling**: Book, reschedule, and cancel appointments; view calendar.
- **Billing**: Generate and manage invoices, track payments, and view payment history.
- **Inventory Tracking**: Track dental supply levels, receive low-stock alerts, and manage orders.

## User Tips for Key Features
  ### 1. Patient Management

  - **Patient Management**: Register new patients, update records, and view patient history.

  > [!NOTE]
  > Ensure that all required fields such as contact information, medical history, and insurance details are accurately filled when registering or updating patient records. This will help in providing better care and seamless follow-ups.

---

### 2. Appointment Scheduling

- **Appointment Scheduling**: Book, reschedule, and cancel appointments; view calendar.

> [!NOTE]
> Make use of the calendar view for efficient appointment scheduling. When rescheduling or canceling appointments, inform patients via email or SMS to avoid miscommunication. Double-check your schedule to prevent booking conflicts.

---

### 3. Billing

- **Billing**: Generate and manage invoices, track payments, and view payment history.

> [!NOTE]
> Ensure services and treatments are properly logged before generating invoices to avoid billing errors. Regularly review payment history to track outstanding payments and send reminders to patients if needed.

---

### 4. Inventory Tracking

- **Inventory Tracking**: Track dental supply levels, receive low-stock alerts, and manage orders.

> [!NOTE]
> Frequently update the inventory after each procedure to maintain accurate stock levels. Activate low-stock alerts to ensure that you are notified before running out of essential supplies, and process new orders promptly to avoid disruptions in service.

## Getting Started

To set up the project locally:

1. **Clone the repository:**
    ```
    git clone https://github.com/yourusername/dental-clinic-management-system.git
2.	Navigate to the project directory:
    ```
    cd dental-clinic-management-system
3.	Set up the back-end:
    - Navigate to the backend directory.
  	- Build and run the Spring Boot application.
    ```
    ./mvnw spring-boot:run
4.  Set up the front-end:
    - Navigate to the frontend directory.
    - Install dependencies and start the development server.
    ~~~
    npm install
    npm start
    ~~~
5.	Configure the database:
    - Update the database configuration in src/main/resources/application.properties.


## Branches:
- main: Contains stable, production-ready code.
- develop: Integration branch for ongoing development.
- feature/{feature-name}: Feature-specific branches.
- bugfix/{bug-name}: Branches for bug fixes.
- hotfix/{hotfix-name}: Branches for urgent fixes.
- release/{version-number}: Branches for preparing releases.

