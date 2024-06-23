import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
