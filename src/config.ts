export const scraper = {
  articlesApiUrl: 'https://cms.zaonce.net/ru-RU/jsonapi/node/galnet_article?page[limit]=10&sort=-created',
  postTemplateUrl: 'https://www.elitedangerous.com/ru-RU/%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8/galnet/',
  imageTemplateUrl: 'https://hosting.zaonce.net/elite-dangerous/galnet/',
  delay: 5 * 60 * 1000
}

export const mongo = {
  connectionString: 'mongo connection string'
}

export const webhook = {
  url: 'discord webhook url'
}
