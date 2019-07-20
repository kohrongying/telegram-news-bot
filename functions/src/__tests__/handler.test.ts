/// <reference types="jest" />

import { toLocalTime, formatText, welcomeMessage } from "../handler";

describe("To Local Time", () => {
  expect(toLocalTime('2019-07-20T08:45:38Z')).toBe("Sat, 20 Jul 2019 16:45:38");
});

describe("Format Text" ,() => {
  const emptyTemplate = `*Test Title*
---


_Published at: Sat, 20 Jul 2019 16:45:38_

`
  const template = `*Test Title*
---
Test Description

_Published at: Sat, 20 Jul 2019 16:45:38_
[image](test.png)
`

  test("With description and imageURL", () => {
    const article = {
      title: "Test Title",
      url: "test.url",
      publishedAt: "2019-07-20T08:45:38Z"
    }
    expect(formatText(article)).toBe(emptyTemplate)
  })

  test("With description and imageURL", () => {
    const article = {
      title: "Test Title",
      url: "test.url",
      publishedAt: "2019-07-20T08:45:38Z",
      description: "Test Description",
      urlToImage: "test.png"
    }
    expect(formatText(article)).toBe(template)
  })

})

describe("Welcome Message", () => {
  const template = `Hello **

Thanks for subscribing to ry's news where ry curates the world's news for you! Too bad you don't get a choice. Ry likes tech news and also sg news. Ry hopes you like the news! Respond with a message to start!

_Powered by NewSAPI.org_
`

const templateWithName = `Hello *alice*

Thanks for subscribing to ry's news where ry curates the world's news for you! Too bad you don't get a choice. Ry likes tech news and also sg news. Ry hopes you like the news! Respond with a message to start!

_Powered by NewSAPI.org_
`


  test("With username", () => {
    expect(welcomeMessage('alice')).toBe(templateWithName)
  })

  test("With no username", () => {
    expect(welcomeMessage(undefined)).toBe(template)
  })
})

