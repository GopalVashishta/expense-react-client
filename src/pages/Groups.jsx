import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';
import { useEffect, useState } from 'react';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';
import { usePermissions } from '../rbac/userPermissions';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const permissions = usePermissions();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const pageSizeOptions = [5, 10, 20, 50, 100];

    const fetchGroups = async (page = 1) => {
        try {
            const resp = await axios.get(`${serverEndpoint}/group/my-group?page=${page}&limit=${limit}`, { withCredentials: true });
            setGroups(resp?.data?.groups); // ? makes null safe
            setTotalPages(resp?.data?.pagination?.totalPages);
            setCurrentPage(resp?.data?.pagination?.currentPage);
        }
        catch (err) {
            console.log("Error fetching groups:", err);
        }
        finally {
            setLoading(false);
        }
    }
    const handleGroupCreated = (newGroup) => {
        setGroups((prevGroups) => [...prevGroups, newGroup]);
    }
    const handleGroupUpdateSuccess = (updatedGroup) => {
        // Default to the 1st page whenever there is anupdate to the group.
        // or new group is added. this logica can be customized as per the user
        // experience you want to provide. You can chooose to keep the user on
        // the same page or go to last page. No right or wrong answrs here!
        fetchGroups(1);
    }
    // Triggers call to fetch when the compoenent is rendered for the very 1st time 
    // and also when there is change in currentPage or limit variable
    useEffect(() => { fetchGroups(currentPage); }, [currentPage, limit]);

    const handlePageSizeChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }
    if (loading) {
        return (
            <div className="container p-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className='mt-3 text-muted fw-medium'>
                    Syncing your circles...
                </p>
            </div>
        );
    }
    return (
        <>
            <div className="container py-5 px-4 px-md-5">
                <div className='row align-items-center mb-5'>
                    <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                        <h2 className="fw-bold text-dark display-6">
                            Manage <span className="text-primary">Groups</span>
                        </h2>
                        <p className="text-muted mb-0">
                            View balances, invite friends, and settle shared
                            expenses in one click.
                        </p>
                    </div>
                    <div className="col-md-4 text-center text-md-end">
                        <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={() => setShow(true)}>
                            <i className="bi bi-plus-lg me-2"></i>
                            New Group
                        </button>
                    </div>
                </div>
                {/*}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3>Your Groups</h3>
                        <p className="text-muted">Manage your shared expenses and split expenses</p>   
                    </div>
                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
                        Create Group
                    </button>
                </div>
                */}
                <hr className="mb-5 opacity-10" />
                {groups.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-5 border border-dashed border-primary border-opacity-25 shadow-inner">
                        <div className="bg-white rounded-circle d-inline-flex p-4 mb-4 shadow-sm">
                            <i
                                className="bi bi-people text-primary"
                                style={{ fontSize: "3rem" }}
                            ></i>
                        </div>
                        <h4 className="fw-bold">No Groups Found</h4>
                        <p
                            className="text-muted mx-auto mb-4"
                            style={{ maxWidth: "400px" }}
                        >
                            You haven't joined any groups yet. Create a group to
                            start splitting bills with your friends or roommates!
                        </p>
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setShow(true)}
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="row g-4 animate__animated animate__fadeIn">
                        {groups.map((group) =>
                            <div className="col-md-6 col-lg-4" key={group._id}>
                                <GroupCard group={group} onUpdate={handleGroupUpdateSuccess} />
                            </div>
                        )}
                    </div>)}
                {totalPages >= 1 && (
                    <nav className='mt-5 d-flex justify-content-center align-items-center flex-wrap gap-3'>
                        <ul className='pagination shadow-sm mb-0'>
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className='page-link'
                                    onClick={() => { handlePageChange(currentPage - 1) }}>
                                    &laquo;
                                </button>
                            </li>

                            {/*Array(totalPages) generates array of size totalPages with empty(undefined) values.*/}
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === (index + 1) ? "active" : ""}`}>
                                    <button className='page-link' onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className='page-link'
                                    onClick={() => { handlePageChange(currentPage + 1) }}>
                                    &raquo;
                                </button>
                            </li>
                        </ul>

                        <div className='d-flex align-items-center gap-2'>
                            <label className='text-muted mb-0 small'>Records per page:</label>
                            <select
                                className='form-select form-select-sm'
                                style={{ width: 'auto' }}
                                value={limit}
                                onChange={() => { handlePageSizeChange }}
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </nav>
                )}
                <CreateGroupModal show={show} onHide={() => setShow(false)} onSuccess={handleGroupCreated} />
            </div>
        </>
    );
}
export default Groups;