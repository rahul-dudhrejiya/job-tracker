import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
    Plus, Briefcase, CheckCircle,
    Clock, XCircle, Award
} from 'lucide-react'
import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import AddJobModal from '../components/AddJobModal'
import EditJobModal from '../components/EditJobModal'
import API from '../utils/api'

const Dashboard = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [filter, setFilter] = useState('All')

    // Fetch all jobs when page loads
    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const response = await API.get('/jobs')
            setJobs(response.data.jobs)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch jobs!')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (job) => {
        setSelectedJob(job)
        setShowEditModal(true)
    }

    const handleJobAdded = (newJob) => {
        setJobs([newJob, ...jobs])
        setShowAddModal(false)
        toast.success('Job Added Succesfully')
    }

    const handleJobUpdated = (updatedJob) => {
        setJobs(jobs.map(job =>
            job._id === updatedJob._id ? updatedJob : job
        ))
        setShowEditModal(false)
        toast.success('Job Updated Succesfully')
    }

    const handleDelete = async (jobId) => {
        if (!window.confirm('Delete this job?')) return
        try {
            await API.delete(`/jobs/${jobId}`)
            setJobs(jobs.filter(job => job._id !== jobId))
            toast.success('Job deleted!')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete job!')
        }
    }

    // Filter jobs by status
    const filteredJobs = filter === 'All'
        ? jobs
        : jobs.filter(job => job.status === filter)

    // Stats for summary cards
    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interview: jobs.filter(j => j.status === 'Interview').length,
        offer: jobs.filter(j => j.status === 'Offer').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <StatCard icon={<Briefcase size={20} />}
                        label="Total" value={stats.total} color="#4f46e5" />
                    <StatCard icon={<Clock size={20} />}
                        label="Applied" value={stats.applied} color="#2563eb" />
                    <StatCard icon={<Award size={20} />}
                        label="Interview" value={stats.interview} color="#ca8a04" />
                    <StatCard icon={<CheckCircle size={20} />}
                        label="Offers" value={stats.offer} color="#16a34a" />
                    <StatCard icon={<XCircle size={20} />}
                        label="Rejected" value={stats.rejected} color="#dc2626" />
                </div>

                {/* Header + Add Button */}
                <div style={styles.header}>
                    <h2 style={styles.heading}>My Applications</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={styles.addBtn}
                    >
                        <Plus size={18} />
                        Add Job
                    </button>
                </div>

                {/* Filter Buttons */}
                <div style={styles.filters}>
                    {['All', 'Wishlist', 'Applied',
                        'Interview', 'Offer', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                style={{
                                    ...styles.filterBtn,
                                    background: filter === status ? '#4f46e5' : 'white',
                                    color: filter === status ? 'white' : '#555'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                </div>

                {/* Jobs Grid */}
                {loading ? (
                    <p style={styles.message}>Loading jobs...</p>
                ) : filteredJobs.length === 0 ? (
                    <div style={styles.emptyState}>
                        <Briefcase size={48} color="#ccc" />
                        <p>No jobs found! Add your first job application.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={styles.addBtn}
                        >
                            <Plus size={18} /> Add First Job
                        </button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {
                showAddModal && (
                    <AddJobModal
                        onClose={() => setShowAddModal(false)}
                        onJobAdded={handleJobAdded}
                    />
                )
            }

            {
                showEditModal && selectedJob && (
                    <EditJobModal
                        job={selectedJob}
                        onClose={() => setShowEditModal(false)}
                        onJobUpdated={handleJobUpdated}
                    />
                )
            }

        </div >
    )
}

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
        <div style={{
            width: '44px', height: '44px',
            borderRadius: '10px',
            background: color + '15',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '24px', fontWeight: '700', color }}>{value}</p>
            <p style={{ fontSize: '13px', color: '#888' }}>{label}</p>
        </div>
    </div>
)

const styles = {
    page: { minHeight: '100vh', background: '#f0f2f5' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    heading: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e' },
    addBtn: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '14px', fontWeight: '600'
    },
    filters: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
    filterBtn: {
        padding: '8px 16px', border: '1px solid #e5e7eb',
        borderRadius: '20px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
    },
    message: { textAlign: 'center', color: '#888', padding: '40px' },
    emptyState: {
        textAlign: 'center', padding: '60px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px', color: '#888'
    }
}

export default Dashboard