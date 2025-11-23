import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { submitCtAssignment, getCtAssignmentByType } from "../../api/apiCourseType"
import Skeleton from "../common/Skeleton"
import "../../styles/courseType.scss"

const CourseTypeAssignment = () => {
  const { tutorialSlug, courseTypeId } = useParams()
  const navigate = useNavigate()

  const [assignmentId, setAssignmentId] = useState("")
  const [textAnswer, setTextAnswer] = useState("")
  const [externalLink, setExternalLink] = useState("")
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [intro, setIntro] = useState(null) // assignment meta
  const [started, setStarted] = useState(false)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const meta = await getCtAssignmentByType(courseTypeId)
        if (!mounted) return
        setIntro(meta)
        // prefill assignmentId if backend returns id
        if (meta?.id) setAssignmentId(String(meta.id))
      } catch (_) {
        if (mounted) setIntro(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [courseTypeId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(null)
    const effectiveId = intro?.id || assignmentId
    if (!effectiveId) {
      setError("assignment_id topilmadi")
      return
    }
    const form = new FormData()
    form.append("assignment_id", effectiveId)
    if (textAnswer) form.append("text_answer", textAnswer)
    if (externalLink) form.append("external_link", externalLink)
    if (file) form.append("attachment", file)
    setSubmitting(true)
    try {
      const res = await submitCtAssignment(form)
      setSuccess(res || { ok: true })
      setAssignmentId("")
      setTextAnswer("")
      setExternalLink("")
      setFile(null)
    } catch (e) {
      setError("Vazifani yuborishda xatolik")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="ct-assignment-page">
        <div className="page-header" style={{ justifyContent:'center' }}>
          <Skeleton width={220} height={28} rounded={8} />
        </div>
        <div className="stats-grid">
          <Skeleton height={64} rounded={14} />
          <Skeleton height={64} rounded={14} />
          <Skeleton height={64} rounded={14} />
          <Skeleton height={64} rounded={14} />
        </div>
        <div className="rules-card">
          <Skeleton width="40%" height={20} rounded={6} />
          <div style={{ marginTop: 8 }}>
            <Skeleton lines={3} />
          </div>
        </div>
      </div>
    )
  }

  if (!intro) {
    return (
      <div className="ct-assignment-page">
        <div className="page-header" style={{ justifyContent:'center' }}>
          <h2>Oylik vazifa mavjud emas</h2>
        </div>
        <div className="actions" style={{ justifyContent:'center' }}>
          <button type="button" onClick={() => navigate(`/tutorials/${tutorialSlug}`)} className="btn">Orqaga</button>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="ct-assignment-page">
        <div className="page-header" style={{ justifyContent:'center' }}>
          <h2>{intro.title || 'Oylik vazifa'}</h2>
        </div>
        <div className="stats-grid">
          <div className="stat"><div className="label">Maks. ball</div><div className="value">{intro.max_points ?? '-'}</div></div>
          <div className="stat"><div className="label">Muddat</div><div className="value">{intro.due_days_after_completion ? `${intro.due_days_after_completion} kun (video tugagandan keyin)` : 'Yo\'q'}</div></div>
          <div className="stat"><div className="label">Bir nechta topshirish</div><div className="value">{intro.allow_multiple_submissions ? 'Ha' : 'Yo\'q'}</div></div>
          <div className="stat"><div className="label">Holat</div><div className="value">{intro.is_active ? 'Faol' : 'O\'chirilgan'}</div></div>
        </div>
        {intro.description && <div className="rules-card"><h3>Izoh</h3><p style={{margin:0,opacity:0.9}}>{intro.description}</p></div>}
        <div className="rules-card">
          <h3>Qoidalar</h3>
          <ul>
            <li>Fayl formati va hajmiga e'tibor bering</li>
            <li>Tashqi havola va matn javob ixtiyoriy</li>
            <li>Muddatdan kech topshirilgan ishlar qabul qilinmasligi mumkin</li>
          </ul>
        </div>
        <div className="actions" style={{ justifyContent:'center' }}>
          <button className="btn primary" onClick={() => setStarted(true)} disabled={!intro.is_active}>Boshlash</button>
          <button className="btn" onClick={() => navigate(`/tutorials/${tutorialSlug}`)}>Orqaga</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ct-assignment-page">
      <div className="page-header">
        <h2>{intro.title || 'Oylik vazifa'}</h2>
        <div className="meta">
          <span className="pill">Course Type ID: {courseTypeId}</span>
          <span className="pill">Muddat: {intro.due_days_after_completion ? `${intro.due_days_after_completion} kun (video tugagandan keyin)` : 'Yo\'q'}</span>
          {Number.isFinite(intro.max_points) && <span className="pill">Maks. ball: {intro.max_points}</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Matn javob (ixtiyoriy)</span>
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            rows={4}
            placeholder="Javob matni"
          />
        </label>

        <label>
          <span>Tashqi havola (ixtiyoriy)</span>
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          <span>Fayl biriktirish (ixtiyoriy)</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">Yuborildi!</div>}

        <div className="actions">
          <button type="submit" disabled={submitting} className="btn primary">
            {submitting ? 'Yuborilmoqda...' : 'Topshirish'}
          </button>
          <button type="button" onClick={() => navigate(`/tutorials/${tutorialSlug}`)} className="btn">
            Orqaga
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseTypeAssignment
