import {
    Trash2, Edit, MapPin, DollarSign,
    Calendar, ExternalLink
} from 'lucide-react'
import { getInterviewStatus } from '../utils/interviewHelper'
import StatusTimeline from './StatusTimeline'

// Status colors
const statusColors = {
    Wishlist: { bg: '#eff6ff', color: '#2563eb' },
    Applied: { bg: '#f0fdf4', color: '#16a34a' },
    Interview: { bg: '#fefce8', color: '#ca8a04' },
    Offer: { bg: '#f0fdf4', color: '#15803d' },
    Rejected: { bg: '#fef2f2', color: '#dc2626' }
}

const priorityColors = {
    Low: { bg: '#f0fdf4', color: '#16a34a' },
    Medium: { bg: '#fefce8', color: '#ca8a04' },
    High: { bg: '#fef2f2', color: '#dc2626' }
}

const JobCard = ({ job, onDelete, onEdit }) => {
    const statusStyle = statusColors[job.status] || statusColors.Applied
    const priorityStyle = priorityColors[job.priority] || priorityColors.Medium
    const interviewStatus = getInterviewStatus(job.interviewDate)

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.company}>{job.company}</h3>
                    <p style={styles.role}>{job.role}</p>
                </div>
                <div style={styles.actions}>
                    <button
                        onClick={() => onEdit(job)}
                        style={styles.editBtn}
                    >
                        <Edit size={15} />
                    </button>
                    <button
                        onClick={() => onDelete(job._id)}
                        style={styles.deleteBtn}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            { /* Status + Priority */}
            <div style={styles.badges}>
                <span style={{
                    ...styles.badge,
                    background: statusStyle.bg,
                    color: statusStyle.color
                }}>
                    {job.status}
                </span>

                {/* Interview Date Badge */}
                {interviewStatus && (
                    <span style={{
                        ...styles.badge,
                        background: interviewStatus.bg,
                        color: interviewStatus.color,
                        fontWeight: '700'
                    }}>
                        {interviewStatus.label}
                    </span>
                )}

                <span style={{
                    ...styles.badge,
                    background: priorityStyle.bg,
                    color: priorityStyle.color
                }}>
                    {job.priority} Priority
                </span>
            </div>

            {/* Details */}
            <div style={styles.details}>
                {job.location && (
                    <div style={styles.detail}>
                        <MapPin size={13} color='#888' />
                        <span>{job.location}</span>
                    </div>
                )}
                {job.salary && (
                    <div style={styles.detail}>
                        <DollarSign size={13} color='#888' />
                        <span>{job.salary}</span>
                    </div>
                )}
                <div style={styles.detail}>
                    <Calendar size={13} color='#888' />
                    <span>
                        {job.appliedDate || job.appliedData
                            ? new Date(job.appliedDate || job.appliedData)
                                .toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })
                            : 'No date'
                        }
                    </span>
                </div>
            </div>

            {/* Notes */}
            {
                job.notes && (
                    <p style={styles.notes}>{job.notes}</p>
                )
            }

            {/* Status Timeline */}
            <StatusTimeline history={job.statusHistory} />

            {/* Job URL */}
            {
                job.jobUrl && (
                    <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                    >
                        <ExternalLink size={13} />
                        View Job Posting
                    </a>
                )
            }
        </div >
    )
}

const styles = {
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #f0f0f0'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    company: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#1a1a2e'
    },
    role: {
        fontSize: '14px',
        color: '#555',
        marginTop: '3px'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    editBtn: {
        padding: '6px',
        background: '#eff6ff',
        color: '#2563eb',
        border: 'none',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center'
    },
    deleteBtn: {
        padding: '6px',
        background: '#fef2f2',
        color: '#dc2626',
        border: 'none',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center'
    },
    badges: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    badge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    details: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
    },
    detail: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        color: '#666'
    },
    notes: {
        fontSize: '13px',
        color: '#777',
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '8px',
        lineHeight: '1.5'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '13px',
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: '500'
    }
}

export default JobCard