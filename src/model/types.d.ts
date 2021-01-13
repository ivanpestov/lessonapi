type FilterLessonsRaw = {
    date?: string;
    status?: '0' | '1';
    teacherIds?: string;
    studentsCount?: string;
    page?: string;
    lessonsPerPage?: string;
}
type FilterLessons = {
    date?: [string, string];
    status?: 0 | 1;
    teacherIds?: number[];
    studentsCount?: [number, number];
    page?: number;
    lessonsPerPage?: number;
}

type Lesson = {
    id: number;
    date: string;
    title: string;
    status: 1 | 0;
    visitCount: number;
    students: Array<Student>;
    teachers: Array<Teacher>
}

type Teacher = {
    id: number;
    name: string;
}

type Student = {
    id: number;
    name: string;
    visit: boolean;
}
