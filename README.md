# Christoffel's Private Chef Experience

A React Native mobile application built with Expo that provides a complete restaurant management system for private chefs. The app features dual interfaces for both chefs and customers, enabling menu management, order placement, and order tracking.

## GitHub Repository link:
https://github.com/ST10477696-Hloniphani/ST10477696---MAST5112POE---Part-2-Adding-the-logic

## Youtube link:
https://youtu.be/7l1PHVBtnQQ?si=Zn6gHmH_7Tccnn9L

## Features

### 🍽️ Customer Features
- **Browse Menu**: View all available dishes with descriptions, prices, and course categories
- **Search & Filter**: Find dishes by name/description and filter by course type (Starters, Mains, Desserts, Beverages, Sides)
- **Order Management**: Add items to cart with quantity selection
- **Special Requests**: Add dietary requirements or special instructions
- **Real-time Cart**: Track selected items and total cost

### 👨‍🍳 Chef Features
- **Secure Authentication**: Login with email, password, and access code
- **Menu Management**: Add, edit, and delete menu items
- **Order Tracking**: View all customer orders with timestamps
- **Search & Filter**: Find and organize menu items efficiently
- **Dashboard**: Overview of total menu items and order statistics

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Components**: React Native built-in components
- **Picker**: @react-native-picker/picker
- **Animations**: React Native Animated API
- **State Management**: React Hooks (useState)

## Project Structure

```
part2/
├── App.tsx              # Main application component
├── package.json         # Dependencies and scripts
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
├── index.ts            # Entry point
└── assets/             # Images and icons
```


## Demo Credentials

For testing the chef interface, use these credentials:
- **Email**: chef@christoffel.com
- **Password**: chef123
- **Access Code**: 2024

## App Navigation

### Welcome Screen
- Entry point with options to browse menu (customer) or access chef dashboard
- Displays demo credentials for easy testing

### Customer Flow
1. **Menu Browser** → View all dishes with search/filter options
2. **Cart Management** → Add/remove items with quantities
3. **Order Placement** → Enter customer details and special requests
4. **Order Confirmation** → Success message and return to menu

### Chef Flow
1. **Authentication** → Secure login with credentials
2. **Dashboard** → Menu overview with search/filter capabilities
3. **Menu Management** → Add/edit/delete dishes
4. **Order Management** → View customer orders with details

## Key Components

### Data Models
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  customerName: string;
  quantity: number;
  specialRequests?: string;
  timestamp: Date;
}
```

### Screen Types
- `welcome` - Landing page
- `chef-login` - Authentication
- `chef-home` - Dashboard
- `chef-add` - Add menu item
- `chef-edit` - Edit menu item
- `chef-orders` - View orders
- `customer-menu` - Browse menu
- `customer-order` - Place order

## Features in Detail

### Form Validation
- Character limits for dish names (50) and descriptions (200)
- Price validation (numeric, positive values)
- Duplicate dish name prevention
- Required field validation

### User Experience
- Smooth animations and transitions
- Responsive design for different screen sizes
- Keyboard dismissal on tap outside
- Loading states and error handling
- Empty state messages

### Data Persistence
- In-memory storage (resets on app restart)
- Real-time updates across screens
- Order grouping by customer and timestamp


## Development Notes

- Uses React Native's built-in animations for smooth transitions
- Implements proper TypeScript typing throughout
- Follows React Native best practices for performance
- Responsive design considerations for various screen sizes
- Accessibility features with proper labels

## Future Enhancements

- Persistent data storage (AsyncStorage/Database)
- Push notifications for new orders
- Image upload for menu items
- Payment integration
- Multi-language support
- Order status tracking
- Chef-customer messaging
- Analytics dashboard


## Reference
- Nuxt UI, n.d. Navigation Menu. [online] Available at: https://ui.nuxt.com/docs/components/navigation-menu
 [Accessed 10 October 2025].

- Stack Overflow, 2021. Subtotal function calculation only working on second click. [online] Available at: https://stackoverflow.com/questions/67296082/subtotal-function-calculation-only-working-on-second-click
 [Accessed 10 October 2025].

- Stack Overflow, 2022. Why should I use the variant prop instead of className in React Bootstrap Button? [online] Available at: https://stackoverflow.com/questions/72090947/why-should-i-use-the-variant-prop-instead-of-classname-in-react-bootstrap-button
 [Accessed 19 October 2025].

- React, n.d. JSX In Depth. [online] Available at: https://legacy.reactjs.org/docs/jsx-in-depth.html
 [Accessed 18 October 2025].

-React, n.d. Context. [online] Available at: https://legacy.reactjs.org/docs/context.html
 [Accessed 12 October 2025].
 
-Hatica, 2023. Best Practices For An Eye Catching GitHub Readme. [online] Available at: https://www.hatica.io/blog/best-practices-for-github-readme/
 [Accessed 21 October 2025].
 
- Microsoft Q&A, 2022. How to use a List of Type Interface or List<IMenuItem>. [online] Available at: https://learn.microsoft.com/en-us/answers/questions/1118129/how-to-use-a-list-of-type-interface-or-list(imenui
 [Accessed 12 October 2025].

  
