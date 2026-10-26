/**
 * All site content as typed data. Pages and components read from here; nothing is hard-coded
 * in markup. Plain data only (no React), so it is safe to import from server and client code.
 *
 * Photography: Unsplash placeholders (see lib/images.ts). Replace with real project photography
 * before launch.
 */
import { type Img, photo, portrait, square } from "./images";
import { featuredIndustries } from "./industries";

export type { Img };

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type Stat = { value: string; label: string };

export type IndustrySlug = "energy" | "aerospace" | "data-centers" | "manufacturing" | "medical" | "semiconductor" | "renewables";
export type IconName =
  | "Zap"
  | "Plane"
  | "Server"
  | "Factory"
  | "HeartPulse"
  | "Cpu"
  | "Wind"
  | "ShieldCheck"
  | "Gauge"
  | "Weight"
  | "Handshake"
  | "HardHat"
  | "BadgeCheck"
  | "ClipboardCheck"
  | "GraduationCap"
  | "Siren"
  | "Users"
  | "Award"
  | "Wallet"
  | "Stethoscope"
  | "TrendingUp"
  | "Clock";

export type Industry = { slug: IndustrySlug; name: string; icon: IconName; image: Img };

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** One line, used on cards and in the mega menu. */
  short: string;
  /** Overview paragraphs on the service page. */
  intro: string[];
  image: Img;
  capabilities: { title: string; text: string }[];
  stats: Stat[];
  gallery: Img[];
  industries: IndustrySlug[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: IndustrySlug;
  services: string[];
  location: string;
  /** Nearest Jnros location, used to relate projects and branches. */
  locationSlug: string;
  /** Headline weight, e.g. "300,000 LBS". */
  weight: string;
  year: number;
  duration: string;
  image: Img;
  gallery: Img[];
  summary: string;
  challenge: string;
  solution: string[];
  results: string[];
  stats: Stat[];
  featured?: boolean;
};

export type Location = {
  slug: string;
  city: string;
  region: string;
  regionCode: string;
  country: "USA" | "Canada" | "Mexico";
  lat: number;
  lng: number;
  /** Regional hubs get bigger pins and appear in the home page list and mega menu. */
  hub: boolean;
  hq?: boolean;
  street: string;
  locality: string;
  postalCode: string;
  phone: string;
  yard: string;
  description: string;
  services: string[];
  image: Img;
};

export type NewsBlock = { type: "p" | "h2"; text: string } | { type: "ul"; items: string[] };
export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: Img;
  body: NewsBlock[];
};

export type Job = { title: string; location: string; type: string; department: string; summary: string };

export type MegaLink = {
  label: string;
  href: string;
  description: string;
  image: Img;
  /** Case-study slug shown as a teaser when this link is hovered. */
  teaser?: string;
};
export type NavItem = {
  label: string;
  href: string;
  mega?: { eyebrow: string; headline: string; description: string; image: Img; cta: { label: string; href: string }; links: MegaLink[] };
};

/* ------------------------------------------------------------------------ */
/* Site                                                                      */
/* ------------------------------------------------------------------------ */

export const site = {
  name: "Jnros Logistics",
  shortName: "JNROS",
  legalName: "Jnros Logistics",
  tagline: "We move what others can't.",
  description:
    "Machinery moving, heavy lift and rigging, crane services and specialized transportation across North America. 40+ years, 18 locations and 1,200+ fleet units.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jnroslogistics.example",
  phone: "1-800-555-0187",
  email: "projects@jnroslogistics.example",
  careersEmail: "careers@jnroslogistics.example",
  storeUrl: "https://store.jnroslogistics.example",
  founded: 1984,
  hours: "Mon–Fri 6:00–18:00 CT · 24/7 emergency dispatch",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/jnros-logistics", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/jnroslogistics", icon: "instagram" },
    { label: "YouTube", href: "https://www.youtube.com/@jnroslogistics", icon: "youtube" },
    { label: "Facebook", href: "https://www.facebook.com/jnroslogistics", icon: "facebook" },
    { label: "X", href: "https://x.com/jnroslogistics", icon: "x" },
  ],
} as const;

export type SocialIcon = (typeof site.socials)[number]["icon"];

/* ------------------------------------------------------------------------ */
/* Home: hero, stats, expertise                                              */
/* ------------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Heavy lift · Rigging · Cranes · Transport",
  lines: ["We move", "what others", "can't."],
  subline: "Strength. Precision. Trust.",
  slides: [
    { image: photo("1755795603374-c466d64e796d", "Lattice-boom crawler crane rigged for a night lift", 2400, 1600), caption: "Night lift · 1,350-ton crawler" },
    { image: photo("1783428673297-17e7fc9f85fb", "Ultra-class mining truck loaded on a multi-axle heavy-haul trailer", 2400, 1600), caption: "Superload haul · 410,000 lbs" },
    { image: photo("1767112601676-1532f4307560", "Floodlit gantry cranes reflected in harbour water at night", 2400, 1600), caption: "Port rigging · Newark, NJ" },
    { image: photo("1783247007596-cca4a61a16f5", "Spherical pressure vessel transported on a highway trailer", 2400, 1600), caption: "Pressure vessel transport" },
  ],
};

export const stats = [
  { value: 40, suffix: "+", label: "Years", detail: "Moving heavy since 1984" },
  { value: 18, label: "Locations", detail: "Across North America" },
  { value: 1200, suffix: "+", label: "Fleet Units", detail: "Cranes, trailers & SPMTs" },
  { value: 0, from: 100, label: "Compromise on Safety", detail: "EMR 0.58 · 2.1M hrs LTI-free" },
] as const;

export const pillars: { title: string; icon: IconName; text: string }[] = [
  { title: "Safety", icon: "ShieldCheck", text: "Every lift engineered, every crew certified. Stop-work authority belongs to everyone on site." },
  { title: "Efficiency", icon: "Gauge", text: "One team plans, rigs, hauls and sets, so there are no handoffs to lose time in." },
  { title: "Strength", icon: "Weight", text: "1,200+ fleet units, cranes to 1,350 tons and the engineering bench to use them." },
  { title: "Trust", icon: "Handshake", text: "Four decades of repeat clients, because we say what it will take and then do it." },
];

export const expertise = {
  label: "Expertise & Innovation",
  heading: "Engineering first. Muscle second.",
  statement:
    "For four decades Jnros has turned impossible moves into engineered plans. Our engineers model every lift in 3D, our crews rehearse every sequence, and our fleet is maintained to a standard most companies reserve for a showroom. That is how a 300,000-pound reactor lands within an eighth of an inch, on schedule and without incident.",
  image: portrait("1591980720366-67945a7d3ecd", "Red crawler crane boom rising into a dark sky"),
  badge: { value: "12,000+", label: "Engineered lift plans" },
};

/* ------------------------------------------------------------------------ */
/* Industries                                                                */
/* ------------------------------------------------------------------------ */

export const industries: Industry[] = [
  { slug: "energy", name: "Energy", icon: "Zap", image: photo("1509390288171-ce2088f7d08e", "Power plant lit up at night under a full moon") },
  { slug: "aerospace", name: "Aerospace", icon: "Plane", image: photo("1542296332-2e4473faf563", "Wide-body aircraft on an airport apron at sunrise") },
  { slug: "data-centers", name: "Data Centers", icon: "Server", image: photo("1558494949-ef010cbdcc31", "Rows of server racks with dense cabling") },
  { slug: "manufacturing", name: "Manufacturing", icon: "Factory", image: photo("1567789884554-0b844b597180", "Robotic arms on an automotive assembly line") },
  { slug: "medical", name: "Medical", icon: "HeartPulse", image: photo("1666214280352-db292c05fd80", "Radiation therapy machine in a hospital treatment room") },
  { slug: "semiconductor", name: "Semiconductor", icon: "Cpu", image: photo("1518770660439-4636190af475", "Close-up of a circuit board and processor") },
  { slug: "renewables", name: "Renewables", icon: "Wind", image: photo("1548337138-e87d889cc369", "Offshore wind turbines standing in calm sea") },
];

export const getIndustry = (slug: IndustrySlug) => industries.find((i) => i.slug === slug)!;

/* ------------------------------------------------------------------------ */
/* Services                                                                  */
/* ------------------------------------------------------------------------ */

export const services: Service[] = [
  {
    slug: "machinery-moving",
    number: "01",
    title: "Machinery Moving",
    short: "Single machines to full plant relocations: disconnected, moved, set and leveled to spec.",
    intro: [
      "From a single CNC to a 2.4-million-pound press line, Jnros crews plan every move around your production schedule. We survey the route, engineer the rigging, protect your floor and hand the machine back set, leveled and ready for your millwrights, or ours.",
      "Every relocation runs under one project manager with one schedule, one safety plan and one point of accountability, whether the move spans forty feet or four thousand miles.",
    ],
    image: photo("1717386255773-1e3037c81788", "Automated production line inside a bright industrial hall"),
    capabilities: [
      { title: "Plant relocations", text: "Full-facility moves sequenced around production, with tagging, crating and as-built documentation." },
      { title: "Production line transfers", text: "Disconnect, move and recommission entire lines with minimal downtime." },
      { title: "Gantry & skate systems", text: "Hydraulic gantries, air bearings and skates for low-headroom lifting where cranes can't reach." },
      { title: "Precision setting", text: "Machines set to anchor bolts and leveled to manufacturer tolerance, then verified by our metrology team." },
      { title: "Tight-access rigging", text: "Wall openings, roof hatches, mezzanines and basements, with temporary structures engineered in-house." },
      { title: "Decommissioning", text: "Safe teardown, salvage and disposal of retired equipment, with full environmental documentation." },
    ],
    stats: [
      { value: "2.4M LBS", label: "Largest line relocated" },
      { value: "48 HRS", label: "Typical weekend line swap" },
      { value: "±0.002 IN", label: "Setting tolerance" },
    ],
    gallery: [
      portrait("1781330173666-11f8818d6eb2", "Row of industrial machinery in a modern facility"),
      photo("1496247749665-49cf5b1022e9", "Interior of a large, dimly lit industrial factory", 1600, 1067),
      square("1647427060118-4911c9821b82", "Orange robotic arms in a factory"),
      photo("1787039467622-ddec5c24320c", "CNC machines in a bright manufacturing workshop", 1600, 1067),
      portrait("1513828742140-ccaa28f3eda0", "Grey industrial process equipment"),
      photo("1567789884554-0b844b597180", "Automotive assembly line with robotic arms", 1600, 1067),
    ],
    industries: ["manufacturing", "aerospace", "medical", "semiconductor"],
  },
  {
    slug: "millwright-industrial",
    number: "02",
    title: "Millwright & Industrial",
    short: "Certified millwrights for installation, alignment, maintenance and outage support.",
    intro: [
      "Our millwrights install, align and maintain the equipment that keeps plants running: conveyors, turbines, pumps, compressors and complete process lines. We staff planned outages and respond around the clock when something breaks.",
      "Laser alignment, vibration analysis and precision grouting are all in-house, so the crew that sets your equipment is the crew that proves it is right.",
    ],
    image: photo("1455165814004-1126a7199f9b", "Welder in a protective helmet working on steel with bright sparks"),
    capabilities: [
      { title: "Equipment installation", text: "Setting, anchoring, grouting and piping of new equipment to OEM specification." },
      { title: "Laser shaft alignment", text: "Coupled-shaft and geometric alignment with documented before-and-after readings." },
      { title: "Conveyor systems", text: "Installation, extension and rebuild of belt, roller and overhead conveyors." },
      { title: "Turbine & compressor service", text: "Teardown, inspection and reassembly of rotating equipment during outages." },
      { title: "Outages & turnarounds", text: "Scalable crews, planned to the hour, with safety and quality leads on every shift." },
      { title: "24/7 emergency response", text: "A dispatcher who answers and a crew on the road, day or night." },
    ],
    stats: [
      { value: "640+", label: "Certified millwrights" },
      { value: "24/7", label: "Emergency dispatch" },
      { value: "1.1M", label: "Outage hours a year" },
    ],
    gallery: [
      portrait("1504328345606-18bbc8c9d7d1", "Welder working under blue arc light"),
      photo("1765218933298-dc55fdfb517a", "Polished industrial pipework and machinery", 1600, 1067),
      square("1513828583688-c52646db42da", "Industrial fan housing and stainless pipework"),
      photo("1666634157070-6fd830fb5672", "Metal rod held in a lathe chuck being machined", 1600, 1067),
      portrait("1786294111959-1cdd640d3c0d", "Large circular industrial machine with metal coils"),
      photo("1630683924997-fe27050a0416", "Worker in a safety vest cutting steel on site", 1600, 1067),
    ],
    industries: ["energy", "manufacturing", "renewables"],
  },
  {
    slug: "storage-warehousing",
    number: "03",
    title: "Storage & Warehousing",
    short: "1.8M sq ft of secured, heavy-floor storage beside major freight corridors.",
    intro: [
      "When equipment arrives before the building is ready, or has to wait out a shutdown, it stays with us. Jnros operates 1.8 million square feet of secured, heavy-capacity warehouse space with overhead cranes, climate-controlled bays and rail access.",
      "Inventory is tracked to the crate, photographed on receipt and released on your schedule, with our own trucks and crews ready for the final mile.",
    ],
    image: photo("1553413077-190dd305871c", "Long warehouse aisle lined with tall pallet racking"),
    capabilities: [
      { title: "Heavy-floor storage", text: "Slab ratings up to 1,500 psf for presses, transformers and machine tools." },
      { title: "Overhead crane bays", text: "Bridge cranes to 50 tons for loading, inspection and kitting." },
      { title: "Climate control", text: "Temperature- and humidity-controlled bays for electronics and precision tools." },
      { title: "Crating & export packing", text: "ISPM-15 crating, VCI wrapping and desiccant packing on site." },
      { title: "Rail-served cross-dock", text: "Direct rail spurs for transload between rail, flatbed and heavy haul." },
      { title: "Inventory portal", text: "Real-time stock, photos and release requests, online." },
    ],
    stats: [
      { value: "1.8M", label: "Sq ft under roof" },
      { value: "50 T", label: "Overhead crane capacity" },
      { value: "24/7", label: "Monitored security" },
    ],
    gallery: [
      photo("1565891741441-64926e441838", "Aerial view of a distribution centre and truck yard", 1600, 1067),
      portrait("1740914994657-f1cdffdc418e", "Yellow reach truck in a high-bay warehouse aisle"),
      square("1689942010216-dc412bb1e7a9", "Forklift between pallet racks loaded with timber"),
      portrait("1714627798569-b3e36d409c4b", "Forklift parked in a dark warehouse"),
      photo("1779517225996-d5b751f80f48", "Forklift loading wrapped pallets into a trailer", 1600, 1067),
      photo("1586528116311-ad8dd3c8310d", "Large warehouse with yellow crates and racking", 1600, 1067),
    ],
    industries: ["data-centers", "medical", "semiconductor", "manufacturing"],
  },
  {
    slug: "heavy-lift-rigging",
    number: "04",
    title: "Heavy Lift & Rigging",
    short: "Engineered lifts to 1,000+ tons with gantries, jacking systems and strand jacks.",
    intro: [
      "Heavy lift is engineering first. Our in-house engineers model every pick: ground bearing, rigging, crane configuration and wind limits, before a single shackle is set. Then our crews execute with gantries, jack-and-slide systems, strand jacks and the largest cranes in the fleet.",
      "Reactors, transformers, bridge girders, press crowns: if it is too heavy, too tall or too awkward for anyone else, it is the work we are built for.",
    ],
    image: photo("1658490261406-5a82631e56f4", "Yellow mobile crane boom extended against a clear blue sky"),
    capabilities: [
      { title: "Lift planning & 3D modeling", text: "Every critical lift engineered, modeled and stamped before mobilization." },
      { title: "Hydraulic gantry systems", text: "Telescopic gantries to 1,000 tons for indoor and low-headroom lifts." },
      { title: "Jack & slide", text: "Controlled jacking and skidding for transformers, vessels and modules." },
      { title: "Strand jacking", text: "Computer-controlled lifting and lowering where no crane can reach." },
      { title: "Tandem & multi-crane picks", text: "Synchronized lifts, upending and tailing of long vessels." },
      { title: "Below-the-hook engineering", text: "Custom spreader bars, lifting beams and trunnion design." },
    ],
    stats: [
      { value: "1,000+ T", label: "Engineered lift capacity" },
      { value: "12,000+", label: "Lift plans engineered" },
      { value: "0", label: "Dropped loads" },
    ],
    gallery: [
      portrait("1660884121477-2be490bc2a08", "Crane hook and block hanging against the sky"),
      photo("1625451102313-c4610feca0b7", "Lattice crane boom under a cloudy sky", 1600, 1067),
      square("1591980720366-67945a7d3ecd", "Red crane boom photographed from below at dusk"),
      photo("1785257532053-34686f5c3e10", "Blue structural steel frame under construction", 1600, 1067),
      portrait("1609627016501-b862497c7294", "Steel lattice structure against a dark sky"),
      photo("1592395700302-d433884e8d45", "Crane boom against a bright, cloudy sky", 1600, 1067),
    ],
    industries: ["energy", "renewables", "manufacturing", "medical"],
  },
  {
    slug: "industrial-metrology",
    number: "05",
    title: "Industrial Metrology",
    short: "Laser tracking, 3D scanning and precision alignment to ±0.001 in.",
    intro: [
      "Kestrel Metrology, our precision division, measures what has to be perfect: machine foundations, tooling, turbine casings and production lines. Laser trackers, 3D scanners and certified technicians capture the as-built condition and verify every setting against design.",
      "Measure before the move, verify after it, and you will know your equipment sits exactly where the drawing says it should.",
    ],
    image: photo("1769147339214-076740872485", "Machined steel parts resting on engineering blueprints"),
    capabilities: [
      { title: "Laser tracker alignment", text: "Large-volume alignment of machines, rolls and tooling to thousandths of an inch." },
      { title: "3D laser scanning", text: "Point clouds of plants and equipment for planning, clash checks and as-builts." },
      { title: "Reverse engineering", text: "Accurate CAD models from legacy parts with no drawings." },
      { title: "Tooling & jig certification", text: "Aerospace and automotive tool certification to customer standards." },
      { title: "Foundation surveys", text: "Anchor bolt and embed surveys before equipment arrives, not after." },
      { title: "As-built documentation", text: "Reports, models and deviation maps your engineers can use." },
    ],
    stats: [
      { value: "±0.001 IN", label: "Measurement accuracy" },
      { value: "ISO 17025", label: "Accredited lab" },
      { value: "38", label: "Certified technicians" },
    ],
    gallery: [
      photo("1764114235891-66ff86abaf87", "Industrial laser cutter working on a metal sheet", 1600, 1067),
      portrait("1764114235916-74de69e6851f", "Laser cutting machine head in a factory"),
      square("1581091226825-a6a2a5aee158", "Engineer working at a laptop beside factory equipment"),
      photo("1581092160562-40aa08e78837", "Engineer drafting technical drawings with tools", 1600, 1067),
      portrait("1716191299980-a6e8827ba10b", "Blue industrial robot arm in a factory"),
      photo("1503387762-592deb58ef4e", "Engineer reviewing plans at a desk", 1600, 1067),
    ],
    industries: ["aerospace", "semiconductor", "manufacturing", "medical"],
  },
  {
    slug: "crane-services",
    number: "06",
    title: "Crane Services",
    short: "All-terrain, crawler and tower cranes from 30 to 1,350 tons, operated and engineered.",
    intro: [
      "Jnros runs one of North America's deepest crane fleets: carry decks and rough-terrains for plant work, all-terrains for fast mobilization and crawler cranes up to 1,350 tons for the heaviest picks. Every crane comes with NCCCO-certified operators, riggers and signal persons.",
      "Need a crane for a day, or a crawler for a two-year build? Bare rental, operated and maintained, or a fully engineered lift: we size it to the job.",
    ],
    image: photo("1781356857510-0be2172fecc1", "Yellow all-terrain mobile crane parked in an industrial yard"),
    capabilities: [
      { title: "Operated & maintained rental", text: "Cranes with certified operators, oilers and maintenance included." },
      { title: "All-terrain cranes", text: "40 to 750 tons, roadable and ready to work on arrival." },
      { title: "Crawler cranes", text: "Lattice-boom crawlers to 1,350 tons for refinery, power and wind work." },
      { title: "Tower cranes", text: "Erection, operation and dismantling for long-duration builds." },
      { title: "Industrial cranes", text: "Carry-deck and pick-and-carry cranes for tight plant aisles." },
      { title: "Critical lift engineering", text: "Lift plans, ground-bearing analysis and crane mat design." },
    ],
    stats: [
      { value: "1,350 T", label: "Largest crawler crane" },
      { value: "320+", label: "Cranes in fleet" },
      { value: "100%", label: "NCCCO-certified operators" },
    ],
    gallery: [
      portrait("1755795603374-c466d64e796d", "Lattice-boom crawler crane against a dark sky"),
      photo("1771679910145-3a368d7f537c", "Blue truck-mounted crane working beside office towers", 1600, 1067),
      portrait("1733929042952-a908eb3305c4", "Yellow crane with a red warning light at night"),
      square("1730582403040-0014634a7b11", "Crane mast and hook with the moon behind"),
      photo("1565862452829-e33c0b781ea3", "Tower cranes silhouetted at sunset", 1600, 1067),
      photo("1553048686-e3d0396506b9", "Tower crane jib against a blue sky", 1600, 1067),
    ],
    industries: ["energy", "renewables", "data-centers", "manufacturing"],
  },
  {
    slug: "specialized-transportation",
    number: "07",
    title: "Specialized Transportation",
    short: "Permitted superloads on multi-axle trailers, SPMTs and Schnabel cars, coast to coast.",
    intro: [
      "Oversize is ordinary for us. Jnros' transportation group routes, permits and hauls superloads across every state and province, on perimeter frames, beam trailers, multi-axle hydraulic platforms, self-propelled modular transporters and Schnabel rail cars.",
      "Route surveys, utility lifts, police escorts and bridge engineering are handled in-house, so your load moves on a plan, not a promise.",
    ],
    image: photo("1783247007596-cca4a61a16f5", "Spherical pressure vessel hauled on a highway trailer"),
    capabilities: [
      { title: "Route surveys & permits", text: "3D route surveys and permits in every US state and Canadian province." },
      { title: "Multi-axle hydraulic trailers", text: "Platform and perimeter trailers to 20+ axle lines." },
      { title: "SPMT moves", text: "Self-propelled modular transporters for site moves and load-outs." },
      { title: "Schnabel & rail", text: "Rail moves for loads too heavy for any highway bridge." },
      { title: "Escorts & utilities", text: "Pilot cars, police escorts, line lifts and traffic control, coordinated." },
      { title: "Bridge engineering", text: "Structural checks and temporary bridging on critical routes." },
    ],
    stats: [
      { value: "900,000 LBS", label: "Heaviest highway haul" },
      { value: "64", label: "States & provinces permitted" },
      { value: "260+", label: "Specialized trailers" },
    ],
    gallery: [
      photo("1783428673297-17e7fc9f85fb", "Mining truck on a multi-axle trailer", 1600, 1067),
      portrait("1792202141286-8cd5f43a9c8b", "Flatbed carrying stacked truck cabs on a highway"),
      photo("1592805144716-feeccccef5ac", "Semi truck driving at dusk under an orange sky", 1600, 1067),
      square("1766785368863-f2188a8c8b32", "Two semi trucks driving on a highway"),
      photo("1768207750854-fb0cbd9c19f0", "Truck crossing a desert under power lines at dusk", 1600, 1067),
      portrait("1519003722824-194d4455a60c", "Truck climbing a mountain highway"),
    ],
    industries: ["energy", "aerospace", "renewables", "manufacturing"],
  },
  {
    slug: "logistics",
    number: "08",
    title: "Logistics",
    short: "Project logistics, forwarding and export packing under one point of contact.",
    intro: [
      "Big projects fail at the handoffs. Jnros Logistics manages the whole chain (ocean, rail, barge and road; customs and export packing; port handling and final positioning) so your cargo has one owner from factory to foundation.",
      "Our project logistics team builds a single schedule across every mode and keeps it current, with live tracking and a dedicated coordinator who answers the phone.",
    ],
    image: photo("1494412574643-ff11b0a5c1c3", "Aerial view of a container terminal with gantry cranes"),
    capabilities: [
      { title: "Project cargo", text: "End-to-end management of breakbulk and out-of-gauge cargo." },
      { title: "Ocean, rail & barge", text: "Multimodal routing chosen for cost, risk and schedule." },
      { title: "Customs brokerage", text: "Licensed brokers for US, Canada and Mexico entries." },
      { title: "Export crating", text: "Engineered crates, skids and seaworthy packing." },
      { title: "Port & terminal handling", text: "Stevedoring, lay-down and load-out at major ports." },
      { title: "Live tracking", text: "Milestones, documents and GPS position in one portal." },
    ],
    stats: [
      { value: "40+", label: "Countries shipped to" },
      { value: "1", label: "Point of contact" },
      { value: "98.7%", label: "On-time delivery" },
    ],
    gallery: [
      photo("1578575437130-527eed3abbec", "Container ship under ship-to-shore gantry cranes", 1600, 1067),
      portrait("1494412651409-8963ce7935a7", "Aerial view of stacked shipping containers"),
      square("1590496793929-36417d3117de", "Container stacks seen from directly above"),
      portrait("1532635026-d12867005472", "Forklift working inside a shipping container"),
      photo("1601584115197-04ecc0da31d7", "Tractor-trailer on an open road", 1600, 1067),
      photo("1720811559337-c59b75acc4de", "Blue semi truck on a rural road", 1600, 1067),
    ],
    industries: ["data-centers", "renewables", "energy", "semiconductor"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const processSteps = [
  { title: "Survey", text: "We walk the site and the route, measure everything and photograph what we'll touch." },
  { title: "Engineer", text: "Lift plans, rigging, ground bearing and transport are modeled and stamped in-house." },
  { title: "Plan", text: "One schedule, one safety plan and one project manager accountable for both." },
  { title: "Execute", text: "Certified crews, maintained equipment and a supervisor who doesn't leave site." },
  { title: "Verify", text: "Metrology confirms the result. You get the documentation, not just our word." },
];

/* ------------------------------------------------------------------------ */
/* Case studies                                                              */
/* ------------------------------------------------------------------------ */

export const caseStudies: CaseStudy[] = [
  {
    slug: "coker-drum-replacement",
    title: "Coker Drum Replacement",
    client: "Gulf Coast refiner",
    industry: "energy",
    services: ["heavy-lift-rigging", "crane-services", "specialized-transportation"],
    location: "Baton Rouge, LA",
    locationSlug: "baton-rouge",
    weight: "300,000 LBS",
    year: 2026,
    duration: "11-day outage",
    image: photo("1670689334015-299d6559b3c3", "Refinery columns and flare stacks at dusk", 2000, 1333),
    gallery: [
      photo("1670689334799-cdc6777db8cc", "Process unit lit up blue at night", 1600, 1067),
      portrait("1755795603374-c466d64e796d", "Crawler crane boom against the night sky"),
      photo("1788041254705-5eba3f62d482", "Industrial chimney above a lit plant at night", 1600, 1067),
    ],
    summary: "Two 300,000 lb coke drums swapped inside an 11-day turnaround, with the unit back on line a day early.",
    challenge:
      "The coker was boxed in by pipe racks on three sides, and the replacement drums, each 98 feet long, had to be delivered, upended and set during an 11-day outage. Every hour over schedule cost the refiner more than the entire lift.",
    solution: [
      "We barged the drums up the Mississippi, offloaded them with SPMTs and staged them within 300 feet of the structure weeks before the outage began.",
      "A 1,350-ton crawler crane with a tailing crane upended each drum, and our engineers sequenced removal and setting so old and new drums never shared a crane radius.",
    ],
    results: ["Both drums set in 52 working hours", "Unit returned to service one day ahead of schedule", "Zero recordable incidents across 38,000 work hours"],
    stats: [
      { value: "300,000 LBS", label: "Per drum" },
      { value: "98 FT", label: "Drum length" },
      { value: "1,350 T", label: "Crawler crane" },
    ],
    featured: true,
  },
  {
    slug: "automotive-press-line-relocation",
    title: "Press Line Relocation",
    client: "Tier-one automotive supplier",
    industry: "manufacturing",
    services: ["machinery-moving", "millwright-industrial", "industrial-metrology", "specialized-transportation"],
    location: "Detroit, MI",
    locationSlug: "detroit",
    weight: "2,400,000 LBS",
    year: 2025,
    duration: "9 weeks",
    image: photo("1567789884554-0b844b597180", "Robotic arms working on car bodies in an assembly plant"),
    gallery: [
      square("1647427060118-4911c9821b82", "Orange industrial robots on a production line"),
      photo("1781330173666-11f8818d6eb2", "Row of industrial machinery in a modern plant", 1600, 1067),
      photo("1717386255773-1e3037c81788", "Automated line inside a bright industrial hall", 1600, 1067),
    ],
    summary: "A six-press tandem line disassembled, moved 210 miles and recommissioned in nine weeks.",
    challenge:
      "A tier-one supplier consolidating two plants needed its six-press tandem line (2.4 million pounds of presses, transfer automation and controls) moved from Ohio to Michigan without missing a model-year launch.",
    solution: [
      "Kestrel Metrology scanned the original foundations and the line's as-built geometry before disassembly, giving the new pits a verified target.",
      "Crowns, slides and beds moved on 13-axle trailers under oversize permits while our millwrights rebuilt the line in sequence, press by press.",
    ],
    results: ["Line producing parts in 9 weeks against a 12-week plan", "All six presses within 0.004 in of original alignment", "54 oversize loads, zero damage claims"],
    stats: [
      { value: "2.4M LBS", label: "Total line weight" },
      { value: "54", label: "Oversize loads" },
      { value: "9 WKS", label: "Downtime" },
    ],
    featured: true,
  },
  {
    slug: "offshore-wind-nacelle-marshalling",
    title: "Nacelle Marshalling Program",
    client: "Offshore wind developer",
    industry: "renewables",
    services: ["heavy-lift-rigging", "logistics", "crane-services"],
    location: "Newark, NJ",
    locationSlug: "newark",
    weight: "1,100,000 LBS",
    year: 2026,
    duration: "14 months",
    image: photo("1548337138-e87d889cc369", "Offshore wind turbines rising from a calm sea"),
    gallery: [
      photo("1466611653911-95081537e5b7", "Wind turbines on a plain at sunset", 1600, 1067),
      photo("1578575437130-527eed3abbec", "Ship-to-shore gantry cranes over a vessel", 1600, 1067),
      portrait("1767112601676-1532f4307560", "Floodlit gantry cranes at night"),
    ],
    summary: "Port marshalling for 98 offshore turbine nacelles, each rolled from vessel to quayside by SPMT.",
    challenge:
      "Each 15 MW nacelle weighed more than 1.1 million pounds and arrived by ocean vessel on a tight installation cadence. The port had never handled cargo this heavy, and the installation vessel couldn't wait.",
    solution: [
      "We engineered the quay bearing, designed custom grillages and ran 48 axle lines of SPMT to roll each nacelle from vessel to storage and back to the installation vessel.",
      "A dedicated logistics cell synchronized arrivals, storage and load-out with the installer's weather windows.",
    ],
    results: ["98 nacelles handled with no lost installation days", "Quay bearing held within 92% of engineered limits", "Program delivered in 14 months"],
    stats: [
      { value: "1.1M LBS", label: "Per nacelle" },
      { value: "98", label: "Nacelles marshalled" },
      { value: "48", label: "SPMT axle lines" },
    ],
    featured: true,
  },
  {
    slug: "substation-transformer-delivery",
    title: "Substation Transformer Delivery",
    client: "Regional power utility",
    industry: "energy",
    services: ["specialized-transportation", "heavy-lift-rigging"],
    location: "Calgary, AB",
    locationSlug: "calgary",
    weight: "520,000 LBS",
    year: 2025,
    duration: "6 weeks",
    image: photo("1473341304170-971dccb5ac1e", "High-voltage transmission towers at sunset"),
    gallery: [
      photo("1768207750854-fb0cbd9c19f0", "Truck crossing open country under power lines at dusk", 1600, 1067),
      portrait("1786294111959-1cdd640d3c0d", "Large circular electrical machine with copper coils"),
      photo("1720811559337-c59b75acc4de", "Heavy truck on a rural road", 1600, 1067),
    ],
    summary: "A 520,000 lb power transformer delivered by rail and road, then jacked and slid onto its pad.",
    challenge:
      "The utility's new 500 kV transformer was too heavy for every bridge on the direct route, and the substation had no room for a crane large enough to set it.",
    solution: [
      "We moved it by Schnabel car to the nearest siding, then on a 20-axle hydraulic platform trailer along a 38-mile route we surveyed and engineered bridge by bridge.",
      "On site, our crew jacked the unit off the trailer and slid it 60 feet onto the pad on a jack-and-slide system. No crane required.",
    ],
    results: ["Delivered 4 days ahead of the energization date", "Zero utility outages along the route", "Transformer set within 1/8 in of design"],
    stats: [
      { value: "520,000 LBS", label: "Transformer weight" },
      { value: "38 MI", label: "Engineered route" },
      { value: "20", label: "Axle lines" },
    ],
    featured: true,
  },
  {
    slug: "wing-assembly-jig-relocation",
    title: "Wing Assembly Jig Relocation",
    client: "Commercial aircraft manufacturer",
    industry: "aerospace",
    services: ["machinery-moving", "industrial-metrology"],
    location: "Seattle, WA",
    locationSlug: "seattle",
    weight: "180,000 LBS",
    year: 2024,
    duration: "21 days",
    image: photo("1542296332-2e4473faf563", "Wide-body jet on the apron at sunrise"),
    gallery: [
      photo("1474302770737-173ee21bab63", "Business jet silhouetted at sunset", 1600, 1067),
      square("1769147339214-076740872485", "Machined parts on engineering drawings"),
      photo("1764114235891-66ff86abaf87", "Laser cutter working on sheet metal", 1600, 1067),
    ],
    summary: "A 180,000 lb wing jig moved across a live assembly bay and re-certified to ±0.003 in.",
    challenge:
      "The jig had to cross an active final-assembly bay without interrupting production, then return to a certification tolerance most machine shops couldn't hold.",
    solution: [
      "Our crews moved the jig on air-bearing skates across two night shifts, inside a dust-controlled corridor we built across the bay.",
      "Kestrel Metrology laser-tracked the jig before disassembly and after reassembly, adjusting each locator until it matched the original certification.",
    ],
    results: ["Zero hours of lost production", "Re-certified to ±0.003 in on first inspection", "Move completed in 21 days against 35 planned"],
    stats: [
      { value: "180,000 LBS", label: "Jig weight" },
      { value: "±0.003 IN", label: "Certified tolerance" },
      { value: "0 HRS", label: "Production lost" },
    ],
    featured: true,
  },
  {
    slug: "proton-therapy-cyclotron",
    title: "Proton Therapy Cyclotron Install",
    client: "Academic medical center",
    industry: "medical",
    services: ["heavy-lift-rigging", "machinery-moving", "industrial-metrology"],
    location: "Atlanta, GA",
    locationSlug: "atlanta",
    weight: "198,000 LBS",
    year: 2025,
    duration: "3 weeks",
    image: photo("1666214280352-db292c05fd80", "Radiation therapy machine in a clinical treatment room"),
    gallery: [
      photo("1758206523830-a5b8afb372a6", "Technician positioning a patient in a CT scanner", 1600, 1067),
      square("1666214282459-c7dff167ecc0", "White medical imaging machine with a round gantry"),
      photo("1581093450021-4a7360e9a6b5", "Scientists working in a bright laboratory", 1600, 1067),
    ],
    summary: "A 198,000 lb cyclotron lowered through a roof hatch into a shielded vault in the middle of a hospital campus.",
    challenge:
      "The vault sat below grade behind 12-foot concrete walls, on a campus that couldn't close streets or interrupt patient care.",
    solution: [
      "We set a 750-ton all-terrain crane overnight in a single traffic lane, lowered the cyclotron through a temporary roof hatch and skidded it into the vault.",
      "Kestrel Metrology verified the magnet's position against the beamline design before the hatch was sealed.",
    ],
    results: ["Lift completed in one overnight window", "No disruption to hospital operations", "Positioned within 0.5 mm of beamline design"],
    stats: [
      { value: "198,000 LBS", label: "Cyclotron weight" },
      { value: "0.5 MM", label: "Final position" },
      { value: "1 NIGHT", label: "Street occupancy" },
    ],
    featured: true,
  },
  {
    slug: "hyperscale-data-center-gensets",
    title: "Hyperscale Generator Set-In",
    client: "Hyperscale cloud provider",
    industry: "data-centers",
    services: ["crane-services", "specialized-transportation", "storage-warehousing"],
    location: "Dallas, TX",
    locationSlug: "dallas",
    weight: "62,000 LBS × 96",
    year: 2026,
    duration: "5 months",
    image: photo("1558494949-ef010cbdcc31", "Server racks with dense cabling in a data hall"),
    gallery: [
      photo("1544197150-b99a580bb7a8", "Network cables patched into a switch", 1600, 1067),
      photo("1771679910145-3a368d7f537c", "Truck-mounted crane working in the city", 1600, 1067),
      portrait("1565891741441-64926e441838", "Distribution centre seen from above"),
    ],
    summary: "96 generator sets received, staged and set across a three-building campus on a just-in-time schedule.",
    challenge:
      "Generators arrived from three manufacturers faster than the buildings could take them, and the general contractor needed each one set the day its pad was released.",
    solution: [
      "Our Dallas warehouse received, inspected and stored every unit, releasing them to site in the exact order pads were ready.",
      "Two 300-ton all-terrain cranes and a dedicated haul team set up to six generators a day.",
    ],
    results: ["96 generators set with zero schedule impact to the GC", "Peak rate of 6 sets per day", "Every unit tracked by serial number in our portal"],
    stats: [
      { value: "96", label: "Generator sets" },
      { value: "62,000 LBS", label: "Each" },
      { value: "6 / DAY", label: "Peak set rate" },
    ],
  },
  {
    slug: "lithography-tool-move-in",
    title: "Lithography Tool Move-In",
    client: "Leading-edge semiconductor fab",
    industry: "semiconductor",
    services: ["machinery-moving", "logistics", "industrial-metrology"],
    location: "Phoenix, AZ",
    locationSlug: "phoenix",
    weight: "330,000 LBS",
    year: 2026,
    duration: "6 weeks",
    image: photo("1518770660439-4636190af475", "Close-up of a processor on a circuit board"),
    gallery: [
      photo("1581092921461-eab62e97a780", "Technician working on electronics under a lamp", 1600, 1067),
      portrait("1716191299980-a6e8827ba10b", "Industrial robot arm in a clean facility"),
      photo("1787039467622-ddec5c24320c", "Precision machines in a bright workshop", 1600, 1067),
    ],
    summary: "Forty crates of lithography tool moved into a live cleanroom, vibration-monitored every inch.",
    challenge:
      "Each scanner arrived in 40 crates with shock and tilt limits tighter than most lab instruments, bound for a cleanroom already running production next door.",
    solution: [
      "Air-ride trucks, shock loggers and a dedicated route brought every crate from the airport to the fab's dock.",
      "Inside, our cleanroom-certified crews de-crated in the sub-fab and moved modules on air skates under continuous vibration monitoring.",
    ],
    results: ["Zero shock or tilt excursions across 40 crates", "Tool handed to the OEM 3 days early", "Cleanroom classification maintained throughout"],
    stats: [
      { value: "330,000 LBS", label: "Tool weight" },
      { value: "40", label: "Crates" },
      { value: "0", label: "Shock excursions" },
    ],
  },
  {
    slug: "mining-haul-truck-delivery",
    title: "Haul Truck Fleet Delivery",
    client: "Heavy equipment manufacturer",
    industry: "manufacturing",
    services: ["specialized-transportation", "machinery-moving"],
    location: "Salt Lake City, UT",
    locationSlug: "salt-lake-city",
    weight: "410,000 LBS",
    year: 2025,
    duration: "4 months",
    image: photo("1783428673297-17e7fc9f85fb", "Ultra-class haul truck loaded on a multi-axle trailer"),
    gallery: [
      photo("1523848309072-c199db53f137", "Excavators and haul trucks working an open-pit mine", 1600, 1067),
      square("1642927778267-4e8b787b325a", "Row of yellow excavators lined up in a yard"),
      portrait("1758750518277-1a8a182033e7", "Steel mine headframe against a pale sky"),
    ],
    summary: "Twelve ultra-class haul trucks delivered from rail-head to mine and assembled in our yard.",
    challenge:
      "Each truck's frame alone weighed 410,000 lb and was too wide for the mountain highway to the mine without a full route rebuild.",
    solution: [
      "We assembled trucks at a rail-served yard near the mine, then moved each completed chassis 26 miles on a perimeter trailer during night closures.",
      "Our crews handled utility lifts, escorts and traffic control with the state DOT.",
    ],
    results: ["12 trucks delivered over 4 months", "No unplanned road closures", "Assembly yard operational in 3 weeks"],
    stats: [
      { value: "410,000 LBS", label: "Chassis weight" },
      { value: "12", label: "Trucks" },
      { value: "26 MI", label: "Night haul" },
    ],
  },
  {
    slug: "booster-stage-transport",
    title: "Booster Stage Transport",
    client: "Commercial launch provider",
    industry: "aerospace",
    services: ["specialized-transportation", "logistics", "crane-services"],
    location: "Houston, TX",
    locationSlug: "houston",
    weight: "85,000 LBS",
    year: 2026,
    duration: "2 weeks",
    image: photo("1517976487492-5750f3195933", "Rocket lifting off from a coastal launch pad"),
    gallery: [
      portrait("1792202141286-8cd5f43a9c8b", "Flatbed truck carrying oversize cargo on a highway"),
      photo("1592805144716-feeccccef5ac", "Heavy truck on the highway at dusk", 1600, 1067),
      photo("1565862452829-e33c0b781ea3", "Cranes silhouetted at sunset", 1600, 1067),
    ],
    summary: "A 160-foot rocket stage moved 340 miles on a steerable trailer and upended onto its test stand.",
    challenge:
      "At 160 feet long and 30 feet across, the stage was light for its size but brutally hard to route: every curve, overpass and sign gantry was a problem.",
    solution: [
      "We built a steerable dolly configuration, surveyed 340 miles of route in 3D and coordinated 41 utility and sign removals.",
      "At the test site, our cranes upended the stage onto its stand in a single wind window.",
    ],
    results: ["Delivered in a three-night convoy", "41 utility and sign conflicts cleared", "Upended in a single four-hour window"],
    stats: [
      { value: "85,000 LBS", label: "Stage weight" },
      { value: "160 FT", label: "Length" },
      { value: "340 MI", label: "Route" },
    ],
  },
  {
    slug: "steel-mill-ladle-crane",
    title: "Ladle Crane Replacement",
    client: "Integrated steel producer",
    industry: "manufacturing",
    services: ["heavy-lift-rigging", "millwright-industrial"],
    location: "Pittsburgh, PA",
    locationSlug: "pittsburgh",
    weight: "340,000 LBS",
    year: 2024,
    duration: "8 days",
    image: photo("1496247749665-49cf5b1022e9", "Cavernous steel mill interior with overhead crane runways"),
    gallery: [
      portrait("1493476523860-a6de6ce1b0c3", "Orange-lit steel girders against the night"),
      photo("1455165814004-1126a7199f9b", "Welder working on steel with sparks", 1600, 1067),
      photo("1504917595217-d4dc5ebe6122", "Grinder throwing sparks in a workshop", 1600, 1067),
    ],
    summary: "A 340,000 lb ladle crane girder replaced inside a live melt shop during an eight-day outage.",
    challenge:
      "The crane runway sat 90 feet up inside a melt shop with no roof access and less than four feet of clearance to the building steel.",
    solution: [
      "Strand jacks on temporary beams lowered the old girders and raised the new ones through a four-foot gap.",
      "Our millwrights rebuilt trucks, drives and rail alignment in parallel, so testing began the moment the girders were set.",
    ],
    results: ["Outage completed in 8 days against a 10-day window", "Runway rail aligned to 1/16 in", "Zero recordables in a hot-work environment"],
    stats: [
      { value: "340,000 LBS", label: "Girder weight" },
      { value: "90 FT", label: "Lift height" },
      { value: "8 DAYS", label: "Outage" },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const featuredCaseStudies = caseStudies.filter((c) => c.featured);
export const caseStudiesForService = (slug: string) => caseStudies.filter((c) => c.services.includes(slug));

/* ------------------------------------------------------------------------ */
/* Locations                                                                 */
/* ------------------------------------------------------------------------ */

const ALL_SERVICES = services.map((s) => s.slug);

export const locations: Location[] = [
  {
    slug: "houston",
    city: "Houston",
    region: "Texas",
    regionCode: "TX",
    country: "USA",
    lat: 29.76,
    lng: -95.37,
    hub: true,
    hq: true,
    street: "7400 Ship Channel Blvd",
    locality: "Houston, TX",
    postalCode: "77029",
    phone: "713-555-0140",
    yard: "62-acre yard",
    description:
      "Our headquarters and largest yard, on the Houston Ship Channel. Home to the heavy-lift engineering group, the crawler crane fleet and 24/7 dispatch for the Gulf Coast's refineries and petrochemical plants.",
    services: ALL_SERVICES,
    image: photo("1509390288171-ce2088f7d08e", "Power plant illuminated at night with the moon above"),
  },
  {
    slug: "chicago",
    city: "Chicago",
    region: "Illinois",
    regionCode: "IL",
    country: "USA",
    lat: 41.88,
    lng: -87.63,
    hub: true,
    street: "2800 W 47th St",
    locality: "Chicago, IL",
    postalCode: "60632",
    phone: "312-555-0118",
    yard: "28-acre yard",
    description: "Midwest hub serving manufacturing, food processing and steel from the Great Lakes to the Ohio River, with a rail-served heavy warehouse.",
    services: ["machinery-moving", "millwright-industrial", "storage-warehousing", "heavy-lift-rigging", "crane-services", "specialized-transportation", "logistics"],
    image: photo("1643871522694-eaaf3c85cfbc", "Construction crane among city towers at night"),
  },
  {
    slug: "atlanta",
    city: "Atlanta",
    region: "Georgia",
    regionCode: "GA",
    country: "USA",
    lat: 33.75,
    lng: -84.39,
    hub: true,
    street: "1650 Fulton Industrial Blvd SW",
    locality: "Atlanta, GA",
    postalCode: "30336",
    phone: "404-555-0162",
    yard: "24-acre yard",
    description: "Southeast hub for medical, data center and manufacturing clients, with cleanroom-certified rigging crews and a climate-controlled warehouse.",
    services: ["machinery-moving", "storage-warehousing", "heavy-lift-rigging", "industrial-metrology", "crane-services", "logistics"],
    image: photo("1485083269755-a7b559a4fe5e", "Tower cranes over a skyline at blue hour"),
  },
  {
    slug: "denver",
    city: "Denver",
    region: "Colorado",
    regionCode: "CO",
    country: "USA",
    lat: 39.74,
    lng: -104.99,
    hub: true,
    street: "5200 E 56th Ave",
    locality: "Commerce City, CO",
    postalCode: "80022",
    phone: "303-555-0129",
    yard: "31-acre yard",
    description: "Rocky Mountain hub for mining, energy and aerospace work, with mountain-route permitting expertise and a large all-terrain crane fleet.",
    services: ["machinery-moving", "heavy-lift-rigging", "crane-services", "specialized-transportation", "logistics"],
    image: photo("1642927778267-4e8b787b325a", "Row of yellow excavators lined up in an equipment yard"),
  },
  {
    slug: "phoenix",
    city: "Phoenix",
    region: "Arizona",
    regionCode: "AZ",
    country: "USA",
    lat: 33.45,
    lng: -112.07,
    hub: true,
    street: "4300 W Buckeye Rd",
    locality: "Phoenix, AZ",
    postalCode: "85043",
    phone: "602-555-0177",
    yard: "40-acre yard",
    description: "Southwest hub built around the semiconductor corridor: cleanroom move-ins, tool installs and a 40-acre yard with a 220,000 sq ft warehouse.",
    services: ["machinery-moving", "storage-warehousing", "industrial-metrology", "crane-services", "specialized-transportation", "logistics"],
    image: photo("1565891741441-64926e441838", "Aerial view of a warehouse and truck yard"),
  },
  {
    slug: "seattle",
    city: "Seattle",
    region: "Washington",
    regionCode: "WA",
    country: "USA",
    lat: 47.61,
    lng: -122.33,
    hub: true,
    street: "3200 E Marginal Way S",
    locality: "Seattle, WA",
    postalCode: "98134",
    phone: "206-555-0135",
    yard: "18-acre yard",
    description: "Pacific Northwest hub on the Duwamish waterway, specializing in aerospace tooling, port cargo and precision metrology.",
    services: ["machinery-moving", "industrial-metrology", "heavy-lift-rigging", "crane-services", "logistics"],
    image: photo("1578575437130-527eed3abbec", "Container ship under gantry cranes at a port"),
  },
  {
    slug: "toronto",
    city: "Toronto",
    region: "Ontario",
    regionCode: "ON",
    country: "Canada",
    lat: 43.65,
    lng: -79.38,
    hub: true,
    street: "1250 Martin Grove Rd",
    locality: "Etobicoke, ON",
    postalCode: "M9W 4X3",
    phone: "416-555-0191",
    yard: "22-acre yard",
    description: "Eastern Canada hub for automotive, nuclear and manufacturing clients, with cross-border logistics and customs brokerage in-house.",
    services: ["machinery-moving", "millwright-industrial", "heavy-lift-rigging", "crane-services", "specialized-transportation", "logistics"],
    image: photo("1599707254554-027aeb4deacd", "Tower cranes beside a building under construction"),
  },
  {
    slug: "calgary",
    city: "Calgary",
    region: "Alberta",
    regionCode: "AB",
    country: "Canada",
    lat: 51.05,
    lng: -114.07,
    hub: true,
    street: "5400 76 Ave SE",
    locality: "Calgary, AB",
    postalCode: "T2C 3G8",
    phone: "403-555-0156",
    yard: "35-acre yard",
    description: "Western Canada hub for oil sands, utilities and pipeline work, with module transport and jack-and-slide crews based on site.",
    services: ["heavy-lift-rigging", "crane-services", "specialized-transportation", "millwright-industrial", "logistics"],
    image: photo("1768207750854-fb0cbd9c19f0", "Truck crossing open country under power lines at dusk"),
  },
  {
    slug: "los-angeles",
    city: "Los Angeles",
    region: "California",
    regionCode: "CA",
    country: "USA",
    lat: 34.05,
    lng: -118.24,
    hub: false,
    street: "2400 E Pacific Coast Hwy",
    locality: "Wilmington, CA",
    postalCode: "90744",
    phone: "323-555-0108",
    yard: "14-acre yard",
    description: "Port-side branch serving the LA and Long Beach terminals, aerospace in the South Bay and Southern California manufacturing.",
    services: ["machinery-moving", "crane-services", "specialized-transportation", "logistics"],
    image: photo("1494412651409-8963ce7935a7", "Aerial view of a busy container port"),
  },
  {
    slug: "dallas",
    city: "Dallas",
    region: "Texas",
    regionCode: "TX",
    country: "USA",
    lat: 32.78,
    lng: -96.8,
    hub: false,
    street: "3100 Irving Blvd",
    locality: "Dallas, TX",
    postalCode: "75247",
    phone: "214-555-0123",
    yard: "20-acre yard",
    description: "North Texas branch built for the data center boom, with generator and switchgear set-in crews and a 180,000 sq ft warehouse.",
    services: ["storage-warehousing", "crane-services", "specialized-transportation", "machinery-moving"],
    image: photo("1766785368863-f2188a8c8b32", "Two semi trucks driving on a highway"),
  },
  {
    slug: "pittsburgh",
    city: "Pittsburgh",
    region: "Pennsylvania",
    regionCode: "PA",
    country: "USA",
    lat: 40.44,
    lng: -79.99,
    hub: false,
    street: "600 Neville Rd",
    locality: "Pittsburgh, PA",
    postalCode: "15225",
    phone: "412-555-0174",
    yard: "12-acre yard",
    description: "River-served branch for steel, power and heavy manufacturing, with barge access on the Ohio River.",
    services: ["heavy-lift-rigging", "millwright-industrial", "crane-services", "machinery-moving"],
    image: photo("1493476523860-a6de6ce1b0c3", "Orange-lit steel girders against the night sky"),
  },
  {
    slug: "detroit",
    city: "Detroit",
    region: "Michigan",
    regionCode: "MI",
    country: "USA",
    lat: 42.33,
    lng: -83.05,
    hub: false,
    street: "7300 W Fort St",
    locality: "Detroit, MI",
    postalCode: "48209",
    phone: "313-555-0147",
    yard: "16-acre yard",
    description: "Automotive specialists: press lines, body shops and powertrain equipment moved and recommissioned on launch schedules.",
    services: ["machinery-moving", "millwright-industrial", "industrial-metrology", "specialized-transportation"],
    image: photo("1781330173666-11f8818d6eb2", "Row of industrial machinery in a modern plant"),
  },
  {
    slug: "charlotte",
    city: "Charlotte",
    region: "North Carolina",
    regionCode: "NC",
    country: "USA",
    lat: 35.23,
    lng: -80.84,
    hub: false,
    street: "4800 Statesville Ave",
    locality: "Charlotte, NC",
    postalCode: "28269",
    phone: "704-555-0139",
    yard: "10-acre yard",
    description: "Carolinas branch for energy, biotech and textile manufacturing, with warehouse space and a fleet of carry-deck cranes.",
    services: ["machinery-moving", "storage-warehousing", "crane-services", "millwright-industrial"],
    image: photo("1770827730773-cc7848b2ee61", "Forklift outside an industrial building"),
  },
  {
    slug: "baton-rouge",
    city: "Baton Rouge",
    region: "Louisiana",
    regionCode: "LA",
    country: "USA",
    lat: 30.45,
    lng: -91.19,
    hub: false,
    street: "9200 Airline Hwy",
    locality: "Baton Rouge, LA",
    postalCode: "70815",
    phone: "225-555-0182",
    yard: "26-acre yard",
    description: "Petrochemical corridor branch for turnarounds and heavy lifts along the Mississippi, with barge offload capability.",
    services: ["heavy-lift-rigging", "crane-services", "millwright-industrial", "specialized-transportation"],
    image: photo("1670689334799-cdc6777db8cc", "Petrochemical unit lit blue at night"),
  },
  {
    slug: "salt-lake-city",
    city: "Salt Lake City",
    region: "Utah",
    regionCode: "UT",
    country: "USA",
    lat: 40.76,
    lng: -111.89,
    hub: false,
    street: "2150 S 5370 W",
    locality: "West Valley City, UT",
    postalCode: "84120",
    phone: "801-555-0168",
    yard: "30-acre yard",
    description: "Intermountain branch for mining, aerospace and distribution, with a rail-served assembly yard for oversized equipment.",
    services: ["specialized-transportation", "machinery-moving", "crane-services", "logistics"],
    image: photo("1523848309072-c199db53f137", "Excavators working an open-pit mine"),
  },
  {
    slug: "kansas-city",
    city: "Kansas City",
    region: "Missouri",
    regionCode: "MO",
    country: "USA",
    lat: 39.1,
    lng: -94.58,
    hub: false,
    street: "1800 Manchester Trafficway",
    locality: "Kansas City, MO",
    postalCode: "64126",
    phone: "816-555-0113",
    yard: "14-acre yard",
    description: "Central Plains branch at the crossroads of four interstates, for agriculture, wind energy and distribution.",
    services: ["specialized-transportation", "storage-warehousing", "crane-services", "logistics"],
    image: photo("1592805144716-feeccccef5ac", "Semi truck on the highway under an orange sky"),
  },
  {
    slug: "monterrey",
    city: "Monterrey",
    region: "Nuevo León",
    regionCode: "NL",
    country: "Mexico",
    lat: 25.69,
    lng: -100.32,
    hub: false,
    street: "Av. Industrial 450",
    locality: "Apodaca, N.L.",
    postalCode: "66600",
    phone: "81-555-0190",
    yard: "18-acre yard",
    description: "Our Mexico branch, serving nearshoring manufacturing across Nuevo León and Coahuila with cross-border transport and customs.",
    services: ["machinery-moving", "millwright-industrial", "specialized-transportation", "logistics"],
    image: photo("1629447388369-760612337eff", "Industrial plant lit green and gold at night"),
  },
  {
    slug: "newark",
    city: "Newark",
    region: "New Jersey",
    regionCode: "NJ",
    country: "USA",
    lat: 40.74,
    lng: -74.17,
    hub: false,
    street: "200 Doremus Ave",
    locality: "Newark, NJ",
    postalCode: "07105",
    phone: "973-555-0126",
    yard: "15-acre yard",
    description: "Port Newark branch for offshore wind marshalling, pharmaceutical moves and Northeast project cargo.",
    services: ["heavy-lift-rigging", "crane-services", "logistics", "specialized-transportation"],
    image: photo("1590496793929-36417d3117de", "Shipping containers stacked at a port, from above"),
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
export const hubLocations = locations.filter((l) => l.hub);

/** Great-circle distance in miles. */
function distance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 3959 * 2 * Math.asin(Math.sqrt(h));
}

/** Case studies closest to a location (its own projects first). */
export function caseStudiesNear(location: Location, count = 3) {
  return [...caseStudies]
    .map((c) => ({ c, d: distance(location, getLocation(c.locationSlug) ?? location) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(({ c }) => c);
}

/** Other branches, nearest first. */
export function locationsNear(location: Location, count = 3) {
  return locations
    .filter((l) => l.slug !== location.slug)
    .sort((a, b) => distance(location, a) - distance(location, b))
    .slice(0, count);
}

/* ------------------------------------------------------------------------ */
/* Group of companies                                                        */
/* ------------------------------------------------------------------------ */

export const partners = [
  { name: "Irongate Logistics", logo: "irongate", role: "Project cargo & forwarding", color: "#E4572E" },
  { name: "Kestrel Metrology", logo: "kestrel", role: "Precision measurement", color: "#3B8BEB" },
  { name: "Bedrock Storage", logo: "bedrock", role: "Heavy warehousing", color: "#F5B800" },
  { name: "Northline Rail & Barge", logo: "northline", role: "Rail & marine transport", color: "#17B890" },
] as const;

export type PartnerLogo = (typeof partners)[number]["logo"];

/* ------------------------------------------------------------------------ */
/* News                                                                      */
/* ------------------------------------------------------------------------ */

export const news: NewsPost[] = [
  {
    slug: "1350-ton-crawler-crane-joins-fleet",
    title: "Jnros commissions a 1,350-ton crawler crane",
    date: "2026-10-08",
    category: "Fleet",
    excerpt: "The largest crane in our history arrives in Houston, ready for refinery turnarounds and wind work across the Gulf Coast.",
    image: photo("1730582403040-0014634a7b11", "Crane mast and hook with the full moon behind"),
    body: [
      { type: "p", text: "Jnros Logistics has commissioned a 1,350-ton lattice-boom crawler crane, the largest in the company's 42-year history. The crane is based at our Houston headquarters and will mobilize first for a refinery turnaround on the Mississippi River in November." },
      { type: "p", text: "With a maximum boom and jib combination of more than 600 feet and a superlift counterweight tray, the crane can pick loads that previously required tandem lifts or a gantry system, which shortens schedules and reduces ground preparation on congested sites." },
      { type: "h2", text: "Built for the work we're seeing" },
      { type: "p", text: "Refinery modules, offshore wind components and data center equipment are all getting heavier. Adding capacity at the top of the fleet lets our engineers choose the safest lift plan rather than the only one available." },
      { type: "ul", items: ["1,350-ton maximum capacity", "Superlift configuration for long-radius picks", "Transported on 52 truckloads, assembled in 4 days", "Operated by NCCCO-certified crews from our heavy-lift group"] },
      { type: "p", text: "The crane is available on an operated and maintained basis across North America. Contact our heavy-lift engineering team to discuss your project." },
    ],
  },
  {
    slug: "two-million-hours-without-lost-time",
    title: "2.1 million hours without a lost-time incident",
    date: "2026-09-22",
    category: "Safety",
    excerpt: "Our crews passed a safety milestone that reflects a decade of investment in planning, training and stop-work culture.",
    image: photo("1759922378219-1d31edb644f4", "Engineer in a white hard hat on a work site"),
    body: [
      { type: "p", text: "In September, Jnros crews passed 2.1 million consecutive work hours without a lost-time incident, across 18 locations and more than 3,400 field employees." },
      { type: "h2", text: "Planning is a safety tool" },
      { type: "p", text: "Every critical lift at Jnros is engineered and reviewed before mobilization, and every crew holds a pre-task briefing that any member can stop. Our EMR of 0.58 puts us among the safest heavy-industrial contractors in North America." },
      { type: "p", text: "The milestone belongs to the people who run the cranes, set the rigging and drive the trucks, and to the clients who give us the time to plan the work properly." },
    ],
  },
  {
    slug: "phoenix-yard-expansion",
    title: "Phoenix yard expands to 40 acres",
    date: "2026-09-03",
    category: "Locations",
    excerpt: "A new 220,000 sq ft warehouse and cleanroom staging area support the Southwest's growing semiconductor corridor.",
    image: photo("1689942010216-dc412bb1e7a9", "Forklift between tall pallet racks in a warehouse"),
    body: [
      { type: "p", text: "Jnros has completed a major expansion of its Phoenix yard, adding 12 acres of laydown, a 220,000 sq ft heavy-floor warehouse and a filtered staging area for semiconductor tools." },
      { type: "p", text: "The expansion lets fab clients stage tools near site, so crates move into the cleanroom on the day of installation rather than sitting at the dock." },
      { type: "h2", text: "What's new" },
      { type: "ul", items: ["220,000 sq ft warehouse with 1,500 psf slab", "Filtered, humidity-controlled tool staging", "Two 50-ton overhead crane bays", "Rail spur connection to the Union Pacific main line"] },
    ],
  },
  {
    slug: "inside-the-overnight-coker-drum-swap",
    title: "Inside the overnight coker drum swap",
    date: "2026-08-14",
    category: "Projects",
    excerpt: "How our engineers planned two 300,000 lb lifts inside an 11-day refinery outage, and finished a day early.",
    image: photo("1788041254705-5eba3f62d482", "Industrial chimney above a lit plant at night"),
    body: [
      { type: "p", text: "When a Gulf Coast refiner scheduled an 11-day outage to replace two coke drums, the lifts themselves were the easy part. The hard part was the space: pipe racks on three sides, live units nearby, and no room for a second large crane." },
      { type: "h2", text: "Weeks of work before day one" },
      { type: "p", text: "Our team barged the drums upriver and staged them within 300 feet of the structure long before the outage began. Engineers modeled every crane position in 3D and sequenced the work so old and new drums never shared the same radius." },
      { type: "p", text: "Both drums were set in 52 working hours. The unit returned to service a day ahead of schedule, with zero recordable incidents across 38,000 work hours." },
    ],
  },
  {
    slug: "apprenticeship-class-of-2026",
    title: "Apprenticeship class of 2026 graduates 64 millwrights",
    date: "2026-07-28",
    category: "Careers",
    excerpt: "Our four-year program produced its largest class yet, and every graduate has a job waiting on a Jnros crew.",
    image: photo("1775880303572-791fbbb73d32", "Construction workers in hard hats on a site"),
    body: [
      { type: "p", text: "Sixty-four apprentices completed Jnros' four-year millwright program this summer, the largest graduating class since the program began in 2009." },
      { type: "p", text: "Apprentices earn while they learn, rotating through machinery moving, heavy lift, metrology and outage work, with classroom training delivered at our Houston and Chicago training centers." },
      { type: "h2", text: "Applications are open" },
      { type: "p", text: "The 2027 intake opens in January. Visit our careers page to learn more or apply." },
    ],
  },
  {
    slug: "planning-a-data-center-move-in",
    title: "Planning a data center move-in: five questions to ask",
    date: "2026-07-02",
    category: "Insights",
    excerpt: "Generators, switchgear and chillers arrive fast and heavy. Here's what to settle before the first truck shows up.",
    image: photo("1544197150-b99a580bb7a8", "Network cables patched into a server switch"),
    body: [
      { type: "p", text: "Hyperscale campuses are setting equipment faster than ever, and the logistics behind them have become a critical path item. These are the five questions we ask every data center client before mobilization." },
      { type: "ul", items: ["Where will equipment wait if pads aren't ready?", "Who owns receiving inspection and damage claims?", "What is the set sequence, and who can change it?", "Are crane pads and access roads engineered for the heaviest unit?", "How will you track every serial number from factory to pad?"] },
      { type: "p", text: "Getting these answers early is the difference between a crane crew setting six generators a day and a crane crew waiting for paperwork." },
    ],
  },
];

export const getNewsPost = (slug: string) => news.find((n) => n.slug === slug);

/* ------------------------------------------------------------------------ */
/* Company: about, safety, careers                                           */
/* ------------------------------------------------------------------------ */

export const timeline = [
  { year: "1984", title: "Two trucks and a crane", text: "Founded on the Houston Ship Channel with two tractors, one lowboy and a 40-ton crane." },
  { year: "1991", title: "First 500-ton lift", text: "A refinery reactor set with our first large crawler crane put Jnros on the heavy-lift map." },
  { year: "1998", title: "Across the border", text: "Calgary opens, serving Alberta's oil sands with module transport and heavy lift." },
  { year: "2004", title: "Kestrel Metrology", text: "Our precision measurement division launches with three laser trackers." },
  { year: "2011", title: "Bedrock Storage joins", text: "1.2M sq ft of heavy warehousing adds storage to the Jnros group." },
  { year: "2018", title: "SPMT fleet", text: "Self-propelled modular transporters make 1,000,000-lb site moves routine." },
  { year: "2023", title: "18 locations", text: "Monterrey opens, completing a network that spans three countries." },
  { year: "2026", title: "1,350 tons", text: "The largest crawler crane in our history joins the fleet in Houston." },
];

export const safety = {
  stats: [
    { value: "0.58", label: "Experience Modification Rate" },
    { value: "0.42", label: "Total Recordable Incident Rate" },
    { value: "2.1M", label: "Hours without lost time" },
    { value: "100%", label: "Critical lifts engineered" },
  ],
  programs: [
    { title: "Stop-work authority", text: "Anyone on site can stop any task, at any time, without consequence. We celebrate the stops.", icon: "Siren" as IconName },
    { title: "Engineered lift plans", text: "Every lift over 75% of chart capacity, every tandem pick and every lift over people is engineered and stamped.", icon: "ClipboardCheck" as IconName },
    { title: "Certified crews", text: "NCCCO operators, riggers and signal persons. Annual recertification, not just initial training.", icon: "BadgeCheck" as IconName },
    { title: "Pre-task planning", text: "A written job safety analysis before every shift, reviewed by the whole crew.", icon: "HardHat" as IconName },
    { title: "Training academy", text: "Over 90,000 training hours a year across our Houston and Chicago centers.", icon: "GraduationCap" as IconName },
    { title: "Leadership in the field", text: "Supervisors and safety managers on site, not in the office, from mobilization to demob.", icon: "Users" as IconName },
  ],
  certifications: ["ISO 45001", "ISO 9001", "ISO/IEC 17025", "OSHA VPP Star sites", "NCCCO certified", "SC&RA member", "ISNetworld A-grade", "Avetta compliant"],
  image: photo("1567954970774-58d6aa6c50dc", "Red hard hat resting on asphalt"),
};

export const careers = {
  benefits: [
    { title: "Day-one benefits", text: "Medical, dental and vision coverage from your first day.", icon: "Stethoscope" as IconName },
    { title: "6% 401(k) match", text: "Fully vested, plus profit sharing in strong years.", icon: "Wallet" as IconName },
    { title: "Paid certifications", text: "NCCCO, CDL and metrology certifications, on us.", icon: "Award" as IconName },
    { title: "Apprenticeships", text: "Four-year earn-while-you-learn millwright program.", icon: "GraduationCap" as IconName },
    { title: "Safety bonus", text: "Quarterly bonuses for crews that work safe.", icon: "ShieldCheck" as IconName },
    { title: "Room to grow", text: "Most of our superintendents started on the tools.", icon: "TrendingUp" as IconName },
  ],
  jobs: [
    { title: "Crane Operator (NCCCO)", location: "Houston, TX", type: "Full-time", department: "Field Operations", summary: "Operate all-terrain and crawler cranes on refinery and industrial projects across the Gulf Coast." },
    { title: "Journeyman Millwright", location: "Detroit, MI", type: "Full-time", department: "Industrial Services", summary: "Install, align and recommission production equipment for automotive clients." },
    { title: "Rigging Engineer (PE)", location: "Chicago, IL", type: "Full-time", department: "Engineering", summary: "Design lift plans, rigging and temporary works for critical lifts and plant relocations." },
    { title: "CDL-A Heavy Haul Driver", location: "Dallas, TX", type: "Full-time", department: "Transportation", summary: "Haul permitted oversize loads on multi-axle trailers across the central US." },
    { title: "Metrology Technician", location: "Phoenix, AZ", type: "Full-time", department: "Kestrel Metrology", summary: "Run laser trackers and 3D scanners on semiconductor and aerospace projects." },
    { title: "Project Manager, Heavy Lift", location: "Atlanta, GA", type: "Full-time", department: "Project Management", summary: "Own schedule, budget and client relationship on complex heavy-lift projects." },
    { title: "Warehouse Lead", location: "Kansas City, MO", type: "Full-time", department: "Warehousing", summary: "Lead receiving, storage and dispatch of heavy equipment in our rail-served warehouse." },
    { title: "Millwright Apprentice", location: "Multiple locations", type: "Apprenticeship", department: "Industrial Services", summary: "Earn while you learn in our four-year program. No experience required, just mechanical aptitude." },
  ] satisfies Job[],
  image: photo("1621905251189-08b45d6a269e", "Worker in a yellow hard hat checking equipment"),
};

/* ------------------------------------------------------------------------ */
/* Page heroes                                                               */
/* ------------------------------------------------------------------------ */

export const pageImages = {
  services: photo("1733929042952-a908eb3305c4", "Crane with a red warning light against a stormy night sky", 2400, 1600),
  caseStudies: photo("1761504537447-e39a3085d697", "Excavators working a construction site under floodlights", 2400, 1600),
  locations: photo("1519003722824-194d4455a60c", "Truck climbing a mountain highway", 2400, 1600),
  about: photo("1541888946425-d81bb19240f5", "Crew in hard hats walking across a large job site", 2400, 1600),
  safety: photo("1769422837020-ea7251eb708d", "Silhouette of a worker in a hard hat at dusk", 2400, 1600),
  careers: photo("1630683924997-fe27050a0416", "Worker cutting steel on a job site", 2400, 1600),
  news: photo("1609627016501-b862497c7294", "Steel lattice structure against a dark sky", 2400, 1600),
  contact: photo("1592838064575-70ed626d3a0e", "Truck parked on an open plain at dusk", 2400, 1600),
  quote: photo("1616432043562-3671ea2e5242", "Trailer of a semi truck at sunset", 2400, 1600),
  industries: photo("1532601224476-15c79f2f7a51", "Wind turbines on rolling green hills", 2400, 1600),
  cta: photo("1565862452829-e33c0b781ea3", "Tower cranes silhouetted against a sunset sky", 2400, 1600),
  notFound: photo("1758750518277-1a8a182033e7", "Steel mine headframe against a pale sky", 2400, 1600),
  aboutStory: [
    portrait("1504307651254-35680f356dfd", "Workers tying rebar on a deck, seen from above"),
    photo("1599707254554-027aeb4deacd", "Tower cranes beside a building under construction", 1600, 1067),
  ],
  careersCrew: [
    portrait("1587582423116-ec07293f0395", "Worker in a hard hat on a building frame"),
    photo("1759922378219-1d31edb644f4", "Engineer in a white hard hat on site", 1600, 1067),
  ],
  safetyGallery: [
    photo("1768158988512-ad31657fe5b8", "Yellow hard hat resting on a wooden pallet", 1600, 1067),
    portrait("1621905251189-08b45d6a269e", "Worker in a yellow hard hat"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Navigation                                                                */
/* ------------------------------------------------------------------------ */

/** Nearest case study to a location, for the mega menu teaser. */
const teaserFor = (slug: string) => caseStudiesNear(getLocation(slug)!, 1)[0]?.slug;

export const nav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    mega: {
      eyebrow: "Industrial services",
      headline: "Heavy capability. Engineered precision.",
      description: "Eight disciplines under one roof, so your project has one plan and one team from survey to sign-off.",
      image: pageImages.services,
      cta: { label: "All services", href: "/services" },
      links: services.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
        description: s.short,
        image: s.image,
        teaser: caseStudiesForService(s.slug)[0]?.slug,
      })),
    },
  },
  {
    label: "Industries",
    href: "/industries",
    mega: {
      eyebrow: "Industries we serve",
      headline: "16 sectors. One standard.",
      description: "From data centers to wind farms, specialist crews who know your equipment, your regulations and your schedule.",
      image: pageImages.industries,
      cta: { label: "All industries", href: "/industries" },
      links: featuredIndustries.map((i) => ({
        label: i.name,
        href: `/industries/${i.slug}`,
        description: i.subtitle,
        image: i.image,
        teaser: i.caseStudy,
      })),
    },
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    mega: {
      eyebrow: "Industries we serve",
      headline: "Proof, by the pound.",
      description: "From cleanrooms to coker units, see how Jnros plans and executes the moves that matter.",
      image: pageImages.caseStudies,
      cta: { label: "All case studies", href: "/case-studies" },
      links: industries.map((i) => ({
        label: i.name,
        href: `/case-studies?industry=${i.slug}`,
        description: `${caseStudies.filter((c) => c.industry === i.slug).length} projects`,
        image: i.image,
        teaser: caseStudies.find((c) => c.industry === i.slug)?.slug,
      })),
    },
  },
  {
    label: "Locations",
    href: "/locations",
    mega: {
      eyebrow: "18 locations",
      headline: "Wherever the work is.",
      description: "Regional hubs and branches across the US, Canada and Mexico, each with its own yard, fleet and crews.",
      image: pageImages.locations,
      cta: { label: "All locations", href: "/locations" },
      links: hubLocations.map((l) => ({
        label: l.city,
        href: `/locations/${l.slug}`,
        description: `${l.locality} · ${l.yard}`,
        image: l.image,
        teaser: teaserFor(l.slug),
      })),
    },
  },
  {
    label: "Company",
    href: "/about",
    mega: {
      eyebrow: "Since 1984",
      headline: "Built by people who lift.",
      description: "Four decades, 3,400 field employees and one standard for safety.",
      image: pageImages.about,
      cta: { label: "About Jnros", href: "/about" },
      links: [
        { label: "About", href: "/about", description: "Our story, our group and our values.", image: pageImages.about, teaser: "coker-drum-replacement" },
        { label: "Safety", href: "/safety", description: "EMR 0.58 and 2.1M hours without lost time.", image: safety.image, teaser: "proton-therapy-cyclotron" },
        { label: "Careers", href: "/careers", description: "Crane operators, millwrights, engineers and more.", image: careers.image, teaser: "automotive-press-line-relocation" },
        { label: "News", href: "/news", description: "Fleet, projects and company updates.", image: pageImages.news, teaser: "offshore-wind-nacelle-marshalling" },
        { label: "Contact", href: "/contact", description: "Talk to a project engineer today.", image: pageImages.contact, teaser: "substation-transformer-delivery" },
      ],
    },
  },
];

export const footerColumns = [
  {
    title: "Locations",
    links: [...hubLocations.map((l) => ({ label: `${l.city}, ${l.regionCode}`, href: `/locations/${l.slug}` })), { label: "All 18 locations", href: "/locations" }],
  },
  { title: "Services", links: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Industries", href: "/industries" },
      { label: "Safety", href: "/safety" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
      { label: "Get a Quote", href: "/get-a-quote" },
    ],
  },
];
