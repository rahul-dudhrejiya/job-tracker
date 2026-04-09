// Status colors and icons
const statusConfig = {
    Wishlist: { color: '#2563eb', icon: '⭐' },
    Applied: { color: '#16a34a', icon: '📨' },
    Interview: { color: '#ca8a04', icon: '🎯' },
    Offer: { color: '#15803d', icon: '🎉' },
    Rejected: { color: '#dc2626', icon: '❌' }
}

const StatusTimeline = ({ history }) => {

    if (!history || history.length === 0) return null

    return (
        <div style={styles.container}>
            <p style={styles.title}>📋 Status Timeline</p>
            <div>
                {history.map((item, index) => {

                    const config = statusConfig[item.status] || statusConfig.Applied
                    const isLast = index === history.length - 1

                    return (
                        <div key={index} style={styles.item}>

                            {/* Left side — dot + line */}
                            <div style={styles.left}>
                                <div style={{
                                    ...styles.dot,
                                    background: config.color,
                                    // Last item is bigger!
                                    width: isLast ? '14px' : '10px',
                                    height: isLast ? '14px' : '10px',
                                }}>
                                </div>
                                {/* Vertical line — hide for last item */}
                                {!isLast && (
                                    <div style={styles.line} />
                                )}
                            </div>

                            {/* Right side — content */}
                            <div style={styles.content}>
                                <div style={styles.row}>
                                    <span style={{
                                        ...styles.status,
                                        color: config.color
                                    }}>
                                        {config.icon} {item.status}
                                    </span>
                                    <span style={styles.date}>
                                        {new Date(item.date)
                                            .toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                        }
                                    </span>
                                </div>
                                {item.note && (
                                    <p style={styles.note}>{item.note}</p>
                                )}
                            </div>

                        </div>
                    )
                })}

            </div>
        </div>
    )
}

const styles = {
    container: {
        background: '#f8f9fa',
        borderRadius: '10px',
        padding: '14px'
    },
    title: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#444',
        marginBottom: '12px'
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column'
    },
    item: {
        display: 'flex',
        gap: '12px'
    },
    left: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '14px'
    },
    dot: {
        borderRadius: '50%',
        flexShrink: 0,
        marginTop: '3px'
    },
    line: {
        width: '2px',
        flex: 1,
        background: '#e5e7eb',
        margin: '4px 0'
    },
    content: {
        paddingBottom: '12px',
        flex: 1
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    status: {
        fontSize: '13px',
        fontWeight: '700'
    },
    date: {
        fontSize: '11px',
        color: '#999'
    },
    note: {
        fontSize: '12px',
        color: '#777',
        marginTop: '3px'
    }
}

export default StatusTimeline