# NYC Clean Team Inc. — Phase 1 Work Order Overview

Summary of "NYC Clean Team Inc. – Phase 1 Team Work Order" v1.0 (12 Oct 2026). The PDF is the authoritative version.

## The deal

- **Who:** AWTOMATIG builds it for NYC Clean Team Inc.
- **What:** Extend their existing site (Next.js, React, Node, MongoDB, VPS) into a full customer-to-payment workflow. Extend it; don't rebuild or migrate.
- **How long:** 12 weeks from kickoff, then 60 days of bug-fix support.
- **Done when:** All acceptance checks pass, production is deployed, the handover docs are delivered, and the 60-day support window has started.

## What gets built (the journey)

1. **Customer** registers and adds a company with two or more properties.
2. **Customer requests service:** catalog → conditional questions → frequency → requested date/time → files → review → submit. The request gets a unique ID.
3. **Admin quotes it:** quotes can be revised, and the customer approves the current revision.
4. **Customer pays** once through Stripe. A verified webhook records success or failure exactly once.
5. **QuickBooks syncs** the customer, invoice, and payment. A failed sync shows as an error, and an admin can retry it.
6. **Admin confirms the schedule** and moves the job through its statuses to completion. Every step is logged.
7. **Emails go out** at each step, to both the customer and the admin.

## The 12 weeks

| Weeks | Build |
|---|---|
| 1 | Review code, database, server, and integrations; confirm decisions |
| 1–3 | Database models, IDs, APIs, workflow services |
| 3–6 | Customer accounts, properties, intake form, files |
| 5–8 | Quotes, approval, admin dashboard, scheduling |
| 7–10 | Stripe, QuickBooks, email |
| 10–12 | QA, user acceptance testing (UAT), production deploy, handover |

## Rules that don't bend

- Security checks run on the server, on every record and file. Changing an ID in a URL must never expose someone else's data.
- Never store card numbers or CVC. No saved cards, no subscriptions.
- Secrets never go in code, emails, or docs.
- MongoDB holds the operational records, Stripe decides payment outcomes, and QuickBooks holds the accounting.

## The client must provide

- Access to the server, database, and code.
- Stripe and QuickBooks test accounts.
- DNS changes for email.
- The service catalog, intake questions, and statuses.
- People to do UAT testing.

## Not in Phase 1

Staff dispatch, GPS, native mobile apps, payroll, automatic reconciliation, migrating old data, recurring billing.

## Handover (10 documents)

1. Architecture
2. Data model
3. Integration notes
4. Configuration guide
5. Deploy and rollback guide
6. Security notes
7. Backup notes
8. QA/UAT record
9. Admin quick-start
10. Source code and account access
