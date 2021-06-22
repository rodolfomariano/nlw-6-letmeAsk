
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContext';

import Routes from './routes';


function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
