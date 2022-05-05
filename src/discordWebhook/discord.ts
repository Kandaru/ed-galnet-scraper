import fetch from 'node-fetch';
import moment from 'moment';

interface INewsArticle {
  title: string;
  time: string;
  text: string[];
  url: string;
}

export class DiscordWebhook {
  private url?: string;

  constructor(webhookUrl: string) {
    this.url = webhookUrl;
  }

  public async sendWebhook(article: INewsArticle) {
    const response = await fetch(this.url!, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        embeds: [
          {
            title: article.title,
            description: article.text.join('\n'),
            url: article.url,
            footer: {
              text: 'Сделано мной на коленке для халявных новостей'
            },
            timestamp: moment(article.time, 'YYYY-MMM-DD').format(),
            color: 15760133
          }
        ]
      })
    });

    return response.ok;
  }
}
