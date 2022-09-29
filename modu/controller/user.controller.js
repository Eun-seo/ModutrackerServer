"use strict";

const User = require("../model/user");

exports.findAll = function (req, res) {
  User.findAll(function (err, user){
      console.log("controller");
      if(err) res.send(err);
      console.log("res", user);
      res.send(user);
  });
};

exports.signUp = function (req, res) {
    const token = req.headers.authorization;
    const new_user = new User(req.body, token);

    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res
            .status(400)
            .send({isSuccess : false, code : 400, message: "Please provide all required field"});
    } else {
        User.signUp(new_user, function (err, user) {
            if (err == 300) {
                res.status(300)
                    .send({isSuccess : false, code : 300, message: "Invalid group code"});
            }
            else{
                res.send({isSuccess : true, code : 200, message: "Sign up Success"})

            }
        });
    }
};

exports.isMember = function (req, res) {
    const jwt = new User(req.body);
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res
            .status(400)
            .send({error : true, message: "Please provide all required field"});
    } else {
        User.isMember(jwt, function (err, result) {
            if (err) res.send(err);
            res.json({
                data: result,
            });
        });
    }
};

exports.info = function (req, res) {
    const token = req.headers.authorization;

    User.info(token, function (err, user){
        console.log("controller");
        if(err) res.send(err);
        console.log("res", user);
        res.json({
            data: user,
        });
    });
};