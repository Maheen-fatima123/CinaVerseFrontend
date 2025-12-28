import React, { useState } from 'react';
import { Terminal, Database, ShieldAlert, User, Activity, Globe } from 'lucide-react';

const LogsAnalyticsTab = ({ logs = {} }) => {
    const { loginLogs = [], apiLogs = [] } = logs;

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (statusCode) => {
        if (!statusCode) return 'text-secondary';
        if (statusCode >= 200 && statusCode < 300) return 'text-success';
        if (statusCode >= 300 && statusCode < 400) return 'text-info';
        if (statusCode >= 400 && statusCode < 500) return 'text-warning';
        return 'text-danger';
    };

    const getActivityColor = (activity) => {
        if (!activity) return 'text-secondary';
        const act = activity.toLowerCase();
        if (act.includes('login')) return 'text-success';
        if (act.includes('logout')) return 'text-warning';
        if (act.includes('fail')) return 'text-danger';
        return 'text-info';
    };

    return (
        <div className="premium-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>
            <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">
                Logs & Analytics
            </h3>

            {/* Login Logs Table */}
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <ShieldAlert size={20} className="text-success" />
                    <h4 className="fw-bold mb-0 fs-5" style={{ color: 'var(--text-color)' }}>Login Activity Logs</h4>
                    <span className="badge bg-success rounded-pill ms-auto">{loginLogs.length}</span>
                </div>

                <div className="table-responsive border rounded-4 shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                    <table className="table table-hover mb-0">
                        <thead className="border-bottom" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color) !important' }}>
                            <tr>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <User size={14} className="me-2" />Username
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Activity size={14} className="me-2" />Activity
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Globe size={14} className="me-2" />IP Address
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Terminal size={14} className="me-2" />Timestamp
                                </th>
                                <th className="text-danger fw-bold text-uppercase text-center" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    Log ID
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginLogs.length > 0 ? (
                                loginLogs.map((log) => (
                                    <tr key={log.id} className="border-bottom hover:bg-white/5 transition-all" style={{ borderColor: 'var(--border-color) !important' }}>
                                        <td className="fw-semibold" style={{ fontSize: '13px', color: 'var(--text-color)' }}>
                                            {log.user?.username || log.user?.email || 'Unknown User'}
                                        </td>
                                        <td>
                                            <span className={`badge ${getActivityColor(log.activity)} bg-opacity-20 fw-bold`} style={{ fontSize: '11px' }}>
                                                {log.activity || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="text-secondary font-mono" style={{ fontSize: '12px' }}>
                                            {log.ipAddress || 'N/A'}
                                        </td>
                                        <td className="text-secondary" style={{ fontSize: '12px' }}>
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td className="text-center">
                                            <code className="text-danger bg-danger bg-opacity-10 px-2 py-1 rounded" style={{ fontSize: '10px' }}>
                                                #{log.id}
                                            </code>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-secondary italic">
                                        No login logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* API Logs Table */}
            <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <Database size={20} className="text-primary" />
                    <h4 className="fw-bold mb-0 fs-5" style={{ color: 'var(--text-color)' }}>API Request Logs</h4>
                    <span className="badge bg-primary rounded-pill ms-auto">{apiLogs.length}</span>
                </div>

                <div className="table-responsive border rounded-4 shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                    <table className="table table-hover mb-0">
                        <thead className="border-bottom" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color) !important' }}>
                            <tr>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <User size={14} className="me-2" />Username
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Globe size={14} className="me-2" />Endpoint
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Activity size={14} className="me-2" />Status
                                </th>
                                <th className="text-danger fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    <Terminal size={14} className="me-2" />Timestamp
                                </th>
                                <th className="text-danger fw-bold text-uppercase text-center" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    Log ID
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiLogs.length > 0 ? (
                                apiLogs.map((log) => (
                                    <tr key={log.id} className="border-bottom hover:bg-white/5 transition-all" style={{ borderColor: 'var(--border-color) !important' }}>
                                        <td className="fw-semibold" style={{ fontSize: '13px', color: 'var(--text-color)' }}>
                                            {log.user?.username || log.user?.email || 'Anonymous'}
                                        </td>
                                        <td className="text-secondary font-mono" style={{ fontSize: '12px' }}>
                                            {log.endpoint || 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusColor(log.statusCode)} bg-opacity-20 fw-bold`} style={{ fontSize: '11px' }}>
                                                {log.statusCode || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="text-secondary" style={{ fontSize: '12px' }}>
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td className="text-center">
                                            <code className="text-danger bg-danger bg-opacity-10 px-2 py-1 rounded" style={{ fontSize: '10px' }}>
                                                #{log.id}
                                            </code>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-secondary italic">
                                        No API logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogsAnalyticsTab;
