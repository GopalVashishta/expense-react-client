import axios from 'axios';
import {serverEndpoint} from '../config/appConfig';
import { useEffect, useState } from 'react';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';
import { usePermissions } from '../rbac/userPermissions';

function Groups(){
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);    
    const permissions = usePermissions();
    
    const fetchGroups = async () => {
        try{
           const resp =  await axios.get(`${serverEndpoint}/group/my-group`, { withCredentials: true });
           setGroups(resp.data.groups || []);
        }
        catch(err){
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
        setGroups((prevGroups) => 
            prevGroups.map((g) => g._id === updatedGroup._id ? updatedGroup : g)
        );
    }
    useEffect(() => {fetchGroups();}, [])
    if(loading){
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }
    return (
        <>
            <div className="container p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3>Your Groups</h3>
                        <p className="text-muted">Manage your shared expenses and split expenses</p>   
                    </div>
                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
                        Create Group
                    </button>
                </div>

                {groups.length === 0  ? (
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
                
                <CreateGroupModal show={show} onHide={() => setShow(false)} onSuccess={handleGroupCreated} />
            </div>
        </>
    );
}
export default Groups;