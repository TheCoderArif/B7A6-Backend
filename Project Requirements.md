# Project Requirements — Housing & Roommate Management Platform

## 1. Overview

Housing & Roommate Management Platform connects property owners, property managers, tenants, and roommates in one platform for discovering properties, finding suitable rooms and roommates, requesting property viewings, applying for rentals, and managing tenancy after approval.

A property owner or manager can create properties, add buildings, flats, and rooms, define availability, and manage rental applications. Tenants can search available properties and rooms based on their requirements, create roommate profiles, find compatible roommates, request property viewings, submit rental applications, and track their tenancy.

The platform also handles rent tracking, utility bill splitting, maintenance requests, rental documents, and notifications.

Admins oversee the platform, manage users and listings, handle verification, and moderate activities.

This document defines what the system must do and the business rules it must follow. It is a product specification, not a database schema or API design.

---

# 2. User Roles

Five roles exist:

* **Admin**
* **Property Owner**
* **Property Manager**
* **Tenant**
* **Roommate**

| Role                 | How they join                                           | Main responsibility                                          |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| **Admin**            | Created/managed by the platform                         | Manage users, listings, verification and platform activities |
| **Property Owner**   | Registers directly                                      | Creates and manages properties and rental units              |
| **Property Manager** | Invited/assigned by an owner                            | Manages properties, rooms, tenants and rental operations     |
| **Tenant**           | Registers directly                                      | Searches properties, applies for rooms and manages tenancy   |
| **Roommate**         | Registers as a tenant/user and creates roommate profile | Finds compatible roommates and shared housing opportunities  |

A user may act as a tenant while also maintaining a roommate profile.

---

# 3. User Permissions

## 3.1 Admin

Admin can:

* Manage users
* Block or unblock users
* Verify property owners
* Verify property managers
* Verify properties
* Moderate property listings
* Remove inappropriate listings
* Manage reported users
* Manage reported properties
* View rental/application activities
* Monitor platform transactions
* Manage categories and system settings

---

## 3.2 Property Owner

A Property Owner can:

* Create properties
* Update property information
* Add buildings
* Add flats
* Add rooms
* Set room prices
* Set room availability
* Upload property images
* Manage property amenities
* View viewing requests
* Approve or reject viewing requests
* View rental applications
* Approve or reject applications
* Assign property managers
* View tenants
* Track rent
* View utility bills
* Manage maintenance requests
* Upload rental documents

---

## 3.3 Property Manager

A Property Manager can manage properties assigned to them by an owner.

They can:

* Manage assigned properties
* Add and update rooms
* Update room availability
* Manage viewing requests
* Manage applications
* Manage tenants
* Track rent payments
* Manage utility bills
* Handle maintenance requests
* Upload rental documents
* Send notifications

A Property Manager cannot transfer ownership of a property or assign another owner.

---

## 3.4 Tenant

A Tenant can:

* Create and manage their profile
* Search properties
* Search available rooms
* Filter properties based on requirements
* View property details
* View room details
* Create a roommate profile
* Set roommate preferences
* Search for compatible roommates
* Request property viewings
* Submit rental applications
* Track application status
* View approved rental information
* Track rent payments
* View utility bills
* Split utility bills with roommates
* Submit maintenance requests
* View rental documents
* Receive notifications

---

# 4. Authentication and Accounts

## 4.1 Registration

Property Owners and Tenants can register directly using:

* Name
* Email
* Password
* Phone number

Additional profile information can be completed after registration.

Property Managers may be created through an invitation from a Property Owner.

Admins are managed by the platform and cannot freely register themselves as Admin.

---

## 4.2 Email Verification

Users who register using email/password must verify their email address before accessing protected platform features.

An OTP is sent to the user's registered email address.

The OTP should:

* Expire after a limited period
* Be usable only once
* Be invalid after successful verification
* Support resend functionality with rate limiting

---

## 4.3 Login

Users log in using:

* Email
* Password

After successful login, the system issues authentication tokens/session information.

Users can only access features allowed by their role.

---

## 4.4 Forgot Password

The password recovery flow is:

1. User submits their email.
2. System sends an OTP.
3. User submits the OTP.
4. System verifies the OTP.
5. User creates a new password.
6. System updates the password.

---

## 4.5 Change Password

A logged-in user can change their password by submitting:

* Current password
* New password

The current password must be verified before the new password is accepted.

---

# 5. Property Management

## 5.1 Create Property

A Property Owner can create a property with information such as:

* Property name
* Property type
* Address
* Description
* Images
* Amenities
* Rules
* Contact information
* Location
* Number of buildings
* Availability

A newly created property may initially remain unpublished until the owner completes all required information.

---

## 5.2 Property Types

The platform may support:

* Apartment
* Flat
* House
* Shared house
* Hostel
* Dormitory
* Studio
* Other supported housing types

---

## 5.3 Property Structure

A property can contain:

```text
Property
   │
   ├── Building
   │      │
   │      ├── Flat
   │      │      ├── Room
   │      │      └── Room
   │      │
   │      └── Flat
   │             └── Room
   │
   └── Building
          └── Flat
                 └── Room
```

Depending on the property type, some levels may not be required.

---

# 6. Building, Flat and Room Management

## 6.1 Buildings

A property owner or manager can add buildings to a property.

A building may contain:

* Building name/number
* Address information
* Number of floors
* Description
* Amenities

---

## 6.2 Flats

A building can contain multiple flats.

A flat may contain:

* Flat number
* Floor
* Number of bedrooms
* Number of bathrooms
* Kitchen information
* Living room information
* Amenities
* Monthly rent
* Available rooms

---

## 6.3 Rooms

Rooms are the primary rental units for roommate-based housing.

A room may contain:

* Room number/name
* Description
* Images
* Price
* Room type
* Capacity
* Current occupants
* Availability
* Furnishing status
* Amenities

Example:

```text
Flat 4A
   │
   ├── Room A → Available
   ├── Room B → Occupied
   └── Room C → Available
```

---

# 7. Room Availability

Room availability must always represent the actual occupancy state.

Possible statuses include:

* **AVAILABLE**
* **PARTIALLY_OCCUPIED**
* **OCCUPIED**
* **UNAVAILABLE**
* **MAINTENANCE**

Availability should be updated automatically when an application is approved or a tenant leaves.

A room cannot be offered to a new tenant if its available capacity has already been reached.

---

# 8. Property Listing

Owners and managers can publish properties for tenants to discover.

A listing can contain:

* Property information
* Room information
* Rent
* Location
* Images
* Amenities
* Rules
* Availability
* Preferred tenant requirements
* Contact/viewing information

A property should not appear in public search if it is:

* Unpublished
* Removed
* Suspended
* Fully unavailable

---

# 9. Tenant Property Search

Tenants can search properties and rooms using filters such as:

* Location
* Price range
* Room type
* Property type
* Number of bedrooms
* Furnished/unfurnished
* Amenities
* Availability
* Gender preference where applicable
* Pet policy
* Smoking policy

Search results should only include properties and rooms that are currently available for rental.

---

# 10. Roommate Profiles

A tenant can create a separate roommate profile.

The profile may contain:

* Age range
* Occupation
* Lifestyle information
* Preferred location
* Budget
* Move-in date
* Preferred room type
* Smoking preference
* Pet preference
* Sleep schedule
* Cleanliness preference
* Social preference
* Other roommate preferences

The tenant controls whether their roommate profile is publicly discoverable.

---

# 11. Roommate Matching

The system matches tenants based on compatible preferences.

Matching factors may include:

* Preferred location
* Budget
* Move-in date
* Room type
* Lifestyle
* Smoking preference
* Pet preference
* Sleep schedule
* Cleanliness preference
* Social preferences

The platform should calculate a compatibility score.

Example:

```text
Tenant A
   │
   ├── Budget ✓
   ├── Location ✓
   ├── Move-in date ✓
   ├── Lifestyle ✓
   └── Smoking preference ✓
             │
             ▼
      90% Compatible
             │
             ▼
          Tenant B
```

The matching score is a recommendation and does not automatically create a tenancy or roommate relationship.

---

# 12. Viewing Requests

A Tenant can request to view an available property or room.

The request contains:

* Property/room
* Requested date
* Requested time
* Message
* Tenant information

The owner or manager can:

* Approve the request
* Reject the request
* Suggest another time
* Cancel the viewing

Possible statuses:

```text
PENDING
   │
   ├── APPROVED
   │
   ├── REJECTED
   │
   └── CANCELLED
```

The tenant receives a notification whenever the viewing status changes.

---

# 13. Rental Application

After finding a suitable property or room, a tenant can submit a rental application.

The application may contain:

* Personal information
* Employment information
* Income information
* Preferred move-in date
* Rental history
* Number of occupants
* References
* Additional notes
* Required verification documents

The tenant cannot submit multiple active applications for the same room unless the existing application has been rejected or cancelled.

---

# 14. Tenant Verification

Property owners or managers may require tenant verification before approving an application.

Verification may include:

* Email verification
* Phone verification
* Identity verification
* Employment information
* Income information
* References

The platform should track the verification status separately from the application status.

---

# 15. Application Workflow

The application follows this workflow:

```text
Tenant
   │
   ▼
Submit Application
   │
   ▼
Pending
   │
   ├── Rejected
   │
   └── Approved
          │
          ▼
      Tenant Assigned
          │
          ▼
       Occupancy
```

Possible application statuses:

* **PENDING**
* **UNDER_REVIEW**
* **APPROVED**
* **REJECTED**
* **CANCELLED**

Only the property owner or authorized property manager can approve an application.

---

# 16. Approval and Occupancy

When an application is approved:

1. The system verifies that the room still has available capacity.
2. The tenant is assigned to the room.
3. Room occupancy is updated.
4. Room availability is recalculated.
5. The rental agreement/document can be generated.
6. The tenant receives an approval notification.

The occupancy update must be **transaction-safe**.

Two applications for the final available room/capacity must not both be approved successfully.

Example:

```text
Room capacity = 2

Current occupants = 1
Available capacity = 1

Application A → Approved
Application B → Must be rejected/blocked
```

This is one of the major backend challenges of the platform.

---

# 17. Rental Agreement and Documents

The platform can store rental-related documents such as:

* Rental agreement
* Tenant verification documents
* Property documents
* Payment receipts
* Utility bills
* Notices
* Other rental documents

Documents should be accessible only to authorized users.

Tenants can view their own rental documents.

Owners and managers can access documents related to properties they manage.

---

# 18. Rent Tracking

The platform should allow owners/managers to track tenant rent.

Each rent record may contain:

* Tenant
* Property
* Room
* Amount
* Due date
* Payment date
* Payment method
* Transaction/reference ID
* Status

Possible statuses:

* **PENDING**
* **PAID**
* **OVERDUE**
* **FAILED**

Example:

```text
Monthly Rent: $600
Due Date: 1st of the month
Paid: $600
Status: PAID
```

The platform can notify tenants before and after rent due dates.

---

# 19. Utility Bill Splitting

Utility expenses can be shared between roommates.

Supported utility types may include:

* Electricity
* Water
* Gas
* Internet
* Heating
* Other utilities

Example:

```text
Electricity Bill = $120
Roommates = 3

Tenant A → $40
Tenant B → $40
Tenant C → $40
```

The system should calculate each tenant's share according to the selected splitting method.

Possible methods:

* Equal split
* Custom percentage
* Custom amount
* Occupancy-based split

The total assigned amount must equal the original bill amount.

---

# 20. Maintenance Requests

Tenants can submit maintenance requests for problems inside their rented property.

A request may include:

* Title
* Description
* Property
* Room
* Images
* Priority
* Submitted date

Possible statuses:

```text
OPEN
  │
  ▼
IN_PROGRESS
  │
  ▼
RESOLVED
```

The owner or property manager can update the maintenance status.

Tenants receive notifications when the request status changes.

---

# 21. Notifications

The system sends notifications for important events.

Examples include:

* Account verification
* Viewing request received
* Viewing request approved
* Viewing request rejected
* Application submitted
* Application approved
* Application rejected
* Rent due
* Rent payment received
* Utility bill created
* Maintenance request updated
* New rental document
* Roommate match
* Property updates

Notifications may be delivered through:

* In-app notifications
* Email
* Other supported notification channels

---

# 22. Dashboard

## 22.1 Owner Dashboard

The Owner Dashboard should show:

* Total properties
* Total buildings
* Total flats
* Total rooms
* Available rooms
* Occupied rooms
* Pending applications
* Upcoming viewings
* Rent summary
* Outstanding rent
* Maintenance requests

---

## 22.2 Property Manager Dashboard

The Property Manager Dashboard should show information only for properties assigned to that manager.

It can include:

* Managed properties
* Available rooms
* Occupied rooms
* Pending applications
* Viewing requests
* Rent status
* Maintenance requests
* Tenant information

---

## 22.3 Tenant Dashboard

The Tenant Dashboard should show:

* Current rental
* Property information
* Room information
* Rent status
* Utility bills
* Maintenance requests
* Rental documents
* Upcoming viewings
* Applications
* Roommate matches
* Notifications

---

## 22.4 Admin Dashboard

The Admin Dashboard should show:

* Total users
* Property owners
* Property managers
* Tenants
* Total properties
* Active listings
* Pending verifications
* Applications
* Reported listings/users
* Platform activity

---

# 23. User and Property Reports

Users can report:

* Inappropriate properties
* Fraudulent listings
* Fake profiles
* Suspicious users
* Incorrect property information

Admins can review reports and take action.

Possible actions:

* Ignore report
* Warn user
* Remove listing
* Suspend listing
* Block user

---

# 24. Permission Management

Every protected operation must verify both:

1. **Authentication**
2. **Authorization**

Example:

```text
Owner A
   │
   ├── Property A ✓ Can manage
   │
   └── Property B ✗ Cannot manage
```

A Property Manager can only manage properties assigned to them.

A Tenant can only access their own applications, rental information, bills, maintenance requests and documents.

An Owner cannot modify another owner's property.

Admins have platform-level management permissions.

---

# 25. Important Business Rules

### Property Rules

* Only authorized owners/managers can modify a property.
* A property must contain required information before publication.
* Unavailable properties should not appear as available listings.
* Deleted/suspended properties cannot accept new applications.

### Room Rules

* A room cannot exceed its maximum occupancy.
* Room availability must reflect current occupancy.
* A room under maintenance cannot accept a new tenant.
* A fully occupied room cannot receive a new approved application.

### Application Rules

* Only available rooms can accept applications.
* An application must belong to an authenticated tenant.
* An owner/manager can only manage applications for their properties.
* Approval must verify current room capacity.
* Occupancy updates must happen atomically.

### Viewing Rules

* A tenant can request a viewing for an available property/room.
* Viewing requests belong to a specific property/room.
* Only the owner/assigned manager can approve or reject the request.

### Rent Rules

* Rent records belong to a specific tenant and rental.
* Paid rent cannot be accidentally recorded twice.
* Overdue rent should be identifiable automatically.

### Utility Rules

* Utility bill splits must add up to the original bill.
* Tenants should only see bills applicable to their rental/room.
* Owners/managers can manage bills for their properties.

---

# 26. Core System Workflow

The complete platform workflow is:

```text
Owner
   │
   ▼
Create Property
   │
   ▼
Add Buildings / Flats / Rooms
   │
   ▼
Set Room Availability
   │
   ▼
Publish Property
   │
   ▼
Tenant Searches
   │
   ├───────────────┐
   │               │
   ▼               ▼
Property Match   Roommate Match
   │               │
   └───────┬───────┘
           ▼
     Request Viewing
           │
           ▼
         Viewing
           │
           ▼
       Application
           │
           ▼
        Verification
           │
           ▼
         Approval
           │
           ▼
     Occupancy Update
           │
           ▼
          Tenant
           │
     ┌─────┼───────────┐
     ▼     ▼           ▼
    Rent  Utilities  Maintenance
     │     │           │
     └─────┴───────────┘
           │
           ▼
       Notifications
```

---

# 27. Conceptual Data Models

The database design is not finalized yet. The following describes the main information the system needs to store.

### User

* Name
* Email
* Password
* Phone
* Role
* Account status
* Email verification status
* Created/updated timestamps

### Owner Profile

* User
* Personal information
* Verification information

### Manager Profile

* User
* Assigned properties
* Management information

### Tenant Profile

* User
* Personal information
* Employment information
* Rental history
* Verification information

### Roommate Profile

* Tenant/User
* Budget
* Location preference
* Move-in preference
* Lifestyle preferences
* Room preferences
* Compatibility information

### Property

* Owner
* Property name
* Type
* Address
* Location
* Description
* Images
* Amenities
* Rules
* Status

### Building

* Property
* Name/number
* Floors
* Description

### Flat

* Building
* Flat number
* Floor
* Bedrooms
* Bathrooms
* Amenities

### Room

* Flat
* Room number
* Price
* Capacity
* Occupancy
* Availability
* Status
* Amenities

### Viewing Request

* Tenant
* Property/Room
* Requested date/time
* Message
* Status

### Rental Application

* Tenant
* Property/Room
* Application information
* Verification status
* Application status
* Submitted date

### Rental

* Tenant
* Property
* Room
* Start date
* End date
* Rent amount
* Status

### Rent Payment

* Rental
* Tenant
* Amount
* Due date
* Paid date
* Payment method
* Transaction ID
* Status

### Utility Bill

* Property/Room
* Utility type
* Total amount
* Billing period
* Due date
* Status

### Utility Split

* Utility bill
* Tenant
* Assigned amount
* Payment status

### Maintenance Request

* Tenant
* Property
* Room
* Title
* Description
* Images
* Priority
* Status

### Rental Document

* Rental
* Document type
* File
* Uploaded by
* Created date

### Notification

* Recipient
* Title
* Message
* Type
* Read status
* Created date

---

# 28. Backend Challenges

The major backend challenges include:

### 28.1 Room Availability

The system must always maintain accurate room capacity and occupancy.

### 28.2 Transaction-Safe Occupancy Updates

When two users apply for the final available room at the same time, only one application should be able to consume the available capacity.

### 28.3 Roommate Matching

The matching system must compare multiple user preferences and produce meaningful compatibility results.

### 28.4 Application Workflow

Applications must move through valid states and prevent unauthorized status changes.

### 28.5 Rent and Bill Calculations

The backend must accurately calculate:

* Rent
* Outstanding amounts
* Utility shares
* Payment totals
* Overdue amounts

### 28.6 Permission Management

Every property-related operation must verify ownership or management assignment.

### 28.7 Concurrent Requests

The system must safely handle simultaneous:

* Applications
* Room bookings
* Occupancy updates
* Payments
* Utility payments

### 28.8 Document Security

Rental and verification documents must not be publicly accessible.

### 28.9 Notifications

Important events should trigger notifications without creating duplicate messages.

---

# 29. Recommended Status Flow

## Property

```text
DRAFT → PUBLISHED → SUSPENDED
                   ↓
                ARCHIVED
```

## Room

```text
AVAILABLE
    ↓
PARTIALLY_OCCUPIED
    ↓
OCCUPIED
```

A room may also become:

```text
MAINTENANCE
UNAVAILABLE
```

## Viewing

```text
PENDING → APPROVED
        → REJECTED
        → CANCELLED
```

## Application

```text
PENDING
   ↓
UNDER_REVIEW
   ↓
APPROVED / REJECTED / CANCELLED
```

## Rental

```text
ACTIVE → COMPLETED
       → TERMINATED
       → CANCELLED
```

## Maintenance

```text
OPEN → IN_PROGRESS → RESOLVED
```

---

# 30. Final Product Goal

The goal of the platform is to provide an end-to-end housing management system where:

**Owners** can publish and manage properties.

**Property Managers** can operate assigned properties.

**Tenants** can discover rooms, request viewings, apply for rentals, and manage their tenancy.

**Roommates** can discover compatible people and shared housing opportunities.

**Admins** can keep the platform secure, verified, and properly moderated.

The system should provide a reliable workflow from:

```text
Property Creation
       ↓
Room Management
       ↓
Availability
       ↓
Search
       ↓
Roommate Matching
       ↓
Viewing
       ↓
Application
       ↓
Verification
       ↓
Approval
       ↓
Occupancy
       ↓
Rent / Utilities
       ↓
Maintenance
       ↓
Rental Management
```

The most important backend requirements are **accurate room availability, transaction-safe occupancy management, secure role-based permissions, reliable application workflows, roommate matching, and correct rent/utility calculations**.
