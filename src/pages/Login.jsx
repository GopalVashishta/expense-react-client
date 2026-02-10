import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; // POSTMAN guy
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/appConfig.js";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action.js";
// import ".login.css"; this will add css to this component
function Login() {
    const [formdata, setFormdata] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const dispatch = useDispatch(); // gives us the dispatch function
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const validate = () => {
        let newErorrs = {};
        let isValid = true;
        if (formdata.email.trim().length === 0) {
            newErorrs.email = "Email is required";
            isValid = false;
        }

        if (formdata.password.trim().length === 0) {
            newErorrs.password = "Password is required";
            isValid = false;
        }
        setErrors(newErorrs);
        return isValid;
    }
    const handleFormSubmit = async (event) => {
        event.preventDefault();//prevent default behaviour i.e.  Page reload
        if (validate()) {
            try {
                const body = {
                    email: formdata.email,
                    password: formdata.password
                };
                const config = { withCredentials: true };
                const res = await axios.post(`${serverEndpoint}/auth/login`, body, config);
                console.log(res);
                //setUser(res.data.user);
                setMessage("User Authenticated");
                dispatch({ type: SET_USER, payload: res.data.user }); // inform redux about the new userDetails

            } catch (err) {
                console.log("Error during login:", err);
                setErrors({ message: err.status === 401 ? "Please log in via Google" : "Login failed. Please try again." });
            }
        } else {
            console.log("Invalid form");
        }
    }

    const handleGoogleSuccess = async (authResponse) => {
        try {
            const body = {
                idToken: authResponse?.credential
            };
            const resp = await axios.post(`${serverEndpoint}/auth/google-auth`, body, { withCredentials: true });
            dispatch({ type: SET_USER, payload: resp.data.user });
        } catch (err) {
            console.log("Error during Google SSO login:", err);
            setErrors({ message: "Google SSO login failed. Please try again." });
        }
    }

    const handleGoogleError = (error) => {
        console.log(error);
        setErrors({ message: "Something went wrong while performing google single sign-on" });
    }

    return (
        <div className="container py-5">
            <h3 className="display-6 fw-bold mb-4 text-center">Login Here</h3>
            {message && (message)}
            {errors.message && (errors.message)}
            <div className="row justify-content-center">
                <div className="col-6">
                    <form onSubmit={handleFormSubmit}>
                        <div className='mb-3'>
                            <label className="form-label small fw-bold text-secondary" >Email Address</label>
                            <input name="email" type="email" placeholder="name@example.com" className={`form-control form-control-lg rounded-3 fs-6 ${errors.email ? "is-invalid" : ""}`}
                                onChange={handleChange} value={formdata.email} required={true} />

                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">Password</label>
                            <input name="password" type="password" placeholder="Password" className={`form-control form-control-lg rounded-3 fs-6 ${errors.password ? "is-invalid" : ""}`}
                                onChange={handleChange} value={formdata.password} required={true} />
                            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            <Link to='/reset-password' className='row justify-content-start'>Forgot Password?</Link>
                            <br />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4" type="submit">Login</button>
                        </div>
                    </form>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-6">
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </div>
            </div >

            {/* Divider */}
            <div className="d-flex align-items-center my-2">
                <hr className="flex-grow-1 text-muted" />
                <span className="mx-3 text-muted small fw-bold">OR</span>
                <hr className="flex-grow-1 text-muted" />
            </div>

            <div className="row justify-content-center w-100">
                <div className="col-5">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> {/* Like BrowserRouter in main.jsx */}
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme='outline' shape='pill' text='signin_with' />
                    </GoogleOAuthProvider>
                </div>
            </div>

        </div >
    );
}
export default Login;