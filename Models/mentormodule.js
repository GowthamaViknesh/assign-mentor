const mongo = require("mongoose");

const mentorSchema = mongo.Schema({
  name: {
    type: String,
    required: [true, "plese enter the product name"],
  },
  email: {
    type: String,
    required: [true, "plese enter the email name"],
  },
  phone_no: {
    type: String,
    required: [true, "plese enter the phone_no name"],
  },
  course: {
    type: String,
    required: [true, "plese enter the course name"],
  },
});

const Mentor = mongo.model("Mentor", mentorSchema);

module.exports = Mentor;
