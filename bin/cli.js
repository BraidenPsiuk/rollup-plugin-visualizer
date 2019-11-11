#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const mkdirp = require("mkdirp");

const mkdir = promisify(mkdirp);
const writeFile = promisify(fs.writeFile);

const buildStats = require("./build-stats");
const TEMPLATE = require("../plugin/template-types");

const argv = require("yargs")
  .option("extra-style-path", {
    describe: "Extra override css file path",
    string: true
  })
  .option("tree-merge-new-root", {
    describe: "Merge all trees by appending as a child to new root",
    boolean: true
  })
  .option("filename", {
    describe: "Output file name",
    string: true,
    default: "./stats.html"
  })
  .option("title", {
    describe: "Output file title",
    string: true,
    default: "RollUp Visualizer"
  })
  .option("template", {
    describe: "Template type",
    string: true,
    choices: TEMPLATE,
    default: "treemap"
  })
  .help().argv;

const listOfFiles = argv._;

const run = async (title, template, extraStylePath, filename, files) => {
  if (files.length === 0) {
    throw new Error("Empty file list");
  }

  const data = { tree, nodes, nodeIds, links };

  const fileContent = await buildStats(
    title,
    data,
    template,
    extraStylePath,
    {}
  );

  await mkdir(path.dirname(filename));
  await writeFile(filename, fileContent);
};

run(
  argv.title,
  argv.template,
  argv.extraStylePath,
  argv.filename,
  listOfFiles
).catch(err => {
  console.error(err.message);
  process.exit(1);
});
