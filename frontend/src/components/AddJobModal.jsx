import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import API from '../utils/api'

const AddJobModal = ({ onClose, onJobAdded }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        location: 'Remote',
        status: 'Applied',
        salary: '',
        jobUrl: '',
        notes: '',
        priority: 'Medium',
        interviewDate: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.company || !formData.role) {
            toast.error('Company and Role are required!')
            return
        }

        try {
            setLoading(true)
            const response = await API.post('/jobs', formData)
            onJobAdded(response.data.job)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add job!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>Add New Job</h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Company *</label>
                            <input name="company" placeholder="Google"
                                value={formData.company} onChange={handleChange}
                                style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Role *</label>
                            <input name="role" placeholder="Frontend Developer"
                                value={formData.role} onChange={handleChange}
                                style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Status</label>
                            <select name="status" value={formData.status}
                                onChange={handleChange} style={styles.input}>
                                <option>Wishlist</option>
                                <option>Applied</option>
                                <option>Interview</option>
                                <option>Offer</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Priority</label>
                            <select name="priority" value={formData.priority}
                                onChange={handleChange} style={styles.input}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Location</label>
                            <input name="location" placeholder="Remote / Bangalore"
                                value={formData.location} onChange={handleChange}
                                style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Salary</label>
                            <input name="salary" placeholder="20 LPA"
                                value={formData.salary} onChange={handleChange}
                                style={styles.input} />
                        </div>
                    </div>

                    {/* Show interview date only when status is Interview */}
                    {formData.status === 'Interview' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                📅 Interview Date
                            </label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={formData.interviewDate} 
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Job URL</label>
                        <input name="jobUrl" placeholder="https://linkedin.com/jobs/..."
                            value={formData.jobUrl} onChange={handleChange}
                            style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Notes</label>
                        <textarea name="notes" placeholder="Any notes..."
                            value={formData.notes} onChange={handleChange}
                            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose}
                            style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Adding...' : 'Add Job'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}


const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000,
        padding: '20px'
    },
    modal: {
        background: 'white', borderRadius: '16px',
        width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflowY: 'auto'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '20px 24px',
        borderBottom: '1px solid #f0f0f0'
    },
    title: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e' },
    closeBtn: {
        background: 'none', border: 'none',
        color: '#888', cursor: 'pointer'
    },
    form: {
        padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '16px'
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#444' },
    input: {
        padding: '10px 14px', border: '2px solid #e5e7eb',
        borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%'
    },
    buttons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    cancelBtn: {
        padding: '10px 24px', background: '#f5f5f5',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', color: '#555'
    },
    submitBtn: {
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '14px', fontWeight: '600'
    }
}

export default AddJobModal