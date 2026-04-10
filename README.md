# Smart Campus Operations Hub (IT3030 - PAF Assignment 2026)

## 📌 Project Overview
[cite_start]The **Smart Campus Operations Hub** is a comprehensive web platform designed for a university to modernize its day-to-day operations[cite: 18, 19]. The system facilitates:
* [cite_start]**Facility & Asset Bookings:** Managing rooms, labs, and equipment[cite: 19, 24].
* [cite_start]**Maintenance & Incident Handling:** Reporting faults and tracking technician resolutions[cite: 19, 38].
* [cite_start]**Workflow Management:** Role-based access and auditability for all campus operations[cite: 20].

## 🛠 Tech Stack
* [cite_start]**Backend:** Spring Boot (Java 21) [cite: 11, 16]
* [cite_start]**Frontend:** React.js [cite: 11, 17]
* [cite_start]**Database:** MySQL / PostgreSQL [cite: 71]
* [cite_start]**Security:** OAuth 2.0 (Google Sign-In) & Spring Security [cite: 48, 50]
* [cite_start]**CI/CD:** GitHub Actions [cite: 12, 62]

## 🚀 Features & Modules

### Module A: Facilities & Assets Catalogue
* [cite_start]Maintain a catalogue of resources like lecture halls and equipment[cite: 24].
* [cite_start]Metadata tracking (capacity, location, status)[cite: 25].
* [cite_start]Advanced search and filtering capabilities[cite: 26].

### Module B: Booking Management
* [cite_start]User booking requests with date, time, and purpose[cite: 28].
* [cite_start]Conflict prevention for overlapping schedules[cite: 35].
* [cite_start]Workflow: `PENDING` → `APPROVED` / `REJECTED` → `CANCELLED`[cite: 34].

### Module C: Maintenance & Incident Ticketing
* [cite_start]Incident reporting with up to 3 image attachments[cite: 39, 40].
* [cite_start]Technician assignment and resolution notes[cite: 42].
* [cite_start]Commenting system with ownership rules[cite: 43].

### Module D: Notifications
* [cite_start]Real-time web UI notifications for booking and ticket updates[cite: 46, 47].

## 👥 Team Contributions
| Member Name | Student ID | Implemented Module | Key Endpoints |
| :--- | :--- | :--- | :--- |
| **Member 1** | ITXXXXXXXX | Facilities Catalogue | [cite_start]GET, POST, PUT, DELETE `/api/facilities` [cite: 76] |
| **Member 2** | ITXXXXXXXX | Booking Workflow | [cite_start]GET, POST, PATCH, DELETE `/api/bookings` [cite: 77] |
| **Member 3** | ITXXXXXXXX | Incident Tickets | [cite_start]GET, POST, PUT, DELETE `/api/tickets` [cite: 78] |
| **Member 4** | ITXXXXXXXX | Notifications/OAuth | [cite_start]GET, POST, PATCH, DELETE `/api/notifications` [cite: 79] |

## ⚙️ Setup & Installation

### Backend Setup
1. [cite_start]Clone the repository[cite: 64].
2. Navigate to `/backend`.
3. Configure `application.properties` with your database credentials.
4. Run: `./mvnw spring-boot:run`

### Frontend Setup
1. Navigate to `/frontend`.
2. Run: `npm install`
3. Run: `npm start`

## 🧪 Testing
* [cite_start]**Unit/Integration Tests:** Run `mvn test` for backend verification[cite: 60, 62].
* [cite_start]**Postman:** API collection available in `/docs/postman`[cite: 60].

## 📝 Academic Integrity
[cite_start]This project is submitted for the IT3030 - Programming Applications and Frameworks module at SLIIT[cite: 1, 2]. [cite_start]All work is original and reflects individual contributions[cite: 94, 96].
