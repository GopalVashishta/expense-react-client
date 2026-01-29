import { useState } from "react";
function Login(){
    const [formdata, setFormdata] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    
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
    const handleFormSubmit = (event) => {
        event.preventDefault();//prevent default behaviour i.e.  Page reload
        if(validate()){
           console.log("Form is valid");
        }else{
            console.log("Invalid form");
        }
    }

    return (
        <div className="container">
            <h3 className="text-center">Login Page</h3>
            <form onSubmit={handleFormSubmit}>
                
                <label>Email</label>
                <input name="email" type="email" placeholder="Email" className="form-label mb-2" 
                onChange={handleChange} value={formdata.email} /> <br />
                <label>Password</label>
                <input name="password" type="password" placeholder="Password" className="form-label mb-2" 
                onChange={handleChange} value={formdata.password} /> <br />
                <button className="btn btn-primary w-20" type="submit">Login</button>
            </form>
        </div>
    );
}
export default Login;