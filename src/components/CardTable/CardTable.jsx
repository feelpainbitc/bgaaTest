import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Form, Button, Card as BSCard } from "react-bootstrap";
import {
  updateTeacher,
  updateAdditionalInfo,
  addPodgroup,
  removePodgroup,
} from "../../store/slices/subjectSlice";

const CardTable = ({ lesson }) => {
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.subjects);

  const rows = [
    { label: "Лекции", key: "lectureTeacher", hoursKey: "lecturesHours" },
    {
      label: "Лабораторные работы",
      key: "laboratoryTeacher",
      hoursKey: "laboratoryHours",
    },
    { label: "Практические", key: "practiceTeacher", hoursKey: "practicHours" },
    { label: "Семинарские", key: "seminarTeacher", hoursKey: "seminarHours" },
  ];

  if (lesson.exam) rows.push({ label: "Экзамен", key: "examTeacher" });
  if (lesson.offset) rows.push({ label: "Зачет", key: "offsetTeacher" });
  rows.push({ label: "Доп. информация", key: "additionalInfo" });

  const handleTeacherChange = (groupIndex, teacherType, value) => {
    dispatch(
      updateTeacher({
        lessonId: lesson.uniqueId,
        groupIndex,
        teacherType,
        teacherName: value,
      })
    );
  };

  const handleApplyToAll = (groupIndex) => {
    const podgroup = lesson.podgroups[groupIndex];
    if (!podgroup.lectureTeacher) return;
    const teacherToApply = podgroup.lectureTeacher;

    const teacherKeys = [
      "lectureTeacher",
      "laboratoryTeacher",
      "practiceTeacher",
      "seminarTeacher",
      "examTeacher",
      "offsetTeacher",
    ];

    teacherKeys.forEach((key) => {
      const hoursKeyMap = {
        lectureTeacher: "lecturesHours",
        laboratoryTeacher: "laboratoryHours",
        practiceTeacher: "practicHours",
        seminarTeacher: "seminarHours",
        examTeacher: null,
        offsetTeacher: null,
      };

      const hoursKey = hoursKeyMap[key];
      if (hoursKey && Number(lesson[hoursKey]) === 0) return;

      dispatch(
        updateTeacher({
          lessonId: lesson.uniqueId,
          groupIndex,
          teacherType: key,
          teacherName: teacherToApply,
        })
      );
    });
  };

  const handleAddPodgroup = () =>
    dispatch(addPodgroup({ lessonId: lesson.uniqueId }));
  const handleRemovePodgroup = (index) =>
    dispatch(removePodgroup({ lessonId: lesson.uniqueId, index }));

  // =======================
  // ПК и планшет
  // =======================
  const tableView = (
    <Table responsive bordered hover className="d-none d-sm-table">
      <thead>
        <tr>
          <th>Занятие</th>
          <th>Часы</th>
          {lesson.podgroups.map((_, i) => (
            <th key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {lesson.podgroups.length === 1
                  ? "Преподаватель"
                  : `Подгруппа ${i + 1}`}
                {i > 0 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemovePodgroup(i)}
                  >
                    ✕
                  </Button>
                )}
                {i === 0 && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleAddPodgroup}
                  >
                    +
                  </Button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.label}</td>
            <td>{lesson[row.hoursKey] || ""}</td>
            {lesson.podgroups.map((pg, i) => (
              <td key={i}>
                {row.key === "additionalInfo" ? (
                  <Form.Control
                    as="textarea"
                    value={
                      pg.additionalInfo !== undefined
                        ? pg.additionalInfo
                        : lesson.additionalInfo || ""
                    }
                    onChange={(e) =>
                      dispatch(
                        updateAdditionalInfo({
                          lessonId: lesson.uniqueId,
                          text: e.target.value,
                          groupIndex: i,
                        })
                      )
                    }
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Form.Select
                      value={pg[row.key] || ""}
                      onChange={(e) =>
                        handleTeacherChange(i, row.key, e.target.value)
                      }
                      disabled={row.hoursKey && Number(lesson[row.hoursKey]) === 0}
                    >
                      <option value="">Вакансия</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </Form.Select>
                    {row.key === "lectureTeacher" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleApplyToAll(i)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-check-all"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z" />
                        </svg>
                      </Button>
                    )}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}

        {lesson.podgroups.length > 1 && (
          <tr>
            <td>Количество человек</td>
            <td></td>
            {lesson.podgroups.map((pg, i) => (
              <td key={i}>
                <Form.Control
                  type="number"
                  min={0}
                  value={pg.countStudents || ""}
                  onChange={(e) =>
                    handleTeacherChange(i, "countStudents", Number(e.target.value))
                  }
                />
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </Table>
  );

  // =======================
  // Мобильная версия
  // =======================
  const mobileView = (
    <div className="d-block d-sm-none">
      {lesson.podgroups.map((pg, i) => (
        <BSCard className="mb-3" key={i}>
          <BSCard.Header className="d-flex justify-content-between align-items-center">
            <span>
              {lesson.podgroups.length === 1
                ? "Преподаватель"
                : `Подгруппа ${i + 1}`}
            </span>
            <div>
              {i > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemovePodgroup(i)}
                  className="me-1"
                >
                  ✕
                </Button>
              )}
              {i === 0 && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleAddPodgroup}
                >
                  +
                </Button>
              )}
            </div>
          </BSCard.Header>
          <BSCard.Body>
            {rows.map((row) => {
              if (row.key === "countStudents") return null; // пропускаем здесь
              if (row.key === "additionalInfo") {
                return (
                  <Form.Group className="mb-2" key={row.key}>
                    <Form.Label>{row.label}</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={
                        pg.additionalInfo !== undefined
                          ? pg.additionalInfo
                          : lesson.additionalInfo || ""
                      }
                      onChange={(e) =>
                        dispatch(
                          updateAdditionalInfo({
                            lessonId: lesson.uniqueId,
                            text: e.target.value,
                            groupIndex: i,
                          })
                        )
                      }
                    />
                  </Form.Group>
                );
              }
              return (
                <Form.Group className="mb-2" key={row.key}>
                  <Form.Label>{row.label}</Form.Label>
                  <Form.Select
                    value={pg[row.key] || ""}
                    onChange={(e) => handleTeacherChange(i, row.key, e.target.value)}
                    disabled={row.hoursKey && Number(lesson[row.hoursKey]) === 0}
                  >
                    <option value="">Вакансия</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Form.Select>
                  {row.key === "lectureTeacher" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-1"
                      onClick={() => handleApplyToAll(i)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-all"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z" />
                      </svg>
                    </Button>
                  )}
                </Form.Group>
              );
            })}
            {/* Добавляем одну строку "Количество человек" для каждой карточки */}
            <Form.Group className="mb-2">
              <Form.Label>Количество человек</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={pg.countStudents || ""}
                onChange={(e) =>
                  handleTeacherChange(i, "countStudents", Number(e.target.value))
                }
              />
            </Form.Group>
          </BSCard.Body>
        </BSCard>
      ))}
    </div>
  );

  return (
    <>
      {tableView}
      {mobileView}
    </>
  );
};

export default CardTable;
