const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai-for-sinon');

const port = process.env.ServerPort || 3000;
const server = `http://localhost:${port}`;
const RandomStringGenerator = require('randomstring');
const testData = require('./testData/bookAPIRequest.json');

chai.use(chaiHttp);

describe('Create Book Negative Flow Test', () => {
  it('TC1-Create Book with invalid api-version header', async () => {
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 12)
      .send(testData.bookRequestWithCommonGenre);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Invalid api-version header');
  });

  it('TC2-Create Book with title having invalid chars', async () => {
    const request = { ...testData.bookRequestWithCommonGenre };
    request.title = '###abc';
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Provided field title has invalid characters');
  });

  it('TC3-Create Book with isbn having invalid chars', async () => {
    const request = { ...testData.bookRequestWithCommonGenre };
    request.isbn = '$123-isbn';
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Provided field isbn has invalid characters');
  });

  it('TC4-Create Book with invalid genre', async () => {
    const request = { ...testData.bookRequestWithCommonGenre };
    request.genre = 'Crime';
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Invalid genre passed');
  });

  it('TC5-Create Book with title having length less than allowed minimum length', async () => {
    const request = { ...testData.bookRequestWithCommonGenre };
    request.title = 'a';
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Provided field title should atleast have 3 characters');
  });

  it('TC6-Create Book with title having length more than allowed maximum length', async () => {
    const request = { ...testData.bookRequestWithCommonGenre };
    request.title = 'abcfhdkslllskslalsjdkdkddshdbbshskajajsjsndjdjdjsgdfdffsreyeians';
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Provided field title can have atmost have 63 characters');
  });

  it('TC7-Invoke Create Book API with empty body', async () => {
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send({});
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Request body should be an object with required fields');
  });

  describe.skip('Create Unprocessable entity scenario test', () => {
    let bookId;
    const request = { ...testData.bookRequestWithCommonGenre };
    request.title = RandomStringGenerator.generate(5);
    beforeEach(async () => {
      await chai.request(server)
        .post('/books')
        .set('api-version', 1)
        .send(request)
        .end((err, resp) => {
          bookId = resp.body._id;
        });
    });
    afterEach(async () => {
      await chai.request(server).delete(`/books/${bookId}`).set('api-version', 1).end();
    });
    it('TC09-Create book with same title that already exists', async () => {
      await chai.request(server)
        .post('/books')
        .set('api-version', 1)
        .send(request)
        .end((err, res) => {
          expect(res.status).to.equals(422);
          expect(res.body.resourceType).to.equals('OperationOutcome');
          expect(res.body.errorType).to.equals('UnprocessableEntity');
          expect(res.body.message).to.equals('Book with provided title already exists');
        });
    });
  });
});
