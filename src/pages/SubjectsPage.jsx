import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import Card from "../components/Card/Card";
import "./subjectspage.css";
import { fetchSubjects, saveSubjects } from "../store/slices/subjectSlice";

const SubjectsPage = () => {
  const dispatch = useDispatch();
  const { lessons, saving } = useSelector((state) => state.subjects);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);
  const { selectedTeachers } = useSelector((state) => state.subjects);
  return (
    <>
      {lessons.map((lesson) => (
        <Card key={lesson.uniqueId} lesson={lesson} />
      ))}
    </>
  );
};

export default SubjectsPage;
