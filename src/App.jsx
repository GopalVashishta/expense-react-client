import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AppLayout from './components/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useState } from 'react';

function App() {
  //Value of userDetails repsersent whteher user is logged in or not
  const [userDetails, setUserDetails] = useState(null);
  return (
    <Routes>
      <Route path="/" element={userDetails ? (
        <Navigate to='/dashboard' />
      ) : (
        <AppLayout>
          <Home />
        </AppLayout>)
      } />
      <Route path="/login" element={userDetails ? (
        <Navigate to='/dashboard' />
      ) : (
        <AppLayout>
          <Login setUser={setUserDetails} />
        </AppLayout>)
      } />
      <Route path="/dashboard" element={userDetails ? (
        <AppLayout>
          <Dashboard user={userDetails} />
        </AppLayout>
      ) : (
        <Navigate to='/login' />
      )
      } />
    </Routes>
  );
}

export default App;