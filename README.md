# My Dinner Planner

## Overview
My Dinner Planner is a mobile-friendly application designed for users to log in and view a weekly dinner plan. The app allows users to manage their dinner choices, see what food items are on hand, and provides a calendar view for easy navigation through the week.

## Features
- User authentication using Firebase
- Weekly dinner plan with the ability to add new dinner choices
- Display of food items currently available for cooking
- Calendar view for selecting days of the week
- User icons to indicate who added each dinner item

## Tech Stack
- Frontend: Next.js
- Mobile: Expo
- Authentication: Firebase

## Project Structure
```
my-dinner-planner
├── assets
│   └── images
│       └── user-icons
├── components
│   ├── Calendar.tsx
│   ├── DinnerItem.tsx
│   ├── FoodOnHand.tsx
│   └── Navbar.tsx
├── firebase
│   ├── auth.ts
│   └── firebaseConfig.ts
├── pages
│   ├── _app.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── dashboard.tsx
├── public
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-dinner-planner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project and add your web app.
   - Update the `firebase/firebaseConfig.ts` file with your Firebase configuration.

4. Run the application:
   ```
   npm run dev
   ```

5. Access the application in your browser at `http://localhost:3000`.

## Usage
- Users can log in using the login page.
- Once logged in, users can view the dashboard to see their weekly dinner plan and food on hand.
- Users can add new dinner choices, which will be displayed along with their user icon.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.# lilholtDinner
