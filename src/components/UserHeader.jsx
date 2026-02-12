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
        <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom shadow-sm py-2">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to='/dashboard'>
                    <span className='text-primary'>Expense</span>App
                </Link>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type='button'
                    data-bs-toggle="collapse"
                    data-bs-target="#useNavbar"
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
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle d-flex align-items-center bg-light rounded-pill px-3 py-1 border"
                                to="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 shadow-sm"
                                    style={{ width: "28px", height: "28px",  fontSize: "12px",}}>
                                     {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="text-dark fw-medium small">
                                    {user ? user.name : <>Account</>}
                                </span>
                            </Link>

                            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-3">
                                <li className="px-3 py-2 border-bottom mb-1"
                                    style={{ minWidth: "200px" }}>
                                    <p className="mb-0 small fw-bold text-dark">
                                         Signed in as
                                    </p>
                                    <p className="mb-0 small text-muted">
                                         {user?.email}
                                    </p>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/manage-users">
                                        Manage Users
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/manage-payments">
                                        Manage Credits
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/manage-subscriptions">
                                        Manage Subscriptions
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item py-2 text-danger fw-medium" to="/logout">
                                         <i className="bi bi-box-arrow-right me-2"></i>{" "}
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