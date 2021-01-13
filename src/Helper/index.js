const Helper = {
    format: Intl.DateTimeFormat('ru-RU', {dateStyle: 'short'}),

    formatDate(date) {
        return this.format.format(date);
    },

    /**
     * Test date in format string to format 'yyyy-MM-dd'
     * @param dateString
     * @return {boolean}
     */
    validateDate(dateString) {
        return /\d{4}-\d\d-\d\d/.test(dateString);
    },

    send400(ctx, msg) {
        const body = {
            error: {
                code: 400,
                description: msg
            }
        };
        ctx.set('Content-Type', 'application/json');
        ctx.status = 400;
        ctx.body = body;
    },

    /**
     * Convert filter parameter 'date' to ['yyyy.MM.dd, 'yyyy.MM.dd'];
     * @param {string} dateStr
     * @return {[string, string]|null}
     */
    getPeriod(dateStr) {
        const msg = 'Parameter "date" must have format: "yyyy-MM-dd" or "yyyy-MM-dd,yyyy-MM-dd"';
        /** @type {Date|null} */
        let dateEnd = null;

        let [dateStartStr, dateEndStr] = (dateStr || "").split(',');
        if (dateStartStr && !Helper.validateDate(dateStartStr) || dateEndStr && !Helper.validateDate(dateEndStr)) {
            throw new Error(msg);
        }
        if (dateStartStr) {
            if (!dateEndStr) {
                dateEnd = new Date(dateStartStr);
                dateEnd.setDate(dateEnd.getDate() + 1);
                dateEndStr = dateEnd.toISOString().split('T')[0];
            }
        } else {
            return null;
        }
        return [dateStartStr, dateEndStr];
    },

    /**
     *
     * @param {FilterLessonsRaw} filter
     * @return {FilterLessons}
     */
    prepareFilter(filter) {
        let date, status,
            /** @type number[] */
            teacherIds,
            /** @type number[] */
            studentsCount,
            /** @type number */
            page,
            /** @type number */
            lessonsPerPage;
        date = this.getPeriod(filter.date);
        if (filter.status) {
            status = parseInt(filter.status);
            if (!(status === 1 || status === 0)) {
                throw new Error('The filter parameter "status" must be 1 or 0');
            }
        }
        if (filter.teacherIds) {
            teacherIds = filter.teacherIds.split(',').map(id => parseInt(id));
            const isValidIdTeacher = teacherIds.reduce((is, id) => !isNaN(id) && is, true);
            if (!isValidIdTeacher) {
                error("teacherIds");
            }
        }
        if (filter.studentsCount) {
            studentsCount = filter.studentsCount.split(',').map(n => parseInt(n));
            if (isNaN(studentsCount[0])) {
                error('studentsCount')
            }
            if (isNaN(studentsCount[1])) {
                studentsCount[1] = studentsCount[0];
            }
        }
        if (filter.page) {
            page = parseInt(filter.page);
            if (isNaN(page)) {
                error('page');
            }
        }
        if (filter.lessonsPerPage) {
            lessonsPerPage = parseInt(filter.lessonsPerPage);
            if (isNaN(lessonsPerPage)) {
                error('lessonsPerPage');
            }
        }

        function error(parameter) {
            throw new Error(`The filter parameter "${parameter}" is not valid`);
        }

        return {date, status, studentsCount, teacherIds, page, lessonsPerPage};
    }
};

module.exports = Helper;




















