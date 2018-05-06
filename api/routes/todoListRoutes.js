'use strict';
// const https = require('https');
const fs = require('fs');
const cmd = require('node-cmd');
const RQ = require('request');

var urlencode = require('urlencode');

const Joi = require('joi');



module.exports = function (app) {
  app.route('/contract')
    .get(defaultGet)
    .post(smartRender);

};

var defaultGet = function (req, res) {
  res.json({
    ok: 'GET'
  });
}
var smartRender = function (req, res) {
  console.log(JSON.stringify(req.body, '\t'));
  if(req.body['TEXT']) {
      let r = res;
    renderText(req.body['TEXT']).then(res => {
        console.log('>>> ALL DONE!');
        r.json({
            result: res
        });
    }, err => {
        console.log(err);
        r.json({
            err: 'POST'
        });
    });
  }
  
}


// article
function heredoc(fn) {
  return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
}

function renderText(text) {
    console.log(text)
    return new Promise((resolve, reject) => {
        console.log("---> 1: Writing file into contract2.txt....");
        
        // INPUT RAW TEXT
        fs.writeFileSync("contract2.txt", text, 'utf8');
        console.log("---> 1: DONE!");
      
        console.log("---> 2: START NLP....");
        // ask python to do the NLP and store in keyword.txt
        var pyProcess = cmd.get('python3 test.py',
          function (err, data, stderr) {
            if (!err) {
              console.log("data from python script: " + data)
      
              // Read the keywords from the file
              // START OUTPUT
              new Promise(
                (resolve2, reject2) => {
                  fs.readFile('keyword.txt', 'utf8', function (err, keyword) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    let keywordArr = keyword.split('_NL_');
                    console.log(keywordArr);
                    resolve2(keywordArr); 
                  });
                }
              ).then(keywordArr => {
                new Promise(
                  (resolve3, reject3) => {
                    fs.readFile('keyword2.txt', 'utf8', function (err, keyword) {
                      if (err) {
                          console.log(err);
                          reject(err);
                      }
                      let linesArr = keyword.split('_NL_');
                      console.log(linesArr);
                      resolve3({
                        lines: linesArr,
                        keywords: keywordArr
                      }); 
                    });
                  }
                )
              }).then(result => {
                resolve(result);
              });
            } else {
                console.log("python script cmd error: " + err)
                reject(err);
              
            }
          }
        );
    });
    

}

