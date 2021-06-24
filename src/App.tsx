
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContext';

import Routes from './routes';

import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes />
        <ToastContainer />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
