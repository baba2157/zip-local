﻿var fs = require('fs');
var expect = require('chai').expect;
var zipper = require('../main.js');
var JSZip = require('jszip');

var localMemory = {}; // used for passing variables between tests


describe("Unzipping asynchronously", function () {

    it("should unzip a .zip file in memory without errors", function (done) {

        zipper.unzip("./tests/assets/hello.zip", function (unzipped) {

            localMemory.T1ZippedFS = unzipped.memory();

            done();
        });
    });

    it("checks if the ZippedFS object contains correct data", function () {
       
        expect(localMemory.T1ZippedFS.contents()).to.include("hello/says-hello") &&
        expect(localMemory.T1ZippedFS.read("hello/says-hello", 'text')).to.equal("Hello") &&
        expect(localMemory.T1ZippedFS.contents()).to.include("hello/world/says-world") &&
        expect(localMemory.T1ZippedFS.read("hello/world/says-world", 'text')).to.equal("World");
    });

    it("should unzip a .zip file to disk without errors", function (done) {

        zipper.unzip("./tests/assets/hello.zip", function (unzipped) {
            
            fs.mkdir("./tests/assets/hello-async-unzip", function (err) {
                if (err)
                    throw err;

                unzipped.save("./tests/assets/hello-async-unzip/", function () {
                    done();
                });
            });
        });
    });

    it("should check if unzipped files on disk contain correct data", function (done) {

        fs.readFile("./tests/assets/hello-async-unzip/hello/says-hello", 'utf8', function (err, data) {
            
            if (err)
                throw err;
            
            expect(data).to.equal("Hello");

            fs.readFile("./tests/assets/hello-async-unzip/hello/world/says-world", 'utf8', function (err, world_data) {

                if (err)
                    throw err;

                expect(world_data).to.equal("World");

                done();
            });
        });

    });

})