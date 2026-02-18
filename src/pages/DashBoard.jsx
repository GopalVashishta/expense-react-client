import { useSelector } from 'react-redux';

function DashBoard() {
    const user = useSelector((state) => state.userDetails);
    return (
        <div className='container text-center'>
            <h4>Welcome, {user.name}</h4>
            <p>This is your dashboard where u can dash the board with the help of dashboard.</p>
        </div>
    );
}

export default DashBoard;