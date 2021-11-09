import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    email: { type: String, required: true },

    password: {
      type: String,
      required: function () {
        return !Boolean(this.googleId);
      },
    },
    role: { type: String, default: "Guest", enum: ["Guest", "Host"] },
    refreshToken: { type: String },
    googleId: {
      type: String,
      required: function () {
        return !Boolean(this.password);
      },
    },
  },

  {
    timestamps: true,
  }
);
customerSchema.pre("save", async function (next) {
  const newCustomer = this;
  const password = newCustomer.password;
  if (newCustomer.isModified("password")) {
    newCustomer.password = await bcrypt.hash(password, 11);
  }
  next();
});

customerSchema.methods.toJSON = function () {
  const customerDocument = this;
  const customerObject = customerDocument.toObject();
  delete customerObject.password;
  return customerObject;
};

customerSchema.statics.checkCredentials = async function (email, plainPW) {
  // 1. find the user by email
  const customer = await this.findOne({ email }); // "this" refers to customerModel

  if (customer) {
    // 2. if the customer is found we are going to compare plainPW with hashed one
    const isMatch = await bcrypt.compare(plainPW, customer.password);
    // 3. Return a meaningful response
    if (isMatch) return customer;
    else return null; // if the pw is not ok I'm returning null
  } else return null; // if the email is not ok I'm returning null as well
};
export default model("Customer", customerSchema);
