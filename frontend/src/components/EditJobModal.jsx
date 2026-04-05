import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import API from '../utils/api'

const EditJobModal = ({ job, onClose, onJobUpdated }) => {
  const [formData, setFormData] = useState({
    company: job.company || '',
    role: job.role || '',
    location: job.location || '',
    status: job.status || 'Applied',
    salary: job.salary || '',
    jobUrl: job.jobUrl || '',
    notes: job.notes || '',
    priority: job.priority || 'Medium'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await API.put(`/jobs/${job._id}`, formData)
      onJobUpdated(response.data.job)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <div style={styles.header}>
          <h2 style={styles.title}>Edit Job</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Company</label>
              <input name="company" value={formData.company}
                onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role</label>
              <input name="role" value={formData.role}
                onChange={handleChange} style={styles.input} />
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
              <input name="location" value={formData.location}
                onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Salary</label>
              <input name="salary" value={formData.salary}
                onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Job URL</label>
            <input name="jobUrl" value={formData.jobUrl}
              onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Notes</label>
            <textarea name="notes" value={formData.notes}
              onChange={handleChange}
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={styles.buttons}>
            <button type="button" onClick={onClose}
              style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Changes'}
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
    justifyContent: 'center', zIndex: 1000, padding: '20px'
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
  closeBtn: { background: 'none', border: 'none', color: '#888' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
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

export default EditJobModal
