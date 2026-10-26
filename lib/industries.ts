/**
 * Content for the Industries section (/industries and /industries/[slug]). Plain typed data,
 * safe to import from server and client components.
 */
import type { Stat } from "./data";
import { type Img, photo } from "./images";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type ServiceTag = "Rigging" | "Metrology" | "Millwright" | "Cranes" | "Transport" | "Heavy lift" | "Machinery moving" | "Storage" | "Logistics";

/**
 * One link in the "Moving industry forward" grid. Sectors with a featured row scroll to it;
 * the others link to the service page that covers them.
 */
export type Sector = { name: string; featured: string } | { name: string; service: string };

export type FeaturedIndustry = {
  slug: string;
  number: string;
  name: string;
  subtitle: string;
  tags: [ServiceTag, ServiceTag, ServiceTag];
  /** Card / list / mega-menu photo. */
  image: Img;
  /** Detail page hero photo. */
  heroImage: Img;
  overview: [string, string];
  /** "What we handle" bullets on the detail page. */
  scope: string[];
  stats: [Stat, Stat, Stat];
  /** Related case-study slug (lib/data.ts caseStudies). */
  caseStudy: string;
};

/** Which service page each tag links to. */
export const serviceForTag: Record<ServiceTag, string> = {
  Rigging: "heavy-lift-rigging",
  "Heavy lift": "heavy-lift-rigging",
  Metrology: "industrial-metrology",
  Millwright: "millwright-industrial",
  Cranes: "crane-services",
  Transport: "specialized-transportation",
  "Machinery moving": "machinery-moving",
  Storage: "storage-warehousing",
  Logistics: "logistics",
};

/* ------------------------------------------------------------------------ */
/* Page copy                                                                 */
/* ------------------------------------------------------------------------ */

/** Page order: hero → intro → sector link grid → industry rows → quote form. */
export const industriesPage = {
  hero: {
    lines: ["Industries", "we serve"],
    subline: "We have a passion for helping industry grow.",
    image: photo("1621905251189-08b45d6a269e", "Worker in a yellow hard hat checking equipment", 2400, 1600),
  },
  intro: {
    heading: "Expert engineers and advanced equipment for seamless industrial moves",
    paragraphs: [
      "Moved, hauled, lifted, stored, repaired or calibrated: whatever your equipment needs, Jnros has the engineers, fleet and resources to deliver it safely and on schedule. Big or small, we handle it.",
      "For more than 30 years we've served industries across the United States, Canada and beyond. Our crews are some of the most experienced in the trade, and on every job safety comes first.",
    ],
  },
  sectors: {
    heading: "Moving industry forward, one job at a time",
    text: "Equipment moves, superload transport, machinery calibration, specialized construction, installation, storage and repair for industries across North America.",
  },
  quote: {
    heading: "Let's get your project rolling",
    text: "Tell us about the job for a free project quote. A member of our team will get back to you shortly.",
  },
};

/* ------------------------------------------------------------------------ */
/* Sectors (the "Moving industry forward" link grid)                         */
/* ------------------------------------------------------------------------ */

export const sectors: Sector[] = [
  { name: "Construction", featured: "construction" },
  { name: "Machine tool manufacturing", featured: "machine-tool-manufacturing" },
  { name: "Data centers", featured: "data-centers" },
  { name: "Food and beverage", featured: "food-processing" },
  { name: "Printing", service: "machinery-moving" },
  { name: "Steel, lumber and mining", featured: "steel-lumber-mining" },
  { name: "Aerospace and defense", featured: "aerospace-defense" },
  { name: "Semiconductors, technology and engineering", featured: "semiconductors" },
  { name: "Renewable energy", featured: "renewable-energy" },
  { name: "Marine", featured: "marine" },
  { name: "Transportation and rail", service: "specialized-transportation" },
  { name: "Injection molding", service: "machinery-moving" },
  { name: "Energy (electrical, oil and gas)", featured: "oil-gas" },
  { name: "HVAC", service: "crane-services" },
  { name: "Medical and pharmaceutical", service: "machinery-moving" },
  { name: "Processing facilities", service: "millwright-industrial" },
];

/* ------------------------------------------------------------------------ */
/* Featured industries (page rows, mega menu, detail pages)                  */
/* ------------------------------------------------------------------------ */

export const featuredIndustries: FeaturedIndustry[] = [
  {
    slug: "machine-tool-manufacturing",
    number: "01",
    name: "Machine tool manufacturing",
    subtitle: "Precision equipment, relocated without a micron of compromise",
    tags: ["Rigging", "Metrology", "Millwright"],
    image: photo("1787039467622-ddec5c24320c", "CNC machining centers in a bright manufacturing workshop"),
    heroImage: photo("1666634157070-6fd830fb5672", "Metal rod held in a lathe chuck being machined", 2400, 1600),
    overview: [
      "CNC machining centers, grinders, EDMs and coordinate measuring machines lose their value the moment they lose alignment. We plan every move around the machine's own tolerances: foundation, lifting points, travel path and the exact conditions it needs on arrival.",
      "Our metrology team scans each machine before it moves and verifies it after, so it goes back into production making good parts on day one, not after a week of shimming.",
    ],
    scope: ["CNC, EDM and grinder relocation", "Foundation and anchor surveys", "Precision leveling and laser alignment", "Crating, climate control and storage"],
    stats: [
      { value: "±0.0005 IN", label: "Re-leveling tolerance" },
      { value: "48 HRS", label: "Typical cell move" },
      { value: "1,200+", label: "Machine tools moved a year" },
    ],
    caseStudy: "automotive-press-line-relocation",
  },
  {
    slug: "construction",
    number: "02",
    name: "Construction",
    subtitle: "Lift and haul support at any scope or scale",
    tags: ["Cranes", "Transport", "Heavy lift"],
    image: photo("1429497419816-9ca5cfb4571a", "Tower cranes over a building under construction"),
    heroImage: photo("1599707254554-027aeb4deacd", "Tower cranes beside a high-rise under construction", 2400, 1600),
    overview: [
      "General contractors call Jnros for the lifts that hold up a schedule: steel erection, precast, rooftop units, modular buildings and the long-lead equipment that has to land the day the slab is ready.",
      "Operated and maintained cranes, permitted transport and stamped lift plans come from one team, so the delivery, the pick and the set are planned together instead of handed off.",
    ],
    scope: ["Operated and maintained crane rental", "Steel, precast and modular erection", "Rooftop equipment and HVAC picks", "Permitted delivery of long-lead equipment"],
    stats: [
      { value: "1,350 T", label: "Largest crawler crane" },
      { value: "320+", label: "Cranes in the fleet" },
      { value: "24/7", label: "Dispatch" },
    ],
    caseStudy: "hyperscale-data-center-gensets",
  },
  {
    slug: "semiconductors",
    number: "03",
    name: "Semiconductors",
    subtitle: "Clean, careful moves for ultra-sensitive tools",
    tags: ["Machinery moving", "Logistics", "Millwright"],
    image: photo("1518770660439-4636190af475", "Close-up of a processor on a circuit board"),
    heroImage: photo("1581092921461-eab62e97a780", "Technician working on electronics under a lamp", 2400, 1600),
    overview: [
      "Lithography scanners, etch and deposition tools ship in dozens of crates with shock and tilt limits tighter than most lab instruments. One excursion can mean weeks of recalibration.",
      "Our cleanroom-certified crews move tools from airport to sub-fab on air-ride trucks and air skates, with shock loggers and vibration monitoring the entire way.",
    ],
    scope: ["Cleanroom move-ins and de-installs", "Air-ride transport with shock logging", "Sub-fab rigging and air-skate moves", "Tool hook-up support"],
    stats: [
      { value: "ISO 5", label: "Cleanroom-certified crews" },
      { value: "40", label: "Crates in one tool move" },
      { value: "0", label: "Shock excursions" },
    ],
    caseStudy: "lithography-tool-move-in",
  },
  {
    slug: "aerospace-defense",
    number: "04",
    name: "Aerospace and defense",
    subtitle: "Care for mission-critical machining equipment",
    tags: ["Metrology", "Machinery moving", "Storage"],
    image: photo("1542296332-2e4473faf563", "Wide-body jet on an airport apron at sunrise"),
    heroImage: photo("1474302770737-173ee21bab63", "Business jet silhouetted against a sunset", 2400, 1600),
    overview: [
      "Assembly jigs, five-axis machining centers and test fixtures are certified to tolerances measured in thousandths. Moving them means protecting that certification as carefully as the equipment itself.",
      "We work inside live production environments, document every step for quality and compliance teams, and re-certify tooling with our own laser trackers before handing it back.",
    ],
    scope: ["Assembly jig and tooling relocation", "Five-axis machining center moves", "Laser tracker re-certification", "Secure, climate-controlled storage"],
    stats: [
      { value: "±0.003 IN", label: "Jig re-certification" },
      { value: "21 DAYS", label: "Wing jig relocation" },
      { value: "0 HRS", label: "Production lost" },
    ],
    caseStudy: "wing-assembly-jig-relocation",
  },
  {
    slug: "oil-gas",
    number: "05",
    name: "Oil and gas",
    subtitle: "Heavy transport and rigging built for energy logistics",
    tags: ["Transport", "Rigging", "Logistics"],
    image: photo("1670689334015-299d6559b3c3", "Refinery columns and flare stacks at dusk"),
    heroImage: photo("1516937941344-00b4e0337589", "Refinery stacks and process units on an open plain", 2400, 1600),
    overview: [
      "Refinery turnarounds, compressor stations and process modules run on outage windows where every hour has a price. We plan the transport, the lift and the set as one critical path.",
      "Barge, rail and multi-axle road transport, SPMTs and the largest crawler cranes in our fleet are engineered in-house, so the plan that wins the bid is the plan that runs on site.",
    ],
    scope: ["Refinery turnarounds and outages", "Vessel, exchanger and module transport", "Engineered critical lifts", "Pipeline and compressor station support"],
    stats: [
      { value: "300,000 LBS", label: "Coke drums, set in 52 hrs" },
      { value: "900,000 LBS", label: "Heaviest highway haul" },
      { value: "64", label: "States & provinces permitted" },
    ],
    caseStudy: "coker-drum-replacement",
  },
  {
    slug: "food-processing",
    number: "06",
    name: "Food processing",
    subtitle: "Facility upgrades and relocations, on schedule",
    tags: ["Millwright", "Machinery moving", "Storage"],
    image: photo("1651525670099-f828fb5478a5", "Fruit moving along a sorting line in a processing plant"),
    heroImage: photo("1652211955971-7517ff03529d", "Stainless processing line inside a food plant", 2400, 1600),
    overview: [
      "Processing and packaging lines only make money while they run. We schedule line moves, upgrades and installs around your production calendar, often over a single weekend.",
      "Our millwrights follow your sanitary-zone and allergen procedures, and our warehouses hold new equipment until the floor is ready for it.",
    ],
    scope: ["Processing and packaging line moves", "Conveyor and equipment installation", "Sanitary-zone work practices", "Short- and long-term equipment storage"],
    stats: [
      { value: "1 WEEKEND", label: "Typical line changeover" },
      { value: "640+", label: "Certified millwrights" },
      { value: "1.8M SQ FT", label: "Storage capacity" },
    ],
    caseStudy: "automotive-press-line-relocation",
  },
  {
    slug: "steel-lumber-mining",
    number: "07",
    name: "Steel, lumber and mining",
    subtitle: "On-site strength for the toughest operations",
    tags: ["Heavy lift", "Transport", "Millwright"],
    image: photo("1523848309072-c199db53f137", "Excavators and haul trucks working an open-pit mine"),
    heroImage: photo("1496247749665-49cf5b1022e9", "Steel mill interior with overhead crane runways", 2400, 1600),
    overview: [
      "Melt shops, sawmills and open-pit mines are hard on equipment and harder on schedules. Outages are short, access is tight and the loads are among the heaviest we move.",
      "Strand jacks, gantries and heavy-haul trailers let us replace crane girders, deliver haul trucks and rebuild presses without waiting for a perfect day.",
    ],
    scope: ["Mill outages and crane replacements", "Haul truck and shovel transport", "Sawmill and press equipment moves", "Strand jacking in tight structures"],
    stats: [
      { value: "340,000 LBS", label: "Ladle crane girder" },
      { value: "410,000 LBS", label: "Haul truck chassis" },
      { value: "8 DAYS", label: "Melt shop outage" },
    ],
    caseStudy: "steel-mill-ladle-crane",
  },
  {
    slug: "renewable-energy",
    number: "08",
    name: "Renewable energy",
    subtitle: "Turnkey support for wind, solar, hydro and battery",
    tags: ["Transport", "Cranes", "Heavy lift"],
    image: photo("1466611653911-95081537e5b7", "Wind turbines on a plain at sunset"),
    heroImage: photo("1548337138-e87d889cc369", "Offshore wind turbines rising from a calm sea", 2400, 1600),
    overview: [
      "Blades longer than a football field, nacelles over a million pounds and battery containers by the hundred: renewable projects are logistics projects first.",
      "We route and permit the components, marshal them at port and lay-down yards, and erect them with crawler cranes and crews who know wind windows as well as weight charts.",
    ],
    scope: ["Blade, nacelle and tower transport", "Crawler cranes for turbine erection", "Battery storage and inverter set-in", "Port marshalling and lay-down"],
    stats: [
      { value: "1.1M LBS", label: "Nacelles marshalled" },
      { value: "98", label: "Nacelles, no lost days" },
      { value: "48", label: "SPMT axle lines" },
    ],
    caseStudy: "offshore-wind-nacelle-marshalling",
  },
  {
    slug: "data-centers",
    number: "09",
    name: "Data centers",
    subtitle: "Moving the infrastructure behind the world's data",
    tags: ["Cranes", "Storage", "Logistics"],
    image: photo("1558494949-ef010cbdcc31", "Server racks with dense cabling in a data hall"),
    heroImage: photo("1544197150-b99a580bb7a8", "Network cables patched into a server switch", 2400, 1600),
    overview: [
      "Generators, switchgear, chillers and UPS systems arrive faster than buildings can take them. Hyperscale schedules need equipment staged, released and set the day each pad is ready.",
      "Our warehouses receive and inspect every unit, our cranes set them in sequence, and every serial number is tracked from factory to pad in one portal.",
    ],
    scope: ["Generator, switchgear and chiller set-in", "Just-in-time warehousing and release", "Rooftop and yard crane picks", "Serial-level tracking to the pad"],
    stats: [
      { value: "96", label: "Generators on one campus" },
      { value: "6 / DAY", label: "Peak set rate" },
      { value: "1.8M SQ FT", label: "Staging warehouse space" },
    ],
    caseStudy: "hyperscale-data-center-gensets",
  },
  {
    slug: "marine",
    number: "10",
    name: "Marine",
    subtitle: "Massive marine loads, handled with care",
    tags: ["Heavy lift", "Transport", "Rigging"],
    image: photo("1578575437130-527eed3abbec", "Container ship under ship-to-shore gantry cranes"),
    heroImage: photo("1494412574643-ff11b0a5c1c3", "Aerial view of a container terminal with gantry cranes", 2400, 1600),
    overview: [
      "Ports, shipyards and offshore projects move cargo too big for a container and too valuable to improvise: vessels, engines, modules and wind components.",
      "We engineer quay bearing and grillages, run SPMTs for roll-on/roll-off, and coordinate barge, rail and road so the load keeps moving from ship to site.",
    ],
    scope: ["Vessel load-out and offload", "Barge and roll-on/roll-off moves", "Port lay-down and marshalling", "Marine engine and propulsion rigging"],
    stats: [
      { value: "1.1M LBS", label: "Single port load-out" },
      { value: "48", label: "SPMT axle lines" },
      { value: "40+", label: "Countries shipped to" },
    ],
    caseStudy: "offshore-wind-nacelle-marshalling",
  },
];

export const getFeaturedIndustry = (slug: string) => featuredIndustries.find((i) => i.slug === slug);
