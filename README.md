This project implements a complete Candidate Referral Management System using the MERN stack. The User Page allows users to refer a candidate by submitting their basic details and uploading a resume in PDF format. The form includes validation for email, phone number, and file type.									

The Admin Page displays a dashboard of all referred candidates fetched from the backend. It includes search and filter options based on job title and status, and allows the admin to update the candidate’s status to Pending, Reviewed, or Hired. The admin also has the option to delete a candidate.
 
 The backend is built with Node.js and Express, using MongoDB as the database. It includes four main API endpoints: POST /candidates, GET /candidates, PUT /candidates/:id/status, and DELETE /candidates/:id. The backend handles validations, file uploads, and error responses.

Steps to run project Locally

Clone the Repository

git clone https://github.com/appuz2701/candidate-referral-system

cd candidate-referral-system


	Setup Backend
	cd backend
	npm install


	Create a .env file inside the backend folder:
	MONGO_URI=your_mongodb_connection_string
	PORT=5000


	Start Backend
	cd backend
	node server.js

	Backend will run on:
	http://localhost:5000

	Setup Frontend
	Open a new terminal:
	cd frontend
	npm install
	npm start

	Frontend will run on:
	http://localhost:3000
