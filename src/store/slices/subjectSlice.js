import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async () => {
    const res = await fetch("https://bgaa.by/test");
    if (!res.ok) throw new Error("Ошибка при загрузке данных");
    return res.json();
  }
);
export const saveSubjects = createAsyncThunk(
  "subjects/saveSubjects",
  async (dataToSend) => {
    const res = await fetch("https://bgaa.by/test_result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) throw new Error("Ошибка при сохранении данных");
    return res.json();
  }
);
const subjectsSlice = createSlice({
  name: "subjects",
  initialState: {
    lessons: [],
    teachers: [],
    selectedTeachers: {},
    additionalInfo: {},
    loading: false,
    error: null,
    saving: false,
    saveError: null,
  },
  reducers: {
    updateTeacher: (state, action) => {
      const { lessonId, groupIndex, teacherType, teacherName } = action.payload;

      const lesson = state.lessons.find((l) => l.uniqueId === lessonId);
      if (!lesson) return;

      lesson.podgroups = lesson.podgroups.map((pg, idx) => {
        if (idx === groupIndex) {
          return { ...pg, [teacherType]: teacherName };
        }
        return pg;
      });
      lesson.isModified = true;
    },

    updateAdditionalInfo: (state, action) => {
      const { lessonId, text } = action.payload;
      const lesson = state.lessons.find((l) => l.uniqueId === lessonId);
      if (lesson) {
        lesson.additionalInfo = text;
        lesson.isModified = true;
      }
    },

    addPodgroup: (state, action) => {
      const { lessonId } = action.payload;
      const lesson = state.lessons.find((l) => l.uniqueId === lessonId);
      if (!lesson) return;

      lesson.podgroups.push({
        countStudents: "0",
        laboratoryTeacher: "",
        lectureTeacher: "",
        practiceTeacher: "",
        seminarTeacher: "",
        examTeacher: "",
        offsetTeacher: "",
      });

      const total = Number(lesson.studentsNumber);
      const count = lesson.podgroups.length;
      const perGroup = Math.floor(total / count);
      const remainder = total - perGroup * (count - 1);

      lesson.podgroups = lesson.podgroups.map((pg, i) => ({
        ...pg,
        countStudents: i === 0 ? remainder : perGroup,
      }));

      lesson.countPodgroups = String(lesson.podgroups.length);
      lesson.isModified = true;
    },
    removePodgroup: (state, action) => {
      const { lessonId, index } = action.payload;
      const lesson = state.lessons.find((l) => l.uniqueId === lessonId);
      if (lesson) {
        lesson.podgroups.splice(index, 1);
        const total = Number(lesson.studentsNumber);
        const count = lesson.podgroups.length;
        const perGroup = Math.floor(total / count);
        const remainder = total - perGroup * (count - 1);

        lesson.podgroups = lesson.podgroups.map((pg, i) => ({
          ...pg,
          countStudents: i === 0 ? remainder : perGroup,
        }));
        lesson.countPodgroups = String(lesson.podgroups.length);
        lesson.isModified = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.data;
        state.teachers = action.payload.teachers;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveSubjects.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveSubjects.fulfilled, (state) => {
        state.saving = false;
        state.lessons.forEach((l) => {
          l.isModified = false;
        });
      })
      .addCase(saveSubjects.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.error.message;
      });
  },
});

export const {
  updateTeacher,
  updateAdditionalInfo,
  addPodgroup,
  removePodgroup,
} = subjectsSlice.actions;
export default subjectsSlice.reducer;
