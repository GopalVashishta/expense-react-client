import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AppLayout from './components/AppLayout.jsx';
import UserLayout from './components/UserLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import ChangePassword from './pages/changePassword.jsx';
import Logout from './pages/Logout.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { serverEndpoint } from './config/appConfig.js';

function App() {
  //Value of userDetails repsersent whteher user is logged in or not
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); //loadog

  // retainLogin
  const isUserLoggedIn = async () => {
      try {
        const resp = await axios.post(`${serverEndpoint}/auth/is-user-logged-in`, {}, {withCredentials: true});
        setUserDetails(resp.data.user);
        
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
  };
  useEffect(() => {isUserLoggedIn(); }, []) // a func and a dependency array(useState vars) only works after page render
  if(loading){
    return (
      <div className="container text-center">
        <h3>Loading....</h3>
      </div>
    );

  }
  return (
    <Routes>
      <Route path="/" element={userDetails ? (
        <UserLayout user={userDetails}>
          <Dashboard user={userDetails} />
        </UserLayout>
      ) : (
        <AppLayout>
          <Home />
        </AppLayout>)
      } />

      <Route path='/register' element={<AppLayout>
          <Register setUser={setUserDetails}/>
         </AppLayout>} />

      <Route path="/login" element={userDetails ? (
        <Navigate to='/dashboard' />
      ) : (
        <AppLayout>
          <Login setUser={setUserDetails} />
        </AppLayout>)
      } />
      <Route path="/dashboard" element={userDetails ? (
        <UserLayout user={userDetails} setUser={setUserDetails}>
          <Dashboard user={userDetails} />
        </UserLayout>
      ) : (
        <Navigate to='/login' />
      )
      } />
      <Route path='/reset-password' element={
        <AppLayout>
          <ResetPassword />
        </AppLayout>} />
      <Route path='/change-password' element={
        <AppLayout>
          <ChangePassword />
        </AppLayout>} />
      <Route path='/logout' element={
        <AppLayout>
          <Logout setUser={setUserDetails} />
        </AppLayout>} />

    </Routes>
  );
}

export default App;