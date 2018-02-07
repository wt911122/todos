const express = require("express");
//const cors = require('cors')
const path = require("path");
const fs = require("fs");

const rootPath = process.cwd();
const app = express();
const bodyParser = require('body-parser');
const bulkWrite = require('./mongoDao').bulkWrite;
const findAll = require('./mongoDao').findAll;


const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'js', 'css'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

const OPRATION = {
  c: {
    parser: (id, state, content) => ({
      insertOne: {
        "document": 
        {
          "_id": id,
          "content": content,
          "state": state,
        }
      }
    }),
  },
  r: 'query',
  u: {
    parser: (id, state, content) => {
      const update = { "state": state };
      if(content){
        update.content = content;
      }
      return {
        updateOne: {
          "filter": { "_id": id},
          "update": {
            $set: {
              ...update
            }
          }
        }
      }
    },
  },
  d: {
    parser: (id) => ({
      deleteOne: {
        "filter": { "_id": id},
      }
    }),
  },
}

const parseOperation = ({
    id, state, content, crud
  }) => {
  console.log(crud);
  return OPRATION[crud].parser(id, state, content);
}

const parse = (data) =>
  (data.map((record) => (parseOperation(record))));

const reorganize = (data) => {
  /*
  优先级：
  1）如果有一个d操作则只保留一个d
  2）如果没有d操作，有一个c操作则只保留一个c
  3）d、c都没有就保留u
  4）保留最终状态和内容
  */
  const bunch = {};
  data.forEach(({id, state, content, crud}) => {
    if(!bunch[id]){
      bunch[id] = {id: id, state: state, content: content, crud: crud};
    }else{
      if(state) bunch[id].state = state;
      if(content) bunch[id].content = content;
      if(crud === 'd' || (crud === 'c' && bunch[id].crud !== 'd')) bunch[id].crud = crud;
    }
  });
  return Object.keys(bunch).map((k) => (bunch[k]));
}

//const parseBack = (doc) => (doc.map((_id, content, state) => ({id: _id, state, content})));


//console.log(rootPath + '/pub')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath + '/src', options));
app.post('/crud', function (req, res) {
  let data = JSON.parse(Object.keys(req.body)[0]);
  //console.log(data);
  data = reorganize(data);
  //console.log(data);
  const bulk = parse(data);
  //console.log(JSON.stringify(bulk));
  bulkWrite(bulk,
    (err) => {
      res.send({code: -1, data: err})
    },
    (result) => {
      res.send({code: 1, data: result})
    });
  //res.send('received');
});
app.post('/r', function(req, res) {
  findAll((doc) => {
    res.send(doc);
  })
});
//app.use(cors);
app.listen(8080);