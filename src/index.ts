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
  const scraper = new Scraper(browserConfig);
  const mongo = new DbOperations(mongoConfig.connectionString);
  const discordWebhook = new DiscordWebhook(discordWebhookConfig.url);

  await sleep(1000);

  scraping(scraper, mongo, discordWebhook);
  scraper.startScrap(() => scraping(scraper, mongo, discordWebhook));

  console.log('Scraping started...');

}

async function scraping(scraper: Scraper, mongo: DbOperations, discordWebhook: DiscordWebhook) {
  try {
    const news = await scraper.scrapTitles() || [];
    let newNews = [];

    for (let index = 0; index < news.length; index++) {
      const article = news[index];

      if (!(await mongo.checkEntryExist(article))) {
        newNews.unshift(article);
      }
    }

    newNews = newNews.sort((a,b) => {
      return Number(moment(a.time, 'YYYY-MMM-DD').format('YYYYMMDD')) - Number(moment(b.time, 'YYYY-MMM-DD').format('YYYYMMDD'))
    });

    for (let index = 0; index < newNews.length; index++) {
      const article = newNews[index];
      const articleText = await scraper.scrapArticle(article.url);
      const result = await mongo.addEntry({
        ...article,
        text: articleText
      });

      if (result) {
        await discordWebhook.sendWebhook({ ...article, text: articleText });
      }
    }

    console.log(`Gain ${newNews?.length} news...`);
  } catch (error) {
    console.log(error);
  }
}

main();
