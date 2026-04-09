// Returns how many days until interview
export const getInterviewStatus = (interviewDate) => {

    if (!interviewDate) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)   // reset to midnight

    const interview = new Date(interviewDate)
    interview.setHours(0, 0, 0, 0)

    // Difference in days
    const diff = Math.round(
        (interview - today) / (1000 * 60 * 60 * 24)
    )

    if (diff < 0) return { label: 'Interview Passed', color: '#888', bg: '#f5f5f5' }
    if (diff === 0) return { label: '🔴 Today!', color: '#dc2626', bg: '#fef2f2' }
    if (diff === 1) return { label: '🔴 Tomorrow!', color: '#dc2626', bg: '#fef2f2' }
    if (diff <= 7) return { label: `🟡 In ${diff} days`, color: '#ca8a04', bg: '#fefce8' }

    return {
        label: `📅 ${new Date(interviewDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        })}`,
        color: '#16a34a',
        bg: '#f0fdf4'
    }
}