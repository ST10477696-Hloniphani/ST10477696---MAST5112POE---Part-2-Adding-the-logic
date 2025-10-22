# Christoffel's Private Chef Experience

A React Native mobile application built with Expo that provides a complete restaurant management system for private chefs. The app features dual interfaces for both chefs and customers, enabling menu management, order placement, and order tracking.

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

## Installation & Setup

1. **Prerequisites**
   - Node.js (v16 or higher)
   - Expo CLI: `npm install -g @expo/cli`
   - iOS Simulator (for iOS development)
   - Android Studio/Emulator (for Android development)

2. **Install Dependencies**
   ```bash
   cd part2
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Platforms**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
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

## Customization

### Course Categories
Modify the `courses` array to add/remove menu categories:
```typescript
const courses = ['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'];
```

### Styling
The app uses a warm, restaurant-themed color palette:
- Primary: `#8B7355` (Brown)
- Background: `#F5F5DC` (Beige)
- Text: `#2C2C2C` (Dark Gray)
- Accent: `#FF6B6B` (Red for orders)

### Authentication
Update `DEMO_CREDENTIALS` object to change login details:
```typescript
const DEMO_CREDENTIALS = {
  email: 'chef@christoffel.com',
  password: 'chef123',
  code: '2024'
};
```

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
