# Short System Design Summary

| Item | Description |
|---|---|
| **System name** | Student Record Management System |
| **Purpose** | Store and manage basic student information in a cloud database. |
| **Users** | Registrar or school staff (and the instructor during demonstration). |
| **Input** | Student ID, Full Name, Program, Year Level, Email (entered via form). |
| **Process** | Validate form fields → Create (insert), Read (select all), Update (modify by id), Delete (remove by id after confirmation) → refresh the table. |
| **Output** | Table of all student records; success or error messages. |
| **Database used** | Supabase (PostgreSQL), table `students`. |

## Flow
User fills form → Save → app sends request to Supabase → record stored → table reloads from the database → Edit loads a row back into the form → Delete asks for confirmation, then removes the row.
