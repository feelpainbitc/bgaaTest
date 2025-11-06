import React from "react";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import './cardheader.css'

const CardHeader = ({lesson}) => {

  return (
    <div className="header-form">
      <h3>{lesson.subjectName}</h3>
      <Row className="mb-2" sm={2}>
        <Form.Group as={Col} controlId="formGridPassword" className="header-label">
          <Form.Label>Группа</Form.Label>
          <Form.Label>{lesson.groupName}</Form.Label>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail" className="header-label">
          <Form.Label>Курс</Form.Label>
          <Form.Label>{lesson.course}</Form.Label>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail" className="header-label">
          <Form.Label>Количество курсантов</Form.Label>
          <Form.Label>{lesson.studentsNumber}</Form.Label>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail" className="header-label">
          <Form.Label>Семестр</Form.Label>
          <Form.Label>{lesson.semestr}</Form.Label>
        </Form.Group>
      </Row>
    </div>
  );
};

export default CardHeader;
