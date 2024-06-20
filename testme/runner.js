import fs from "fs";
import chalk from "chalk";
import path from "path";
import { pathToFileURL } from "url";
import render from "./render.js";

const ignoreDirs = ["node_modules"];

export class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.blue(`----- ${file.shortName}`));
      const beforeEaches = [];
      global.render = render;
      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };
      global.it = async (desc, fn) => {
        beforeEaches.forEach((func) => func());
        try {
          await fn();
          console.log(chalk.green(`\tOK - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, "\n\t\t");
          console.log(chalk.red(`\tX - ${desc}`));
          console.log("\t", chalk.red(message));
        }
      };

      try {
        import(pathToFileURL(file.name));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);
    for (let file of files) {
      const filepath = path.join(targetPath, file);

      const stats = await fs.promises.lstat(filepath);
      if (stats.isFile() && file.includes(".test.js")) {
        this.testFiles.push({ name: filepath, shortName: file });
      } else if (stats.isDirectory() && !ignoreDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);
        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }
}
