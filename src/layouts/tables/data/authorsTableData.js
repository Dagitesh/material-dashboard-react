import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Box, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";

export default function Data() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch students
  useEffect(() => {
    axios
      .get("http://localhost:3000/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle row click
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedStudent(null);
  };

  // Student name component
  const Student = ({ name }) => (
    <MDBox display="flex" alignItems="center">
      <MDAvatar alt={name} size="sm" />
      <MDBox ml={2}>
        <MDTypography variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  Student.propTypes = {
    name: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Student", accessor: "name", align: "center" },
      { Header: "Govnmt/Passport ID", accessor: "governmentId", align: "center" },
      { Header: "Category", accessor: "category", align: "center" },
      { Header: "Phone Number", accessor: "phone", align: "center" },
      { Header: "Start Date", accessor: "startDate", align: "center" },
      { Header: "Teachers", accessor: "teachersId", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Result", accessor: "result", align: "center" },
      { Header: "Branch", accessor: "branch", align: "center" },
    ],
    rows: students.map((student) => ({
      id: student.id.toString(),
      name: <Student name={`${student.first_name} ${student.last_name}`} />,
      governmentId: student.government_id,
      category: student.category,
      phone: student.phone,
      startDate: student.start_date,
      teachersId: student.teacher_id,
      branch: student.branch,
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={student.status} color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      result: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {student.result}
        </MDTypography>
      ),
      action: (
        <Button variant="contained" color="primary" size="small" onClick={() => handleRowClick(student)}>
          View Details
        </Button>
      ),
    })),
    studentDetailsModal: (
      <StudentDetailsModal
        open={showDetailsModal}
        student={selectedStudent}
        onClose={handleCloseModal}
      />
    ),
  };
}

// Modal Component
const StudentDetailsModal = ({ open, student, onClose }) => {
  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Student Details
        </Typography>
        <Typography>ID: {student.id}</Typography>
        <Typography>Name: {student.first_name} {student.last_name}</Typography>
        <Typography>Govt ID: {student.government_id}</Typography>
        <Typography>Category: {student.category}</Typography>
        <Typography>Phone: {student.phone}</Typography>
        <Typography>Start Date: {student.start_date}</Typography>
        <Typography>Branch: {student.branch}</Typography>
        <Typography>Status: {student.status}</Typography>
        <Typography>Result: {student.result}</Typography>
        <Button onClick={onClose} variant="contained" color="secondary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

StudentDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  student: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
