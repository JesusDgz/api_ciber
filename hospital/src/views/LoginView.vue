<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const errorMessage = ref('')

const demoUsers = [
  { username: 'doctor', password: 'Doctor123!', role: 'doctor' },
  { username: 'enfermero', password: 'Enfermero123!', role: 'enfermero' },
  { username: 'farmacia', password: 'Farmacia123!', role: 'farmacia' },
  { username: 'tecnico', password: 'Tecnico123!', role: 'tecnico' },
]

function useDemoUser(user) {
  form.username = user.username
  form.password = user.password
}

async function handleSubmit() {
  errorMessage.value = ''

  try {
    await authStore.login(form)
    router.push({ name: 'dashboard' })
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <main class="login-shell">
    <section class="login-panel">
      <div class="hero-copy">
        <p class="eyebrow">MedSec IoT</p>
        <h1>Acceso hospitalario seguro</h1>
        <p class="lead">
          Inicia sesion con las credenciales del backend y la vista principal se adaptara al rol
          autenticado.
        </p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label>
          <span>Usuario</span>
          <input v-model.trim="form.username" type="text" autocomplete="username" required />
        </label>

        <label>
          <span>Contrasena</span>
          <input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
          />
        </label>

        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Ingresando...' : 'Entrar' }}
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>

      <section class="demo-users">
        <div class="demo-users__header">
          <h2>Usuarios de prueba</h2>
        </div>

        <div class="demo-grid">
          <button
            v-for="user in demoUsers"
            :key="user.username"
            class="demo-card"
            type="button"
            @click="useDemoUser(user)"
          >
            <strong>{{ user.username }}</strong>
            <span>{{ user.role }}</span>
            <small>{{ user.password }}</small>
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top, rgba(39, 92, 122, 0.35), transparent 30%),
    linear-gradient(135deg, #08121d 0%, #0d2233 45%, #f4f8fb 45%, #eef4f7 100%);
  min-height: 100vh;
}

:global(*) {
  box-sizing: border-box;
}

.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-panel {
  width: min(960px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(10, 36, 56, 0.1);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(6, 19, 31, 0.18);
}

.hero-copy {
  padding: 48px;
  background: linear-gradient(180deg, #10314b 0%, #174e69 100%);
  color: #f4fbff;
}

.eyebrow {
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.75rem;
  color: #8fe3ff;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1;
}

.lead {
  margin: 18px 0 0;
  max-width: 28rem;
  line-height: 1.7;
  color: rgba(244, 251, 255, 0.84);
}

.login-form,
.demo-users {
  padding: 32px;
}

.login-form {
  display: grid;
  gap: 18px;
  align-content: start;
}

label {
  display: grid;
  gap: 8px;
  color: #18354a;
  font-weight: 600;
}

input {
  width: 100%;
  border: 1px solid #c7d6df;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 1rem;
  background: #fff;
}

input:focus {
  outline: 2px solid #2e8bc0;
  outline-offset: 2px;
}

button[type='submit'] {
  border: 0;
  border-radius: 999px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #0c6ea8, #19a8b7);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.7;
  cursor: wait;
}

.error {
  margin: 0;
  color: #a22020;
  font-weight: 600;
}

.demo-users {
  grid-column: 1 / -1;
  padding-top: 0;
}

.demo-users__header h2 {
  margin: 0 0 6px;
  color: #14354b;
}

.demo-users__header p {
  margin: 0 0 18px;
  color: #527086;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.demo-card {
  text-align: left;
  border: 1px solid #d4e0e7;
  border-radius: 18px;
  background: #f8fbfd;
  padding: 16px;
  display: grid;
  gap: 6px;
  cursor: pointer;
  color: #18354a;
}

.demo-card strong {
  font-size: 1rem;
}

.demo-card span {
  text-transform: capitalize;
  color: #1d7187;
}

.demo-card small {
  color: #56707f;
}

@media (max-width: 820px) {
  .login-panel {
    grid-template-columns: 1fr;
  }

  .hero-copy,
  .login-form,
  .demo-users {
    padding: 24px;
  }
}
</style>
