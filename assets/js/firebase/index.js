import { getApp, getApps, initializeApp } from "firebase/app";
import config from "./config";

if (!getApps().length) {
  initializeApp(config);
} else {
  getApp();
}
