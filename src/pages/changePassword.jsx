import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();
        try {
            const body = {
                email: event.target.email.value,
                newPassword: event.target.newPassword.value,
                otp: event.target.otp.value
            };
            const resp = await axios.post('http://localhost:5001/auth/change-password', body, { withCredentials: true });
            console.log(resp);
            console.log("Password changed successfully.");
            navigate('/login');
        } catch (error) {
            console.error("Error changing password:", error);
        }
    }
    return (
        <>
            <div className="row justify-content-center py-5">
                <div className="col-6">
                    <h3 className="display-6 fw-bold mb-4 text-center">Change Password Page</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className='mb-3'>
                            <label className="form-label small fw-bold text-secondary">Email</label>
                            <input type="email" name="email" placeholder="name@example.com" className={`form-control form-control-lg rounded-3 fs-6 ${errors.email ? "is-invalid" : ""}`}
                                onChange={handleChange} required={true} />

                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                        </div>

                        <div className='mb-4'>
                            <label className="form-label small fw-bold text-secondary">New Password</label>
                            <input type="password" name="newPassword" placeholder="Password" className={`form-control form-control-lg rounded-3 fs-6 ${errors.password ? "is-invalid" : ""}`}
                                onClick={handleChange} required={true} />
                        </div>

                        <div className='mb-4'>
                            <label className="form-label small fw-bold text-secondary">OTP</label>
                            <input type="text" name="otp" placeholder="123456" className={`form-control form-control-lg rounded-3 fs-6 ${errors.password ? "is-invalid" : ""}`}
                                onChange={handleChange} required={true} />
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className='btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4'>Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ChangePassword;