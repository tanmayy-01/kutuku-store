
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import { View } from 'react-native';

function App() {
 
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}


export default App;
