#!/usr/bin/env bash
# Empaqueta "Mi Inicio" (.wgt) y lo instala en la tele.
#
# Uso:
#   TV_IP=192.168.1.40 CERT_PROFILE=MiTV ./build.sh            # empaquetar + instalar
#   CERT_PROFILE=MiTV ./build.sh --no-install                   # solo empaquetar
#
# Variables:
#   TIZEN_STUDIO  ruta de Tizen Studio (por defecto ~/tizen-studio)
#   CERT_PROFILE  perfil de certificado Samsung creado en Certificate Manager
#   TV_IP         IP de la tele (con Modo desarrollador activado)
set -euo pipefail

cd "$(dirname "$0")"

TIZEN_STUDIO="${TIZEN_STUDIO:-$HOME/tizen-studio}"
TIZEN="$TIZEN_STUDIO/tools/ide/bin/tizen"
SDB="$TIZEN_STUDIO/tools/sdb"
INSTALL=1
[[ "${1:-}" == "--no-install" ]] && INSTALL=0

die() { echo "ERROR: $*" >&2; exit 1; }

[[ -x "$TIZEN" ]] || die "No encuentro Tizen Studio en $TIZEN_STUDIO (define TIZEN_STUDIO)."
[[ -n "${CERT_PROFILE:-}" ]] || die "Define CERT_PROFILE con tu perfil de certificado Samsung."

BUILD_DIR="$(mktemp -d)"
trap 'rm -rf "$BUILD_DIR"' EXIT

# Copia solo los archivos de la app.
cp -R config.xml index.html css js img "$BUILD_DIR/"

echo "→ Empaquetando con el perfil '$CERT_PROFILE'…"
"$TIZEN" package -t wgt -s "$CERT_PROFILE" -- "$BUILD_DIR"

WGT="$(find "$BUILD_DIR" -maxdepth 1 -name '*.wgt' | head -n 1)"
[[ -n "$WGT" ]] || die "No se generó el .wgt"
mkdir -p dist
cp "$WGT" dist/MiInicio.wgt
echo "✓ dist/MiInicio.wgt"

(( INSTALL )) || exit 0
[[ -n "${TV_IP:-}" ]] || die "Define TV_IP para instalar (o usa --no-install)."

echo "→ Conectando con $TV_IP…"
"$SDB" connect "$TV_IP"
SERIAL="$("$SDB" devices | awk -v ip="$TV_IP" 'index($1, ip) == 1 { print $1; exit }')"
[[ -n "$SERIAL" ]] || die "La tele no aparece en 'sdb devices'. ¿Modo desarrollador activo con la IP de este ordenador?"

echo "→ Instalando en $SERIAL…"
"$TIZEN" install -n MiInicio.wgt -s "$SERIAL" -- "$(pwd)/dist"
echo "✓ Instalada. Búscala en Apps de la tele como 'Mi Inicio'."
