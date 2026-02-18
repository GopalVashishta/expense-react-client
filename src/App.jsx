import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AppLayout from "./components/AppLayout.jsx";
import UserLayout from "./components/UserLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
import ChangePassword from "./pages/changePassword.jsx";
import Logout from "./pages/Logout.jsx";
import Groups from "./pages/Groups.jsx";
import GroupExpenses from "./pages/GroupExpenses.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import ProtectedRoute from "./rbac/ProtectedRoute";
import ManagePayments from "./pages/managePayments.jsx";
import UnauthorizedAccess from "./components/errors/UnauthorizedAccess";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "./config/appConfig.js";
import { useSelector, useDispatch } from "react-redux";
import ManageSubscriptions from "./pages/ManageSubscriptions.jsx";

function App() {
  //Value of userDetails repsersent whteher user is logged in or not
  //const [userDetails, setUserDetails] = useState(null);  /////////replace by redux

  //useSelector takes 1 funtion as input. Redux calls the func that you pass to useSelector
  // with all the values its storing/managing.
  // We need to take ou userDetails since we're interested in userDetails obj;
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true); //loadog
  const dispatch = useDispatch();
  // retainLogin
  const isUserLoggedIn = async () => {
    try {
      const resp = await axios.post(
        `${serverEndpoint}/auth/is-user-logged-in`,
        {},
        { withCredentials: true },
      );
      if (resp.status !== 200) throw new Error("User not logged in");
      //setUserDetails(resp.data.user); //////// replace by redux
      dispatch({ type: "SET_USER", payload: resp.data.user });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []); // a func and a dependency array(useState vars) only works after page render

  if (loading) {
    return (
      <div className="container text-center">
        <h3>Loading....</h3>
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <UserLayout user={userDetails}>
              <Dashboard user={userDetails} />
            </UserLayout>
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      <Route
        path="/register"
        element={
          <AppLayout>
            <Register />
          </AppLayout>
        }
      />

      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/" /> //dashboard
          ) : (
            <AppLayout>
              <Login />
            </AppLayout>
          )
        }
      />

      <Route
        path="/groups"
        element={
          userDetails ? (
            <UserLayout>
              <Groups />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          <AppLayout>
            <ResetPassword />
          </AppLayout>
        }
      />

      <Route
        path="/change-password"
        element={
          <AppLayout>
            <ChangePassword />
          </AppLayout>
        }
      />

      <Route
        path="/manage-payments"
        element={
          userDetails ? (
            <ProtectedRoute roles={["admin"]}>
              <UserLayout>
                <ManagePayments />
              </UserLayout>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={userDetails ? <Logout /> : <Navigate to="/login" />}
      />

      <Route
        path="/groups/:groupId"
        element={
          userDetails ? (
            <UserLayout>
              <GroupExpenses />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/manage-users"
        element={
          userDetails ? (
            <ProtectedRoute roles={["admin"]}>
              <UserLayout>
                <ManageUsers />
              </UserLayout>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/unauthorized-access"
        elements={
          userDetails ? (
            <UserLayout>
              <UnauthorizedAccess />
            </UserLayout>
          ) : (
            <AppLayout>
              <UnauthorizedAccess />
            </AppLayout>
          )
        }
      />

      <Route
        path="/manage-subscriptions"
        element={
          userDetails ? (
            <ProtectedRoute roles={["admin"]}>
              <UserLayout>
                <ManageSubscriptions />
              </UserLayout>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;