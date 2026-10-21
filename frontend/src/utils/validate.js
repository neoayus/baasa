export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '')
export const isPhone = (v) => /^[+\d][\d\s().-]*$/.test(v || '') && (v || '').replace(/\D/g, '').length >= 7

/**
 * validate(values, rules) -> { field: message }
 * rule keys: required, email, phone, min, message, custom(value, values) => string | undefined
 */
export function validate(values, rules) {
  const errors = {}
  Object.keys(rules).forEach((key) => {
    const rule = rules[key]
    const raw = values[key]
    const v = typeof raw === 'string' ? raw.trim() : raw
    const empty = v === '' || v == null || v === false || (Array.isArray(v) && v.length === 0)
    if (rule.required && empty) {
      errors[key] = rule.message || 'This field is required'
      return
    }
    if (empty) return
    if (rule.email && !isEmail(v)) errors[key] = 'Enter a valid email address'
    else if (rule.phone && !isPhone(v)) errors[key] = 'Enter a valid phone number'
    else if (rule.min && String(v).length < rule.min) errors[key] = `Use at least ${rule.min} characters`
    else if (rule.custom) {
      const msg = rule.custom(v, values)
      if (msg) errors[key] = msg
    }
  })
  return errors
}
