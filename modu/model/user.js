"use strict";

const mysql = require("../config/mysql");
const request = require("request");
const jwt = require("jsonwebtoken");

let User = function (user, token) {
    this.accesstoken = user.accesstoken;
    this.id = user.id;
    this.name = user.name;
    this.groupcode = user.groupcode;
    this.token = token;
};

User.findAll = function (result) {
    mysql.query('Select * from user', function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, res);
        }
        else {
            console.log("result : ", res);
            result(null, res);
        }
    });
};
 //회원가입
User.signUp = function (newEmp, result) {
    //카카오에서 사용자 정보 받아오기
    const data = jwt.verify(newEmp.token, 'modu_key');
    const userid = data.idCode;

    if (newEmp.groupcode != null) {
        //groupcode가 유효한 코드인지 확인
        mysql.query('select groupidx from group_table where groupcode = ?', [newEmp.groupcode], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, res);
            } else if (res.length == 0) {
                console.log("Invalid group code");
                result(300, res);
            } else {
                mysql.query('Insert into user (id, name, groupidx) values(?, ?,(select groupidx from group_table where groupcode = ? limit 1))', [userid, newEmp.name, newEmp.groupcode], function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        console.log(res.insertId);
                        result(null, res.insertId);
                    }
                });
            }
        });
    }
    else{
        mysql.query('Insert into user (id, name, groupidx) values(?, ?,(select groupidx from group_table order by groupidx desc limit 1))', [userid, newEmp.name], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    }
};

User.isMember = function (newEmp, result) {

    //카카오에서 사용자 정보 받아오기
    var id;

    const options = {
        method : 'GET',
        uri:'https://kapi.kakao.com/v2/user/me',
        headers : { 'Authorization' : 'Bearer ' + newEmp.accesstoken },
    };

    request(options, function (err, response, body){
        if(err){
            console.log("result : ", err);
        }
        else{
            console.log("result : ", body);
            var data = JSON.parse(body);
            id = data.id;
            console.log("input id : ", id);

            var token = jwt.sign({
                idCode: id
            },
                "modu_key");

            mysql.query('Select exists (select * from user where id = ? limit 1) as result', [id], function (err, res){
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    var data = JSON.stringify(res[0]);
                    var jsondata = JSON.parse(data);
                    jsondata.jwt = token;
                    console.log(jsondata);
                    result(null, jsondata);
                }
            });
        }

    });


};

User.info = function (token, result) {
    const data = jwt.verify(token, 'modu_key');
    const userid = data.idCode;

    mysql.query('Select name, groupcode from user join group_table gt on user.groupidx = gt.groupidx where id = ?', [userid], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, res);
        }
        else {
            console.log("result : ", res);
            result(null, res);
        }
    });
};

module.exports = User;