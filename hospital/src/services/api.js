const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function buildHeaders(token, hasJsonBody = false) {
  const headers = {}

  if (hasJsonBody) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
  } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo completar la solicitud')
  }

  return data
}
