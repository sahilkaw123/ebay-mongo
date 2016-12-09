var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('http tests', function(){

    it('Test to get the login page', function(done){
        http.get('http://localhost:5000/signin', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('Test to check login username and password', function(done) {
        request.post(
            'http://localhost:5000/detailofBidProducts',
            { form: { operation: "detailofBidProducts", id:"8" } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('Test to check remove Product the cart', function(done) {
        request.post(
            'http://localhost:5000/removeProducts',
            { form: { operation: "removeProducts", id:"16"} },
            function (error, response, body) {
                assert.equal(500, response.statusCode);
                done();
            }
        );
    });

    it('This to get the product detail of product at homepage', function(done) {
        request.post(
            'http://localhost:5000/detailofProducts',
            { form: { operation: "detailofProducts", id:"30"} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('Test to get the datil of the bid product', function(done) {
        request.post(
            'http://localhost:5000/detailProduct',
            { form: { operation: "detailProduct", id:"38" } },
            function (error, response, body) {
                assert.equal(404, response.statusCode);
                done();
            }
        );
    });
});