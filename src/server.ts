import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/search', async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const jobs: { title: string; link: string }[] = [];

    $('a').each((i, elem) => {
      const title = $(elem).text().toLowerCase();
      console.log("Title: " + title);
      if (title.includes('engineering manager') || title.includes('Engineering Manager') || title.includes('software manager')) {
        console.log("Found!");
        jobs.push({
          title: $(elem).text(),
          link: new URL($(elem).attr('href') || '', url).href,
        });
      }
    });

    if(jobs.length === 0) {
        jobs.push({
            title: 'No jobs found',
            link: '',
        })
    }

    res.json(jobs);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'An error occurred while searching for jobs' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});