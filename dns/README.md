# 2. Bloqueo de publicidad por DNS

La tele pide los anuncios a servidores concretos (`samsungads.com`, ACR, etc.).
Si el DNS responde "no existe", el anuncio no llega y la pantalla de inicio
tampoco espera a descargarlo.

Elige **una** opción.

## Opción A — Sin instalar nada (DNS público con filtro)

En la tele: `Ajustes > General > Red > Estado de red > Ajustes de IP`:

- Ajuste DNS: **Introducir manualmente**
- Servidor DNS: `94.140.14.14` (AdGuard DNS, bloquea publicidad y rastreo)

Es la forma más rápida, pero no puedes elegir qué se bloquea.
Si prefieres controlarlo, crea un perfil gratuito en NextDNS, añade la lista
`samsung-blocklist.txt` en "Denylist" y usa la IP que te dé.

## Opción B — AdGuard Home en tu Mac/Linux (control total)

Necesita que el ordenador esté encendido cuando uses la tele. Lo ideal es un
equipo siempre encendido (Raspberry Pi, NAS, mini PC).

```bash
cd dns
docker compose up -d
# Abre http://localhost:3000 y completa el asistente
```

Luego, en AdGuard Home:

1. **Filtros > Listas de bloqueo DNS > Añadir lista personalizada**
   - `samsung-blocklist.txt` de este repo (pega el contenido en
     **Reglas de filtrado personalizadas**), y/o
   - la lista comunitaria de Smart TV:
     `https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt`
2. En la tele, DNS manual → la IP local de tu ordenador (p. ej. `192.168.1.50`).

## Si algo deja de funcionar

Abre el **Registro de consultas** de AdGuard Home, busca lo bloqueado justo
cuando falló y desbloquéalo. No bloquees:

- `samsungcloudsolution.com` / `.net` → tienda de apps y Smart Hub
- `samsungotn.net` → actualizaciones de firmware
- dominios de Netflix, YouTube, etc.
