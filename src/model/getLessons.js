const knex = require('./knex');
const Helper = require('../Helper');

/**
 *
 * @param {FilterLessons} filter
 * @return {Promise<void>}
 * @return {Lesson[]}
 */
async function getLessons(filter) {
    const lessons = knex({l: 'lessons'})
        .select({
            id: 'l.id',
            title: 'l.title',
            status: 'l.status',
            date: 'l.date'
        })
        .count('ls.student_id')
        .count({visitCount: knex.raw('CASE WHEN ls.visit THEN 1 END')})
        // .count({visitCount: 'CASE WHEN ls.visit THEN 1 END'})
        .joinRaw('JOIN lesson_students ls ON ls.lesson_id = l.id')
        .orderBy('l.id')
        .groupByRaw('id');
    if (filter.date) {
        const [firstDate, secondDate] = filter.date;
        lessons.where('l.date', '>=', firstDate).where('l.date', '<', secondDate);
    }

    if (filter.teacherIds) {
        lessons.whereIn('id', knex.select('lesson_id')
            .from('lesson_teachers').whereIn('teacher_id', filter.teacherIds));
    }
    if (filter.status === 0 || filter.status === 1) {
        lessons.where('status', '=', filter.status);
    }
    if (filter.studentsCount) {
        lessons.havingRaw(`count(ls.student_id) BETWEEN ${filter.studentsCount[0]} AND ${filter.studentsCount[1]}`);
    }
    if (filter.lessonsPerPage && filter.page) {
        lessons.limit(filter.lessonsPerPage).offset(filter.lessonsPerPage * (filter.page - 1));
    }
    const lessonsData = await lessons;
    const lessonsId = lessonsData.map(l => l.id);
    const [studentsAll, teachersAll] = await getStudentsAndTeachers(lessonsId);
    return lessonsData.map(lesson => {
        delete lesson.count;
        lesson.visitCount = parseInt(lesson.visitCount);
        lesson.date = Helper.formatDate(lesson.date);
        const teachers = teachersAll.filter(t => t.lesson_id === lesson.id).map(deleteLessonId);
        const students = studentsAll.filter(s => s.lesson_id === lesson.id).map(deleteLessonId);
        lesson.teachers = teachers;
        lesson.students = students;
        return lesson;
    });
}


function deleteLessonId(e) {
    delete e.lesson_id;
    return e
}

async function getStudentsAndTeachers(lessonsId) {
    const students = knex.column('lesson_id', 'id', 'name', 'visit')
        .from({ls: 'lesson_students'})
        .joinRaw('JOIN students as s ON ls.student_id = s.id')
        .whereIn('lesson_id', lessonsId);
    const teachers = knex.column('lesson_id', 'id', 'name')
        .from({lt: 'lesson_teachers'})
        .joinRaw('JOIN teachers as t ON lt.teacher_id = t.id')
        .whereIn('lesson_id', lessonsId);
    return Promise.all([students, teachers]);
}

module.exports = getLessons;
