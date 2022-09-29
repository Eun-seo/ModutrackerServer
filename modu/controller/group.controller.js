"use strict";

const Group = require("../model/group");
const jwt = require('jsonwebtoken');

exports.addGroup = function (req, res){
    const new_group = new Group(null, req.body);
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res
            .status(400)
            .send({error : true, message: "Please provide all required field"});
    } else {
        Group.addGroup(new_group, function (err, group) {
            if (err) res.send(err);
            res.json({
                data: group,
            });
        });
    }
};

exports.joinGroup = function (req, res){
    const token = req.headers.authorization;
    const new_group = new Group(token, req.body);

    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res
            .status(400)
            .send({isSuccess : false, code : 400, message: "Please provide all required field"});
    }
    else {
        Group.joinGroup(new_group, function (err, group) {
            if (err == 300) {
                res.status(300)
                .send({isSuccess : false, code : 300, message: "Invalid group code"});
            }
            else{
                res.send({isSuccess : true, code : 200, message: "Update Success"});
            }
        });
    }
}

exports.findGroup = function (req, res) {
    Group.findGroup(function (err, group){
        console.log("controller");
        if(err) res.send(err);
        console.log("res", group);
        res.send(group);
    });
};