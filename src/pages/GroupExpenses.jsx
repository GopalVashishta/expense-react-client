import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { usePermissions } from "../rbac/userPermissions";

function GroupExpenses() {
    // 1. Get the groupId from the URL
    const { groupId } = useParams();
    const permissions = usePermissions();

    // State for group details and expenses
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State for new expense form
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseDescription, setExpenseDescription] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [splitType, setSplitType] = useState("equal"); // equal or custom
    const [customSplits, setCustomSplits] = useState({});
    const [excludedMembers, setExcludedMembers] = useState([]);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // Fetch group details and expenses
    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [expenseResp, summaryResp] = await Promise.all([
                axios.get(`${serverEndpoint}/expense/group/${groupId}`, { withCredentials: true }),
                axios.get(`${serverEndpoint}/expense/summary/${groupId}`, { withCredentials: true })
            ]);

            setGroup(expenseResp.data.group);
            setExpenses(expenseResp.data.expenses);
            setBalances(summaryResp.data.balances);
            setError("");
        } catch (err) {
            console.log("Error fetching group data:", err);
            setError(err.response?.data?.message || "Failed to load group data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    // Initialize custom splits when group members change
    useEffect(() => {
        if (group?.membersEmail) {
            const initialSplits = {};
            group.membersEmail.forEach(email => {
                initialSplits[email] = "";
            });
            setCustomSplits(initialSplits);
        }
    }, [group]);

    // Handle member exclusion toggle
    const handleMemberExclusion = (email) => {
        if (excludedMembers.includes(email)) {
            setExcludedMembers(excludedMembers.filter(e => e !== email));
        } else {
            setExcludedMembers([...excludedMembers, email]);
        }
    };

    // Handle custom split amount change
    const handleCustomSplitChange = (email, value) => {
        setCustomSplits({
            ...customSplits,
            [email]: value
        });
    };

    // Calculate equal split amounts
    const calculateEqualSplit = () => {
        const amount = parseFloat(expenseAmount) || 0;
        const activeMembers = group?.membersEmail?.filter(e => !excludedMembers.includes(e)) || [];
        if (activeMembers.length === 0) return {};

        const splitAmount = amount / activeMembers.length;
        const splits = {};
        activeMembers.forEach(email => {
            splits[email] = splitAmount.toFixed(2);
        });
        return splits;
    };

    // Submit new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!expenseTitle || !expenseAmount) {
            setFormError("Title and amount are required");
            return;
        }

        const amount = parseFloat(expenseAmount);
        if (isNaN(amount) || amount <= 0) {
            setFormError("Please enter a valid amount");
            return;
        }

        // Build split details
        let splitDetails = [];
        if (splitType === "equal") {
            const activeMembers = group.membersEmail.filter(e => !excludedMembers.includes(e));
            if (activeMembers.length === 0) {
                setFormError("At least one member must be included in the split");
                return;
            }
            const splitAmount = amount / activeMembers.length;
            splitDetails = activeMembers.map(email => ({
                memberEmail: email,
                amount: parseFloat(splitAmount.toFixed(2)),
                isPaid: false
            }));
        } else {
            // Custom split
            const activeMembers = group.membersEmail.filter(e => !excludedMembers.includes(e));
            let total = 0;
            for (const email of activeMembers) {
                const splitValue = parseFloat(customSplits[email]) || 0;
                if (splitValue < 0) {
                    setFormError("Split amounts cannot be negative");
                    return;
                }
                total += splitValue;
                splitDetails.push({
                    memberEmail: email,
                    amount: splitValue,
                    isPaid: false
                });
            }

            if (Math.abs(total - amount) > 0.01) {
                setFormError(`Split amounts (${total.toFixed(2)}) must equal total amount (${amount.toFixed(2)})`);
                return;
            }
        }

        try {
            await axios.post(`${serverEndpoint}/expense/create`, {
                groupId,
                title: expenseTitle,
                description: expenseDescription,
                totalAmount: amount,
                splitDetails
            }, { withCredentials: true });

            setFormSuccess("Expense added successfully!");
            setExpenseTitle("");
            setExpenseDescription("");
            setExpenseAmount("");
            setCustomSplits({});
            setExcludedMembers([]);
            setSplitType("equal");
            setShowAddExpense(false);
            fetchGroupData();
        } catch (err) {
            console.log("Error creating expense:", err);
            setFormError(err.response?.data?.message || "Failed to create expense");
        }
    };

    // Handle settle group
    const handleSettleGroup = async () => {
        if (!window.confirm("Are you sure you want to settle this group? All balances will be reset to zero.")) {
            return;
        }

        try {
            await axios.post(`${serverEndpoint}/expense/settle/${groupId}`, {}, { withCredentials: true });
            setFormSuccess("Group settled successfully!");
            fetchGroupData();
        } catch (err) {
            console.log("Error settling group:", err);
            setError(err.response?.data?.message || "Failed to settle group");
        }
    };

    // Handle delete expense
    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        try {
            await axios.delete(`${serverEndpoint}/expense/${expenseId}`, { withCredentials: true });
            fetchGroupData();
        } catch (err) {
            console.log("Error deleting expense:", err);
            setError(err.response?.data?.message || "Failed to delete expense");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container p-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-medium">Loading group expenses...</p>
            </div>
        );
    }

    if (error && !group) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
                <Link to="/dashboard" className="btn btn-primary">Back to Groups</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/groups">Groups</Link>
                    </li>
                    <li className="breadcrumb-item active">{group?.name || "Expense Details"}</li>
                </ol>
            </nav>

            {/* Error/Success Messages */}
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            {formSuccess && <div className="alert alert-success mb-4">{formSuccess}</div>}

            {/* Group Header */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary me-3">
                                <i className="bi bi-collection-fill fs-3"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-1">{group?.name}</h2>
                                <p className="text-muted mb-0">{group?.description || "No description"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        {permissions.canSettleExpenses && (
                            <button
                                className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm"
                                onClick={handleSettleGroup}
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Settle Group
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - Members & Summary */}
                <div className="col-lg-4">
                    {/* Members Card */}
                    <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border">
                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-people-fill text-primary me-2"></i>
                            Members ({group?.membersEmail?.length || 0})
                        </h5>
                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                            {group?.membersEmail?.map((member, index) => (
                                <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded-3">
                                    <div
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                                        style={{ width: "32px", height: "32px", fontSize: "12px" }}
                                    >
                                        {member.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="small text-truncate flex-grow-1" title={member}>
                                        {member}
                                    </span>
                                    {member === group.adminEmail && (
                                        <span className="badge bg-warning text-dark small">Admin</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Balance Summary Card */}
                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-wallet2 text-primary me-2"></i>
                            Balance Summary
                        </h5>
                        {Object.keys(balances).length === 0 ? (
                            <p className="text-muted small">No balances to show</p>
                        ) : (
                            <div className="overflow-auto" style={{ maxHeight: '250px' }}>
                                {Object.entries(balances).map(([email, balance]) => (
                                    <div key={email} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded-3">
                                        <span className="small text-truncate" style={{ maxWidth: '60%' }} title={email}>
                                            {email.split('@')[0]}
                                        </span>
                                        <span className={`fw-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-3 pt-3 border-top">
                            <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Positive = owed money, Negative = owes money
                            </small>
                        </div>
                    </div>
                </div>

                {/* Right Column - Expenses */}
                <div className="col-lg-8">
                    {/* Add Expense Button/Form */}
                    {permissions.canCreateExpenses && (
                        <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border">
                            {!showAddExpense ? (
                                <button
                                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold w-100"
                                    onClick={() => setShowAddExpense(true)}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add New Expense
                                </button>
                            ) : (
                                <form onSubmit={handleAddExpense}>
                                    <h5 className="fw-bold mb-3">
                                        <i className="bi bi-receipt text-primary me-2"></i>
                                        Add New Expense
                                    </h5>

                                    {formError && <div className="alert alert-danger py-2">{formError}</div>}

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small">Title *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., Dinner, Movie tickets"
                                                value={expenseTitle}
                                                onChange={(e) => setExpenseTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small">Amount (INR) *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                value={expenseAmount}
                                                onChange={(e) => setExpenseAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold small">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                placeholder="Optional description"
                                                value={expenseDescription}
                                                onChange={(e) => setExpenseDescription(e.target.value)}
                                            ></textarea>
                                        </div>

                                        {/* Split Type Selection */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold small">Split Type</label>
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="splitType"
                                                        id="equalSplit"
                                                        checked={splitType === 'equal'}
                                                        onChange={() => setSplitType('equal')}
                                                    />
                                                    <label className="form-check-label" htmlFor="equalSplit">
                                                        Equal Split
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="splitType"
                                                        id="customSplit"
                                                        checked={splitType === 'custom'}
                                                        onChange={() => setSplitType('custom')}
                                                    />
                                                    <label className="form-check-label" htmlFor="customSplit">
                                                        Custom Split
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Member Selection / Custom Splits */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold small">
                                                {splitType === 'equal' ? 'Include Members' : 'Custom Amounts'}
                                            </label>
                                            <div className="bg-light p-3 rounded-3">
                                                {group?.membersEmail?.map((member, index) => (
                                                    <div key={index} className="d-flex align-items-center justify-content-between mb-2">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`member-${index}`}
                                                                checked={!excludedMembers.includes(member)}
                                                                onChange={() => handleMemberExclusion(member)}
                                                            />
                                                            <label className="form-check-label small" htmlFor={`member-${index}`}>
                                                                {member}
                                                            </label>
                                                        </div>
                                                        {splitType === 'equal' ? (
                                                            <span className="badge bg-secondary">
                                                                {!excludedMembers.includes(member)
                                                                    ? `₹${calculateEqualSplit()[member] || '0.00'}`
                                                                    : 'Excluded'}
                                                            </span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                style={{ width: '100px' }}
                                                                placeholder="0.00"
                                                                step="0.01"
                                                                min="0"
                                                                value={customSplits[member] || ''}
                                                                onChange={(e) => handleCustomSplitChange(member, e.target.value)}
                                                                disabled={excludedMembers.includes(member)}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-4">
                                        <button type="submit" className="btn btn-success px-4">
                                            <i className="bi bi-check-lg me-2"></i>Save Expense
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => {
                                                setShowAddExpense(false);
                                                setFormError("");
                                                setExpenseTitle("");
                                                setExpenseDescription("");
                                                setExpenseAmount("");
                                                setExcludedMembers([]);
                                                setSplitType("equal");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Expenses List */}
                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-list-ul text-primary me-2"></i>
                            Expenses ({expenses.length})
                        </h5>

                        {expenses.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded-3">
                                <i className="bi bi-receipt display-1 text-muted opacity-50"></i>
                                <h5 className="mt-3 text-muted">No Expenses Yet</h5>
                                <p className="text-muted small">Add your first expense to start tracking!</p>
                            </div>
                        ) : (
                            <div className="overflow-auto" style={{ maxHeight: '500px' }}>
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="card mb-3 border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h6 className="fw-bold mb-0 me-2">{expense.title}</h6>
                                                        {expense.isSettled && (
                                                            <span className="badge bg-success">Settled</span>
                                                        )}
                                                    </div>
                                                    <p className="text-muted small mb-2">
                                                        {expense.description || "No description"}
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-2 small text-muted">
                                                        <span>
                                                            <i className="bi bi-person-fill me-1"></i>
                                                            Paid by: {expense.paidBy?.split('@')[0]}
                                                        </span>
                                                        <span>
                                                            <i className="bi bi-calendar me-1"></i>
                                                            {formatDate(expense.createdAt)}
                                                        </span>
                                                        <span>
                                                            <i className="bi bi-people me-1"></i>
                                                            Split: {expense.splitDetails?.length} members
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <h5 className="fw-bold text-primary mb-2">
                                                        ₹{expense.totalAmount?.toFixed(2)}
                                                    </h5>
                                                    {permissions.canDeleteExpenses && !expense.isSettled && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteExpense(expense._id)}
                                                        >
                                                            <i className="bi bi-trash"></i>Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Split Details Accordion */}
                                            <div className="mt-3">
                                                <button
                                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#splits-${expense._id}`}
                                                >
                                                    <i className="bi bi-chevron-down me-1"></i>
                                                    View Split Details
                                                </button>
                                                <div className="collapse mt-2" id={`splits-${expense._id}`}>
                                                    <div className="bg-light p-2 rounded-3">
                                                        {expense.splitDetails?.map((split, idx) => (
                                                            <div key={idx} className="d-flex justify-content-between small py-1">
                                                                <span>{split.memberEmail}</span>
                                                                <span className="fw-bold">₹{split.amount?.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupExpenses;
