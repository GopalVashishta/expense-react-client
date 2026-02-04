import { useState } from "react";

function GroupCard({ group }){
    const [showMembers, setShowMembers] = useState(false);
    const handleShowMembers = () => {
        setShowMembers(!showMembers);
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
                </div>
            </div>
        </>
    );
}
export default GroupCard;