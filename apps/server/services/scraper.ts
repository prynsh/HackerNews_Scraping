import puppeteer, { Browser, Page } from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Article {
  title: string;
  link: string;
  score: string;
}

export const scrapeHackerNews = async (): Promise<Article[]> => {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();

    await page.goto('https://news.ycombinator.com/newest', {
      waitUntil: 'networkidle2',
    });

    const articles: Article[] = await page.evaluate(() => {
      const results: Article[] = [];
      const items = document.querySelectorAll('.titleline');

      items.forEach((item) => {
        const linkElement = item.querySelector('a');
        const title = linkElement?.textContent || 'No title';
        const link = linkElement?.getAttribute('href') || 'No link';

        const parentRow = item.closest('tr');
        const scoreElement = parentRow?.nextElementSibling?.querySelector('.score');
        const score = scoreElement?.textContent || '0 points';

        results.push({ title, link, score });
      });

      return results;
    });
try {
  await prisma.article.createMany({
    data: articles.map(article => ({
      title: article.title,
      link: article.link,
      score: article.score,
    })),
    skipDuplicates: true,
  });
} catch (error) {
  console.log('Error inserting articles:', error);
}
  return articles;
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }

    await prisma.$disconnect();
  }
};
