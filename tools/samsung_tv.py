#!/usr/bin/env python3
"""Control de la tele Samsung desde el Mac/Linux por la red local.

Instalación:  python3 -m pip install -r tools/requirements.txt

Uso:
  python3 tools/samsung_tv.py --ip 192.168.1.40 info
  python3 tools/samsung_tv.py --ip 192.168.1.40 apps            # nombres e IDs instalados
  python3 tools/samsung_tv.py --ip 192.168.1.40 open 3201907018807
  python3 tools/samsung_tv.py --ip 192.168.1.40 key KEY_HOME

La IP también se puede dar con la variable TV_IP. La primera vez la tele
muestra un aviso para permitir la conexión: acéptalo con el mando.
"""
import argparse
import json
import os
import sys
from pathlib import Path

try:
    from samsungtvws import SamsungTVWS
except ImportError:
    sys.exit("Falta la librería: python3 -m pip install -r tools/requirements.txt")

TOKEN_FILE = Path.home() / ".config" / "tv-refactor" / "samsung-token"


def connect(ip: str) -> SamsungTVWS:
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    return SamsungTVWS(host=ip, port=8002, token_file=str(TOKEN_FILE), name="tv-refactor", timeout=10)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--ip", default=os.environ.get("TV_IP"), help="IP de la tele (o variable TV_IP)")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("info", help="modelo, firmware y estado")
    sub.add_parser("apps", help="lista las apps instaladas con su ID")
    p_open = sub.add_parser("open", help="abre una app por ID")
    p_open.add_argument("app_id")
    p_key = sub.add_parser("key", help="envía una tecla del mando (KEY_HOME, KEY_VOLUP…)")
    p_key.add_argument("key")
    args = parser.parse_args()

    if not args.ip:
        parser.error("indica la IP con --ip o TV_IP")

    tv = connect(args.ip)
    if args.cmd == "info":
        print(json.dumps(tv.rest_device_info(), indent=2, ensure_ascii=False))
    elif args.cmd == "apps":
        apps = sorted(tv.app_list() or [], key=lambda a: a.get("name", "").lower())
        width = max((len(a.get("name", "")) for a in apps), default=10)
        for a in apps:
            print(f"{a.get('name', ''):<{width}}  {a.get('appId', '')}")
    elif args.cmd == "open":
        tv.run_app(args.app_id)
    elif args.cmd == "key":
        tv.send_key(args.key)


if __name__ == "__main__":
    main()
