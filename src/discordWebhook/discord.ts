import fetch from 'node-fetch';
import moment from 'moment';

interface INewsArticle {
  galnet_id: string;
  title: string;
  date: string;
  text: string[];
  url: string;
  image: string;
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
            image: {
              url: article.image
            },
            footer: {
              text: 'Сделано мной на коленке для халявных новостей'
            },
            timestamp: moment(article.date, 'DD MMM YYYY').format(),
            color: 15760133
          }
        ]
      })
    });

    return response.ok;
  }
}
