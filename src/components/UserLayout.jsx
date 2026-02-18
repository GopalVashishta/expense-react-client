import UserFooter from './UserFooter';
import UserHeader from './UserHeader';
import { useSelector } from 'react-redux';

function UserLayout({ children }) {
    const user = useSelector((state) => state.userDetails);

    return (
        <>
            <UserHeader user={user} />

            {children}

            <UserFooter />
        </>
    );
}

export default UserLayout;
