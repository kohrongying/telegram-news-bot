/// <reference types="jest" />

import { mergeArticles, getRequest } from "../cron";
import axios from "axios";
import { API_KEY } from "../config";

jest.mock('axios', () => {
  return {
     get: jest.fn(() => Promise.resolve({status: 200}))
  };
});

describe("Test merge article function", () => {
  const article1 = {
    "source": {
        "id": "google-news",
        "name": "Google News"
    },
    "author": "NG HUIWEN",
    "title": "Man who was rescued from burning Bukit Batok flat dies in hospital - The Straits Times",
    "description": "SINGAPORE - The man who was rescued from a burning Bukit Batok Housing Board (HDB) flat in the early hours of Thursday (July 18) has died in hospital.. Read more at straitstimes.com.",
    "url": "https://news.google.com/__i/rss/rd/articles/CBMiaWh0dHBzOi8vd3d3LnN0cmFpdHN0aW1lcy5jb20vc2luZ2Fwb3JlL21hbi13aG8td2FzLXJlc2N1ZWQtZnJvbS1idXJuaW5nLWJ1a2l0LWJhdG9rLWZsYXQtZGllcy1pbi1ob3NwaXRhbNIBAA?oc=5",
    "urlToImage": "https://www.straitstimes.com/sites/default/files/styles/x_large/public/articles/2019/07/20/colin-cc-20.jpg?itok=T61VfYcd",
    "publishedAt": "2019-07-20T07:57:44Z",
  }
  const article2 = {
    "source": {
        "id": "google-news",
        "name": "Google News"
    },
    "author": null,
    "title": "AMD Ryzen 7 3800X vs. 3700X Review: Don't Waste the Money - Gamers Nexus",
    "description": null,
    "url": "https://news.google.com/__i/rss/rd/articles/CBMiK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UEFHUXdXRHlVUknSAQA?oc=5",
    "urlToImage": null,
    "publishedAt": "2019-07-20T07:01:05Z",
    "content": null
  }
  const article3 = {
    "source": {
        "id": "buzzfeed",
        "name": "Buzzfeed"
    },
    "author": "Hanifah Rahman, Josie Ayre, Ben Armson, Sam Cleal",
    "title": "Can You Guess The Children's Book From These Adorable Doodles?",
    "description": "Primary school nostalgia in three...two...one!",
    "url": "https://www.buzzfeed.com/hanifahrahman/kids-books-drawings",
    "urlToImage": "https://img.buzzfeed.com/buzzfeed-static/static/2019-07/18/9/enhanced/336e1ad540d1/original-3575-1563440461-2.jpg?crop=1249:654;0,12",
    "publishedAt": "2019-07-20T10:04:14Z",
    "content": null
  }
  const article4 = {
    "source": {
        "id": "buzzfeed",
        "name": "Buzzfeed"
    },
    "author": "Elena Garcia",
    "title": "35 Things For Your Next Flight That'll Make You Feel Like You're In First Class",
    "description": "Forget first class — with this stuff, you'll be feeling like you're traveling on a private jet!",
    "url": "https://www.buzzfeed.com/elenamgarcia/things-for-next-flight-feel-like-first-class",
    "urlToImage": "https://img.buzzfeed.com/buzzfeed-static/static/2019-07/17/21/enhanced/c4f234449d76/original-606-1563397281-2.png?crop=980:513;16,0",
    "publishedAt": "2019-07-20T10:01:07Z",
    "content": null
  }
  
  test("Merge", () => {
    const arr1 = [article1, article2]
    const arr2 = [article3, article4]
    const merged = mergeArticles(arr1, arr2)
   
    expect(merged[0]).toBe(article3)
    expect(merged[1]).toBe(article4)
    expect(merged[2]).toBe(article1)
    expect(merged[3]).toBe(article2)
  })

})

describe("Get request", () => {
  const countryParams = {
    pageSize: 100,
    country: "sg",
  }

  const config = {
    headers: {
      'Authorization': API_KEY
    },
    params: countryParams
  }

  test("When params is valid", async () => {
    await getRequest(countryParams)

    expect(axios.get).toHaveBeenCalledWith("https://newsapi.org/v2/top-headlines", config);
    expect(axios.get).toHaveBeenCalledTimes(1)
  })
})