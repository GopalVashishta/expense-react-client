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
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h3 className="display-6 fw-bold mb-4 text-center">Register Here</h3>
                        {message && (message)}
                        {errors.message && (errors.message)}

                        <form onSubmit={handleFormSubmit}>
                            <div className='mb-3'>
                                <label className="form-label small fw-bold text-secondary">Name</label>
                                <input type="text" name="name" placeholder='Your Name' className={`form-control form-control-lg rounded-3 fs-6 ${errors.name ? "is-invalid" : ""}`} value={formdata.name} onChange={handleChange} required={true} />
                                {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                            </div>

                            <div className='mb-3'>
                                <label className="form-label small fw-bold text-secondary">Email</label>
                                <input type="email" name="email" value={formdata.email} placeholder="name@example.com" className={`form-control form-control-lg rounded-3 fs-6 ${errors.email ? "is-invalid" : ""}`}
                                    onChange={handleChange} required={true}></input>

                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">Password</label>
                                <input type="password" name="password" value={formdata.password} placeholder="Password" className={`form-control form-control-lg rounded-3 fs-6 ${errors.password ? "is-invalid" : ""}`}
                                    onChange={handleChange} required={true}></input>
                            </div>

                            <div className="d-flex justify-content-center">
                                <button type="submit" className='btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4'>Register</button>
                            </div>
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