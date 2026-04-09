import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = {
    Wishlist: '#2563eb',
    Applied: '#16a34a',
    Interview: '#ca8a04',
    Offer: '#15803d',
    Rejected: '#dc2626'
}

const Analytics = ({ jobs }) => {

    // ── Pie Chart Data 
    // Count how many jobs in each status
    const statusData = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']
        .map(status => ({
            name: status,
            value: jobs.filter(job => job.status === status).length
        }))
        .filter(item => item.value > 0) // only show statuses that have jobs

    // ── Bar Chart Data ──────────────────────────
    // Group jobs by week
    const weeklyData = getWeeklyData(jobs)


    // ── Success Rate
    const offers = jobs.filter(j => j.status === 'Offer').length
    const successRate = jobs.length > 0
        ? Math.round((offers / jobs.length) * 100)
        : 0

    return (
        <div style={styles.container}>

            {/* Title */}
            <h2 style={styles.title}>📊 Analytics</h2>

            {/* Success Rate Banner */}
            <div style={styles.banner}>
                <div style={styles.bannerItem}>
                    <span style={styles.bannerNumber}>{jobs.length}</span>
                    <span style={styles.bannerLabel}>Total Applications</span>
                </div>
                <div style={styles.bannerItem}>
                    <span style={styles.bannerNumber}>{offers}</span>
                    <span style={styles.bannerLabel}>Offers Received</span>
                </div>
                <div style={styles.bannerItem}>
                    <span style={styles.bannerNumber}>{successRate}%</span>
                    <span style={styles.bannerLabel}>Success Rate</span>
                </div>
                <div style={styles.bannerItem}>
                    <span style={styles.bannerNumber}>
                        {jobs.filter(j => j.status === 'Interview').length}
                    </span>
                    <span style={styles.bannerLabel}>In Interview</span>
                </div>
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>

                {/* Pie Chart */}
                <div style={styles.chartBox}>
                    <h3 style={styles.chartTitle}>Applications by Status</h3>
                    {statusData.length === 0 ? (
                        <p style={styles.empty}>No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {statusData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={COLORS[entry.name]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Bar Chart */}
                <div style={styles.chartBox}>
                    <h3 style={styles.chartTitle}>Applications per Week</h3>
                    {weeklyData.length === 0 ? (
                        <p style={styles.empty}>No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="count"
                                    fill="#4f46e5"
                                    radius={[6, 6, 0, 0]}
                                    name="Applications"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

            </div>
        </div>
    )
}

// ── Helper: Group jobs by wee
const getWeeklyData = (jobs) => {
    const weeks = {}

    jobs.forEach(job => {
        const date = new Date(job.createdAt)
        
        // Get Monday of that week
        const monday = new Date(date)
        monday.setDate(date.getDate() - date.getDay() + 1)
        
        // Format as "Apr 1"
        const key = monday.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        })

        weeks[key] = (weeks[key] || 0) + 1
    })

    // Convert object to array for recharts
    return Object.entries(weeks)
        .map(([week, count]) => ({ week, count }))
        .slice(-6) // show last 6 weeks only
}

// ── Styles ──────────────────────────────────────
const styles = {
    container: {
        marginBottom: '32px'
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '16px'
    },
    banner: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
    },
    bannerItem: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    bannerNumber: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#4f46e5'
    },
    bannerLabel: {
        fontSize: '13px',
        color: '#888',
        fontWeight: '500'
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
    },
    chartBox: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    chartTitle: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '12px'
    },
    empty: {
        textAlign: 'center',
        color: '#aaa',
        padding: '40px 0'
    }
}

export default Analytics