import { useSelector } from 'react-redux';
function DashBoard() {
    const user = useSelector((state) => state.userDetails);
    return (
        <div className='container text-center'>
            <h4>Welcome, {user.name}</h4>
        </div>
    );
}

export default DashBoard;