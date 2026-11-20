# 3. "Mi Inicio" — pantalla de inicio propia

App web para Tizen con **tu fondo de pantalla**, reloj y saludo, una fila con
tus apps favoritas (Netflix, YouTube, Prime Video, Disney+…) y otra con el
resto de apps instaladas. Se maneja con el mando: flechas, OK y Atrás.

> Tizen no deja reemplazar el Smart Hub. "Mi Inicio" se instala como una app
> más y se pone **la primera en la barra de inicio**: Home → OK.

## Personalizar

- **Fondo**: sustituye `img/wallpaper.jpg` por tu imagen (1920×1080, JPG).
- **Apps favoritas, orden, colores, tu nombre**: `js/config.js`.
- **Estilo**: `css/style.css`.

Vista previa en el Mac sin tele: abre `index.html` en Chrome (usa apps de ejemplo,
navegas con las flechas).

## Instalar en la tele (primera vez, ~1 h)

### 1. Tizen Studio (en el Mac)

1. Descarga **Tizen Studio con CLI** desde developer.tizen.org e instálalo en `~/tizen-studio`.
2. Abre `~/tizen-studio/package-manager` y en **Extension SDK** instala:
   - **Samsung Certificate Extension**
   - **TV Extensions** (la versión más reciente)

### 2. Modo desarrollador en la tele

1. Abre **Apps** en la tele.
2. Con el mando, pulsa **1 2 3 4 5** (en mandos sin números, usa el teclado numérico en pantalla).
3. **Developer mode** → **On**, y en **Host PC IP** pon la IP de tu Mac
   (`ipconfig getifaddr en0`).
4. Apaga y enciende la tele, desenchufándola 30 s.

### 3. Certificado Samsung

Las teles Samsung solo instalan apps firmadas con un certificado de Samsung
ligado a **esa** tele.

```bash
~/tizen-studio/tools/sdb connect IP_DE_LA_TELE
~/tizen-studio/tools/certificate-manager/certificate-manager &
```

En Certificate Manager: **+** → **Samsung** → **TV** → nombre de perfil (p. ej. `MiTV`)
→ crea un certificado de autor nuevo → inicia sesión con tu cuenta Samsung →
crea un certificado de distribuidor nuevo → en **DUID**, la tele conectada
aparece automáticamente; márcala.

### 4. Empaquetar e instalar

```bash
cd launcher
TV_IP=192.168.1.40 CERT_PROFILE=MiTV ./build.sh
```

Para actualizar después de cambiar el fondo o `config.js`, repite este comando.

### 5. Fijarla en la barra

Home → Apps → "Mi Inicio" → mantén OK → **Añadir a Inicio**; luego muévela a
la primera posición.

## Problemas frecuentes

- **"sdb: device not found"**: la IP del Mac en Developer mode no coincide, o
  la tele no se reinició tras activarlo.
- **"Install failed: certificate"**: el certificado no incluye el DUID de esta
  tele. Rehaz el paso 3 con la tele conectada.
- **Una favorita no aparece**: el nombre no coincide con `match`. Mira el nombre
  real con `python3 tools/samsung_tv.py apps` y ajústalo en `js/config.js`.
- Tras una actualización de firmware puede desaparecer: vuelve a ejecutar `build.sh`.
