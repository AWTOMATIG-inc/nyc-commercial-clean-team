import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cencelled"],
      default: "pending",
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Last name must be at least 3 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 digits"],
      trim: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      minlength: [2, "Company name must be at least 2 characters"],
      trim: true,
    },

    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },

    facilityType: {
      type: String,
      required: [true, "Facility type is required"],
      trim: true,
    },

    facilitySize: {
      type: String,
      default: "",
    },

    numberOfFloors: {
      type: String,
      default: "",
    },
    // numberOfEmployees: {
    //   type: String,
    //   default: "",
    // },

    propertyAddress: {
      type: String,
      required: [true, "Property address is required"],
      minlength: [5, "Property address must be at least 5 characters"],
      trim: true,
    },

    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },

    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      trim: true,
    },

    services: [
      {
        type: String,
        required: true,
      },
    ],

    cleaningSchedule: {
      type: String,
      required: [true, "Cleaning schedule is required"],
      minlength: [2, "Cleaning schedule must be at least 2 characters"],
    },

    preferredStartDate: {
      type: String,
      required: [true, "Start date is required"],
    },

    preferredTime: {
      type: String,
      default: "",
    },

    facilityAccess: {
      type: String,
      default: "",
    },

    currentlyUsingCleaner: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      required: [true, "Notes is required"],
      minlength: [2, "Notes must be at least 2 characters"],
    },

    termAndCondition: {
      type: Boolean,
      required: true,
      validate: {
        validator: (val) => val === true,
        message: "You must accept terms and conditions",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const BookingModel =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
