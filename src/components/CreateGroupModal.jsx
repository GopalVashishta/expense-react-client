import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useState } from "react";
import { useSelector } from 'react-redux';

function CreateGroupModal({ show, onHide, onSuccess }) { // Create Group
    const user = useSelector((state) => state.userDetails);
    const [formdata, setFormdata] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let isValid = true;
        const newErrors = {};
        if (formdata.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters long";
            isValid = false;
        }
        if (formdata.description.length < 3) {
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
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const resp = await axios.post(`${serverEndpoint}/group/create`, {
                    name: formdata.name,
                    description: formdata.description,
                    membersEmail: [],
                    thumbnail: ""
                }, { withCredentials: true });
                const groupId = resp.data.group;
                onHide();
                onSuccess({
                    name: formdata.name,
                    description: formdata.description,
                    membersEmail: [user.email],
                    adminEmail: user.email,
                    _id: groupId,
                    paymentStatus: {
                        amount: 0,
                        currency: "INR",
                        date: new Date().toISOString(),
                        isPaid: false
                    },
                    thumbnail: "",
                    isPaid: false
                });
                setFormdata({ name: "", description: "" });
                onHide();
            } catch (error) {
                console.log("Error creating group:", error);
                setErrors({ message: "Failed to create group. Please try again." });
            } finally {
                setLoading(false);
            }
        }
    }

    if (!show) return null;

    return (
        <>
            <div className="modal show d-block"
                tabIndex="-1"
                style={{
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                }}
            >

                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header border-0 pb-0">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                    <i className="bi bi-plus-circle-fill text-primary fs-4"></i>
                                </div>
                                <h5>Start a new Circle</h5>
                                <button type='button' className='btn-close shadow-none' onClick={onHide}></button>
                            </div>

                            <div className='modal-body py-4'>
                                <p className="text-muted small mb-4">
                                    Create a shared space to manage bills with your
                                    friends, roommates, or travel partners.
                                </p>
                                {errors.message && (<div className="alert alert-danger py-2 small border-0 
mb-3">  {errors.message}  </div>)}

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary
text-uppercase mb-2">Group Name</label>
                                    <input placeholder="e.g., Goa Trip 2026" type="text" name="name" value={formdata.name} onChange={onChange} className={`form-control form-control-lg bg-light
border-0 fs-6 ${errors.name ? "is-invalid" : ""}`} />
                                </div>
                                {errors.name && (
                                    <div className="invalid-feedback ps-1" >
                                        {errors.name}
                                    </div>
                                )}

                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary
text-uppercase mb-2">Description</label>
                                    <textarea name="description" value={formdata.description} onChange={onChange} className={`form-control form-control-lg bg-light
border-0 fs-6 ${errors.description ? "is-invalid" : ""}`}
                                        rows="3" placeholder="What is this group for?"></textarea>
                                </div>
                                {errors.description && (
                                    <div className="invalid-feedback ps-1" >
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light rounded-pill  px-4 fw-medium" onClick={onHide} disabled={loading}>Cancel</button>

                                <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold
shadow-sm" disabled={loading}>{loading ? (<>
                                        <span className="spinner-border spinner-border-sm
me-2" role="status" aria-hidden="true" ></span> Creating... </>) : ("Create Group")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CreateGroupModal;