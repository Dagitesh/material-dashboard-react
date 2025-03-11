import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Modal, Button, TextField, Avatar, Badge, Card, Grid, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PropTypes from "prop-types"; // Import PropTypes

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for Snackbar

  // Fetch data from API
  useEffect(() => {
    axios
      .get("http://localhost:3000/teachers")
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAddTeacher = () => {
    setAddingTeacher(true);
    setEditFormData({});
  };
  const handleRowClick = (teacher) => {
    setSelectedTeacher(teacher);
  };
  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setEditFormData(teacher);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (editingTeacher) {
      axios
        .put(`http://localhost:3000/teachers/${editingTeacher.id}`, editFormData)
        .then((response) => {
          setTeachers((prev) =>
            prev.map((teacher) => (teacher.id === editingTeacher.id ? response.data : teacher))
          );
          setEditingTeacher(null);
          setSnackbarMessage("Teacher information updated successfully!"); // Set success message
          setSnackbarOpen(true); // Open Snackbar
        })
        .catch((error) => {
          console.error("Error updating teacher:", error);
          setSnackbarMessage("Failed to update teacher information."); // Set error message
          setSnackbarOpen(true); // Open Snackbar
        });
    } else {
      axios
        .post("http://localhost:3000/teachers", editFormData)
        .then((response) => {
          setTeachers((prev) => [...prev, response.data]);
          setAddingTeacher(false);
          setSnackbarMessage("Teacher added successfully!"); // Set success message
          setSnackbarOpen(true); // Open Snackbar
        })
        .catch((error) => {
          console.error("Error adding teacher:", error);
          setSnackbarMessage("Failed to add teacher."); // Set error message
          setSnackbarOpen(true); // Open Snackbar
        });
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Teacher Component with PropTypes Validation
  const Teacher = ({ name = "" }) => (
    <MDBox display="flex" alignItems="center">
      <Avatar alt={name} />
      <MDBox ml={2}>
        <MDTypography variant="body4" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  // Add PropTypes validation for the Teacher component
  Teacher.propTypes = {
    name: PropTypes.string.isRequired, // Validate that 'name' is a required string
  };

  const columns = [
    { Header: "ID", accessor: "id", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Category", accessor: "category", align: "center" },
    { Header: "Branch", accessor: "branch", align: "center" },
    { Header: "Plate No.", accessor: "plate_no", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
  ];

  const rows = teachers.map((teacher) => ({
   
    id: teacher.id,
    name: <Teacher name={`${teacher.first_name} ${teacher.last_name}`} />,
    phone: teacher.phone,
    category: teacher.category,
    branch: teacher.branch,
    plate_no: teacher.plate_no,
    status: <Badge badgeContent={teacher.status} style={{ color: "green" }} />,
    onClick: ()=> handleRowClick(teacher),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Teachers Table
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="flex-end" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTeacher}
                  style={{
                    top: "20px",
                    right: "20px",
                    color: "white",
                  }}
                >
                  Add Teacher
                </Button>
              </MDBox>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for Adding/Editing Teachers */}
      <Modal
        open={addingTeacher || editingTeacher}
        onClose={() => {
          setAddingTeacher(false);
          setEditingTeacher(null);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Increased opacity (less transparent)
        }}
      >
        <Container style={{backgroundColor:"white"}}>
        <MDBox
          p={4}
         
          borderRadius={2}
          boxShadow={3}
          minWidth="400px"
          maxWidth="600px"
          width="100%"
        >
          <MDTypography variant="h6" gutterBottom color="text">
            {addingTeacher ? "Add Teacher" : "Edit Teacher"}
          </MDTypography>
          <TextField
            name="first_name"
            label="First Name"
            value={editFormData.first_name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="last_name"
            label="Last Name"
            value={editFormData.last_name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="phone"
            label="Phone"
            value={editFormData.phone || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="blood_type"
            label="Blood Type"
            value={editFormData.blood_type || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="category"
            label="Category"
            value={editFormData.category || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="branch"
            label="Branch"
            value={editFormData.branch || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="status"
            label="Status"
            value={editFormData.status || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            style={{ marginTop: "20px", color: "white" }}
          >
            Save
          </Button>
        </MDBox>
        </Container>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Auto-close after 3 seconds
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
      />
    </DashboardLayout>
  );
}