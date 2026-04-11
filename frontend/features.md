# Admin Dashboard Features

This document outlines the essential features for the admin dashboard of the ThirdEye platform, designed to support the public-facing MVP.

## 1. Core Administration & Overview

This is the admin's landing page, providing a high-level snapshot of the platform's health and activity.

*   **Key Metrics Dashboard**: At-a-glance cards showing:
    *   **New User Reports:** Number of new "SatyaTathya" reports submitted today/this week.
    *   **Pending Contracts:** Contracts that need verification before being made public.
    *   **Delayed Projects:** A count of all projects currently flagged as 'Delayed'.
    *   **New Users:** Growth in the citizen user base.
*   **Moderation Queue**: An actionable list of items needing immediate attention, such as newly submitted corruption reports or flagged user feedback.
*   **Recent Activity Feed**: A live log of significant actions on the platform (e.g., "New R0M 10 Crore contract awarded to 'Nepal Construction Inc.'", "Project 'Highway 79' status changed to 'Delayed'").

## 2. Transparency & Project Tracking Management

This section is for managing the core data shown to the public.

*   **Contract Management (Bolpatra)**:
    *   **CRUD Interface**: A full Create, Read, Update, Delete interface for all tenders and contracts.
    *   **Verification Workflow**: A system to verify and approve new contracts before they are published. Admins should be able to upload and attach relevant documents.
    *   **Contractor Database**: Manage the profiles of all contracting companies, view their history, and see their performance ratings.
*   **Project Management (Bikas Ko Naksha)**:
    *   **Interactive Map Editor**: An admin version of the GIS map where you can **add new projects by clicking on the map**, edit their GPS coordinates, and update their status (e.g., changing a pin from 'On Track' to 'Delayed').
    *   **Project Details Editor**: A form to update a project's completion percentage, budget allocation (raw materials, labor, etc.), and roadmap details.
*   **Budget Management (Arthatantra)**:
    *   **Budget Category Manager**: A settings area to define and manage the standardized budget categories (e.g., "Raw Materials", "Labor Costs") used in the visual breakdowns. This ensures consistency across all projects.

## 3. Accountability & Feedback Management

This is where you handle the citizen-provided data to ensure its integrity and generate insights.

*   **Corruption Report Inbox (SatyaTathya)**:
    *   **Secure & Confidential Viewer**: A dedicated, secure interface to read submitted reports. The UI should be built to protect the whistleblower's anonymity at all costs.
    *   **Case Management System**: Admins should be able to:
        *   Assign a status to each report ('New', 'Under Investigation', 'Escalated', 'Resolved').
        *   Categorize reports (e.g., 'Financial', 'Procedural').
        *   Add internal notes for collaboration with other admins.
*   **Ratings & Scorecard Moderation**:
    *   **Review Queue**: A place to review incoming citizen ratings and feedback for both contractors and government offices.
    *   **Content Moderation**: The ability to remove spam, abusive language, or off-topic comments to maintain the quality of the platform.
    *   **Efficiency Scorecard Configuration**: Manage the list of government offices and set the target processing times for tasks, which are used as benchmarks.

## 4. General Platform Administration

Standard but critical features for running the application.

*   **User Management**:
    *   A table of all registered citizen users with search and filter capabilities.
    *   The ability to view a user's activity, suspend their account, or remove them from the platform if they violate community guidelines.
*   **Admin & Role Management**:
    *   If you have multiple team members, you need the ability to create new admin accounts and assign roles with different permission levels (e.g., a 'Moderator' might only be able to handle feedback, while a 'Super Admin' can manage contracts).
