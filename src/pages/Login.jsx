function Login(){
    return (
        <div className="container">
            <h3 className="text-center">Login Page</h3>
            <input type="text" placeholder="Username" className="form-control mb-2" />
            <input type="password" placeholder="Password" className="form-control mb-2" />
            <button className="btn btn-primary w-100">Login</button>
        </div>
    );
}
export default Login;