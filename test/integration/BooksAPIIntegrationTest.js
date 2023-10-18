const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'dev';
const envPath = path.resolve(__dirname, '..', '..', 'config', `.env.${env}`);
dotenv.config({ path: envPath });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai-for-sinon');
const RandomStringGenerator = require('randomstring');

const port = process.env.ServerPort || 3000;
const server = `http://localhost:${port}`;
const testData = require('../testData/bookAPIRequest.json');

chai.use(chaiHttp);

describe('Book Managament APIs Flow test', () => {
  let bookId;
  const request = { ...testData.bookRequestWithCommonGenre };
  request.title = RandomStringGenerator.generate(5);

  it('TC1-Create Book', async () => {
    const res = await chai.request(server)
      .post('/books')
      .set('api-version', 1)
      .send(request);
    expect(res.status).to.equals(201);
    expect(res.body._id).to.exist;
    expect(res.body.resourceType).to.equals('Book');
    expect(res.body.title).to.equals(request.title);
    expect(res.body.author).to.equals('Rowling');
    expect(res.body.genre).to.equals('Common');
    bookId = res.body._id;
  });

  it('TC2-Get Book by id', async () => {
    const res = await chai.request(server)
      .get(`/books/${bookId}`)
      .set('api-version', 1);
    expect(res.status).to.equals(200);
    expect(res.body._id).to.exist;
    expect(res.body.resourceType).to.equals('Book');
    expect(res.body.title).to.equals(request.title);
    expect(res.body.author).to.equals('Rowling');
    expect(res.body.genre).to.equals('Common');
  });

  it('TC3-Update genre for book', async () => {
    const res = await chai.request(server)
      .put(`/books/${bookId}`)
      .set('api-version', 1)
      .send(testData.bookUpdateRequestWithHorrorGenre);
    expect(res.status).to.equals(200);
    expect(res.body._id).to.exist;
    expect(res.body.resourceType).to.equals('Book');
    expect(res.body.title).to.equals(request.title);
    expect(res.body.author).to.equals('Rowling');
    expect(res.body.genre).to.equals('Thriller');
  });

  it('TC4-Query book by genre=Thriller', async () => {
    const res = await chai.request(server)
      .get('/books')
      .set('api-version', 1)
      .query({ genre: 'Thriller' });
    expect(res.status).to.equals(200);
    let count = 0;
    for (const eachBook of res.body) {
      if (eachBook.name === 'Harry Potter') {
        count += 1;
        expect(eachBook._id).to.exist;
        expect(eachBook.resourceType).to.equals('Book');
        expect(eachBook.title).to.equals(request.title);
        expect(eachBook.author).to.equals('Rowling');
        expect(eachBook.genre).to.equals('Thriller');
        break;
      }
    }
    expect(count).to.not.equals(1);
  });

  it('TC5-Delete book by id', async () => {
    await chai.request(server)
      .delete(`/books/${bookId}`)
      .set('api-version', 1)
      .end((err, res) => {
        expect(res.status).to.equals(204);
      });
  });
});
