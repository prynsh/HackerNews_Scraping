import puppeteer, { Browser, Page } from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Article {
  title: string;
  link: string;
  score: string;
  publishedAt: string;
}

const parseRelativeTime = (relativeTime: string): Date => {
  const now = new Date();

  const timeParts = relativeTime.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
  if (!timeParts) {
    return now;
  }

  const value = parseInt(timeParts[1], 10);
  const unit = timeParts[2];

  switch (unit) {
    case 'second':
      now.setSeconds(now.getSeconds() - value);
      break;
    case 'minute':
      now.setMinutes(now.getMinutes() - value);
      break;
    case 'hour':
      now.setHours(now.getHours() - value);
      break;
    case 'day':
      now.setDate(now.getDate() - value);
      break;
    case 'week':
      now.setDate(now.getDate() - value * 7);
      break;
    case 'month':
      now.setMonth(now.getMonth() - value);
      break;
    case 'year':
      now.setFullYear(now.getFullYear() - value);
      break;
  }

  return now;
};


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

        const ageElement = parentRow?.nextElementSibling?.querySelector('.age > a');
        const relativeTime = ageElement?.textContent || '0 minutes ago';

        results.push({ title, link, score, publishedAt:relativeTime });
      });

      return results;
    });

    const finalArticles = articles.map((article) => ({
      ...article,
      publishedAt: parseRelativeTime(article.publishedAt).toISOString(), 
    }));
      try {
        await prisma.article.createMany({
          data: finalArticles.map((article) => ({
            title: article.title,
            link: article.link,
            score: article.score,
            publishedAt: article.publishedAt,
          })),
          skipDuplicates: true,
        });
      } catch (error) {
        console.log('Error inserting articles:', error);
      }
        return finalArticles;
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