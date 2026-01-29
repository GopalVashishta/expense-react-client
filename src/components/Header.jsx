import { Link } from "react-router-dom";

function Header(){

    return (
        <div className="container">
            <Link to='/'>Home</Link> {/* used anchor tag the page will refrsh */}
            <Link to='/login'>Login</Link>
        </div>
    );
}
export default Header;