import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AppLayout from './components/AppLayout.jsx';
import UserLayout from './components/UserLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  //Value of userDetails repsersent whteher user is logged in or not
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); //loadog

  // retainLogin
  const isUserLoggedIn = async () => {
      try {
        const resp = await axios.post('http://localhost:5001/auth/is-user-logged-in', {}, {withCredentials: true});
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
        <Navigate to='/dashboard' />
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
    </Routes>
  );
}

export default App;