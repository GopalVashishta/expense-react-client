import { useEffect, useState } from "react";
import { serverEndpoint } from '../config/appConfig';
import axios from 'axios';
import Can from '../components/Can';

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "", email: "", role: "Select"
    });
    const [message, setMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", role: "Select" });

    const fetchUsers = async () => {
        try {
            const resp = await axios.get(`${serverEndpoint}/users/`, { withCredentials: true });
            setUsers(resp.data.users || []);
        }
        catch (error) {
            console.log(error);
            setErrors({ message: "Failed to fetch users" });
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};
        if (formData.name.length === 0) {
            isValid = false;
            newErrors.name = "Name is required";
        }
        if (formData.email.length === 0) {
            isValid = false;
            newErrors.email = "Email is required";
        }
        if (formData.role === 'Select') {
            isValid = false;
            newErrors.role = "Role is required";
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            setActionLoading(true);
            try {
                const resp = await axios.post(`${serverEndpoint}/users/`,
                    { name: formData.name, email: formData.email, role: formData.role },
                    { withCredentials: true }
                );
                setUsers([
                    ...users,
                    resp.data.user
                ]);
                setMessage("User added!");
            } catch (error) {
                console.log(error);
                setErrors({ message: "Unable to add user, please try again." });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditFormData({ name: user.name, role: user.role.charAt(0).toUpperCase() + user.role.slice(1) });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editFormData.role === 'Select') {
            setErrors({ message: "Please select a role" });
            return;
        }
        setActionLoading(true);
        try {
            const resp = await axios.patch(`${serverEndpoint}/users/`,
                { userId: editUser._id, name: editFormData.name, role: editFormData.role },
                { withCredentials: true }
            );
            setUsers(users.map(u => u._id === editUser._id ? resp.data.user : u));
            setMessage("User updated!");
            setEditUser(null);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to update user, please try again." });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        setActionLoading(true);
        try {
            await axios.post(`${serverEndpoint}/users/delete`,
                { userId },
                { withCredentials: true }
            );
            setUsers(users.filter(u => u._id !== userId));
            setMessage("User deleted!");
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to delete user, please try again." });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='container p-5'>
                <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='container py-5 px-4  px-md-5'>
            <div className='col-md-8 text-center text-md-start mb-3 mb-md-0'>
                <h2 className="fw-bold text-dark display-6">Manage <span className='text-primary' >Users</span></h2>

                <p className='text-muted mb-0'>
                    View and manage all the users along with their permissions
                </p>
            </div>

            {errors.message && <div className="alert alert-danger" role="alert">{errors.message}</div>}
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            <div className='row'>
                <Can requiredPermission="canCreateUsers">
                    <div className='col-md-3'>
                        <div className='card shadow-sm'>
                            <div className='card-header'>
                                <h5>Add Members</h5>
                            </div>

                            <div className='card-body p-0'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Name</label>
                                        <input type="text" name="name" className={errors.name ? 'form-control is-invalid' : 'form-control'}
                                            value={formData.name} onChange={handleChange} />
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Email</label>
                                        <input type="text" name="email" className={errors.email ? 'form-control is-invalid' : 'form-control'}
                                            value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className='form-label'>Role</label>
                                        <select name='role' onChange={handleChange} className={errors.role ? 'form-select is-invalid' : 'form-select'} value={formData.role}>
                                            <option value='Select'>Select</option>
                                            <option value='Manager'>Manager</option>
                                            <option value='Viewer'>Viewer</option>
                                        </select>
                                        {errors.role && (
                                            <div className="invalid-feedback ps-1">
                                                {errors.role}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary" disabled={actionLoading}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Can>
                <div className='col-md-9'>
                    <div className="card shadow-sm">
                        <div className='card-header'>
                            <h5>Team Members</h5>
                        </div>
                        <div className='card-body p-0'>
                            <div className='table-responsive'>
                                <table className='table table-hover mb-0'>
                                    <thead className='table-light' >
                                        <tr>
                                            <th className='text-center'> Name</th>
                                            <th className='text-center'> Email</th>
                                            <th className='text-center'> Role</th>
                                            <th className='text-center'> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center"> No users found. Start by adding them</td>
                                            </tr>
                                        )}

                                        {users.length > 0 && (
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td className='align-middle'>{user.name}</td>
                                                    <td className='align-middle'>{user.email}</td>
                                                    <td className='align-middle'>{user.role}</td>
                                                    <td className='align-middle'>
                                                        <button className='btn btn-link text-primary' onClick={() => handleEdit(user)}>
                                                            Edit
                                                        </button>
                                                        <button className='btn btn-link text-danger' onClick={() => handleDelete(user._id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editUser && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleEditSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit User</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditUser(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="name" className="form-control" value={editFormData.name} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select name="role" className="form-select" value={editFormData.role} onChange={handleEditChange}>
                                            <option value="Select">Select</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Viewer">Viewer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={actionLoading}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ManageUsers;