const https = require('https');

const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      hostname: 'inknnuxctfwnoswawixt.supabase.co',
      path: '/rest/v1' + path,
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Fetching tours...');
  const tours = await request('GET', '/tours?select=id,title,included');
  
  if (!Array.isArray(tours)) {
    console.error('Failed to fetch tours:', tours);
    return;
  }

  console.log(`Found ${tours.length} tours.`);

  for (const tour of tours) {
    if (!tour.included || !Array.isArray(tour.included)) continue;

    const stringsToRemove = [
      'Transporte ida e volta',
      'Round trip transport',
      'Transporte ida y vuelta',
      'includedTransport'
    ];

    const newIncluded = tour.included.filter(item => !stringsToRemove.includes(item));

    if (newIncluded.length !== tour.included.length) {
      console.log(`Updating tour: ${tour.title}`);
      await request('PATCH', `/tours?id=eq.${tour.id}`, { included: newIncluded });
    }
  }
  console.log('Done.');
}

run();
