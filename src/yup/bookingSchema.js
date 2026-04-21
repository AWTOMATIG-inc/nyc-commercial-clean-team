import * as Yup from "yup";

export const bookingYupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Firtname is required") // min(1) instead of min(0) to ensure non-empty
    .required("Firt name is required"),
  lastName: Yup.string()
    .min(3, "Lastname is required") // min(1) instead of min(0) to ensure non-empty
    .required("Last name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  phone: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Subject is required"),
  jobTitle: Yup.string()
    .optional(),
  facilityType: Yup.string()
    .required("Facility type is required"),
  facilitySize: Yup.string()
    .optional(),
  numberOfFloors: Yup.string().optional(),
  // numberOfEmployees: Yup.string().optional(),
  propertyAddress: Yup.string()
    .min(5, "Property address must be at least 5 characters")
    .required("Property address is required"),
  area: Yup.string()
    .required("Area is required"),
  zipCode: Yup.string()
    .required("Zip code is required"),
  services: Yup.array()
    .min(1, "Select at least one service")
    .required("Services is required"),
  cleaningSchedule: Yup.string()
    .min(2, "Cleaning schedule must be at least 2 characters")
    .required("Cleaning schedule is required"),
  preferredStartDate: Yup.string()
    .required("Start date is required"),
  preferredTime: Yup.string()
    .optional(),
  facilityAccess: Yup.string()
    .optional(),
  currentlyUsingCleaner: Yup.string()
    .optional(),
  notes: Yup.string()
    .min(2, "Notes must be at least 2 characters")
    .required("Notes is required"),
  termAndCondition: Yup.boolean().required("Notes is required"),
});
