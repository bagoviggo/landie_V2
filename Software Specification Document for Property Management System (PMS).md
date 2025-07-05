\---

\# Software Specification Document for Property Management System (PMS)

\#\# 1\. Introduction

\#\#\# 1.1 Purpose  
The purpose of this document is to outline the specifications for a Property Management System (PMS) designed for landlords. The system will facilitate property management tasks, including tenant management, lease tracking, maintenance requests, and financial reporting.

\#\#\# 1.2 Scope  
This document covers the functional and non-functional requirements, system architecture, user roles, APIs, data models, user stories, and the technology stack used in the development of the PMS.

\#\#\# 1.3 Audience  
This document is intended for developers, project managers, stakeholders, and any other parties involved in the development and deployment of the PMS.

\#\# 2\. System Overview

\#\#\# 2.1 System Architecture  
The PMS will be built using a client-server architecture with the following components:  
\- \*\*Frontend\*\*: Next.js for server-side rendering and static site generation.  
\- \*\*Backend\*\*: Node.js with Express for API development.  
\- \*\*Database\*\*: MongoDB for data storage.  
\- \*\*Authentication\*\*: NextAuth for user authentication and session management.

\#\#\# 2.2 User Roles  
\- \*\*Landlord\*\*: Can manage properties, tenants, leases, and view reports.  
\- \*\*Tenant\*\*: Can view their lease details, submit maintenance requests, and make payments.  
\- \*\*Admin\*\*: Can manage users, properties, and oversee the entire system.

\#\# 3\. Functional Requirements

\#\#\# 3.1 User Authentication  
\- Users must be able to register and log in using email and password.  
\- Passwords must be securely hashed and stored.  
\- Users should be able to reset their passwords.

\#\#\# 3.2 Property Management  
\- Landlords can add, edit, and delete properties.  
\- Each property should have details such as address, type, size, and rental price.

\#\#\# 3.3 Tenant Management  
\- Landlords can add, edit, and remove tenants associated with their properties.  
\- Tenants should have profiles that include contact information and lease details.

\#\#\# 3.4 Lease Management  
\- Landlords can create and manage leases for each property.  
\- Leases should include start and end dates, rental amount, and payment frequency.

\#\#\# 3.5 Maintenance Requests  
\- Tenants can submit maintenance requests for their rented properties.  
\- Landlords can view and manage these requests, marking them as completed when resolved.

\#\#\# 3.6 Financial Reporting  
\- Landlords can view financial reports, including income from rents and expenses related to property maintenance.

\#\# 4\. APIs and Methods

\#\#\# 4.1 API Routes

\- \*\*/api/properties\*\*  
  \- \*\*GET\*\*: Returns a list of properties based on the specified search criteria, such as location, price range, and property type.  
  \- \*\*POST\*\*: Allows the creation of a new property listing with the provided details.

\- \*\*/api/property/{id}\*\*  
  \- \*\*GET\*\*: Retrieves the details of a specific property based on its unique identifier (id).

\- \*\*/api/users\*\*  
  \- \*\*GET\*\*: Returns the user's information based on their session or authentication token.  
  \- \*\*POST\*\*: Allows the creation of a new user account with the provided details.

\- \*\*/api/user/{id}\*\*  
  \- \*\*GET\*\*: Retrieves the details of a specific user based on their unique identifier (id).

\- \*\*/api/bookmarks\*\*  
  \- \*\*GET\*\*: Retrieves a list of bookmarked properties for the authenticated user.  
  \- \*\*POST\*\*: Adds a property to the user's bookmarked properties list.  
  \- \*\*DELETE\*\*: Removes a property from the user's bookmarked properties list.

\- \*\*/api/reviews\*\*  
  \- \*\*GET\*\*: Retrieves a list of reviews for a specific property.  
  \- \*\*POST\*\*: Allows users to submit a new review for a property.

\- \*\*/api/search\*\*  
  \- \*\*POST\*\*: Performs a search based on the provided search criteria and returns the matching properties.

\#\#\# 4.2 API Endpoints

\- \*\*getPropertiesByLocation(location)\*\*  
  \- Retrieves a list of properties based on the specified location.  
  \- \*\*Parameters\*\*: location \- The desired location for property search.

\- \*\*getPropertyDetails(propertyId)\*\*  
  \- Retrieves the details of a specific property based on its unique identifier (propertyId).  
  \- \*\*Parameters\*\*: propertyId \- The unique identifier of the property.

\- \*\*getUserProfile(userId)\*\*  
  \- Retrieves the profile information of a specific user based on their unique identifier (userId).  
  \- \*\*Parameters\*\*: userId \- The unique identifier of the user.

\#\#\# 4.3 Third-Party APIs  
\- \*\*Google Maps API\*\*: Used for displaying maps, geocoding addresses, and providing location-related services.

\#\# 5\. Data Models

\#\#\# 5.1 User Model  
\`\`\`json  
{  
  "userId": "string", // Unique identifier for the user  
  "email": "string", // User's email address  
  "passwordHash": "string", // Hashed password  
  "role": "string", // User role (landlord, tenant, admin)  
  "createdAt": "date", // Account creation date  
  "updatedAt": "date" // Last update date  
}  
\`\`\`

\#\#\# 5.2 Property Model  
\`\`\`json  
{  
  "propertyId": "string", // Unique identifier for the property  
  "title": "string", // Title of the property listing  
  "description": "string", // Detailed description of the property  
  "location": {  
    "address": "string", // Full address  
    "latitude": "number", // Latitude for mapping  
    "longitude": "number" // Longitude for mapping  
  },  
  "price": "number", // Rental price  
  "type": "string", // Type of property (e.g., apartment, house)  
  "size": "number", // Size of the property in square meters  
  "amenities": \["string"\], // List of amenities  
  "images": \["string"\], // Array of image URLs  
  "createdAt": "date", // Date the property was listed  
  "updatedAt": "date" // Last update date  
}  
\`\`\`

\#\#\# 5.3 Lease Model  
\`\`\`json  
{  
  "leaseId": "string", // Unique identifier for the lease  
  "propertyId": "string", // Reference to the associated property  
  "tenantId": "string", // Reference to the tenant  
  "startDate": "date", // Lease start date  
  "endDate": "date", // Lease end date  
  "monthlyRent": "number", // Monthly rental amount  
  "paymentFrequency": "string", // Frequency of payments (e.g., monthly)  
  "createdAt": "date", // Date the lease was created  
  "updatedAt": "date" // Last update date  
}  
\`\`\`

\#\#\# 5.4 Maintenance Request Model  
\`\`\`json  
{  
  "requestId": "string", // Unique identifier for the maintenance request  
  "propertyId": "string", // Reference to the associated property  
  "tenantId": "string", // Reference to the tenant making the request  
  "description": "string", // Description of the maintenance issue  
  "status": "string", // Status of the request (e.g., pending, completed)  
  "createdAt": "date", // Date the request was created  
  "updatedAt": "date" // Last update date  
}  
\`\`\`

\#\#\# 5.5 Review Model  
\`\`\`json  
{  
  "reviewId": "string", // Unique identifier for the review  
  "propertyId": "string", // Reference to the associated property  
  "userId": "string", // Reference to the user who submitted the review  
  "rating": "number", // Rating given by the user (1-5)  
  "comment": "string", // Review comment  
  "createdAt": "date" // Date the review was created  
}  
\`\`\`

\#\# 6\. User Stories

1\. \*\*As a user\*\*, I navigate to the Kejani website.  
2\. I am greeted with a user-friendly interface that allows me to easily search for properties.  
3\. I see a search bar where I can enter the location, type of property (e.g., studio, house, apartment), and other criteria.  
4\. After entering my search parameters, I click the "Search" button.  
5\. Kejani sends a request to the back-end server.  
6\. The server processes my request and retrieves relevant property listings from the database.  
7\. The listings are displayed on the screen, showing key details such as price, location, and property type.  
8\. I can browse through the listings, view photos, and read additional information about each property.  
9\. If I find a property I'm interested in, I can click on it to view more details, such as videos/images of the property, amenities, and contact information for the seller/agent or the caretaker.  
10\. I have the option to save properties to my favorites or create a shortlist for comparison.  
11\. Kejani may also provide personalized recommendations based on my search history and preferences.  
12\. If I decide to contact the seller or agent, I can use the provided contact information or submit an inquiry through the platform.  
13\. Throughout my search, Kejani provides a smooth and seamless experience, with quick loading times and intuitive navigation.  
14\. Once I have found my dream home, I can take additional actions, such as scheduling a viewing or making an offer