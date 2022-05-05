import Puppeteer, { Browser, LaunchOptions, Page } from "puppeteer";
import { scraper } from "../config.js";
import { sleep } from "../helpers.js";

interface INews {
  title: string;
  time: string;
  url: string;
}

export class Scraper {
  private browser?: Browser;
  private newsPage?: Page;
  public isInited: boolean = false;

  constructor(browserConfig: any) {
    this.init(browserConfig);
  }

  public async scrapTitles() {
    if (!this.isInited) {
      await sleep(5 * 1000);
    }

    await this.newsPage?.goto(scraper.titleUrl);
    await sleep(10 * 1000);

    const news = await this.newsPage?.evaluate(this.fetchNews);

    return news;
  }

  public async scrapArticle(url: string) {
    if (!this.isInited) {
      await sleep(5 * 1000);
    }

    const articlePage = await this.browser!.newPage();
    await articlePage.goto(url);
    await sleep(3 * 1000);

    const paragraphs = await articlePage.evaluate(this.fetchArticle);

    articlePage.close();

    return paragraphs;
  }

  public async startScrap(callback: Function) {
    return setInterval(callback, scraper.delay);
  }

  private fetchNews(): INews[] {
    const pageHolder = document.querySelector('.v-galnet');
    const lastNewsList = pageHolder?.querySelector('#articles-list>ul');
    const newsElems = lastNewsList?.querySelectorAll('li');
    const news: INews[] = [];

    newsElems?.forEach(elem => {
      const articleUrl = (<HTMLAnchorElement>elem.querySelector('.o-news-article>a'))?.href;
      const articleHolder = elem.querySelector('.o-news-article__info');
      const articleTitle = articleHolder?.querySelector('h1')?.innerText;
      const articleTime = articleHolder?.querySelector('time')?.dateTime;

      news.push({
        title: articleTitle!,
        time: articleTime!,
        url: articleUrl
      });
    });

    return news;
  }

  private fetchArticle(): string[] {
    const mainBody = document.querySelector('.v-galnet-details__main .v-galnet-details__main-body');
    const paragraphs = mainBody?.querySelectorAll('p');
    const dataArray: string[] = [];

    paragraphs?.forEach(paragraph => {
      dataArray.push(paragraph.innerText);
    });

    return dataArray;
  }

  private async init(browserConfig: any) {
    this.browser = await Puppeteer.launch(browserConfig);
    this.newsPage = await this.browser.newPage();
    this.isInited = true;
  }

}
