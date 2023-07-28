const express = require("express");
const mongo = require("mongoose");
const app = express();
const Mentor = require("./Models/mentormodule");
const Student = require("./Models/studentmodules");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Declare Route
app.get("/", (req, res) => {
  res.send("API created // Student and Mentor // created successfully");
});

//Which PORT i want to run my server
app.listen(4000, () => {
  console.log("Node Api is on Running on port 4000");
});

//Data posted in MongoDB  API to create Mentor
app.post("/mentor", async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(200).json(mentor);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//Student database  API to create Student

app.post("/student", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(200).json(student);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//Data GET mentor details in MONGODB
app.get("/mentor", async (req, res) => {
  try {
    const mentor = await Mentor.find({});
    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json({ err: `The database is crashed` });
  }
});

//TO get a data from students Database

app.get("/student", async (req, res) => {
  try {
    const student = await Student.find({});
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ err: `The database is crashed` });
  }
});

//Write API to Assign a student to Mentor || Select one mentor and Add multiple Student
app.put("/student/:studentid/mentor/:mentorid", async (req, res) => {
  try {
    const studentid = req.params.studentid;
    const mentorid = req.params.mentorid;
    const student = await Student.findByIdAndUpdate(
      studentid,
      { mentor: mentorid },
      { new: true }
    );
    res.status(200).send(student);
  } catch (error) {
    res.status(404).json({ error: `The page not found` });
  }
});

//A student who has a mentor should not be shown in List
app.get("/student/unassigned", async (req, res) => {
  try {
    const unassigned = await Student.find({
      mentor: { $in: [null, undefined] },
    });
    res.status(200).send(unassigned);
  } catch (error) {
    res.status(404).json({ error: `The page not found` });
  }
});

//API to Assign or Change Mentor for particular Student
app.put("/student/:studentid/mentor/:mentorid", async (req, res) => {
  try {
    const studentid = req.params.studentid;
    const mentorid = req.params.mentorid;
    const student = await Student.findById(studentid);
    const mentor = await Mentor.findById(mentorid);
    if (!student) {
      return res.status(404).json({ error: `Student not Found` });
    }
    if (!mentor) {
      return res.status(404).json({ error: `Mentor not Found` });
    }
    student.mentor = mentor;
    await student.save();
    res.status(200).send(student);
  } catch (error) {
    res.status(404).json({ error: `The page not found` });
  }
});

//API to show all students for a particular mentor

app.get("/mentor/:mentorid/student", async (req, res) => {
  try {
    const mentorid = req.params.mentorid;
    const mentor = await Mentor.findById(mentorid);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    const student = await Student.find({ mentor: mentorid });
    res.status(200).send(student);
  } catch (error) {
    res.status(404).json({ error: `The page not found` });
  }
});

// API to show the previously assigned mentor for a particular student
app.get("/student/:studentid", async (req, res) => {
  try {
    const studentid = req.params.studentid;
    const student = await Student.findById(studentid);
    if (!student) {
      return res.status(404).json({ error: `page not found` });
    }
    const mentorID = student.mentor;
    const mentor = await Mentor.findById(mentorID);
    if (!mentor) {
      return res.status(404).json({ error: `page not found` });
    }
    res.status(200).send(mentor);
  } catch (err) {
    res.status(404).json({ error: `The page not found` });
  }
});

//Connect the MONGODB as backend and using CRUD operations
mongo
  .connect("mongodb+srv://Gowtham:Honda@zenclass.m2hg9wy.mongodb.net/")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error);
  });
