# LOGIN 2K26 Technical Documentation

This directory contains system architecture diagrams, database design schemas, API specifications, and operational guides for **LOGIN 2K26: "The Last Human Standing"**.

## Document Index
- System Architecture Overview (Pending implementation phase)
- Database ERD & Data Models (Pending Prisma schema expansion)
- API Specs & Postman Collections (Pending controller creation)
- Deployment & CI/CD Guides (Pending production environment provisioning)

I need you to provide me with the following changes, improvements and feature additions in the existing code.

3 user roles - admin, event and registration coordinators, participants

Admin: 
1. Create user accounts - event coordinators based on event details, roles
2. view registration details - participants and alumni
3. payment status of participants
4. verify participant payment status

Event Coordinators:
1. View event registrations for their events
2. Mark attendance during the time of events
3. Registration coordinators can view overall registration 

Payment Checking Flow:
1. CSV flow downloaded from payment portal
2. Uploaded in login portal - it should match with payment verification requests and verify it
3. done by admin and registration coordinators
4. Match transaction id from csv and verify it
5. Verification could be done manually too

Participants:
1. Upload bonafied and payment receipt/screenshot - it should be stored in server
2. First unverified then under review then verified
3. unverified - payment done transaction id not uploaded
4. under review - transaction id submitted
5. verified - checked by admin and registration coords if both transaction ids match
6. can register only when under review and verified
7. Participant id (unique ID) generated - using which teams will be matched


login based on the user id or email id. userid as the loginid generated for participants. and admin and coordinators with the based on the register number of the university.

also change the ui accordingly. all the sections in the left. arranged. change only the functionalities in the project.