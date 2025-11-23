import React, { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCtTestByType, submitCtTest, getMyCtTestResults } from "../../api/apiCourseType"
import "../../styles/courseType.scss"

const CourseTypeTest = () => {
  const { tutorialSlug, courseTypeId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState({}) // { [questionId]: optionId }
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [myResults, setMyResults] = useState([])
  const [started, setStarted] = useState(false)
  const [remaining, setRemaining] = useState(null) // seconds

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const t = await getCtTestByType(courseTypeId)
        if (!mounted) return
        setTest(t || null)
        if (t?.time_limit_minutes) {
          setRemaining(Math.max(0, Math.floor(Number(t.time_limit_minutes) * 60)))
        }
      } catch (e) {
        if (mounted) setError("Testni yuklashda xatolik")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [courseTypeId])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const results = await getMyCtTestResults({ course_type_id: courseTypeId })
        if (mounted) setMyResults(Array.isArray(results) ? results : [])
      } catch (_) {}
    })()
    return () => { mounted = false }
  }, [courseTypeId, submitResult])

  // Countdown when started
  useEffect(() => {
    if (!started) return
    if (!Number.isFinite(remaining)) return
    if (remaining === 0) {
      // Auto submit when time is up
      handleSubmit()
      return
    }
    const id = setInterval(() => {
      setRemaining((sec) => (sec && sec > 0 ? sec - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [started, remaining])

  const totalQuestions = useMemo(() => Array.isArray(test?.questions) ? test.questions.length : 0, [test])
  const formatTime = (s) => {
    if (!Number.isFinite(s)) return "--:--"
    const mm = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async () => {
    if (!test?.id) return
    const body = {
      test_id: test.id,
      answers: Object.entries(answers).map(([qId, optId]) => ({
        question_id: Number(qId),
        selected_option_id: Number(optId),
      })),
    }
    setSubmitting(true)
    setError("")
    try {
      const res = await submitCtTest(body)
      setSubmitResult(res || null)
    } catch (e) {
      setError("Javoblarni yuborishda xatolik")
    } finally {
      setSubmitting(false)
    }
  }

  const answeredCount = Object.keys(answers).length

  if (loading) return (
    <div className="ct-test-page"><div className="info">Yuklanmoqda...</div></div>
  )
  if (error) return (
    <div className="ct-test-page"><div className="error">{error}</div></div>
  )
  if (!test) return (
    <div className="ct-test-page">
      <h2>Oylik test topilmadi</h2>
      <button onClick={() => navigate(`/tutorials/${tutorialSlug}`)}>Orqaga qaytish</button>
    </div>
  )

  // PRE-START SCREEN
  if (!started && !submitResult) {
    return (
      <div className="ct-test-page">
        <div className="page-header" style={{ justifyContent:'center' }}>
          <h2>{test.title || 'Oylik test'}</h2>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <div className="label">Savollar soni</div>
            <div className="value">{totalQuestions}</div>
          </div>
          <div className="stat">
            <div className="label">Vaqt</div>
            <div className="value">{Number.isFinite(test.time_limit_minutes) ? `${test.time_limit_minutes} min` : 'Cheklanmagan'}</div>
          </div>
          <div className="stat">
            <div className="label">O‘tish balli</div>
            <div className="value">{Number.isFinite(test.pass_score) ? `${test.pass_score}%` : '-'}</div>
          </div>
          <div className="stat">
            <div className="label">Urinishlar</div>
            <div className="value">{Number.isFinite(test.attempts_allowed) ? test.attempts_allowed : '-'}</div>
          </div>
        </div>

        <div className="rules-card">
          <h3>Qoidalar:</h3>
          <ul>
            <li>Testni boshlashdan oldin videoni to‘liq ko‘rib chiqing</li>
            <li>Har bir savolga faqat bitta javob tanlash mumkin</li>
            <li>Vaqt tugagach test avtomatik yakunlanadi</li>
            <li>O‘tish uchun kerakli % ball to‘planishi shart</li>
          </ul>
        </div>

        <div className="actions" style={{ justifyContent:'center' }}>
          <button className="btn primary" onClick={() => setStarted(true)}>Testni boshlash</button>
          <button className="btn" onClick={() => navigate(`/tutorials/${tutorialSlug}`)}>Orqaga</button>
        </div>
      </div>
    )
  }

  // TEST SCREEN
  return (
    <div className="ct-test-page">
      <div className="page-header">
        <h2>{test.title || 'Oylik test'}</h2>
        <div className="meta">
          <span className="pill">{totalQuestions} savol</span>
          {Number.isFinite(remaining) && <span className="pill countdown-pill">{formatTime(remaining)}</span>}
        </div>
      </div>

      <div>
        {(test.questions || []).map((q, idx) => (
          <div key={q.id || idx} className="card question-card">
            <div className="q-title">{idx + 1}. {q.text}</div>
            <div className="options">
              {(q.options || []).map((opt) => (
                <label key={opt.id} className="option">
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button disabled={submitting} onClick={handleSubmit} className="btn primary">
          {submitting ? 'Yuborilmoqda...' : 'Javoblarni yuborish'}
        </button>
        <button onClick={() => navigate(`/tutorials/${tutorialSlug}`)} className="btn">
          Orqaga
        </button>
      </div>

      {submitResult && (
        <div className="card" style={{ padding: 12 }}>
          <h3>Natija</h3>
          <div>Ball: {Number(submitResult.score_percent ?? submitResult.score)?.toFixed?.(1) ?? submitResult.score_percent}%</div>
          <div>Holat: {submitResult.passed ? 'O‘tildi' : 'O‘tilmadi'}</div>
        </div>
      )}

      {myResults.length > 0 && (
        <div className="results">
          <h3>Mening natijalarim</h3>
          {myResults.map(r => (
            <div key={r.id} className="result-item">
              <div><strong>Urinish:</strong> {r.attempt}</div>
              <div><strong>Ball:</strong> {Number(r.score)?.toFixed?.(1) ?? r.score}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseTypeTest
