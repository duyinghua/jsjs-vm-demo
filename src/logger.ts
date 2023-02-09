import * as fs from "fs";
import * as path from "path";

export default function (name: string, log: any) {
  const logstr = typeof log !== "string" ? JSON.stringify(log) : log;
  const filepath = path.join(__dirname, "../log/", name + ".log");
  console.log("filepath: ", filepath);
  fs.writeFileSync(filepath, logstr);
}
