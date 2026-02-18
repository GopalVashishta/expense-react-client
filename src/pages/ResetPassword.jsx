import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = async (event) => {
        event.preventDefault();
        try {
            const body = {
                email: event.target.email.value
            };
            const resp = await axios.post('http://localhost:5001/auth/reset-password', body, { withCredentials: true });
            console.log(resp);
            console.log("Password reset link sent to email if it exists in our records.");
            navigate('/change-password');

        } catch (err) {
            console.log("Error during password reset:", err);
            setErrors({ message: "Error sending the reset-password req." })
        }
    };

    return (
        <>
            <div className="row justify-content-center py-5">
                <div className="col-6">
                    <h3 className="display-6 fw-bold mb-4 text-center" >Reset Password Page</h3>
                    <form onSubmit={handleReset}>
                        <div className='mb-3'>
                            <label className="form-label fw-bold text-secondary">Email</label>
                            <input type="email" name="email" className={`form-control form-control-lg rounded-3 fs-6 ${errors.name ? "is-invalid" : ""}`}
                                onChange={handleChange} required={true} />

                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className='btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4'>Send Reset Link</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;