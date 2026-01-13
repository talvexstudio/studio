# **App Name**: FlowLedger

## Core Features:

- Multi-user Authentication: Secure user authentication using Firebase Authentication, supporting email/password and Google sign-in, allowing multiple users to access the app.
- Workspace Management: Enable users to create and manage multiple workspaces, each isolated with its own settings and data (name, currency, etc.).
- Account Management: Allow users to add and manage multiple accounts (bank, credit card, etc.) within each workspace, including details like name, type, currency, and opening balance.
- Transaction Import: Enable users to import transactions from bank statements in CSV and XLSX formats. Supports configuration of import templates to handle different file formats.
- AI-Powered Transaction Classification: Automatically categorize transactions into predefined English categories using description patterns and amount ranges, leveraging a classification rule system that the user can expand and refine. Rules act as a tool for guiding categorization decisions.
- User Confirmation Workflow: Implement a review queue where users can confirm or correct the automatically classified transactions, ensuring data accuracy before inclusion in analytics and budgeting.
- Dashboard and Budgeting: Provide a dashboard with key financial indicators (income, expenses, savings rate) and visualizations, along with a budget generation feature based on historical data.

## Style Guidelines:

- Primary color: HSL(210, 60%, 50%) which is close to blue. Translated to HEX: #478FFF
- Background color: HSL(210, 20%, 95%) a desaturated, light shade of blue, almost white. Translated to HEX: #F0F4FF
- Accent color: HSL(180, 60%, 50%), a brighter color close to cyan, for action items. Translated to HEX: #47FFDA
- Body and headline font: 'Inter' (sans-serif) for a clean and modern look. 'Inter' will be used in both headlines and body text since there is not a lot of content expected to be displayed at once in paragraph form. No code font has been specified.
- Use minimalist icons to represent account types, transaction categories, and dashboard metrics.
- A clean, card-based layout that is responsive across devices, providing a clear separation of content and easy navigation.
- Subtle transitions and animations on user interactions, such as loading new transactions or confirming classifications.