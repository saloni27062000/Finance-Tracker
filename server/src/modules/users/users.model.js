const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: [true, "firstname is required"],
      },
      middlename: {
        type: String,
      },
      lastname: {
        type: String,
        required: [true, "lastname is required"],
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    address: {
      street: {
        type: String,
        required: [true, "street is required"],
      },
      city: {
        type: String,
        required: [true, "city is required"],
      },
      state: {
        type: String,
        required: [true, "state is required"],
      },
      zip: {
        type: String,
        required: [true, "zip is required"],
      },
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    DOB: {
      type: Date,
      required: [true, "DOB is required"],
      default: Date.now,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
