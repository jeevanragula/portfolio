#!/usr/bin/env python3
"""Validate the Career OS source of truth without external dependencies."""
import json
import pathlib
import re
import sys
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "career.json"

errors = []
warnings = []

def required(obj, path):
    if not isinstance(obj, dict) or not obj.get(path):
        errors.append(f"Missing required field: {path}")

try:
    data = json.loads(DATA.read_text(encoding="utf-8"))
except Exception as exc:
    print(f"ERROR: cannot parse {DATA}: {exc}")
    sys.exit(1)

profile = data.get("profile", {})
for field in ["name", "title", "company", "location", "experience", "description", "email", "linkedin", "github"]:
    required(profile, field)

if profile.get("name") != "Jeevan Reddy Ragula":
    errors.append("profile.name must be 'Jeevan Reddy Ragula'")

for field in ["linkedin", "github"]:
    value = profile.get(field, "")
    if value and urlparse(value).scheme != "https":
        errors.append(f"profile.{field} must use HTTPS")

email = profile.get("email", "")
if email and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
    errors.append("profile.email is not a valid email address")

career = data.get("career", [])
if not isinstance(career, list) or not career:
    errors.append("career must be a non-empty array")

ids = set()
for entry in career:
    if not isinstance(entry, list) or len(entry) < 5:
        errors.append("Every career entry must contain id, period, title, company, details")
        continue
    if entry[0] in ids:
        errors.append(f"Duplicate career id: {entry[0]}")
    ids.add(entry[0])

products = data.get("products", [])
if not products:
    errors.append("products must not be empty")
else:
    expected_order = ["prod-aisec", "prod-dspm", "prod-zpc"]
    actual = [p.get("id") for p in products]
    if actual[:3] != expected_order:
        warnings.append("Core product order differs from the intended AI Security → DSPM → ZPC order")

# Prevent accidental confidential-data patterns in public Career OS.
raw = DATA.read_text(encoding="utf-8")
secret_patterns = [
    r"AKIA[0-9A-Z]{16}",
    r"-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY-----",
    r"(?i)password\s*[:=]",
    r"(?i)api[_-]?key\s*[:=]"
]
for pattern in secret_patterns:
    if re.search(pattern, raw):
        errors.append(f"Possible secret/confidential credential pattern detected: {pattern}")

for warning in warnings:
    print(f"WARNING: {warning}")

if errors:
    for error in errors:
        print(f"ERROR: {error}")
    sys.exit(1)

print("Career OS validation passed.")
