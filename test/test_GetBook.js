const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'dev';
const envPath = path.resolve(__dirname, '..', 'config', `.env.${env}`);
dotenv.config({ path: envPath });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai-for-sinon');
const RandomStringGenerator = require('randomstring');

const testData = require('./testData/bookAPIRequest.json');

const port = process.env.ServerPort || 3000;
const server = `http://localhost:${port}`;
const genreEnum = ['Horror', 'Thriller', 'Common'];

chai.use(chaiHttp);
describe('GET /books', () => {
  let book1Id;
  let book2Id;
  const book1Request = { ...testData.bookRequestWithCommonGenre };
  book1Request.title = RandomStringGenerator.generate(5);
  const book2Request = { ...testData.bookRequestWithHorrorGenre };
  book2Request.title = RandomStringGenerator.generate(5);

  before(async () => {
    await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(book1Request)
      .end((err, res) => {
        book1Id = res.body._id;
      });

    await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(book2Request)
      .end((err, res) => {
        book2Id = res.body._id;
      });
  });

  after(async () => {
    await chai.request(server).delete(`/books/${book1Id}`).set('api-version', 1).end();
    await chai.request(server).delete(`/books/${book2Id}`).set('api-version', 1).end();
  });
  it('TC1-Search books should return all the books', async () => {
    await chai.request(server).get('/books').set('api-version', 1).end((err, res) => {
      expect(res.status).to.equals(200);
      res.body.forEach((eachBook) => {
        expect(eachBook.resourceType).to.equals('Book');
        expect(eachBook.title).to.exist;
        expect(eachBook.author).to.exist;
        expect(genreEnum).to.include(eachBook.genre);
        expect(eachBook._id).to.exist;
      });
    });
  });

  it('TC2-Search books by genre query param=Horror, should return all books of Horror genre type', async () => {
    await chai.request(server)
      .get('/books')
      .set('api-version', 1)
      .query({ genre: 'Horror' })
      .end((err, res) => {
        expect(res.status).to.equals(200);
        res.body.forEach((eachBook) => {
          expect(eachBook.resourceType).to.equals('Book');
          expect(eachBook.title).to.exist;
          expect(eachBook.author).to.exist;
          expect(eachBook.author).to.equals('Horror');
          expect(eachBook._id).to.exist;
        });
      });
  });

  it('TC3-Search books should return error when invalid query param is provided', async () => {
    const res = await chai.request(server)
      .get('/books')
      .set('api-version', 1)
      .query({ genre: 'Invalid' });
    expect(res.status).to.equals(400);
    expect(res.body.resourceType).to.equals('OperationOutcome');
    expect(res.body.errorType).to.equals('BadRequest');
    expect(res.body.message).to.equals('Invalid genre passed');
  });

  it('TC4-Search books API should return error when unsupported query param is provided', async () => {
    await chai.request(server)
      .get('/books')
      .set('api-version', 1)
      .query({ invalid: 'invalid' })
      .end((err, res) => {
        expect(res.status).to.equals(400);
        expect(res.body.resourceType).to.equals('OperationOutcome');
        expect(res.body.errorType).to.equals('BadRequest');
        expect(res.body.message).to.equals('must NOT have additional properties');
      });
  });

  it('TC5-Search books API should return error when invalid api-version header is provided', async () => {
    await chai.request(server)
      .get('/books')
      .set('api-version', 100)
      .end((err, res) => {
        expect(res.status).to.equals(400);
        expect(res.body.resourceType).to.equals('OperationOutcome');
        expect(res.body.errorType).to.equals('BadRequest');
        expect(res.body.message).to.equals('Invalid api-version header');
      });
  });
});
