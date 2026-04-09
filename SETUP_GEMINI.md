# 🚀 Guía de Configuración: Gemini API + Netlify

## Paso 1: Obtener tu API Key de Gemini

1. Ve a https://aistudio.google.com/apikey
2. Haz clic en "Get API Key" → "Create API key in new project"
3. Copia la clave generada (comenzará con `AIza...`)

## Paso 2: Configurar Variables de Entorno en Netlify

### Opción A: Dashboard de Netlify (Recomendado)

1. Accede a https://app.netlify.com
2. Selecciona tu sitio "espiral"
3. Ve a **Site Settings** → **Build & deploy** → **Environment**
4. Haz clic en **Edit variables**
5. Agrega una nueva variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *[pega tu API key aquí]*
6. Guarda los cambios

### Opción B: Usar NetlifyCLI (Desde terminal)

```bash
# Instala Netlify CLI si no lo tiene
npm install -g netlify-cli

# Loguéate en Netlify
netlify login

# Navega a tu proyecto
cd c:\Users\juanm\OneDrive\Documentos\GitHub\espiral

# Configura la variable de entorno
netlify env:set GEMINI_API_KEY "tu-api-key-aqui"

# Verifica que está configurada
netlify env:list
```

## Paso 3: Archivo .env Local (Solo para desarrollo)

Si querés probar localmente sin Netlify:

1. Crea un archivo `.env` en la raíz del proyecto (NO lo commits a Git)
2. Copia el contenido de `.env.example`:
   ```
   GEMINI_API_KEY=tu-api-key-aqui
   ```
3. Instala `dotenv` en `netlify/functions`:
   ```bash
   npm install dotenv
   ```
4. Modifica `gemini.js` para cargar `.env` en local (agregar en la primera línea):
   ```javascript
   require('dotenv').config();
   ```

## Paso 4: Deploy y Test

```bash
# Navega al proyecto
cd c:\Users\juanm\OneDrive\Documentos\GitHub\espiral

# Prueba localmente con Netlify Functions
netlify functions:invoke gemini --payload '{
  "body": "{\"prompt\": \"Hola\", \"systemInstruction\": \"Eres un asistente útil\"}"
}'

# O deploy normal
git add .
git commit -m "Configure Gemini API with Netlify env vars"
git push
```

## ✅ Verificación

Después del deploy, abre la consola del navegador (F12) y:

1. Ingresa una idea en "Elevator Pitch Generator"
2. Haz clic en "Generar Pitch"
3. Si ves la respuesta → ✅ Funcionando
4. Si ves error → Revisa los logs en Netlify (Deployments → Functions)

## 🔒 Seguridad

⚠️ **NUNCA**:
- Hagas commit de `.env` a Git
- Publiques tu API_KEY en el código frontend
- Pongas la API_KEY en `index.html`

✅ **SIEMPRE**:
- Usa variables de entorno en Netlify
- Llama a la Function `/.netlify/functions/gemini` desde el frontend
- Ten `.env` en `.gitignore`

## 🆘 Troubleshooting

### Error: "API_KEY no configurada"
→ Verifica que `GEMINI_API_KEY` está en Netlify → Environment variables

### Error 401 (Unauthorized)
→ La API_KEY es inválida o no tiene permisos. Regenera en https://aistudio.google.com/apikey

### Error 429 (Too many requests)
→ Rate limit de Gemini. Espera unos minutos o usa un modelo diferente

### Function no se ejecuta
→ Verifica que `netlify.toml` existe en la raíz
→ Reconstruye: `netlify deploy --prod`

