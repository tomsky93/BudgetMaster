import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';       
import './index.css'

import 'primereact/resources/themes/lara-light-blue/theme.css';  
//import 'primereact/resources/primereact.min.css';              
import 'primeicons/primeicons.css';                          
import '@fortawesome/fontawesome-free/css/all.css';
import './overrides.css';

import { toastRef } from './utils/toast';
import { Toast } from 'primereact/toast';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    
    <PrimeReactProvider 
    value={{
      unstyled: false,
      pt: Tailwind,       
      ripple: true        
    }}
  > 
      <App />
      <Toast ref={toastRef} />
    </PrimeReactProvider>
  );
} else {
  console.error("Root element not found");
}


