// import type { Options } from "@wdio/types";
import { spawn, spawnSync } from "child_process";
import * as path from "path";

let tauriDriver: any;

const binSuffix = process.platform === "win32" ? ".exe" : "";

export const config = {
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "./tsconfig.json",
    },
    // tsconfig-paths is only used if "tsConfigPathsOpts" are provided, if you
    // do please make sure "tsconfig-paths" is installed as dependency
    // tsConfigPathsOpts: {
    //     baseUrl: './'
    // }
  },
  specs: ["./test/**/*.ts"],
  exclude: [],
  maxInstances: 10,

  capabilities: [
    {
      "tauri:options": {
        application: "./src-tauri/target/release/cool-reader" + binSuffix,
      },
      "ms:edgeOptions": {
        args: ["headless"],
      },
      maxInstances: 1,
      //
      // browserName: "edge",
      acceptInsecureCerts: true,
    },
  ],

  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "warn",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  onPrepare: () => spawnSync("cargo", ["build", "--release"]),
  beforeSession: () => {
    // tauriDriver = spawn("tauri-driver", [], {
    //   stdio: [null, process.stdout, process.stderr],
    // });

    // todo:  此处 存在一个问题： 通常每个套接字地址(协议/网络地址/端口)只允许使用一次，IPv6 port not available. Exiting...
    tauriDriver = spawn(
      path.resolve(process.cwd(), "bin", "tauri-driver"),
      [],
      { stdio: [null, process.stdout, process.stderr] }
    );
  },
  afterSession: () => tauriDriver?.kill(),
  onComplete: () => tauriDriver?.kill(),
};
