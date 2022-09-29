"use strict";

const mysql = require("../config/mysql");
const jwt = require("jsonwebtoken");

let Group = function (token, group) {
    this.groupcode = group.groupcode;
    this.token = token;
};

Group.addGroup = function (newEmp, result){
        mysql.query('Insert into group_table(groupcode) values(?)', [newEmp.groupcode], function (err, res){
            if(err){
                console.log("error: ", err);
                result(null, res);
            }
            else{
                console.log("groupcode : ", newEmp.groupcode);
                result(null, res.insertId);
            }
        });
    };

Group.joinGroup = function (newEmp, result){
    const data =  jwt.verify(newEmp.token, 'modu_key');
    const userid = data.idCode;

    //groupcode가 유효한 코드인지 확인하기
    mysql.query('select groupidx from group_table where groupcode = ?',[newEmp.groupcode], function (err,res){
        if(err){
            console.log("error: ", err);
            result(null, res);
        }
        else if(res.length == 0){
            console.log("Invalid group code");
            result(300, res);
        }
        else{
            mysql.query('update user set groupidx = (select groupidx from group_table where groupcode = ?) where id = ?',
                [newEmp.groupcode, userid], function (err, res){
                    if(err){
                        console.log("error: ", err);
                        result(null, res);
                    }
                    else{
                        console.log(res.insertId);
                        result(null, res.insertId);
                    }
                });
        }
    });

};

Group.findGroup = function (result) {
    mysql.query('Select * from group_table', function (err, res) {
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

module.exports = Group;