import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { API_KEY } from './config';

export const cronJob = functions.pubsub.schedule('every 12 hours from 06:00 to 18:00')
  .timeZone('Asia/Singapore')
  .onRun(async (context) => {
    console.log('This will be run every day at 6am and 6pm!');
    try {
      // set subscribers article index to 0
      reinitializeArticleIndex()

      // get articles from sources and from country
      const [
        sourcesArticles,
        countryArticles
      ] = await Promise.all([
        getRequest(sourcesParams),
        getRequest(countryParams)
      ])
      
      // merge articles
      const articles = mergeArticles(sourcesArticles.data.articles, countryArticles.data.articles)

      // set to db
      admin.database().ref('articles').set(articles).catch(err => console.log(err))
    } catch (err) {
      console.log(err)
    }
});

const sourcesParams = {
  pageSize: 100,
  sources: "bbc-news,bloomberg,cnn,fortune,google-news,hacker-news,national-geographic,techcrunch,techradar,the-new-york-times,the-washington-post,the-verge,time,wired",
}

const countryParams = {
  pageSize: 100,
  country: "sg",
}

export const getRequest = async (params: {pageSize: number, sources?: string, country?: string}) => {
  const config = {
    headers: {
      'Authorization': API_KEY
    },
    params: params
  };
  return axios.get("https://newsapi.org/v2/top-headlines", config)
};

export const mergeArticles = (arr1: {publishedAt: string}[], arr2: {publishedAt: string}[]) => {
  const arr = arr1.concat(arr2);
  arr.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  return arr;
}

const reinitializeArticleIndex = () => {
  admin.database().ref('subscribers')
    .once('value')
    .then(snapshot => {
      const subscribers = Object.keys(snapshot.val());
      const updates:{ [index:string] : number } = {}
      for (const subscriber of subscribers) {
        updates[`subscribers/${subscriber}/articleIndex`] = 0
      }
      admin.database().ref().update(updates)
        .catch(err => console.log(err))
      
    })
    .catch(err => console.log(err))
}