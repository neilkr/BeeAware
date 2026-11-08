// Sample beekeeper directory + educational content

export const SAMPLE_BEEKEEPERS = [
  {
    name: "Maya Rodriguez",
    phone: "555-201-4477",
    email: "maya.bees@example.com",
    city: "Springfield, IL",
    zip: "62701",
    level: "hobby",
    specialty: "Backyard hive removal & swarm rescue",
  },
  {
    name: "James 'Buzz' Whitfield",
    phone: "555-334-8890",
    email: "buzz@whitfieldapiary.example.com",
    city: "Riverton, NJ",
    zip: "08077",
    level: "pro",
    specialty: "Commercial apiary, 200+ hives, hive relocation",
  },
  {
    name: "Dr. Priya Natarajan",
    phone: "555-776-1123",
    email: "priya@gentlehive.example.com",
    city: "Lakeside, CA",
    zip: "92040",
    level: "famous",
    specialty: "Author of 'The Gentle Hive', featured on National Honey Day TV",
  },
  {
    name: "Tom & Ellie Carter",
    phone: "555-902-6645",
    email: "carterbees@example.com",
    city: "Fairview, OR",
    zip: "97024",
    level: "hobby",
    specialty: "Weekend swarm pickup, free for schools",
  },
  {
    name: "Golden State Apiaries",
    phone: "555-418-2200",
    email: "help@goldenstateapiaries.example.com",
    city: "Bloomfield, NY",
    zip: "14469",
    level: "pro",
    specialty: "24/7 emergency hive removal, insured & licensed",
  },
];

// Approximate lat/lon for major US metro ZIP codes, used for local
// nearest-first sorting without any external API. Unknown ZIPs fall
// back to prefix (3-digit regional) distance.
export const ZIP_COORDS = {
  "10001": [40.7506, -73.9972],  // New York, NY
  "90001": [33.9731, -118.2479], // Los Angeles, CA
  "60601": [41.8864, -87.6186],  // Chicago, IL
  "77001": [29.7604, -95.3698],  // Houston, TX
  "85001": [33.4484, -112.074],  // Phoenix, AZ
  "19101": [39.9526, -75.1652],  // Philadelphia, PA
  "78201": [29.4241, -98.4936],  // San Antonio, TX
  "92101": [32.7157, -117.1611], // San Diego, CA
  "75201": [32.7767, -96.797],   // Dallas, TX
  "95101": [37.3382, -121.8863], // San Jose, CA
  "73301": [30.2672, -97.7431],  // Austin, TX
  "32201": [30.3322, -81.6557],  // Jacksonville, FL
  "43201": [39.9612, -82.9988],  // Columbus, OH
  "28201": [35.2271, -80.8431],  // Charlotte, NC
  "94102": [37.7749, -122.4194], // San Francisco, CA
  "46201": [39.7684, -86.1581],  // Indianapolis, IN
  "98101": [47.6062, -122.3321], // Seattle, WA
  "80201": [39.7392, -104.9903], // Denver, CO
  "20001": [38.9072, -77.0369],  // Washington, DC
  "02101": [42.3601, -71.0589],  // Boston, MA
  "37201": [36.1627, -86.7816],  // Nashville, TN
  "97201": [45.5152, -122.6784], // Portland, OR
  "89101": [36.1699, -115.1398], // Las Vegas, NV
  "30301": [33.749, -84.388],    // Atlanta, GA
  "55401": [44.9778, -93.265],   // Minneapolis, MN
  "48201": [42.3314, -83.0458],  // Detroit, MI
  "33101": [25.7617, -80.1918],  // Miami, FL
  "63101": [38.627, -90.1994],   // St. Louis, MO
  "64101": [39.0997, -94.5786],  // Kansas City, MO
  "44101": [41.4993, -81.6944],  // Cleveland, OH
  "15201": [40.4406, -79.9959],  // Pittsburgh, PA
  "70112": [29.9511, -90.0715],  // New Orleans, LA
  "84101": [40.7608, -111.891],  // Salt Lake City, UT
  "96813": [21.3099, -157.8581], // Honolulu, HI
  "99501": [61.2181, -149.9003], // Anchorage, AK
  // Sample beekeeper ZIPs
  "62701": [39.7817, -89.6501],  // Springfield, IL
  "08077": [40.0112, -75.0146],  // Riverton, NJ
  "92040": [32.8573, -116.9222], // Lakeside, CA
  "97024": [45.5385, -122.4339], // Fairview, OR
  "14469": [42.8998, -77.4297],  // Bloomfield, NY
};

export const LEVEL_LABELS = {
  hobby: "🌱 Hobby Beekeeper",
  pro: "🍯 Professional",
  famous: "⭐ Well-Known Expert",
};

export const HIVE_STEPS = [
  {
    emoji: "🧘",
    title: "Stay Calm & Keep Distance",
    text: "Do not approach, touch, or throw anything at the hive. Keep at least 20 feet away and keep children and pets inside.",
    slot: "hiveSpotted",
  },
  {
    emoji: "🚫",
    title: "Don't Spray or Disturb It",
    text: "Never use water, smoke, or pesticides on a hive. Disturbing it can provoke the bees and is dangerous for you and lethal for the colony.",
    slot: "stayCalm",
  },
  {
    emoji: "📞",
    title: "Call a Beekeeper Below",
    text: "Browse the directory and call a local beekeeper. Most will remove or relocate a hive safely — hobbyists often do it for free.",
    slot: "beekeeperCalled",
  },
  {
    emoji: "🐝",
    title: "If You See a Swarm",
    text: "A swirling cluster of bees is usually a swarm looking for a new home. They are typically gentle — walk away slowly and call a beekeeper.",
    slot: "swarmSafety",
  },
];

export const BEE_FACTS = [
  {
    emoji: "🐝",
    title: "What Are Bees?",
    text: "Bees are flying insects famous for making honey and pollinating plants. A single colony can hold 20,000–80,000 bees: one queen, hundreds of drones, and thousands of worker bees.",
  },
  {
    emoji: "🌻",
    title: "Why Bees Matter",
    text: "Bees pollinate about one out of every three bites of food we eat — apples, almonds, berries, cucumbers, and more. Without bees, our food supply and ecosystems would collapse.",
  },
  {
    emoji: "🛡️",
    title: "Are Bees Dangerous?",
    text: "Honeybees are gentle and only sting to defend their hive — a sting kills the bee, so they avoid it. Most 'aggressive bee' encounters are actually wasps. Give bees space and they'll leave you alone.",
  },
  {
    emoji: "🏡",
    title: "Why Hives Appear in Yards",
    text: "Scout bees search for sheltered spots — tree hollows, wall cavities, sheds. A hive in your yard means your neighborhood is a healthy habitat. A beekeeper can relocate it safely.",
  },
];

export const BEE_PLANTS = [
  { emoji: "🌸", name: "Wildflowers", text: "Coneflowers, black-eyed Susans, and clover give bees nectar all season long." },
  { emoji: "💜", name: "Lavender", text: "A bee magnet that blooms for months and smells wonderful in any garden." },
  { emoji: "🌻", name: "Sunflowers", text: "Giant landing pads packed with pollen — bees visit them all day." },
  { emoji: "🌿", name: "Herbs", text: "Let rosemary, thyme, basil, and mint flower — bees love their tiny blossoms." },
  { emoji: "🍎", name: "Fruit Trees", text: "Apple, cherry, and plum blossoms feed bees in early spring when food is scarce." },
  { emoji: "🚿", name: "Water Station", text: "A shallow dish with pebbles and water gives bees a safe place to drink." },
];
