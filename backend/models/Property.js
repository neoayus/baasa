const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // BASIC INFORMATION
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    roomType: {
      type: String,
      enum: ["private-room", "shared-room", "pg", "hostel-room"],
      required: [true, "Room type is required"],
    },

    genderPreference: {
      type: String,
      enum: ["any", "male", "female"],
      default: "any",
    },

    status: {
      type: String,
      enum: ["draft", "available", "occupied", "inactive"],
      default: "draft",
    },

    // PRICING AND AVAILABILITY
    rent: {
      type: Number,
      required: [true, "Monthly rent is required"],
      min: [0, "Rent cannot be negative"],
    },

    deposit: {
      type: Number,
      default: 0,
      min: [0, "Deposit cannot be negative"],
    },

    availableFrom: {
      type: Date,
    },

    minimumStayMonths: {
      type: Number,
      min: [1, "Minimum stay must be at least 1 month"],
      validate: {
        validator: Number.isInteger,
        message: "Minimum stay must be a whole number",
      },
    },

    rentIncludes: {
      type: [String],
      enum: ["electricity", "water", "wifi", "food", "maintenance"],
      default: [],
    },

    // LOCATION
    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      default: "Dharamshala",
    },

    state: {
      type: String,
      default: "Himachal Pradesh",
      trim: true,
    },

    pincode: {
      type: String,
      match: [/^\d{6}$/, "Enter a valid 6-digit Indian PIN code"],
    },

    landmark: {
      type: String,
      trim: true,
    },

    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },

    // ROOM DETAILS AND AMENITIES
    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
    },

    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Bedrooms must be a whole number",
      },
    },

    bathroomType: {
      type: String,
      enum: ["attached", "shared"],
    },

    amenities: {
      type: [String],
      default: [],
    },

    foodIncluded: {
      type: Boolean,
      default: false,
    },

    rules: {
      type: [String],
      default: [],
    },

    // PHOTOS AND OWNERSHIP
    images: [
      {
        url: {
          type: String,
          required: [true, "Image URL is required"],
          trim: true,
        },
        alt: {
          type: String,
          trim: true,
        },
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "Property owner is required"],
    },

    contactPreference: {
      type: [String],
      enum: ["phone", "whatsapp", "in-app"],
      default: ["in-app"],
    },
  },
  {
    timestamps: true,
  },
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
