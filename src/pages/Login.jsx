import { useState } from "react";
import axios from 'axios'; // POSTMAN guy
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
                setErrors({message: "Login failed. Please try again."});
            }
        }else{
            console.log("Invalid form");
        }
    }

    return (
        <div className="container">
            <h3 className="text-center">Login Page</h3>
            {message && (message)}
            {errors.message && (errors.message)}
            
            <form onSubmit={handleFormSubmit}>
                
                <label>Email</label>
                <input name="email" type="email" placeholder="Email" className="form-label mb-2" 
                onChange={handleChange} value={formdata.email} required={true} /> <br />
                <label>Password</label>
                <input name="password" type="password" placeholder="Password" className="form-label mb-2" 
                onChange={handleChange} value={formdata.password} required={true} /> <br />
                <button className="btn btn-primary w-20" type="submit">Login</button>
            </form>
        </div>
    );
}
export default Login;