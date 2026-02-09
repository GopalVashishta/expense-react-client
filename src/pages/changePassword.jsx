import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const navigate = useNavigate();
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
            <div className="row justify-content-center">
                <div className="col-6">
                    <h3>Change Password Page</h3>
                    <form onSubmit={handleChangePassword}>
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" required={true} />
                        <br />

                        <label>New Password</label>
                        <input type="password" name="newPassword" className="form-control" required={true} />
                        <br />

                        <label >OTP</label>
                        <input type="text" name="otp" className="form-control" required={true} />
                        <br />

                        <button type="submit" className="btn btn-primary w-100">Change Password</button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ChangePassword;