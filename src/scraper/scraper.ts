import { scraper } from "../config.js";
import { sleep } from "../helpers.js";
import fetch from 'node-fetch';

interface IRawArticle {
  id: string;
  attributes: {
    title: string;
    created: string; // ISO8601
    body: {
      value: string; // Без разметки
      processed: string; // С разметкой
    },
    field_galnet_date: string; // "DD MMM YYYY"
    field_galnet_image: string; // Без расширения
    field_slug: string;
  }
}

interface IApiResponse {
  data: IRawArticle[];
}

export class Scraper {

  public get ImageTemplateUrl(): string {
    return scraper.imageTemplateUrl;
  }

  public get PostTemplateUrl(): string {
    return scraper.postTemplateUrl;
  }

  public async getArticles(): Promise<IRawArticle[]> {
    const response = await fetch(scraper.articlesApiUrl);
    const data: IApiResponse = <IApiResponse>await response.json();

    return data.data;
  }

  public startScrap(callback: Function) {
    return setInterval(callback, scraper.delay);
  }
}
