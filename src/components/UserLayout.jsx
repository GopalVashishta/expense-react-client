import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from 'axios'

function UserLayout({ children, user, setUser }) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        setUser(null);
        await axios.post('http://localhost:5001/auth/logout');
        navigate('/');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        ExpenseApp
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            {user && (
                                <span className="navbar-text me-3">
                                    Welcome, {user.name || user.email}
                                </span>
                            )}
                            <button 
                                className="btn btn-outline-danger" 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {children}
            <Footer />
        </>
    );
}

export default UserLayout;
