const express = require('express');
const catalystSDK = require('zcatalyst-sdk-node');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const catalyst = catalystSDK.initialize(req);
  res.locals.catalyst = catalyst;
  next();
});

app.get('/home_elements', async (req, res) => {
  try {
    const { catalyst } = res.locals;

    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    const zcql = catalyst.zcql();

    const hasMore = await zcql
      .executeZCQLQuery(`SELECT COUNT(ROWID) FROM Home`)
      .then((rows) => parseInt(rows[0].Home.ROWID) > page * perPage);

    const homeItems = await zcql
      .executeZCQLQuery(
        `SELECT ROWID,WELCOME_TITLE,WELCOME_TEXT FROM Home LIMIT  ${
          (page - 1) * perPage + 1
        },${perPage}`
      )
      .then((rows) =>
        rows.map((row) => ({
          id: row.Home.ROWID,
          welcome_title: row.Home.WELCOME_TITLE,
          welcome_text: row.Home.WELCOME_TEXT,
        }))
      );

    res.status(200).send({
      status: 'success',
      data: {
        homeItems,
        hasMore,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failure',
      message: "We're unable to process the request.",
    });
  }
});
app.get('/about_elements', async (req, res) => {
  try {
    const { catalyst } = res.locals;

    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    const zcql = catalyst.zcql();

    const hasMore = await zcql
      .executeZCQLQuery(`SELECT COUNT(ROWID) FROM About`)
      .then((rows) => parseInt(rows[0].About.ROWID) > page * perPage);

    const aboutItems = await zcql
      .executeZCQLQuery(
        `SELECT ROWID,TITLE,CONTENT FROM About LIMIT  ${
          (page - 1) * perPage + 1
        },${perPage}`
      )
      .then((rows) =>
        rows.map((row) => ({
          id: row.About.ROWID,
          title: row.About.TITLE,
          content: row.About.CONTENT,
        }))
      );

    res.status(200).send({
      status: 'success',
      data: {
        aboutItems,
        hasMore,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failure',
      message: "We're unable to process the request.",
    });
  }
});
module.exports = app;
