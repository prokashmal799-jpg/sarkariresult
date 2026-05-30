# Security Specifications for Sarkari Result BharatJobs Portal

This document outlines the data invariants, threat model payloads ("The Dirty Dozen"), and validation criteria to assure the highest standards of safety for the administrative databases.

## 1. Data Invariants

1. **Role Access Restriction**: Only authenticated, verified administrators with the approved email can perform write operations (create, update, delete) on `jobs`, `results`, `admits`, `siteSettings`, `ticker`, and `pushAlerts`.
2. **Strict Structure**: Elements such as vacancy numbers, age limits, dates must be limited string lengths. All IDs must conform to alphanumeric constraints.
3. **Draft Privacy**: Draft postings are hidden from general users and are readable only by administrators.
4. **Timestamp Integrity**: Whenever items are created or saved, their timing indicators must be validated or maintained.

---

## 2. The "Dirty Dozen" Security Payloads

These are the 12 hypothetical payloads simulated to breach databases. The security rules are designed to fail them gracefully with standard permission denials.

### Payload 1: Anonymous Create Job
An anonymous, unauthenticated user tries to add a hot vacancy.
- **Action**: `create` on `/jobs/evil_job_1`
- **Result**: `PERMISSION_DENIED`

### Payload 2: Email-Spoofed Write
An attacker logging in as another domain tries to modify the global announcement marquee.
- **Action**: `update` on `/ticker/ticker_1`
- **Auth**: `request.auth.token.email = "attacker@xyz.com"`, `email_verified = true`
- **Result**: `PERMISSION_DENIED`

### Payload 3: Unverified Email Login Admin Attempt
An attacker with email `prokashmal799@gmail.com` but with `email_verified = false` attempts to override site settings.
- **Action**: `update` on `/siteSettings/settings_1`
- **Auth**: `request.auth.token.email = "prokashmal799@gmail.com"`, `email_verified = false`
- **Result**: `PERMISSION_DENIED`

### Payload 4: Overlong String Infiltration (Denial of Wallet / Resource Poisoning)
An administrator account is hijacked, or an attacker bypasses the client to post a 5MB job description string.
- **Action**: `create` on `/jobs/oversized_job` with a 5,000,000 character string field.
- **Result**: `PERMISSION_DENIED` (string size limit check)

### Payload 5: ID Poisoning Attack
An attacker tries to seed a collection using an extremely long junk ID.
- **Action**: `create` on `/jobs/very_long_junk_id_over_1000_chars_to_waste_project_indexing`
- **Result**: `PERMISSION_DENIED` (isValidId verification validates string length <= 128)

### Payload 6: Draft Exposure
A general guest tries to fetch a draft post by querying the `/jobs` path.
- **Action**: `get` on `/jobs/draft_job_1` where `status = "draft"`
- **Auth**: None (guest)
- **Result**: `PERMISSION_DENIED`

### Payload 7: Immortal Fields Mutation
An editor tries to modify the original alphanumeric `id` or `created` time parameter after creation.
- **Action**: `update` on `/jobs/job_100` attempting to change `created` timestamp.
- **Result**: `PERMISSION_DENIED`

### Payload 8: Negative Value / Wrong Type Invariant
Attacking state inputs by putting negative integers or arrays in place of string variables.
- **Action**: `create` on `/results/result_1` passing `exam = [-55, 99]` instead of string.
- **Result**: `PERMISSION_DENIED`

### Payload 9: Action-Based Bypassing
An authenticated user attempts to modify fields not whitelisted for their execution layer.
- **Action**: `update` on `/jobs/job_2` changing `salary` and bypassing standard action rules.
- **Result**: `PERMISSION_DENIED`

### Payload 10: Fake Push Broadcast Triggering
An external user attempts to publish a fake push alert directly to `/pushAlerts`.
- **Action**: `create` on `/pushAlerts/spam_alert`
- **Result**: `PERMISSION_DENIED`

### Payload 11: AdSense Slot Override
An attacker attempts to inject custom malicious scripts into `headerSlot` properties under `siteSettings`.
- **Action**: `create` or `update` on `/siteSettings/settings_1`
- **Result**: `PERMISSION_DENIED`

### Payload 12: Corrupted Ticker Data Injection
An attacker tries to update the scrolling marquee text to blank or NULL.
- **Action**: `update` on `/ticker/ticker_1` with `text = null`
- **Result**: `PERMISSION_DENIED`

---

## 3. The Test Suite Verification Blueprint

Testing rules ensures safety. Our test rules verify:
- Admin verified status.
- Guest read access correctness.
- Data field size and type bounds.
