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
                        <h5 className="">{group.name}</h5>
                        {/*add logic to handle click of this button*/}
                        <button className="btn btn-sm btn-link p-0" onClick={handleShowMembers}>
                            {group.membersEmail?.length || 0} Members | Show Members 
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={handleGroupEdit}>Edit</button>
                    </div>
                    <p>{group.description}</p>

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
                        <div className='rounded-3 p-3 mb-3 border'>
                            <h6>Members in this Group:</h6>
                            {(group.membersEmail || []).map((member, index) => (
                                <div key={member}>
                                    {index+1}. {member} <button className="btn btn-sm btn-link p-0" onClick={() => handleRemoveMember(group._id, member)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='mb-3'>
                        <label className="form-label extra-small fw-bold text-secondary">Add Member</label>
                        <div className="input-group input-group-sm">
                            <input type="email" className="form-control border-end-0" value={memberEmail}
                            onChange={(e) => {setMemberEmail(e.target.value)}}></input>

                            <button className="btn btn-primary px-3" onClick={handleAddMember}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default GroupCard;