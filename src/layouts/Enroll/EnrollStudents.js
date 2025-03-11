import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "examples/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import MDBox from "components/MDBox";

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; // Predefined list of blood types

const EnrollStudents = () => {
  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    government_id: "",
    dob: "",
    category: "",
    previousLicense: "",
    city: "",
    subcity: "",
    education: "",
    phone: "",
    start_date: "",
    teacher_id: "",
    status: "",
    result: "",
    branch: "",
    blood_type: "", // Added blood_type to the state
  });

  const [dobError, setDobError] = useState("");
  const categories = ["Automobile", "Public Transport 1","Public Transport 2", "Dry Cargo 1","Dry Cargo 2", "Motor Cycle"]; // Example categories
  const educationLevels = ["High School", "Undergraduate", "Postgraduate"];
  const statuses = ["Practice", "Theory","Done"];
  const branches = ["Megenagna", "Pastor"];
  const [teachers, setTeachers] = useState([]); // State to store teachers

  useEffect(() => {
    // Fetch teacher names from the database
    axios
      .get("http://localhost:3000/teachers") // Update this endpoint as per your API
      .then((response) => {
        setTeachers(response.data); // Assuming the API returns an array of teacher objects
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
        alert("Failed to load teacher data.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });

    if (name === "dob") {
      const age = calculateAge(value);
      if (age < 18) {
        setDobError("Student must be at least 18 years old.");
      } else {
        setDobError(""); // Clear the error if age is valid
      }
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSubmit = () => {
    if (dobError) {
      alert(dobError);
      return;
    }

    // Log student data for debugging
    console.log("Student enrolled:", studentData);

    // Make an API call to save the student data to the backend
    axios
      .post("http://localhost:3000/students", studentData) // Ensure this endpoint matches your backend
      .then((response) => {
        // Handle success
        console.log("Response from server:", response.data);
        alert("Student successfully enrolled!");
      })
      .catch((error) => {
        // Handle errors
        if (error.response) {
          // Server responded with a status other than 200
          console.error("Error response from server:", error.response.data);
          alert(`Error: ${error.response.data.message || "Failed to enroll student."}`);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:", error.request);
          alert("Error: No response from the server.");
        } else {
          // Something else caused the error
          console.error("Unexpected error:", error.message);
          alert("Error: Something went wrong.");
        }
      });
  };

  return (
    <div className="container">
      <DashboardNavbar />
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
      sx={{ backgroundColor: "#f4f6f8" }} // Optional background for the whole page
    >
      
      <MDBox
        p={3}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: 900, // Optional: set max width for the form container
        }}
      >
        <Typography variant="h4" gutterBottom>
          Enroll New Student
        </Typography>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                name="first_name"
                value={studentData.first_name}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="last_name"
                value={studentData.last_name}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Govt/Passport ID */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Govt/Passport ID"
                variant="outlined"
                fullWidth
                name="government_id"
                value={studentData.government_id}
                onChange={handleInputChange}
              />
            </Grid>

            {/* DOB */}
            <Grid item xs={12} md={6}>
              <TextField
                label="DOB"
                variant="outlined"
                fullWidth
                name="dob"
                type="date"
                value={studentData.dob}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={studentData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Previous License Number */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Previous License Number"
                variant="outlined"
                fullWidth
                name="previousLicense"
                value={studentData.previousLicense}
                onChange={handleInputChange}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                name="city"
                value={studentData.city}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Subcity */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Subcity"
                variant="outlined"
                fullWidth
                name="subcity"
                value={studentData.subcity}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Education Level */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Education Level</InputLabel>
                <Select
                  label="Education Level"
                  name="education"
                  value={studentData.education}
                  onChange={handleInputChange}
                >
                  {educationLevels.map((level, index) => (
                    <MenuItem key={index} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phone"
                value={studentData.phone}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                variant="outlined"
                fullWidth
                name="start_date"
                type="date"
                value={studentData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Teacher */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Teacher</InputLabel>
                <Select
                  label="Teacher"
                  name="teacher_id"
                  value={studentData.teacher_id}
                  onChange={handleInputChange}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Blood Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Blood Type</InputLabel>
                <Select
                  label="Blood Type"
                  name="blood_type"
                  value={studentData.blood_type || ''}
                  onChange={handleInputChange}
                >
                  {bloodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={studentData.status}
                  onChange={handleInputChange}
                >
                  {statuses.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Result */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Result"
                variant="outlined"
                fullWidth
                name="result"
                value={studentData.result}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Branch */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Branch</InputLabel>
                <Select
                  label="Branch"
                  name="branch"
                  value={studentData.branch}
                  onChange={handleInputChange}
                >
                  {branches.map((branch, index) => (
                    <MenuItem key={index} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Enroll Student
              </Button>
            </Grid>
          </Grid>
        </Box>
      </MDBox>
    </Box>
    </div>
  );
};

export default EnrollStudents;