import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
    Plus, Briefcase, CheckCircle,
    Clock, XCircle, Award,
    Search,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import AddJobModal from '../components/AddJobModal'
import EditJobModal from '../components/EditJobModal'
import API from '../utils/api'
import Analytics from '../components/Analytics'

const Dashboard = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [filter, setFilter] = useState('All')
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('darkMode') === 'true'
    })
    const toggleDark = () => {
        const newValue = !isDark
        setIsDark(newValue)
        localStorage.setItem('darkMode', newValue)
    }
    const [search, setSearch] = useState('') // this is add to search jobs
    const [sort, setSort] = useState('Newest') // this is add to sort jobs

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

    const handleExportCSV = () => {

        // Step 1: Define column headers
        const headers = [
            'Company',
            'Role',
            'Status',
            'Priority',
            'Location',
            'Salary',
            'Applied Date',
            'Notes',
            'Job URL'
        ]

        // Step 2: Convert each job to a CSV row
        const rows = jobs.map(job => [
            job.company,
            job.role,
            job.status,
            job.priority,
            job.location,

            // Wrap in quotes → handles commas inside values!
            // Example: salary "20,000" without quotes breaks CSV!
            `"${job.salary || ''}"`,

            // Format date nicely
            job.appliedDate || job.appliedData
                ? new Date(job.appliedDate || job.appliedData)
                    .toLocaleDateString('en-IN')
                : '',

            // Replace newlines in notes → CSV breaks on newlines!
            `"${(job.notes || '').replace(/\n/g, ' ')}"`,

            job.jobUrl || ''
        ])

        // Step 3: Combine headers + rows into one CSV string
        const csvContent = [
            headers.join(','),   // "Company,Role,Status,..."
            ...rows.map(row => row.join(','))   // "Google,Developer,Applied,..."
        ].join('\n')    // each row on new line

        // Step 4: Create a Blob (file in memory)
        const blob = new Blob([csvContent], { type: 'text/csv' })

        // Step 5: Create download URL from blob
        const url = URL.createObjectURL(blob)

        // Step 6: Create invisible link + click it
        const link = document.createElement('a')
        link.href = url
        link.download = `job-tracker-${new Date().toLocaleDateString('en-IN')}.csv`
        document.body.appendChild(link)
        link.click()

        // Step 7: Clean up
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`Exported ${jobs.length} jobs to CSV!`)
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

    // Filter jobs by status AND search
    const filteredJobs = jobs
        .filter(job => {
            // Step 1: Check status filter
            const matchesFilter = filter === 'All' || job.status === filter

            // Step 2: Check search filter
            // .toLowerCase() → makes search case insensitive
            // "Google" and "google" both match!
            const matchesSearch =
                job.company.toLowerCase().includes(search.toLowerCase()) ||
                job.role.toLowerCase().includes(search.toLowerCase()) ||
                job.location.toLowerCase().includes(search.toLowerCase())

            // Step 3: Job must match BOTH filters!
            return matchesFilter && matchesSearch
        })
        // Sort jobs based on selected sort option
        .sort((a, b) => {
            if (sort === 'newest') {
                // Newest first → bigger date comes first
                return new Date(b.createdAt) - new Date(a.createdAt)
            }
            if (sort === 'oldest') {
                // Oldest first → smaller date comes first
                return new Date(a.createdAt) - new Date(b.createdAt)
            }
            if (sort === 'company') {
                // A-Z alphabetically by company name
                return a.company.localeCompare(b.company)
            }
            if (sort === 'priority') {
                // High priority first
                const order = { 'High': 1, 'Medium': 2, 'Low': 3 }
                return order[a.priority] - order[b.priority]
            }
            return 0
        })


    // Stats for summary cards
    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interview: jobs.filter(j => j.status === 'Interview').length,
        offer: jobs.filter(j => j.status === 'Offer').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    }

    return (
        <div style={{
            ...styles.page,
            background: isDark ? '#13131f' : '#f0f2f5',
        minHeight: '100vh'
        }}>
            <Navbar isDark={isDark} toggleDark={toggleDark} />
            <div style={{
                ...styles.container,
                color: isDark ? '#e0e0e0' : '#333'
            }}>

                {/* Analytics */}
                <Analytics jobs={jobs} />

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
                    <h2 style={styles.heading}>
                        My Applications
                        {search && (
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: '#888',
                                marginLeft: '8px'
                            }}>
                                ({filteredJobs.length} results for "{search}")
                            </span>
                        )}
                    </h2>

                    {/* Buttons Row */}
                    <div style={{ display: 'flex', gap: '10px' }}>

                        {/* Export Button */}
                        <button
                            onClick={handleExportCSV}
                            disabled={jobs.length === 0}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: jobs.length === 0 ? '#e5e7eb' : '#16a34a',
                                color: jobs.length === 0 ? '#999' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: jobs.length === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ⬇ Export CSV
                        </button>

                        {/* Add Job Button */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={styles.addBtn}
                        >
                            <Plus size={18} />
                            Add Job
                        </button>
                    </div>

                </div>

                {/* Sort Dropdown */}
                <div style={styles.sortBox}>
                    <label style={styles.sortLabel}>Sort by:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={styles.sortSelect}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="company">Company A-Z</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>

                {/* Search Box */}
                <div style={styles.searchBox}>
                    <Search size={18} color='#888' style={styles.searchIcon} />
                    <input
                        type='text'
                        placeholder='Search by company, role or location...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                    {/* Show X button only when user has typed something */}
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={styles.clearBtn}
                        />
                    )}
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
    controls: {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    sortBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
    },
    sortLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        whiteSpace: 'nowrap'
    },
    sortSelect: {
        padding: '10px 14px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '13px',
        outline: 'none',
        background: 'white',
        color: '#333',
        cursor: 'pointer'
    },
    searchBox: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        marginBottom: '16px'
    },
    searchIcon: {
        position: 'absolute',
        left: '14px',
        pointerEvents: 'none'  // icon doesn't block typing
    },
    searchInput: {
        width: '100%',
        padding: '12px 40px 12px 44px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '14px',
        outline: 'none',
        background: 'white',
        color: '#333'
    },
    clearBtn: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        color: '#888',
        cursor: 'pointer',
        padding: '4px'
    },
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