import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const newsHandler = functions.https.onRequest((req, res) => {
  const update = req.body;
  if (update.hasOwnProperty('message')) {
    if (update.message.text === "/start") {
      initializeSubscriber(update.message.chat.id)
      const reply = {
        method: 'sendMessage',
        chat_id: update.message.chat.id,
        parse_mode: 'Markdown',
        text: welcomeMessage(update.message.chat.username),
        reply_markup: JSON.stringify({
          keyboard: [
            [
              {
                text: "Load More"
              },
            ]
          ],
          resize_keyboard: true,
        })
      }
      return res.json(reply)
    } else {
      let reply = {};
      return getArticleIndex(update.message.chat.id)
        .then(articleIndex => {
          console.log('articleIndex', articleIndex)
          return getArticle(articleIndex)
        })
        .then(article => {
          console.log('article', article)
          reply = {
            method: 'sendMessage',
            chat_id: update.message.chat.id,
            text: formatText(article),
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: article.source.name ? `Read on ${article.source.name}` : "View more",
                    url: article.url
                  }
                ]
              ],
            })
          };
          return updateArticleIndex(update.message.chat.id)
        })
        .then(() => {
          console.log('updated index');
          return res.json(reply);
        })
        .catch(err => console.log(err))
    }
  }
  // If no message property
  return res.sendStatus(200)
});

export const toLocalTime = (timeString: string) => {
  const d = new Date(timeString)
  return new Date(d.getTime() + 8 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
}

export const formatText = (article: { title: string; urlToImage?: string; url: string; description?: string; publishedAt: string; }) => `*${article.title}*
---
${article.description ? article.description : ''}

_Published at: ${toLocalTime(article.publishedAt)}_
${article.urlToImage ? `[image](${article.urlToImage})` : ''}
`

export const welcomeMessage = (name: string|undefined) => `Hello *${name ? name : ''}*

Thanks for subscribing to ry's news where ry curates the world's news for you! Too bad you don't get a choice. Ry likes tech news and also sg news. Ry hopes you like the news! Respond with a message to start!

_Powered by NewSAPI.org_
`

const initializeSubscriber = (id: number) => {
  admin.database().ref(`subscribers/${id}/articleIndex`)
    .set(0)
    .catch(err => console.log(err));
}

const getArticleIndex = (id: number) => {
  return admin.database().ref(`subscribers/${id}/articleIndex`)
    .once('value')
    .then(snapshot => snapshot.val())
}

const getArticle = (index: number) => {
  return admin.database().ref(`articles/${index}`)
    .once('value')
    .then(snapshot => snapshot.val())
}

const updateArticleIndex = (id: number) => {
  return admin.database().ref(`subscribers/${id}/articleIndex`)
    .transaction(index => index + 1)
}