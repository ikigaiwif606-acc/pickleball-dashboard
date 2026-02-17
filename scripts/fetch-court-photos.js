const fs = require("fs");
const path = require("path");
const https = require("https");

const COURTS_JSON = path.join(__dirname, "..", "data", "courts.json");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "courts");
const ENV_FILE = path.join(__dirname, "..", ".env.local");

function loadApiKey() {
  if (!fs.existsSync(ENV_FILE)) {
    console.error("Error: .env.local not found. Create it with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>");
    process.exit(1);
  }
  const env = fs.readFileSync(ENV_FILE, "utf-8");
  const match = env.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)/);
  if (!match) {
    console.error("Error: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found in .env.local");
    process.exit(1);
  }
  return match[1].trim();
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function findPlace(apiKey, name) {
  const input = encodeURIComponent(name + " Penang");
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=place_id,photos&key=${apiKey}`;
  const res = await httpsGet(url);
  const data = JSON.parse(res.body.toString());

  if (data.status === "REQUEST_DENIED") {
    console.error(`\nAPI Error: ${data.error_message}`);
    console.error("Make sure the Places API is enabled in your Google Cloud project.");
    process.exit(1);
  }

  if (data.status !== "OK" || !data.candidates || data.candidates.length === 0) {
    return null;
  }

  const candidate = data.candidates[0];
  return {
    placeId: candidate.place_id,
    photoReference: candidate.photos && candidate.photos.length > 0 ? candidate.photos[0].photo_reference : null,
  };
}

async function downloadPhoto(apiKey, photoReference, outputPath) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`;
  const res = await httpsGet(url);

  if (res.statusCode !== 200) {
    throw new Error(`Photo download failed with status ${res.statusCode}`);
  }

  fs.writeFileSync(outputPath, res.body);
}

async function main() {
  const apiKey = loadApiKey();
  const courts = JSON.parse(fs.readFileSync(COURTS_JSON, "utf-8"));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log("Created /public/courts/ directory");
  }

  let updated = 0;
  let failed = 0;

  for (const court of courts) {
    process.stdout.write(`[${court.id}/${courts.length}] ${court.name} ... `);

    try {
      const result = await findPlace(apiKey, court.name);

      if (!result) {
        console.log("SKIP (not found on Google Places)");
        failed++;
        continue;
      }

      court.placeId = result.placeId;

      if (!result.photoReference) {
        console.log("SKIP (no photos available)");
        failed++;
        continue;
      }

      const outputPath = path.join(OUTPUT_DIR, `${court.id}.jpg`);
      await downloadPhoto(apiKey, result.photoReference, outputPath);

      court.image = `/courts/${court.id}.jpg`;
      updated++;
      console.log("OK");
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failed++;
    }
  }

  fs.writeFileSync(COURTS_JSON, JSON.stringify(courts, null, 2) + "\n");
  console.log(`\nDone! ${updated} photos downloaded, ${failed} failed.`);
  console.log("courts.json updated with local image paths and placeIds.");
}

main();
