# tv-refactor — Samsung (Tizen) limpia, rápida y personalizada

Objetivo: quitar publicidad y rastreo de la Smart TV Samsung, que cargue rápido
y tener una pantalla de inicio propia (con mi fondo) que abra Netflix, YouTube,
Prime Video, Disney+, etc.

## Qué se puede y qué no en Tizen

| Objetivo | ¿Posible? | Cómo |
|---|---|---|
| Quitar anuncios personalizados y rastreo (ACR) | ✅ | Ajustes de privacidad → [docs/01-ajustes.md](docs/01-ajustes.md) |
| Bloquear banners/anuncios de Smart Hub y TV Plus | ✅ (casi todo) | Bloqueo por DNS → [dns/](dns/README.md) |
| Arranque y menú más rápidos | ✅ | Instant On, quitar autoarranques, limpiar caché y apps → [docs/01-ajustes.md](docs/01-ajustes.md) |
| Pantalla de inicio propia con mi fondo | ✅ como app | App Tizen "Mi Inicio" → [launcher/](launcher/README.md) |
| Sustituir el Smart Hub / botón Home de Samsung | ❌ | Tizen no lo permite; se fija "Mi Inicio" como 1ª app de la barra |
| Fondo propio con la tele "apagada" | ✅ en QLED/The Frame | Modo Ambiente / Modo Arte desde la app SmartThings |
| Controlar la tele y abrir apps desde el Mac | ✅ | [tools/samsung_tv.py](tools/samsung_tv.py) |

## Empezar en el Mac

```bash
cd ~/projects/personal/repos/tv-refactor
git pull

# 1. Herramienta para hablar con la tele
python3 -m pip install -r tools/requirements.txt

# 2. IP de la tele: Ajustes > General > Red > Estado de red > Ajustes de IP
export TV_IP=192.168.1.XX

# 3. Comprobar conexión (acepta el aviso que sale en la tele con el mando)
python3 tools/samsung_tv.py info
python3 tools/samsung_tv.py apps

# 4. Vista previa de "Mi Inicio" en el navegador
open launcher/index.html
```

Para instalar "Mi Inicio" en la tele, sigue [launcher/README.md](launcher/README.md).

## Orden recomendado

1. **Ajustes** (10 min, sin ordenador): [docs/01-ajustes.md](docs/01-ajustes.md)
2. **DNS anti-publicidad** (15 min): [dns/README.md](dns/README.md)
3. **Mi Inicio** (1 h la primera vez, requiere Tizen Studio y cuenta Samsung): [launcher/README.md](launcher/README.md)

Todo es reversible: los ajustes se cambian de vuelta, el DNS se quita poniendo
"Automático" en la red de la tele y la app se desinstala como cualquier otra.

## Estructura

```
docs/01-ajustes.md      Checklist de ajustes de privacidad y velocidad
dns/                    Lista de bloqueo + AdGuard Home en Docker
launcher/               App Tizen "Mi Inicio" (HTML/JS) con tu fondo y tus apps
tools/samsung_tv.py     CLI: listar apps instaladas, abrirlas, info de la tele
```
