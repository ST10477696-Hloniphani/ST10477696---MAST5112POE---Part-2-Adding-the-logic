import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

type Screen = 'welcome' | 'chef-login' | 'chef-home' | 'chef-add' | 'chef-edit' | 'chef-orders' | 'customer-menu' | 'customer-order';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  // Demo credentials (shown in app)
  const DEMO_CREDENTIALS = {
    email: 'chef@christoffel.com',
    password: 'chef123',
    code: '2024'
  };
  
  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Starters');
  const [price, setPrice] = useState('');
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Customer state
  const [customerName, setCustomerName] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerFilterCourse, setCustomerFilterCourse] = useState('All');
  const [showCustomerFilterPicker, setShowCustomerFilterPicker] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<{[key: string]: number}>({});
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Chef search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  const courses = ['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'];
  const filterCourses = ['All', ...courses];

  // Character limits
  const MAX_DISH_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  // Course images (using emojis for demo)
  const courseImages = {
    'Starters': '🥗',
    'Mains': '🍽️',
    'Desserts': '🍰',
    'Beverages': '🥤',
    'Sides': '🍟'
  };

  const navigateToScreen = (screen: Screen) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    setCurrentScreen(screen);
  };

  const authenticateChef = () => {
    if (email === DEMO_CREDENTIALS.email && 
        password === DEMO_CREDENTIALS.password && 
        code === DEMO_CREDENTIALS.code) {
      resetAuthForm();
      navigateToScreen('chef-home');
    } else {
      Alert.alert('Authentication Failed', 'Please check your credentials and try again.');
    }
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setCode('');
  };

  const validateForm = (isEdit: boolean = false): boolean => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (dishName.length > MAX_DISH_NAME_LENGTH) {
      Alert.alert('Error', `Dish name must be ${MAX_DISH_NAME_LENGTH} characters or less`);
      return false;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Error', `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`);
      return false;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    const duplicateExists = menuItems.some(item => 
      item.name.toLowerCase() === dishName.trim().toLowerCase() && 
      (!isEdit || item.id !== editingItem?.id)
    );

    if (duplicateExists) {
      Alert.alert('Error', 'This dish name already exists. Please choose a different name.');
      return false;
    }

    return true;
  };

  const addMenuItem = () => {
    if (!validateForm()) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: price.trim(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuItems(prev => [...prev, newItem]);
      
      resetForm();
      slideAnim.setValue(0);
      navigateToScreen('chef-home');
      
      Alert.alert('Success', 'Menu item added successfully!');
    });
  };

  const editMenuItem = () => {
    if (!validateForm(true) || !editingItem) return;

    const updatedItem: MenuItem = {
      ...editingItem,
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: price.trim(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));

    resetForm();
    setEditingItem(null);
    navigateToScreen('chef-home');
    
    Alert.alert('Success', 'Menu item updated successfully!');
  };

  const deleteMenuItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setDishName(item.name);
    setDescription(item.description);
    setSelectedCourse(item.course);
    setPrice(item.price);
    navigateToScreen('chef-edit');
  };

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setSelectedCourse('Starters');
    setPrice('');
  };

  const getFilteredMenuItems = (isCustomer: boolean = false): MenuItem[] => {
    let filtered = menuItems;
    const query = isCustomer ? customerSearchQuery : searchQuery;
    const filter = isCustomer ? customerFilterCourse : filterCourse;

    if (query.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filter !== 'All') {
      filtered = filtered.filter(item => item.course === filter);
    }

    return filtered;
  };

  const updateOrderQuantity = (itemId: string, quantity: number) => {
    setSelectedOrderItems(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const submitOrder = () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const orderItemsArray = Object.entries(selectedOrderItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        id: Date.now().toString() + Math.random(),
        menuItemId: itemId,
        customerName: customerName.trim(),
        quantity,
        specialRequests: specialRequests.trim() || undefined,
        timestamp: new Date()
      }));

    if (orderItemsArray.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    setOrders(prev => [...prev, ...orderItemsArray]);
    setSelectedOrderItems({});
    setCustomerName('');
    setSpecialRequests('');
    
    Alert.alert('Order Placed!', 'Your order has been sent to the chef. Thank you!');
    navigateToScreen('customer-menu');
  };

  const getTotalOrderItems = () => {
    return Object.values(selectedOrderItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getOrderTotal = () => {
    return Object.entries(selectedOrderItems)
      .reduce((total, [itemId, quantity]) => {
        const item = menuItems.find(m => m.id === itemId);
        return total + (item ? parseFloat(item.price) * quantity : 0);
      }, 0)
      .toFixed(2);
  };

  // Welcome Screen
  const renderWelcomeScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>👨‍🍳 Christoffel's</Text>
        <Text style={styles.welcomeSubtitle}>Private Chef Experience</Text>
        <Text style={styles.welcomeDescription}>
          Welcome to our exclusive culinary journey. Choose your experience below.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.welcomeButton, styles.customerButton]}
            onPress={() => navigateToScreen('customer-menu')}
            accessible={true}
            accessibilityLabel="Browse menu as customer"
          >
            <Text style={styles.customerButtonText}>🍽️ Browse Menu</Text>
            <Text style={styles.buttonSubtext}>View our culinary offerings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.welcomeButton, styles.chefButton]}
            onPress={() => navigateToScreen('chef-login')}
            accessible={true}
            accessibilityLabel="Chef login"
          >
            <Text style={styles.chefButtonText}>👨‍🍳 Chef Access</Text>
            <Text style={styles.buttonSubtext}>Manage menu & orders</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>Demo Chef Credentials:</Text>
          <Text style={styles.demoText}>Email: {DEMO_CREDENTIALS.email}</Text>
          <Text style={styles.demoText}>Password: {DEMO_CREDENTIALS.password}</Text>
          <Text style={styles.demoText}>Code: {DEMO_CREDENTIALS.code}</Text>
        </View>
      </View>
    </Animated.View>
  );

  // Chef Login Screen
  const renderChefLoginScreen = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToScreen('welcome')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chef Login</Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Welcome Back, Chef!</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#8B8B8B"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8B8B8B"
              secureTextEntry
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Access Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="Enter access code"
              placeholderTextColor="#8B8B8B"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={authenticateChef}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: {DEMO_CREDENTIALS.email}</Text>
            <Text style={styles.demoText}>Password: {DEMO_CREDENTIALS.password}</Text>
            <Text style={styles.demoText}>Code: {DEMO_CREDENTIALS.code}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  // Chef Home Screen
  const renderChefHomeScreen = () => {
    const filteredItems = getFilteredMenuItems();

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToScreen('welcome')}
          >
            <Text style={styles.backButtonText}>← Logout</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chef Dashboard</Text>
          <TouchableOpacity
            style={styles.ordersButton}
            onPress={() => navigateToScreen('chef-orders')}
          >
            <Text style={styles.ordersButtonText}>Orders ({orders.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search dishes..."
            placeholderTextColor="#8B8B8B"
            returnKeyType="search"
          />
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterPicker(true)}
          >
            <Text style={styles.filterButtonText}>
              {filterCourse === 'All' ? 'All Courses' : filterCourse}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statsCard, { transform: [{ scale: fadeAnim }] }]}>
            <Text style={styles.statsNumber}>{filteredItems.length}</Text>
            <Text style={styles.statsLabel}>
              {searchQuery || filterCourse !== 'All' ? 'Filtered Items' : 'Total Menu Items'}
            </Text>
          </Animated.View>
        </View>

        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {menuItems.length === 0 ? 'No menu items yet' : 'No items match your search'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {menuItems.length === 0 ? 'Add your first dish to get started' : 'Try adjusting your search or filter'}
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <Animated.View key={item.id} style={styles.menuCard}>
                <TouchableOpacity
                  onPress={() => startEditItem(item)}
                  style={styles.menuCardContent}
                >
                  <View style={styles.menuCardHeader}>
                    <View style={styles.courseImageContainer}>
                      <Text style={styles.courseImage}>{courseImages[item.course as keyof typeof courseImages]}</Text>
                    </View>
                    <View style={styles.menuCardInfo}>
                      <Text style={styles.dishName}>{item.name}</Text>
                      <Text style={styles.course}>{item.course}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <Text style={styles.price}>R{item.price}</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteMenuItem(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigateToScreen('chef-add')}
        >
          <Text style={styles.addButtonText}>+ Add New Dish</Text>
        </TouchableOpacity>

        {/* Filter Modal */}
        <Modal visible={showFilterPicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter by Course</Text>
                <TouchableOpacity onPress={() => setShowFilterPicker(false)}>
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={filterCourse}
                onValueChange={(itemValue) => setFilterCourse(itemValue)}
                style={styles.picker}
              >
                {filterCourses.map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </Animated.View>
    );
  };

  // Customer Menu Screen
  const renderCustomerMenuScreen = () => {
    const filteredItems = getFilteredMenuItems(true);
    const totalItems = getTotalOrderItems();

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToScreen('welcome')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Our Menu</Text>
          {totalItems > 0 && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigateToScreen('customer-order')}
            >
              <Text style={styles.cartButtonText}>Cart ({totalItems})</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            value={customerSearchQuery}
            onChangeText={setCustomerSearchQuery}
            placeholder="Search dishes..."
            placeholderTextColor="#8B8B8B"
            returnKeyType="search"
          />
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCustomerFilterPicker(true)}
          >
            <Text style={styles.filterButtonText}>
              {customerFilterCourse === 'All' ? 'All Courses' : customerFilterCourse}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes available</Text>
              <Text style={styles.emptyStateSubtext}>Please check back later</Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.customerMenuCard}>
                <View style={styles.courseImageContainer}>
                  <Text style={styles.courseImageLarge}>{courseImages[item.course as keyof typeof courseImages]}</Text>
                </View>
                <View style={styles.customerMenuInfo}>
                  <View style={styles.customerMenuHeader}>
                    <Text style={styles.customerDishName}>{item.name}</Text>
                    <Text style={styles.customerPrice}>R{item.price}</Text>
                  </View>
                  <Text style={styles.customerCourse}>{item.course}</Text>
                  <Text style={styles.customerDescription}>{item.description}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateOrderQuantity(item.id, Math.max(0, (selectedOrderItems[item.id] || 0) - 1))}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{selectedOrderItems[item.id] || 0}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateOrderQuantity(item.id, (selectedOrderItems[item.id] || 0) + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {totalItems > 0 && (
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => navigateToScreen('customer-order')}
          >
            <Text style={styles.proceedButtonText}>
              Proceed to Order ({totalItems} items)
            </Text>
          </TouchableOpacity>
        )}

        {/* Customer Filter Modal */}
        <Modal visible={showCustomerFilterPicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter by Course</Text>
                <TouchableOpacity onPress={() => setShowCustomerFilterPicker(false)}>
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={customerFilterCourse}
                onValueChange={(itemValue) => setCustomerFilterCourse(itemValue)}
                style={styles.picker}
              >
                {filterCourses.map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </Animated.View>
    );
  };

  // Customer Order Screen
  const renderCustomerOrderScreen = () => {
    const orderItems = Object.entries(selectedOrderItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        item: menuItems.find(m => m.id === itemId)!,
        quantity
      }));

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigateToScreen('customer-menu')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Your Order</Text>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter your name"
                placeholderTextColor="#8B8B8B"
                returnKeyType="next"
              />
            </View>

            <Text style={styles.sectionTitle}>Order Summary</Text>
            {orderItems.map(({ item, quantity }) => (
              <View key={item.id} style={styles.orderSummaryItem}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemDetails}>
                  {quantity}x R{item.price} = R{(parseFloat(item.price) * quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: R{getOrderTotal()}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Requests (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Any special dietary requirements or requests..."
                placeholderTextColor="#8B8B8B"
                multiline
                numberOfLines={3}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitOrder}
            >
              <Text style={styles.submitButtonText}>Place Order</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  // Chef Orders Screen
  const renderChefOrdersScreen = () => {
    const groupedOrders = orders.reduce((acc, order) => {
      const key = `${order.customerName}-${order.timestamp.getTime()}`;
      if (!acc[key]) {
        acc[key] = {
          customerName: order.customerName,
          timestamp: order.timestamp,
          items: [],
          specialRequests: order.specialRequests
        };
      }
      const menuItem = menuItems.find(m => m.id === order.menuItemId);
      if (menuItem) {
        acc[key].items.push({
          ...menuItem,
          quantity: order.quantity
        });
      }
      return acc;
    }, {} as any);

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToScreen('chef-home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Orders</Text>
        </View>

        <ScrollView style={styles.ordersList}>
          {Object.keys(groupedOrders).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No orders yet</Text>
              <Text style={styles.emptyStateSubtext}>Orders will appear here when customers place them</Text>
            </View>
          ) : (
            Object.values(groupedOrders).map((orderGroup: any, index) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.customerOrderName}>{orderGroup.customerName}</Text>
                  <Text style={styles.orderTime}>
                    {orderGroup.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
                
                {orderGroup.items.map((item: any, itemIndex: number) => (
                  <View key={itemIndex} style={styles.orderItem}>
                    <Text style={styles.orderItemText}>
                      {item.quantity}x {item.name} - R{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
                
                {orderGroup.specialRequests && (
                  <View style={styles.specialRequestsContainer}>
                    <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
                    <Text style={styles.specialRequestsText}>{orderGroup.specialRequests}</Text>
                  </View>
                )}
                
                <View style={styles.orderTotal}>
                  <Text style={styles.orderTotalText}>
                    Total: R{orderGroup.items.reduce((sum: number, item: any) => 
                      sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    );
  };

  // Form Screen (Add/Edit)
  const renderFormScreen = (isEdit: boolean = false) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              resetForm();
              setEditingItem(null);
              navigateToScreen('chef-home');
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEdit ? 'Edit Dish' : 'Add New Dish'}
          </Text>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Dish Name ({dishName.length}/{MAX_DISH_NAME_LENGTH})
            </Text>
            <TextInput
              style={styles.input}
              value={dishName}
              onChangeText={setDishName}
              placeholder="Enter dish name"
              placeholderTextColor="#8B8B8B"
              maxLength={MAX_DISH_NAME_LENGTH}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description ({description.length}/{MAX_DESCRIPTION_LENGTH})
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the dish"
              placeholderTextColor="#8B8B8B"
              multiline
              numberOfLines={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCoursePicker(true)}
            >
              <View style={styles.pickerButtonContent}>
                <Text style={styles.courseEmoji}>{courseImages[selectedCourse as keyof typeof courseImages]}</Text>
                <Text style={styles.pickerButtonText}>{selectedCourse}</Text>
              </View>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (R)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#8B8B8B"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={isEdit ? editMenuItem : addMenuItem}
          >
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Update Dish' : 'Add to Menu'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showCoursePicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Course</Text>
                <TouchableOpacity onPress={() => setShowCoursePicker(false)}>
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                style={styles.picker}
              >
                {courses.map((course) => (
                  <Picker.Item 
                    key={course} 
                    label={`${courseImages[course as keyof typeof courseImages]} ${course}`} 
                    value={course} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'chef-login' && renderChefLoginScreen()}
      {currentScreen === 'chef-home' && renderChefHomeScreen()}
      {currentScreen === 'chef-add' && renderFormScreen(false)}
      {currentScreen === 'chef-edit' && renderFormScreen(true)}
      {currentScreen === 'chef-orders' && renderChefOrdersScreen()}
      {currentScreen === 'customer-menu' && renderCustomerMenuScreen()}
      {currentScreen === 'customer-order' && renderCustomerOrderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  welcomeButton: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#8B7355',
  },
  chefButton: {
    backgroundColor: '#8B7355',
  },
  customerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B7355',
    marginBottom: 5,
  },
  chefButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  demoCredentials: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B7355',
    marginBottom: 5,
  },
  demoText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#8B7355',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '600',
  },
  ordersButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ordersButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#8B7355',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C2C2C',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  filterArrow: {
    fontSize: 10,
    color: '#666666',
  },
  statsContainer: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  statsLabel: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999999',
    marginTop: 10,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
    flexDirection: 'row',
  },
  menuCardContent: {
    flex: 1,
    padding: 16,
  },
  menuCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseImage: {
    fontSize: 24,
  },
  courseImageLarge: {
    fontSize: 40,
  },
  menuCardInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B7355',
  },
  course: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FF6B6B',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  customerMenuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
    flexDirection: 'row',
    gap: 16,
  },
  customerMenuInfo: {
    flex: 1,
  },
  customerMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerDishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    flex: 1,
  },
  customerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B7355',
  },
  customerCourse: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  customerDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B7355',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#8B7355',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#8B7355',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C2C2C',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courseEmoji: {
    fontSize: 20,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  orderSummaryItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8B7355',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  orderItemDetails: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  totalContainer: {
    backgroundColor: '#8B7355',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#8B7355',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ordersList: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerOrderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  orderTime: {
    fontSize: 14,
    color: '#666666',
  },
  orderItem: {
    paddingVertical: 4,
  },
  orderItemText: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  specialRequestsContainer: {
    backgroundColor: '#F5F5DC',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  specialRequestsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B7355',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  orderTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B7355',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '600',
  },
  picker: {
    height: 200,
  },
});

export default App;
