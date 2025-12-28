import React, { useState } from 'react';
import { Shield, Trash2, Search } from 'lucide-react';

const UserManagementTab = ({ users = [], onUpdateRole, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="premium-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>

            <h3 className="text-danger mb-4 border-bottom border-secondary pb-2 fs-6 fw-bold uppercase tracking-widest">
                User Management
            </h3>

            {/* Search + Actions */}
            <div className="row g-3 align-items-center mb-4">
                <div className="col-md-6">
                    <div className="position-relative">
                        <Search
                            size={16}
                            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '50px', paddingLeft: '3rem', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em' }}
                            placeholder="Search Users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-6 text-md-end">
                    <button
                        className="btn custom-red-btn rounded-pill px-4 py-2 fw-black tracking-widest text-[10px]"
                        onClick={() => {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
                            const downloadAnchorNode = document.createElement('a');
                            downloadAnchorNode.setAttribute("href", dataStr);
                            downloadAnchorNode.setAttribute("download", "cinaverse_system_data.json");
                            document.body.appendChild(downloadAnchorNode);
                            downloadAnchorNode.click();
                            downloadAnchorNode.remove();
                        }}
                    >
                        <Shield size={14} className="me-2" />
                        Export System Data
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="text-secondary text-[10px] fw-black uppercase tracking-widest ps-4">User ID</th>
                            <th className="text-secondary text-[10px] fw-black uppercase tracking-widest">Name / Email</th>
                            <th className="text-secondary text-[10px] fw-black uppercase tracking-widest">Role</th>
                            <th className="text-secondary text-[10px] fw-black uppercase tracking-widest">Subscription</th>
                            <th className="text-secondary text-[10px] fw-black uppercase tracking-widest text-end pe-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map(u => {
                            const activeSub = u.subscriptions?.find(s => s.status === 'active');
                            const planName = activeSub?.plan?.name || u.plan || 'Free';

                            return (
                                <tr
                                    key={u.id}
                                    className="border-bottom transition-all duration-300"
                                >
                                    <td className="text-secondary font-monospace text-xs ps-4">
                                        #{u.id}
                                    </td>

                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold" style={{ color: 'var(--text-color)' }}>
                                                {u.firstName} {u.lastName}
                                            </span>
                                            <span className="text-secondary text-xs" style={{ color: 'var(--muted-text)' }}>
                                                {u.email}
                                            </span>
                                            {u.childProfiles && u.childProfiles.length > 0 && (
                                                <div className="mt-2">
                                                    <span className="text-secondary text-xs">Children:</span>
                                                    <ul className="text-secondary text-xs">
                                                        {u.childProfiles.map((child) => (
                                                            <li key={child.id}>
                                                                {child.name} (Age: {child.age})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <select
                                            className="rounded-pill px-3 py-1
                                                           text-[10px] fw-black uppercase tracking-widest
                                                           focus:border-danger outline-none cursor-pointer"
                                            style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                                            value={u.role}
                                            onChange={(e) => {
                                                // Immediately reflect change in UI for smoother UX
                                                onUpdateRole(u.id, e.target.value);
                                            }}
                                        >
                                            <option value="user">USER</option>
                                            <option value="parent">PARENT</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </td>

                                    <td>
                                        <span
                                            className={`px-3 py-1 rounded-pill text-[9px] fw-black uppercase tracking-widest
                                                ${planName === 'Premium'
                                                    ? 'bg-danger/10 text-danger border border-danger/30'
                                                    : planName === 'Standard'
                                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                                        : 'bg-gray-900 text-secondary border border-gray-800'
                                                }`}
                                        >
                                            {planName}
                                        </span>
                                    </td>

                                    <td className="text-end pe-4">
                                        <button
                                            onClick={() => onDeleteUser(u.id)}
                                            className="btn btn-sm rounded-circle
                                                           bg-danger/10 text-danger
                                                           hover:bg-danger hover:text-white
                                                           transition-all duration-300"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {!filteredUsers.length && (
                <div className="p-5 text-center">
                    <p className="text-secondary text-[11px] fw-bold uppercase tracking-widest italic">
                        No users found
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserManagementTab;
