import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({ name: "", email: "", password: "" });
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
    const handleFormSubmit = async (event) => {
        event.preventDefault();//prevent default behaviour i.e.  Page reload
        try {
            const body = {
                username: formdata.name,
                email: formdata.email,
                password: formdata.password
            };
            const config = { withCredentials: true };
            const res = await axios.post('http://localhost:5001/auth/register', body, config);
            console.log(res);
            setUser(res.data.user);
            setMessage("User Registered Successfully");
            navigate('/dashboard');

        } catch (err) {
            console.log("Error during login:", err);
            setErrors({ message: "Login failed. Please try again." });
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h3 className="text-center">Register Page</h3>
                        {message && (message)}
                        {errors.message && (errors.message)}

                        <form onSubmit={handleFormSubmit}>
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" value={formdata.name} onChange={handleChange} required={true} />
                            <br />

                            <label>Email</label>
                            <input type="email" name="email" value={formdata.email} className="form-control"
                                onChange={handleChange} required={true}></input>
                            <br />

                            <label>Password</label>
                            <input type="password" name="password" value={formdata.password} className="form-control"
                                onChange={handleChange} required={true}></input>
                            <br />
                            <button type="submit" className='btn btn-primary w-100'>Register</button>
                        </form>

                        <div className="row justify-content-center">
                            <div className="col-6">
                                <p>Already have an account? <Link to="/login">Login here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}
export default Register;