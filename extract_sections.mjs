import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('cleaned.html', 'utf8');
const $ = cheerio.load(html);

if (!fs.existsSync('temp_sections')) {
    fs.mkdirSync('temp_sections');
}

$('section').each((i, el) => {
    fs.writeFileSync(`temp_sections/section_${i}.html`, $(el).html(), 'utf8');
});
console.log('Saved sections to temp_sections/');
