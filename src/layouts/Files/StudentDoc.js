import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { UploadFile, Folder } from "@mui/icons-material";
import axios from "axios";

export default function StudentDocumentManager() {
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState({});

  // Fetch students and their documents from the backend
  useEffect(() => {
    const fetchStudentsAndDocuments = async () => {
      try {
        // Fetch students
        const studentsResponse = await axios.get("http://localhost:3000/students");
        setStudents(studentsResponse.data);

        // Fetch documents for each student
        const documentsResponse = await axios.get("http://localhost:3000/student_documents");
        const documentsByStudent = {};

        documentsResponse.data.forEach((doc) => {
          if (!documentsByStudent[doc.student_id]) {
            documentsByStudent[doc.student_id] = [];
          }
          documentsByStudent[doc.student_id].push(doc);
        });

        setDocuments(documentsByStudent);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchStudentsAndDocuments();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event, studentId) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
  
    files.forEach((file) => {
      formData.append("student_file[file]", file);
    });
  
    try {
      // Fetch or create the student_document for the student
      const studentDocumentResponse = await axios.get(
        `http://localhost:3000/students/${studentId}/student_documents`
      );
  
      const studentDocumentId = studentDocumentResponse.data[0]?.id;
  
      if (!studentDocumentId) {
        console.error("No student document found for the student.");
        return;
      }
  
      // Upload the file to the student_document
      const response = await axios.post(
        `http://localhost:3000/students/${studentId}/student_documents/${studentDocumentId}/student_files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setDocuments((prev) => ({
        ...prev,
        [studentId]: [...(prev[studentId] || []), ...response.data],
      }));
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center" }}>
      {/* Student Document List */}
      <div style={{ width: "50%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Student Documents
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {students.map((student) => (
            <Grid item xs={12} key={student.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6"><Folder /> {student.first_name} {student.last_name}</Typography>
                  
                  {/* Upload Button */}
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, student.id)}
                    style={{ display: "none" }}
                    id={`upload-${student.id}`}
                  />
                  <label htmlFor={`upload-${student.id}`}>
                    <Button variant="contained" component="span" startIcon={<UploadFile />}>Upload File</Button>
                  </label>
                  
                  {/* Display Uploaded Documents */}
                  <ul>
                    {documents[student.id]?.map((doc, index) => (
                      <li key={index}>
                        <a href={`http://localhost:3000${doc.file.url}`} target="_blank" rel="noopener noreferrer">
                          {doc.file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}