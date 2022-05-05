export const browser = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: {
    width: 1920,
    height: 1080
  },
  executablePath: process.env.PROD ? '/usr/bin/chromium' : undefined
};

export const scraper = {
  titleUrl: 'https://www.elitedangerous.com/ru-RU/%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8/galnet',
  delay: 60 * 60 * 1000
}

export const mongo = {
  connectionString: 'mongo connection string'
}

export const webhook = {
  url: 'discord webhook url'
}
