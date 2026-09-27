import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, LayoutDashboard, Library, User } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReaderScreen from '../screens/ReaderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="Reader" component={ReaderScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#1e293b', borderTopColor: '#334155' },
                tabBarActiveTintColor: '#38bdf8',
                tabBarInactiveTintColor: '#64748b',
            }}
        >
            <Tab.Screen
                name="DashboardTab"
                component={DashboardScreen}
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{ title: 'Books', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
            />
            <Tab.Screen
                name="LibraryTab"
                component={LibraryScreen}
                options={{ title: 'Library', tabBarIcon: ({ color, size }) => <Library color={color} size={size} /> }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
            />
        </Tab.Navigator>
    );
}