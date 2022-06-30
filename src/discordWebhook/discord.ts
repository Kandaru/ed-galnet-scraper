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
    const body = {
      embeds: [
        {
          title: article.title,
          description: this.createDescText(article.text),
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
    }

    const response = await fetch(this.url!, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body)
    });

	if (!response.ok) {
		console.log(response.status);
		console.log(await response.text());
    console.log(JSON.stringify(body, undefined, '\t'));
	}

    return response.ok;
  }

  private createDescText(text: string[]) {
    let result = '';
    let tmp = '';

    for (let pIndex = 0; pIndex < text.length; pIndex++) {
      const paragraph = text[pIndex];

      tmp += paragraph + '\n';
      if (tmp.length > 4000) {
        result += '(продолжение в оригинальной статье...)';
        break;
      }

      result = tmp;
    }

    return result;
  }
}
