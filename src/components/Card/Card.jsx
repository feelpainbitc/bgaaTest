import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import CardHeader from "../CardHeader/CardHeader";
import CardTable from "../CardTable/CardTable";
import "./card.css";
import { saveSubjects } from "../../store/slices/subjectSlice";

const Card = ({ lesson }) => {
  const dispatch = useDispatch();
  const { lessons, saving } = useSelector((state) => state.subjects);

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedLessons = lessons.filter((l) => l.isModified);
    if (modifiedLessons.length === 0) {
      alert("Нет изменений для сохранения");
      return;
    }
    console.log("Отправляем на сервер:", modifiedLessons);
    dispatch(saveSubjects({ data: modifiedLessons }));
  };
  return (
    <Form className="page-form" onSubmit={handleSubmit}>
      <CardHeader lesson={lesson} />
      <Row className="mb-3">
        <CardTable lesson={lesson} />
      </Row>

      <Button variant="primary" type="submit" disabled={saving}>
        {saving ? "Сохраняется..." : "Отправить"}
      </Button>
    </Form>
  );
};

export default Card;
