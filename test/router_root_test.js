const {PORT} = process.env;
const chai = require("chai");
chai.should();
const chai_http = require('chai-http');
chai.use(chai_http);

const app = require('../src/app');
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

describe('/', function () {
    it('valid request', function (done) {
        let queryData = {
            date: '2020-01-11,2020-01-31',
            status: '0',
            teacherIds: '1,2,3,4,5',
            studentsCount: '1,10',
            page: '1',
            lessonsPerPage: '10'
        };
        chai.request(server)
            .get('/')
            .query(queryData)
            .end((err, res) => {
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                done();
            });
    });
    it('bad date', function (done) {
        let queryData = {
            date: '2020-01-1',
        };
        chai.request(server)
            .get('/')
            .query(queryData)
            .end((err, res) => {
                res.status.should.eql(400);
                res.type.should.eql('application/json');
                done();
            });
    })
});

