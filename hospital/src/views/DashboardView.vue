<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { apiRequest } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const responseMessage = ref('')
const errorMessage = ref('')
const vitalsResult = ref(null)
const mqttResult = ref(null)
const doseResult = ref(null)
const loading = reactive({
  vitals: false,
  mqtt: false,
  dose: false,
})

const doseForm = reactive({
  paciente: 'Ana Perez',
  medicamento: 'Insulina',
  dosis: 8,
})

const mqttForm = reactive({
  deviceId: 'iot-monitor-01',
  paciente: 'Ana Perez',
  temperatura: 36.7,
  presion: '120/80',
})

const role = computed(() => authStore.user?.role || '')
const canViewVitals = computed(() => ['doctor', 'enfermero'].includes(role.value))
const canUpdateDose = computed(() => role.value === 'farmacia')
const canSendMqtt = computed(() => ['doctor', 'tecnico'].includes(role.value))

function formatJson(value) {
  return JSON.stringify(value, null, 2)
}

function clearFeedback() {
  responseMessage.value = ''
  errorMessage.value = ''
}

async function fetchVitals() {
  clearFeedback()
  loading.vitals = true

  try {
    const response = await apiRequest('/vitals', {
      token: authStore.token,
    })

    vitalsResult.value = response
    responseMessage.value = 'Signos vitales cargados correctamente.'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.vitals = false
  }
}

async function submitDose() {
  clearFeedback()
  loading.dose = true

  try {
    const response = await apiRequest('/dosis', {
      method: 'POST',
      token: authStore.token,
      body: {
        ...doseForm,
        dosis: Number(doseForm.dosis),
      },
    })

    doseResult.value = response
    responseMessage.value = response.message
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.dose = false
  }
}

async function submitMqtt() {
  clearFeedback()
  loading.mqtt = true

  try {
    const response = await apiRequest('/mqtt-data', {
      method: 'POST',
      token: authStore.token,
      body: {
        ...mqttForm,
        temperatura: Number(mqttForm.temperatura),
      },
    })

    mqttResult.value = response
    responseMessage.value = response.message
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.mqtt = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="dashboard-shell">
    <section class="topbar">
      <div>
        <p class="eyebrow">Panel Hospitalario</p>
        <h1>{{ authStore.user?.username }}</h1>
        <p class="subtitle">
          Rol activo: <strong>{{ authStore.user?.role }}</strong> | Token: {{ authStore.expiresIn }}
        </p>
      </div>

      <button class="secondary" type="button" @click="handleLogout">Cerrar sesion</button>
    </section>

    <p v-if="responseMessage" class="status success">{{ responseMessage }}</p>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>

    <section class="card-grid">
      <article v-if="canViewVitals" class="card">
        <div class="card__header">
          <div>
            <p class="card__eyebrow">GET /vitals</p>
            <h2>Monitoreo de signos vitales</h2>
          </div>
          <button type="button" @click="fetchVitals" :disabled="loading.vitals">
            {{ loading.vitals ? 'Consultando...' : 'Consultar' }}
          </button>
        </div>

        <pre v-if="vitalsResult">{{ formatJson(vitalsResult) }}</pre>
      </article>

      <article v-if="canUpdateDose" class="card">
        <div class="card__header">
          <div>
            <p class="card__eyebrow">POST /dosis</p>
            <h2>Actualizacion de dosis</h2>
          </div>
          <button type="button" @click="submitDose" :disabled="loading.dose">
            {{ loading.dose ? 'Enviando...' : 'Guardar dosis' }}
          </button>
        </div>

        <div class="form-grid">
          <label>
            <span>Paciente</span>
            <input v-model.trim="doseForm.paciente" type="text" />
          </label>
          <label>
            <span>Medicamento</span>
            <input v-model.trim="doseForm.medicamento" type="text" />
          </label>
          <label>
            <span>Dosis</span>
            <input v-model.number="doseForm.dosis" type="number" min="0" step="0.1" />
          </label>
        </div>

        <pre v-if="doseResult">{{ formatJson(doseResult) }}</pre>
      </article>

      <article v-if="canSendMqtt" class="card">
        <div class="card__header">
          <div>
            <p class="card__eyebrow">POST /mqtt-data</p>
            <h2>Registro de telemetria IoT</h2>
          </div>
          <button type="button" @click="submitMqtt" :disabled="loading.mqtt">
            {{ loading.mqtt ? 'Registrando...' : 'Enviar datos' }}
          </button>
        </div>

        <div class="form-grid">
          <label>
            <span>Device ID</span>
            <input v-model.trim="mqttForm.deviceId" type="text" />
          </label>
          <label>
            <span>Paciente</span>
            <input v-model.trim="mqttForm.paciente" type="text" />
          </label>
          <label>
            <span>Temperatura</span>
            <input v-model.number="mqttForm.temperatura" type="number" step="0.1" />
          </label>
          <label>
            <span>Presion</span>
            <input v-model.trim="mqttForm.presion" type="text" />
          </label>
        </div>

        <pre v-if="mqttResult">{{ formatJson(mqttResult) }}</pre>
      </article>

      <article class="card card--soft">
        <p class="card__eyebrow">Sesion</p>
        <h2>JWT activo</h2>
        <pre>{{ authStore.token }}</pre>
      </article>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top right, rgba(34, 136, 170, 0.22), transparent 20%),
    linear-gradient(180deg, #eef6fa 0%, #f7fbfd 100%);
  color: #163042;
}

.dashboard-shell {
  min-height: 100vh;
  padding: 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.eyebrow,
.card__eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  color: #31708f;
}

h1,
h2 {
  margin: 0;
}

.subtitle {
  margin: 8px 0 0;
  color: #537083;
}

.status {
  margin: 0 0 16px;
  padding: 14px 16px;
  border-radius: 14px;
  font-weight: 600;
}

.success {
  background: #e7f7ef;
  color: #17693e;
}

.error {
  background: #fdeeee;
  color: #a12b2b;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 22px;
  border: 1px solid #dce8ee;
  box-shadow: 0 14px 34px rgba(18, 48, 66, 0.08);
}

.card--soft {
  background: linear-gradient(135deg, #12344d, #205f73);
  color: #effbff;
}

.card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 600;
}

input,
button {
  border-radius: 14px;
  font: inherit;
}

input {
  border: 1px solid #c4d4de;
  padding: 12px 14px;
}

button {
  border: 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, #0c6ea8, #15aab7);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.secondary {
  background: #113147;
}

pre {
  margin: 16px 0 0;
  padding: 14px;
  border-radius: 16px;
  background: #f3f7f9;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.card--soft pre {
  background: rgba(255, 255, 255, 0.12);
  color: inherit;
}

@media (max-width: 720px) {
  .dashboard-shell {
    padding: 18px;
  }

  .topbar,
  .card__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
