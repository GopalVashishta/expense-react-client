import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; // POSTMAN guy
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
// import ".login.css"; this will add css to this component
function Login({ setUser }) {
    const [formdata, setFormdata] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

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
        if(formdata.email.trim().length === 0){
            newErorrs.email = "Email is required";
            isValid = false;
        }

        if(formdata.password.trim().length === 0){
            newErorrs.password = "Password is required";
            isValid = false;
        }
        setErrors(newErorrs);
        return isValid;
    }
    const handleFormSubmit = async (event) => {
        event.preventDefault();//prevent default behaviour i.e.  Page reload
        if(validate()){
            try{ 
                const body = {
                    email: formdata.email,
                    password: formdata.password
                };
                const config = {withCredentials: true};
                const res = await axios.post('http://localhost:5001/auth/login', body, config);
                console.log(res);
                setUser(res.data.user);
                setMessage("User Authenticated");
            }catch(err){
                console.log("Error during login:", err);
                setErrors({message: err.status === 401 ? "Please log in via Google" : "Login failed. Please try again."});
            }
        }else{
            console.log("Invalid form");
        }
    }

    const handleGoogleSuccess = async (authResponse) => {
        try{
            const body = {
                idToken: authResponse?.credential
            };
            const resp = await axios.post("http://localhost:5001/auth/google-auth", body, {withCredentials: true});
            setUser(resp.data.user);
        }catch(err){
            console.log("Error during Google SSO login:", err);
            setErrors({message: "Google SSO login failed. Please try again."});
        }
    }

    const handleGoogleError = (error) => {
        console.log(error);
        setErrors({message: "Something went wrong while performing google single sign-on"});
    } 

    return (
        <div className="container">
            <h3 className="text-center">Login Page</h3>
            {message && (message)}
            {errors.message && (errors.message)}
            <div className="row justify-content-center"> 
                <div className="col-6">
                    <form onSubmit={handleFormSubmit}>
                        
                        <label>Email</label>
                        <input name="email" type="email" placeholder="Email" className="form-control mb-2" 
                        onChange={handleChange} value={formdata.email} required={true} />
                        {errors.email && (errors.email)}
                        <br />

                        <label>Password</label>
                        <input name="password" type="password" placeholder="Password" className="form-control mb-2" 
                        onChange={handleChange} value={formdata.password} required={true} /> 
                        {errors.password && (errors.password)}
                        <Link to='/reset-password' className='row justify-content-start'>Forgot Password?</Link>
                        <br />
                        
                        <button className="btn btn-primary w-100" type="submit">Login</button>
                    </form>
                </div>
            </div>
            <br />
            <div className="row justify-content-center">
                <div className="col-6">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> {/* Like BrowserRouter in main.jsx */}
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                    </GoogleOAuthProvider>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-6">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>

        </div>
    );
}
export default Login;