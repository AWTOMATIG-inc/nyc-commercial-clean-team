export function pushEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

export function trackPageView(url) {
  pushEvent("page_view", { page_path: url });
}

export function trackContactFormSubmit({ subject }) {
  pushEvent("contact_form_submit", {
    form_name: "contact_form",
    form_subject: subject || "not_set",
  });
}

export function trackBookingSubmit({ service, industry, facilitySize }) {
  pushEvent("booking_form_submit", {
    form_name: "booking_form",
    booking_service: service || "not_set",
    booking_industry: industry || "not_set",
    booking_facility_size: facilitySize || "not_set",
  });
}

export function trackPhoneClick(location) {
  pushEvent("phone_click", {
    click_location: location,
    phone_number: "+16313817252",
  });
}

export function trackCtaClick(ctaLabel, ctaLocation) {
  pushEvent("cta_click", {
    cta_label: ctaLabel,
    cta_location: ctaLocation,
  });
}
