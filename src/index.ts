import moment from 'moment';
import {
  browser as browserConfig,
  mongo as mongoConfig,
  webhook as discordWebhookConfig
} from './config.js';
import { sleep } from './helpers.js';
import { DbOperations } from './mongo/mongo.js';
import { Scraper } from './scraper/scraper.js';
import { DiscordWebhook } from './discordWebhook/discord.js';

async function main() {
  const scraper = new Scraper();
  const mongo = new DbOperations(mongoConfig.connectionString);
  const discordWebhook = new DiscordWebhook(discordWebhookConfig.url);

  await sleep(1000);

  scraping(scraper, mongo, discordWebhook);
  scraper.startScrap(() => scraping(scraper, mongo, discordWebhook));

  console.log('Scraping started...');

}

async function scraping(scraper: Scraper, mongo: DbOperations, discordWebhook: DiscordWebhook) {
  try {
    const news = await scraper.getArticles();
    let newNews = [];

    for (let index = 0; index < news.length; index++) {
      const article = news[index];

      if (!(await mongo.checkEntryExist(article.id))) {
        newNews.unshift(article);
      }
    }

    for (let index = 0; index < newNews.length; index++) {
      const article = {
        galnet_id: newNews[index].id,
        title: newNews[index].attributes.title,
        date: newNews[index].attributes.field_galnet_date,
        text: newNews[index].attributes.body.value.split('\r\n'),
        image: newNews[index].attributes.field_galnet_image
          ? scraper.ImageTemplateUrl + newNews[index].attributes.field_galnet_image + '.png' : '',
        url: newNews[index].attributes.field_slug
          ? scraper.PostTemplateUrl + newNews[index].attributes.field_slug : ''
      };

      const result = await mongo.addEntry(article);

      if (result) {
        await discordWebhook.sendWebhook(article);
      }
    }

    console.log(`Gain ${newNews?.length} news...`);
  } catch (error) {
    console.log(error);
  }
}

main();
