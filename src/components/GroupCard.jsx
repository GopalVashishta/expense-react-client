import { useState } from "react";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate }){
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleShowMembers = () => {
        setShowMembers(!showMembers);
    };
    const handleAddMember = async () => {
        if(memberEmail.length === 0) return;
        try{
            const resp = await axios.post(`${serverEndpoint}/group/members/add`, {
                groupId: group._id,
                membersEmail: [memberEmail]
            }, {withCredentials: true});
            onUpdate(resp.data);
        }catch(error){
            console.log(errors);
            setErrors({message: "Unable to add members"});
        }
    };
    return (
        <>
            <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
                <div className="card-body">
                    <div>
                        <h5 className="">{group.name}</h5>
                        {/*add logic to handle click of this button*/}
                        <button className="btn btn-sm btn-link p-0" onClick={handleShowMembers}>
                            {group.membersEmail.length} Members | Show Members 
                        </button>
                    </div>
                    <p>{group.description}</p>
                    {showMembers && (
                        <div className='rounded-3 p-3 mb-3 border'>
                            <h6>Members in this Group:</h6>
                            {group.membersEmail.map((member, index) => (
                                <div>{index+1}. {member} </div>
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