import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword(){
    const navigate = useNavigate();
    const handleReset = async (event) => {
        event.preventDefault();
        try{ 
            const body = {
                email: event.target.email.value
            };
            const resp = await axios.post('http://localhost:5001/auth/reset-password', body, {withCredentials: true});
            console.log(resp);
            console.log("Password reset link sent to email if it exists in our records.");
            navigate('/change-password');

        }catch(err){
            console.log("Error during password reset:", err);
        }
        
    };
    return(
        <>
           <div className="row justify-content-center">
            <div className="col-6">
                <h3>Reset Password Page</h3>
                <form onSubmit={handleReset}>
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" required={true} />
                    <br />
                    <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
                </form>
            </div>
           </div> 
        </>
    );
}
export default ResetPassword;