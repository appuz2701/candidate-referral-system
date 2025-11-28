# Candidate Referral Backend

## Setup
1. Copy `.env` and set `MONGO_URI` (local MongoDB or Atlas), example:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/candidateDB

2. Install packages:
   npm install

3. Start server:
   npm run start
   // or during development:
   npm run dev

## Endpoints
- POST /candidates
  - multipart/form-data fields: name, email, phone, jobTitle, resume (file .pdf)
  - returns created candidate

- GET /candidates
  - returns array of candidates

- PUT /candidates/:id/status
  - JSON body: { status: "Reviewed" }
  - returns updated candidate

- DELETE /candidates/:id
  - deletes candidate and resume file

## Files served
Uploaded resumes are available at: http://<host>:<port>/uploads/<filename>
