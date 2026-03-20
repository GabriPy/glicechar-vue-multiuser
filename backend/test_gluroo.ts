import { fetchLatestReadings } from './gluroo.js';

async function test() {
  const token = 'aaa1479c-d325-4df8-a2ca-ea9b4e453281';
  const header = '6de113ccdcfee4de7a90e60caaa6f6b94678d058';
  const link = 'https://aaa1.ns.gluroo.com/';
  
  try {
    console.log('Fetching from Gluroo...');
    const readings = await fetchLatestReadings(token, header, link);
    console.log(`Success! Fetched ${readings.length} readings.`);
  } catch (e: any) {
    console.error('Error fetching:', e.message);
    if (e.response) {
      console.error('Response status:', e.response.status);
      console.error('Response data:', e.response.data);
    }
  }
}

test();
