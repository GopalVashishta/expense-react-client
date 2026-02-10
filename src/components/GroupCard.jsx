import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate }){
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [showGroupDetails, setShowGroupDetails] = useState(false);
    
    const handleShowMembers = () => {
        setShowMembers(!showMembers);
    };
    const handleAddMember = async () => {
        if(memberEmail.length === 0) return;
        try{
            const resp = await axios.put(`${serverEndpoint}/group/members/add`, {
                groupId: group._id,
                emails: [memberEmail]
            }, {withCredentials: true});
            onUpdate(resp.data.group);
            setMemberEmail("");
        }catch(error){
            console.log(error);
            setErrors({message: "Unable to add members"});
        }
    };
    const handleGroupEdit = () => {
        setShowGroupDetails(!showGroupDetails);
    }
    const handleGroupUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedName = form[0].value;
        const updatedDescription = form[1].value;
        const updatedAmount = form[2].value;
        try{
            const resp = await axios.put(`${serverEndpoint}/group/update`, {
                groupId: group._id,
                name: updatedName,
                description: updatedDescription,
                amount: updatedAmount
            }, {withCredentials: true});
            onUpdate(resp.data.group);
            setShowGroupDetails(false);
        }catch(error){
            console.log(error);
            setErrors({message: "Unable to update group"});
        }
    }

    const handleRemoveMember= async (groupId, email) => {
        console.log(email);
        try{
            const resp = await axios.put(`${serverEndpoint}/group/members/remove`, {
                groupId: groupId,
                emails: [email]
            }, {withCredentials: true});
            onUpdate(resp.data.group);
        }
        catch(error){
            console.log(error);
            setErrors({message: "Unable to remove member"});
        }
    }
    return (
        <>
            <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover">
                <div className="card-body  p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary mb-2">
                            <i className="bi bi-collection-fill fs-4"></i>
                        </div>
                        {group.adminEmail && ( <span className="badge rounded-pill bg-light text-dark border fw
                        -normal small"> Admin: {group.adminEmail.split("@")[0]}</span> )}
                    </div>
                        <h5 className="fw-bold mb-1 text-dark text-truncate">{group.name}</h5>
                        {/*add logic to handle click of this button*/}
                        <button className="btn btn-sm text-primary p-0 text-start fw-medium mb-3" onClick={handleShowMembers}>
                            <i className={`bi bi-people-fill me-1`}></i>
                            {group.membersEmail?.length || 0} Members | Show Members 
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={handleGroupEdit}>Edit</button>
                    <p className='text-muted small mb-3 flex-grow-1'>{group.description || "No description provided."}</p>
                    <Link  to={`/groups/${group._id}`} className="btn btn-outline-primary btn-sm rounded-pill fw-bold mb-4 w-100 py-2" >
                     View & Add Expenses 
                    </Link>

                    {showGroupDetails && (
                         <div className='rounded-3 p-3 mb-3 border'>
                            <form onSubmit={handleGroupUpdate}>
                                <h6>Details:</h6>
                                <label className="form-label extra-small fw-bold text-secondary">Group Name</label>
                                <input type="text" className="form-control form-control-sm mb-2" defaultValue={group.name} />
                                <label className="form-label extra-small fw-bold text-secondary">Description</label>
                                <textarea className="form-control form-control-sm mb-2" rows="3" defaultValue={group.description}></textarea>
                                <label className="form-label extra-small fw-bold text-secondary">Amount</label>
                                <input type="number" className="form-control form-control-sm mb-3" defaultValue={group.amount} />
                                <button className="btn btn-sm btn-success" type="submit">Save Changes</button>
                            </form>
                        </div>
                    )}
                    {showMembers && (
                        <div className='bg-light rounded-3 p-3 mb-4 border-0 shadow-inner'>
                            <h6  className="extra-small fw-bold text-uppercase text-secondary mb-3">Members List</h6>
                            <div className="overflow-auto" style={{maxHeight:'150px'}}>
                                {(group.membersEmail || []).map((member, index) => (
                                    <div key={member} className="d-flex align-items-center mb-2 last-child mb-0">
                                        <div  className="rounded-circle bg-white border d-flex align-items-center justify-content-center me-2 fw-bold text-primary shadow-sm"  style={{ width: "24px", height: "24px", fontSize: "10px",}}>
                                            {member.charAt(0).toUpperCase()}
                                        </div>
                                        <span  className="small text-dark text-truncate" title={member}>
                                            {member} <button className="btn btn-sm text-primary p-0 text-start fw-medium mb-1" onClick={() => handleRemoveMember(group._id, member)}>Remove</button>
                                        </span>
                                        {/*{index+1}. {member} <button className="btn btn-sm btn-link p-0" onClick={() => handleRemoveMember(group._id, member)}>Remove</button> */}
                                    </div>
                                ))}
                                 {errors.message && ( <div className="alert alert-danger py-1 px-2 small border-0 mb-3">{errors.message}</div> )}
                            </div>
                            
                        </div>
                    )}

                    <div className="mt-auto pt-3 border-top">
                        <label className="form-label extra-small fw-bold text-uppercase text-muted mb-2">Invite a Friend</label>
                        <div className="input-group input-group-sm">
                            <input type="email" className="form-control bg-light border-0 px-3" placeholder="example@gmail.com" value={memberEmail}
                            onChange={(e) => {setMemberEmail(e.target.value)}}></input>

                            <button className="btn btn-primary px-3 fw-bold" onClick={handleAddMember}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default GroupCard;