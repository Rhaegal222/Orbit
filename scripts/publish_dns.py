#!/usr/bin/env python3
"""Idempotently publish the public Orbit CNAME records through Cloudflare."""

import json
import os
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen


TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
API = "https://api.cloudflare.com/client/v4"
RECORDS = (
    ("wyrmrest.it", "orbit.wyrmrest.it", "wyrmrest.it"),
    ("wyrmrest.com", "orbit.wyrmrest.com", "wyrmrest.com"),
)


def request(method: str, path: str, payload: dict | None = None) -> dict:
    if not TOKEN:
        raise RuntimeError("CLOUDFLARE_API_TOKEN is required")
    body = json.dumps(payload).encode() if payload is not None else None
    req = Request(
        f"{API}/{path}",
        data=body,
        method=method,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    with urlopen(req, timeout=20) as response:  # nosec B310: fixed Cloudflare API endpoint
        data = json.load(response)
    if not data.get("success"):
        raise RuntimeError("Cloudflare rejected the DNS update")
    return data


def main() -> None:
    for zone_name, hostname, target in RECORDS:
        zone = request("GET", f"zones?{urlencode({'name': zone_name})}")["result"][0]
        records = request(
            "GET", f"zones/{zone['id']}/dns_records?{urlencode({'name': hostname, 'type': 'CNAME'})}"
        )["result"]
        payload = {
            "type": "CNAME",
            "name": hostname,
            "content": target,
            "proxied": True,
            "ttl": 1,
            "comment": "Orbit UI foundations",
        }
        method = "PUT" if records else "POST"
        path = f"zones/{zone['id']}/dns_records/{records[0]['id']}" if records else f"zones/{zone['id']}/dns_records"
        request(method, path, payload)
        print(f"DNS ready: {hostname}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"DNS publication failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
