import { exec } from "child_process";
import { Request, Response } from "express";
import { GithubHook } from "../models/misc/github";

export async function AutoUpdateFromGithub(req: Request, res: Response) {
  let hook: GithubHook = req.body;
  console.log(`Receiving update from Github`);
  console.log({
    application: hook?.repository?.name,
    user: hook?.pusher?.name,
    from: hook?.before,
    to: hook?.after,
  });
  exec(
    "git pull && tsc && pm2 restart SUPERSOFT-API",
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
  return res.status(200).json({ message: `Updating code` });
}
