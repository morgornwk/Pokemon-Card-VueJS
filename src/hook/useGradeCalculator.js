import { ref, computed } from 'vue'

const CRITERIA = [
  { grade: 'A', range: '80 - 100', label: 'ยอดเยี่ยม (Excellent)', color: '#059669', bg: '#ecfdf5', icon: 'mdi-trophy-outline' },
  { grade: 'B', range: '70 - 79', label: 'ดีมาก (Very Good)', color: '#2563eb', bg: '#eff6ff', icon: 'mdi-star-outline' },
  { grade: 'C', range: '60 - 69', label: 'ผ่านเกณฑ์ (Good)', color: '#16a34a', bg: '#f0fdf4', icon: 'mdi-check-circle-outline' },
  { grade: 'D', range: '50 - 59', label: 'พอใช้ (Fair)', color: '#ea580c', bg: '#fff7ed', icon: 'mdi-alert-circle-outline' },
  { grade: 'F', range: '0 - 49', label: 'ตกเกณฑ์ (Fail)', color: '#dc2626', bg: '#fef2f2', icon: 'mdi-close-circle-outline' },
]

export function useGradeCalculator() {
  const formRef = ref(null)
  const score = ref('')
  const grade = ref(null)

  const rules = [
    (v) => (v !== '' && v !== null && v !== undefined) || 'กรุณากรอกคะแนน',
    (v) => !isNaN(Number(v)) || 'กรุณากรอกเฉพาะตัวเลข',
    (v) => (Number(v) >= 0 && Number(v) <= 100) || 'คะแนนต้องอยู่ระหว่าง 0 - 100',
  ]

  const gradeMeta = computed(() => {
    if (!grade.value) return null
    switch (grade.value) {
      case 'A':
        return {
          grade: 'A',
          label: 'ยอดเยี่ยม (Excellent)',
          color: '#059669',
          bg: '#ecfdf5',
          border: '#a7f3d0',
          icon: 'mdi-trophy-variant',
          message: 'สุดยอดมาก! ผลการเรียนอยู่ในระดับดีเยี่ยม รักษาความยอดเยี่ยมนี้ไว้นะครับ 🎉',
        }
      case 'B':
        return {
          grade: 'B',
          label: 'ดีมาก (Very Good)',
          color: '#2563eb',
          bg: '#eff6ff',
          border: '#bfdbfe',
          icon: 'mdi-star-circle',
          message: 'ทำคะแนนได้ดีมาก มีความเข้าใจในบทเรียนเป็นอย่างดี สู้ต่อไปครับ 👏',
        }
      case 'C':
        return {
          grade: 'C',
          label: 'ผ่านเกณฑ์ (Good)',
          color: '#16a34a',
          bg: '#f0fdf4',
          border: '#bbf7d0',
          icon: 'mdi-check-decagram',
          message: 'ผ่านเกณฑ์เรียบร้อย มีพื้นฐานที่ดี พร้อมต่อยอดให้เก่งขึ้นไปอีกขั้น 👍',
        }
      case 'D':
        return {
          grade: 'D',
          label: 'พอใช้ (Fair)',
          color: '#ea580c',
          bg: '#fff7ed',
          border: '#fed7aa',
          icon: 'mdi-alert-circle',
          message: 'ผ่านเกณฑ์ขั้นต่ำ ควรทบทวนจุดที่ยังไม่เข้าใจเพิ่มเติมเพื่อเตรียมพร้อมรอบถัดไป 📖',
        }
      case 'F':
      default:
        return {
          grade: 'F',
          label: 'ตกเกณฑ์ (Needs Improvement)',
          color: '#dc2626',
          bg: '#fef2f2',
          border: '#fecaca',
          icon: 'mdi-close-octagon',
          message: 'คะแนนยังไม่ผ่านเกณฑ์ ไม่เป็นไรนะ ทบทวนใหม่และตั้งใจใหม่อีกครั้ง เป็นกำลังใจให้! 💪',
        }
    }
  })

  const numericScore = computed(() => {
    const n = Number(score.value)
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n))
  })

  function calculate() {
    if (!formRef.value || !formRef.value.validate()) {
      grade.value = null
      return
    }

    const num = Number(score.value)
    if (num >= 80) grade.value = 'A'
    else if (num >= 70) grade.value = 'B'
    else if (num >= 60) grade.value = 'C'
    else if (num >= 50) grade.value = 'D'
    else grade.value = 'F'
  }

  function setPreset(val) {
    score.value = String(val)
    calculate()
  }

  function reset() {
    score.value = ''
    grade.value = null
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  }

  return {
    formRef,
    score,
    grade,
    gradeMeta,
    numericScore,
    rules,
    criteria: CRITERIA,
    calculate,
    setPreset,
    reset,
  }
}
