import fs from 'fs';
import * as cheerio from 'cheerio';

[1, 2, 3, 4, 6].forEach(i => {
    try {
        const html = fs.readFileSync(`temp_sections/section_${i}.html`, 'utf8');
        const $ = cheerio.load(html);
        console.log(`\n--- SECTION ${i} ---`);
        $('h2, h3, h4, h5, h6, p').each((_, el) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text.length > 0) console.log(text);
        });
    } catch (e) {
        console.log(`Failed to read section ${i}`);
    }
});
