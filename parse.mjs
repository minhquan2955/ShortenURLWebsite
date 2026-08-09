import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('cleaned.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Template Structure ---');
$('section').each((i, el) => {
    const cls = $(el).attr('class') || '';
    const h2 = $(el).find('h2, h3').first().text().trim();
    console.log(`[Section ${i}] classes: ${cls}`);
    console.log(`  Heading: ${h2 || '(no heading)'}`);
});
