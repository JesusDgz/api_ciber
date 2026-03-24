# MedSec-IoT API

API REST segura en Node.js + Express para entorno hospitalario con autenticacion JWT y autorizacion RBAC.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm start
```

Servidor por defecto:

```bash
http://localhost:3000
```

## Variables opcionales

```bash
PORT=3000
JWT_SECRET=medsec-iot-super-secret
CORS_ORIGIN=*
```

## Usuarios de prueba

- `doctor` / `Doctor123!`
- `enfermero` / `Enfermero123!`
- `farmacia` / `Farmacia123!`
- `tecnico` / `Tecnico123!`

## Endpoints

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "username": "doctor",
  "password": "Doctor123!"
}
```

### Vitals

```http
GET /vitals
Authorization: Bearer <JWT>
```

### Dosis

```http
POST /dosis
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "paciente": "Ana Perez",
  "medicamento": "Insulina",
  "dosis": 8
}
```

### MQTT Data

```http
POST /mqtt-data
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "deviceId": "iot-monitor-01",
  "paciente": "Ana Perez",
  "temperatura": 36.7,
  "presion": "120/80"
}
```

## Postman / cURL

### 1. Obtener token

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"doctor\",\"password\":\"Doctor123!\"}"
```

### 2. Consumir endpoint protegido

```bash
curl http://localhost:3000/vitals \
  -H "Authorization: Bearer TU_TOKEN"
```
