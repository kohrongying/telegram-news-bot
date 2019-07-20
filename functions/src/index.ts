import * as admin from 'firebase-admin';
import serviceAccount from "./serviceAccountKey.json";
import { cronJob } from "./cron";
import { newsHandler } from "./handler"
import { DB_UID } from './config';

admin.initializeApp({
  credential: admin.credential.cert((<any>serviceAccount)),
  databaseURL: "https://news-chat-1212.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: DB_UID
  }  
});

export const getNews = newsHandler;
export const refreshNewsJob = cronJob;