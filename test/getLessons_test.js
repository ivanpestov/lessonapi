const chai = require("chai");
chai.should();
const model = require('../src/model');

describe('model', function () {
    it('The lesson is conducted', async function () {
        /** @type FilterLessons */
        const filter = {
            status: 1
        };
        const lessons = await model.getLessons(filter);
        const is = lessons.reduce((is, e) => is && !!e.status, true);
        is.should.be.true;
    });
    it('The lesson is not conducted', async function () {
        /** @type FilterLessons */
        const filter = {
            status: 0
        };
        const lessons = await model.getLessons(filter);
        const is = lessons.reduce((is, e) => is && !!e.status, true);
        is.should.be.false;
    });
    it('Contains only need teachers', async function () {
        const teacherIds = [1, 2, 3, 4];
        /** @type FilterLessons */
        const filter = {
            teacherIds
        };
        /** @type Lesson[] */
        const lessons = await model.getLessons(filter);
        const isRight = lessons.reduce((is, lesson) => {
            const isOnlyNeedIds = lesson.teachers.reduce((is, teacher) => is && teacherIds.includes(teacher.id), true);
            return isOnlyNeedIds && is;
        }, true);
        isRight.should.be.true;
    });
    it('Contains only need count of students', async function () {
        const studentsCount = [2, 3];
        /** @type FilterLessons */
        const filter = {studentsCount};
        /** @type Lesson[] */
        const lessons = await model.getLessons(filter);
        const isRight = lessons.reduce((is, lesson) => {
            const countStudents = lesson.students.length;
            return is && countStudents >= studentsCount[0] && countStudents <= studentsCount[1]
        }, true);
        isRight.should.be.true;
    });
    it('Contains only between dates', async function () {
        const date = ['2019-06-01', '2019-07-01'];
        const timetamps = date.map(d => Date.parse(d));
        /** @type FilterLessons */
        const filter = {date};
        /** @type Lesson[] */
        const lessons = await model.getLessons(filter);
        const isRight = lessons.reduce((is, lesson) => {
            const time = Date.parse(lesson.date);
            return is && time >= timetamps[0] && time < timetamps[1];
        }, true);
        isRight.should.be.true;
    });
    it('offset 2', async function () {
        /** @type FilterLessons */
        const filter = {page: 1, lessonsPerPage: 5};
        /** @type Lesson[] */
        const lessons = await model.getLessons(filter);
        lessons.length.should.be.equal(filter.lessonsPerPage);
    });
});

