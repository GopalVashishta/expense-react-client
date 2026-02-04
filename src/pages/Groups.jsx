import axios from 'axios';
import {serverEndpoint} from '../config/appConfig';
import { useEffect, useState } from 'react';
import GroupCard from '../components/GroupCard';

function Groups(){
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try{
           const resp =  await axios.get(`${serverEndpoint}/group/my-groups`, { withCredentials: true });
           setGroups(resp.data);
        }
        catch(err){
            console.log("Error fetching groups:", err);
        }
        finally {
            setLoading(false);
        }
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
                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                        Create Group
                    </button>
                </div>

                {groups.length === 0  ? (
                    <div className=""> <p>No groups found. Start by creating one!</p> </div>
                ) : (
                    <div className="row g-4">
                        {groups.map((group) =>
                        <div className="col-md-6 col-lg-4">
                            <GroupCard key={group.id} group={group} />
                        </div>
                    )}
                    </div>)}
            </div>
        </>
    );
}
export default Groups;