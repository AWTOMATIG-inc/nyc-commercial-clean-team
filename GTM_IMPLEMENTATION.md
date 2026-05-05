# GTM & Data Layer Implementation Instructions

> **For the AI agent implementing this:** Read every section before writing a single line of code. The project is a **Next.js App Router** app (not Pages Router). All tracking code must be compatible with React Server Components — tracking helpers must be client-side only.

---

## 0. Prerequisites & Assumptions

| Item | Value / Action needed |
|---|---|
| GTM Container ID | Replace every `GTM-XXXXXXX` placeholder with the real ID |
| GA4 Measurement ID | Replace every `G-XXXXXXXXXX` placeholder — configured inside GTM, not directly in code |
| Phone number | `+16313817252` (already in site as "Call Now" CTA) |
| Framework | Next.js App Router, React 19 |
| Package manager | npm |

**Do not install any third-party GTM/analytics npm packages.** Use the native GTM script snippet + `window.dataLayer` only. This keeps the implementation lean and under the site owner's full control inside GTM.

---

## 1. Environment Variable

Add to `.env` (and `.env.local` for local dev, `.env.production` for prod):

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

`NEXT_PUBLIC_` prefix is required so Next.js exposes it to the browser bundle.

---

## 2. GTM Snippet — Root Layout

**File to edit:** `src/app/layout.js`

Install both the GTM `<script>` tag (in `<head>`) and the `<noscript>` iframe fallback (immediately after `<body>` opens). Use Next.js `Script` component with `strategy="afterInteractive"` for the main script so it does not block rendering.

```jsx
import Script from "next/script";

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} ${inter.variable} antialiased`}>
        {/* GTM Script — must be first child of body */}
        {GTM_ID && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}

        <ToastProvider>
          <Header />
          {children}
          <ScrollToTopButton />
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

> **Important:** Keep all existing imports (`Footer`, `Header`, `ScrollToTopButton`, `ToastProvider`, fonts, `globals.css`, `swiper/css`) exactly as they are. Only add `Script` import and the GTM blocks shown above.

---

## 3. Data Layer Utility

**Create new file:** `src/lib/gtm.js`

This is the single place all tracking calls go through. Every component imports from here — never call `window.dataLayer.push()` directly in components.

```js
/**
 * Push an event to the GTM data layer.
 * Safe to call server-side (no-ops if window is not defined).
 */
export function pushEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

// ─── Pre-built event helpers ───────────────────────────────────────────────

/** Fired when a page view happens (used by the route-change listener) */
export function trackPageView(url) {
  pushEvent("page_view", { page_path: url });
}

/** Fired when the contact form is submitted successfully */
export function trackContactFormSubmit({ subject }) {
  pushEvent("contact_form_submit", {
    form_name: "contact_form",
    form_subject: subject || "not_set",
  });
}

/** Fired when the booking form is submitted successfully */
export function trackBookingSubmit({ service, industry, facilitySize }) {
  pushEvent("booking_form_submit", {
    form_name: "booking_form",
    booking_service: service || "not_set",
    booking_industry: industry || "not_set",
    booking_facility_size: facilitySize || "not_set",
  });
}

/** Fired when the user clicks a phone number link */
export function trackPhoneClick(location) {
  pushEvent("phone_click", {
    click_location: location, // e.g. "hero_cta", "navbar", "footer"
    phone_number: "+16313817252",
  });
}

/** Fired when a primary CTA button is clicked (Get a Free Quote, Book Now, etc.) */
export function trackCtaClick(ctaLabel, ctaLocation) {
  pushEvent("cta_click", {
    cta_label: ctaLabel,
    cta_location: ctaLocation,
  });
}
```

---

## 4. Page View Tracking (Route Changes)

Next.js App Router does **not** fire traditional page view events on client-side navigation. You must listen to route changes using `usePathname`.

**Create new file:** `src/components/GTMPageTracker.jsx`

```jsx
"use client";

import { trackPageView } from "@/lib/gtm";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GTMPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
```

**Then add it to the root layout** inside `<ToastProvider>`, before `<Header />`:

```jsx
import GTMPageTracker from "@/components/GTMPageTracker";

// inside RootLayout's JSX:
<ToastProvider>
  <GTMPageTracker />
  <Header />
  {children}
  <ScrollToTopButton />
  <Footer />
</ToastProvider>
```

---

## 5. Contact Form Tracking

**File to edit:** `src/components/contact/ContactForm.jsx`

Add the import at the top of the file:
```js
import { trackContactFormSubmit } from "@/lib/gtm";
```

Inside the `onSubmit` function, call the tracker **after** a successful response (after `toast.success`):

```js
const onSubmit = async (data) => {
  setLoading(true);
  // ... existing FormData build ...
  try {
    const response = await fetch("/api/contact", { method: "POST", body: formData });
    if (response.ok) {
      reset();
      setLoading(false);
      toast.success("Email sent successfully");
      // ↓ ADD THIS LINE
      trackContactFormSubmit({ subject: data.subject });
    } else {
      // ... existing error handling ...
    }
  } catch (error) {
    // ... existing catch ...
  }
};
```

---

## 6. Booking Form Tracking

**File to edit:** `src/components/Booking/BookingForm.jsx`

Add the import at the top of the file:
```js
import { trackBookingSubmit } from "@/lib/gtm";
```

Inside `onSubmit`, call the tracker **after** a successful API response and **before** the router redirect:

```js
const onSubmit = async (values) => {
  const formData = createFormData(values);
  setLoading(true);
  try {
    const res = await fetch("/api/booking", { method: "POST", body: formData });
    const data = await res.json();
    if (data) {
      setLoading(false);
      // ↓ ADD THIS BLOCK before router.push
      trackBookingSubmit({
        service: values.service,
        industry: values.industry,
        facilitySize: values.facilitySize,
      });
      router.push("/booking/thankyou");
    }
  } catch (error) {
    setLoading(false);
    toast.error("Booking request failed!");
  }
};
```

> **Note:** The field names `values.service`, `values.industry`, `values.facilitySize` must match the actual `name` attributes used in the booking form's `register()` calls. Verify these against the form fields and correct them if the names differ.

---

## 7. Phone Click & CTA Tracking

### 7a. Phone Links

Search the entire codebase for all phone number anchor tags (pattern: `href="tel:` or `tel:+1`). They exist in at least: `Header`, `Footer`, hero section, and possibly service pages.

For each phone link, attach an `onClick` handler:

```jsx
// Import at top of the component file:
import { trackPhoneClick } from "@/lib/gtm";

// On the anchor element:
<a
  href="tel:+16313817252"
  onClick={() => trackPhoneClick("hero_cta")} // change location label per file
>
  Call Now
</a>
```

Use these `location` label values consistently:

| Where the link appears | location value |
|---|---|
| Hero section | `"hero_cta"` |
| Navigation / Header | `"navbar"` |
| Footer | `"footer"` |
| Contact page | `"contact_page"` |
| Service pages | `"service_page"` |

### 7b. Primary CTA Buttons

Find the main "Get a Free Quote" and "Book Now" buttons (in hero section, service pages, etc.). Add `onClick` tracking:

```jsx
import { trackCtaClick } from "@/lib/gtm";

// Example — hero CTA:
<Link
  href="/contact"
  onClick={() => trackCtaClick("Get a Free Quote", "hero_section")}
>
  Get a Free Quote
</Link>

// Example — booking CTA:
<Link
  href="/booking"
  onClick={() => trackCtaClick("Book Now", "hero_section")}
>
  Book Now
</Link>
```

---

## 8. GTM Container Configuration (Do inside GTM UI, not in code)

After deploying the code changes, configure the following inside your GTM workspace at tagmanager.google.com:

### 8a. Variables to create

| Variable name | Type | Config |
|---|---|---|
| `DL - Event` | Data Layer Variable | Key: `event` |
| `DL - Page Path` | Data Layer Variable | Key: `page_path` |
| `DL - Form Name` | Data Layer Variable | Key: `form_name` |
| `DL - Form Subject` | Data Layer Variable | Key: `form_subject` |
| `DL - Booking Service` | Data Layer Variable | Key: `booking_service` |
| `DL - Booking Industry` | Data Layer Variable | Key: `booking_industry` |
| `DL - CTA Label` | Data Layer Variable | Key: `cta_label` |
| `DL - CTA Location` | Data Layer Variable | Key: `cta_location` |
| `DL - Click Location` | Data Layer Variable | Key: `click_location` |

### 8b. Triggers to create

| Trigger name | Type | Condition |
|---|---|---|
| `Custom - page_view` | Custom Event | Event name equals `page_view` |
| `Custom - contact_form_submit` | Custom Event | Event name equals `contact_form_submit` |
| `Custom - booking_form_submit` | Custom Event | Event name equals `booking_form_submit` |
| `Custom - phone_click` | Custom Event | Event name equals `phone_click` |
| `Custom - cta_click` | Custom Event | Event name equals `cta_click` |

### 8c. Tags to create

**Tag 1: GA4 Configuration**
- Tag type: Google Analytics: GA4 Configuration
- Measurement ID: `G-XXXXXXXXXX`
- Trigger: All Pages (built-in) — **disable** GTM's built-in pageview; use custom trigger below
- OR: Trigger: `Custom - page_view`

**Tag 2: GA4 Event — Contact Form Submit**
- Tag type: Google Analytics: GA4 Event
- Configuration tag: (select the GA4 Config tag above)
- Event name: `generate_lead`
- Event parameters:
  - `form_name` → `{{DL - Form Name}}`
  - `form_subject` → `{{DL - Form Subject}}`
- Trigger: `Custom - contact_form_submit`
- ☑ Mark this as a **conversion** in GA4

**Tag 3: GA4 Event — Booking Form Submit (Primary Conversion)**
- Tag type: Google Analytics: GA4 Event
- Event name: `generate_lead` (or `booking_complete` — your choice)
- Event parameters:
  - `form_name` → `{{DL - Form Name}}`
  - `booking_service` → `{{DL - Booking Service}}`
  - `booking_industry` → `{{DL - Booking Industry}}`
- Trigger: `Custom - booking_form_submit`
- ☑ Mark this as a **conversion** in GA4

**Tag 4: GA4 Event — Phone Click**
- Tag type: Google Analytics: GA4 Event
- Event name: `phone_call_click`
- Event parameters:
  - `click_location` → `{{DL - Click Location}}`
- Trigger: `Custom - phone_click`
- ☑ Mark this as a **conversion** in GA4

**Tag 5: GA4 Event — CTA Click**
- Tag type: Google Analytics: GA4 Event
- Event name: `cta_click`
- Event parameters:
  - `cta_label` → `{{DL - CTA Label}}`
  - `cta_location` → `{{DL - CTA Location}}`
- Trigger: `Custom - cta_click`

---

## 9. Files to Create / Edit — Summary Checklist

| Action | File |
|---|---|
| ✏️ Edit | `src/app/layout.js` — add GTM script + noscript |
| ✏️ Edit | `src/components/contact/ContactForm.jsx` — add form submit tracking |
| ✏️ Edit | `src/components/Booking/BookingForm.jsx` — add booking submit tracking |
| ✏️ Edit | `src/components/Header.jsx` — add phone click tracking |
| ✏️ Edit | `src/components/Footer.jsx` — add phone click tracking |
| ✏️ Edit | Hero section component — add phone + CTA click tracking |
| 🆕 Create | `src/lib/gtm.js` — data layer utility |
| 🆕 Create | `src/components/GTMPageTracker.jsx` — route-change page view |
| ✏️ Edit | `.env` and `.env.production` — add `NEXT_PUBLIC_GTM_ID` |

---

## 10. Testing Checklist

Before marking this done, verify the following:

### Browser console verification
Open DevTools console and confirm `window.dataLayer` shows events when you:
- [ ] Navigate between pages → `page_view` event appears with correct `page_path`
- [ ] Submit contact form → `contact_form_submit` event appears
- [ ] Submit booking form → `booking_form_submit` event appears with service/industry values
- [ ] Click a phone link → `phone_click` event appears with correct `click_location`
- [ ] Click a CTA button → `cta_click` event appears

### GTM Preview Mode
1. Open GTM → click **Preview** → enter the site URL
2. Use Tag Assistant to confirm each tag fires on the correct triggers
3. Check that data layer variables are populated with correct values

### GA4 DebugView
1. In GA4 → Admin → DebugView
2. Browse the site and trigger events
3. Confirm all 5 event types appear in real time

---

## 11. Notes & Constraints

- **Do not** add `"use client"` to `src/app/layout.js`. The GTM script tag using `dangerouslySetInnerHTML` with Next.js `Script` works in a Server Component.
- **Do not** use `next/headers` or any server-only API inside `src/lib/gtm.js`. It must be importable from client components.
- **Do not** track the dashboard routes (`/dashboard/*`) — add a GTM trigger exception or filter out paths starting with `/dashboard` using a GTM trigger condition: `Page Path does not start with /dashboard`.
- The `<noscript>` iframe should be the **first** child of `<body>`, placed before `<ToastProvider>`.
- If `NEXT_PUBLIC_GTM_ID` is not set, the GTM blocks should not render (use the `{GTM_ID && ...}` conditional shown in section 2).
- Field names in `trackBookingSubmit()` must match the `register("fieldName")` names in `BookingForm.jsx`. Cross-check with `src/constant/booking/booking.js` for the option keys.
