const chai = require("chai");
chai.should();
const {expect} = chai;
const Helper = require('../src/Helper');


let queryData = {
    date: '2020-01-11,2020-01-31',
    status: '0',
    teacherIds: '1,2,3,4,5',
    studentsCount: '1,10',
    page: '1',
    lessonsPerPage: '10'
};
let filter = Helper.prepareFilter(queryData);

describe('prepareFilter', function () {

    it('two date', function () {
        let date = ['2020-01-11', '2020-01-31'];
        const filter = Helper.prepareFilter({date: date.join(',')});
        const isValid = filter.date[0] === date[0] && filter.date[1] === date[1]
        isValid.should.be.true;
    });

    it('one date', function () {
        let date = ['2020-01-11', '2020-01-12'];
        const filter = Helper.prepareFilter({date: date[0]});
        const isValid = filter.date[0] === date[0] && filter.date[1] === date[1];
        isValid.should.be.true;
    });

    it('not date', function () {
        const filter = Helper.prepareFilter({});
        return expect(filter.date).is.null;
    });

    it('status 0', function () {
        const filter = Helper.prepareFilter({status: "0"});
        return expect(filter.status).is.equal(0);
    });

    it('status 1', function () {
        const filter = Helper.prepareFilter({status: "1"});
        return expect(filter.status).is.equal(1);
    });

    it('not status', function () {
        const filter = Helper.prepareFilter({});
        return expect(filter.status).is.undefined;
    });
    it('teacherIds', function () {
        let teacherIds = [1, 2, 3, 4, 5];
        const filter = Helper.prepareFilter({teacherIds: teacherIds.join(',')});
        return expect(filter.teacherIds).is.deep.equal(teacherIds);
    });
    it('studentsCount', function () {
        let studentsCount = [1, 3];
        const filter = Helper.prepareFilter({studentsCount: studentsCount.join(',')});
        return expect(filter.studentsCount).is.deep.equal(studentsCount);
    });
    it('page', function () {
        let page = 1;
        const filter = Helper.prepareFilter({page: page.toString()});
        return expect(filter.page).is.equal(page);
    });
    it('page', function () {
        let lessonsPerPage = 5;
        const filter = Helper.prepareFilter({lessonsPerPage: lessonsPerPage.toString()});
        return expect(filter.lessonsPerPage).is.equal(lessonsPerPage);
    });
});





















