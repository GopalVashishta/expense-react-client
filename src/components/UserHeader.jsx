import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserHeader() {
    const user = useSelector((state) => state.userDetails);
    const location = useLocation();
    const isActive = (path) => {
        location.pathname === path ?
            "active fw-bold text-primary" :
            "text-secondary";
    }
    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom shadow-sm py-2"
            data-bs-theme="dark">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to='/dashboard'>
                    Dashboard
                </Link>
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type='button'
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li>
                        <Link className="nav-link" to="/groups">
                            My Groups
                        </Link>
                    </li>
                </ul>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {user ? user.name : <>Account</>}
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/manage-users">
                                        Manage Users
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/logout">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default UserHeader;