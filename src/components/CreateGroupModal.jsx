function CreateGroupModal({ show, onHide }) { // Create Group
    const [formdata, setFormdata] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});
    const validate = () => {
        let isValid = true;
        const newErrors = {};
        if(formdata.name.length() < 3){
            newErrors.name = "Name must be at least 3 characters long";
            isValid = false;
        }
        if(formdata.description.length() < 3){
            newErrors.description = "Description must be at least 3 characters long";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }
    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validate()){
            try{
                const resp = await axios.post(`${serverEndpoint}/group/create`, {
                    name: formdata.name,
                    description: formdata.description
                }, { withCredentials: true });


            }catch(error){
                console.log("Error creating group:", error);
                setErrors({message: "Failed to create group. Please try again."});
            }
        }
    }

    return (
        <>
            <div className="modal show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header border-0">
                                <h5>Create Group</h5>
                                <button type='button' className='btn-close' onClick={onHide}></button>
                            </div>

                            <div className='modal-body'>
                                <div className="mb-3">
                                    <label className="form-label">Group Name</label>
                                    <input type="text" name="name" value={formdata.name} onChange={onChange} className="form-control" />
                                </div>
                                {errors.name && (
                                    <div className="invalid-feedback" >
                                        {errors.name}
                                    </div>
                                )}
                                
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea name="description" value={formdata.description} onChange={onChange} className="form-control" rows="3"></textarea>
                                </div>
                                {errors.description && (
                                    <div className="invalid-feedback" >
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light rounded-pill" onClick={onHide}>Cancel</button>
                                <button type="submit" className="btn btn-primary mx-4 rounded-pill">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CreateGroupModal;