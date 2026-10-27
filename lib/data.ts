/**
 * All site content as typed data. Pages and components read from here; nothing is hard-coded
 * in markup. Plain data only (no React), so it is safe to import from server and client code.
 *
 * Every word and photo comes from jnroslogistics.com. Keep it that way: add content here only
 * when it is published on the live site too.
 */
import { type Img, photo } from "./images";

export type { Img };

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type IconName = "Award" | "Globe" | "Layers" | "Network" | "SlidersHorizontal" | "Route" | "ShieldCheck" | "Handshake" | "Ship" | "Plane" | "Truck";

export type Feature = { title: string; text: string; icon: IconName };

/** A solution or a service: both have a card line and a four-paragraph page. */
export type Offering = {
  slug: string;
  number: string;
  title: string;
  /** One line, used on cards and in the menus. */
  short: string;
  /** Body paragraphs on the detail page. */
  body: string[];
  image: Img;
  href: string;
};

export type MegaLink = { label: string; href: string; description: string; image: Img };
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
  legalName: "Jnros Logistics",
  description:
    "Jnros Logistics delivers engineered logistics solutions across sea, air, and inland transport, with specialized expertise in Project Cargo, Breakbulk, ODC, and Heavy Lift movements, supported by comprehensive global freight services.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jnroslogistics.com",
  phone: "+91 96202 32321",
  email: "nesan.kumar@jnroslogistics.com",
  address: {
    lines: ["G006 Aditya Sunshine, Chickkabanaswadi Main Road", "Opp to CMR Law College, Kalyanagar Post", "Bangalore - 560043"],
    street: "G006 Aditya Sunshine, Chickkabanaswadi Main Road, Opp to CMR Law College, Kalyanagar Post",
    city: "Bangalore",
    postalCode: "560043",
    country: "IN",
  },
  socials: [{ label: "WhatsApp", href: "https://wa.me/919620232321", icon: "whatsapp" }],
} as const;

export type SocialIcon = (typeof site.socials)[number]["icon"];

/* ------------------------------------------------------------------------ */
/* Solutions and services                                                    */
/* ------------------------------------------------------------------------ */

const offering = (base: string, number: number, o: Omit<Offering, "number" | "href">): Offering => ({
  ...o,
  number: String(number).padStart(2, "0"),
  href: `${base}/${o.slug}`,
});

export const solutions: Offering[] = [
  {
    slug: "odc-cargo-shipping",
    title: "ODC Cargo Shipping",
    short: "Safe and compliant transportation of over-dimensional and heavy cargo with detailed planning and specialized equipment.",
    body: [
      "Jnros Logistics specializes in transporting Over Dimensional Cargo (ODC) that exceeds standard size and weight limitations. We handle heavy machinery, industrial equipment, and oversized components with precision and expertise.",
      "Our team conducts detailed route surveys, risk assessments, and permit arrangements to ensure safe and compliant transportation. We coordinate escort vehicles and specialized trailers to manage complex movements.",
      "We work closely with port authorities, carriers, and regulatory bodies to ensure seamless execution across sea and land transport. Safety and compliance remain our top priorities throughout the process.",
      "With strategic planning and technical expertise, we deliver ODC shipments efficiently while minimizing risks and operational disruptions.",
    ],
    image: photo("odc-cargo-shipping.jpeg", "Locomotives loaded on multi-axle trailers for an over-dimensional move", 1280, 960),
  },
  {
    slug: "break-bulk-shipping",
    title: "Break Bulk Shipping",
    short: "Efficient handling and shipping of non-containerized cargo with secure loading and global coordination.",
    body: [
      "Break bulk shipping is ideal for cargo that cannot be containerized due to size or nature. Jnros Logistics manages the secure loading, handling, and transportation of such specialized cargo.",
      "Our team ensures proper cargo stowage planning and port coordination to prevent damage and delays. We work with reliable vessel operators to guarantee smooth shipment execution.",
      "We handle a wide range of break bulk cargo including industrial materials, steel structures, and heavy equipment. Each shipment is carefully monitored from origin to destination.",
      "With strong global partnerships, we provide dependable and cost-effective break bulk logistics solutions.",
    ],
    image: photo("break-bulk-shipping.jpg", "Steel pipes stowed as break bulk cargo between a vessel's deck cranes", 740, 493),
  },
  {
    slug: "ro-ro-shipping",
    title: "Ro-Ro Shipping",
    short: "Reliable roll-on/roll-off solutions for vehicles and wheeled machinery with smooth port operations.",
    body: [
      "Jnros Logistics offers efficient Ro-Ro shipping services for vehicles, construction equipment, and wheeled cargo. This method allows cargo to be driven directly onto and off the vessel, ensuring faster handling.",
      "Our team coordinates closely with port terminals and vessel operators to ensure smooth loading and discharge operations. We handle documentation and customs procedures efficiently.",
      "Ro-Ro shipping minimizes handling risks and ensures cost-effective transportation for heavy mobile equipment. It is an ideal solution for large vehicle shipments.",
      "With reliable scheduling and professional oversight, we ensure safe and timely delivery of Ro-Ro cargo worldwide.",
    ],
    image: photo("ro-ro-shipping.jpg", "Wheeled cargo driven up the stern ramp of a Ro-Ro vessel", 820, 533),
  },
  {
    slug: "bulk-carrier-shipping",
    title: "Bulk Carrier Shipping",
    short: "Specialized bulk carrier vessel solutions for transporting coal, rice, grains, minerals, and other dry bulk commodities across global trade routes.",
    body: [
      "Jnros Logistics provides dedicated bulk carrier shipping services for large-volume dry commodities such as coal, rice, grains, minerals, fertilizers, and industrial raw materials. We coordinate vessel chartering and cargo planning to ensure safe and efficient maritime transport.",
      "Our team carefully manages cargo loading, stowage planning, draft surveys, and discharge operations to maintain cargo integrity and comply with international maritime standards. We work closely with shipowners, port authorities, and surveyors to ensure smooth operations.",
      "With strong relationships in the global shipping market, we arrange suitable bulk carrier vessels based on cargo type, quantity, and destination. Our expertise ensures optimized freight cost, proper scheduling, and minimal turnaround time.",
      "From origin port coordination to final discharge, Jnros Logistics ensures secure handling, regulatory compliance, and reliable execution of bulk commodity shipments worldwide.",
    ],
    image: photo("bulk-carrier-shipping.jpg", "Bulk carrier with deck cranes transferring cargo to a barge at sea", 740, 493),
  },
  {
    slug: "ship-brokering",
    title: "Ship Brokering",
    short: "Reliable vessel sourcing and charter negotiation tailored to cargo requirements and global trade routes.",
    body: [
      "Jnros Logistics offers professional ship brokering services, connecting clients with suitable vessels based on cargo requirements and trade routes. We negotiate competitive charter terms while ensuring operational efficiency.",
      "Our expertise covers voyage charters, time charters, and long-term freight arrangements tailored to specific shipping needs. We work closely with shipowners and operators to secure reliable tonnage.",
      "By understanding market trends and freight dynamics, we provide strategic guidance that supports cost-effective decision-making.",
      "Our goal is to ensure dependable vessel placement with smooth coordination from fixture to completion.",
    ],
    image: photo("ship-brokering.avif", "Cargo ship berthed beside port cranes", 740, 492),
  },
  {
    slug: "heavy-lift-chartering-industrial-movers",
    title: "Heavy Lift Chartering & Industrial Movers",
    short: "Specialized vessel chartering and industrial relocation services for heavy machinery and large-scale equipment.",
    body: [
      "We specialize in arranging heavy lift vessel charters for oversized and high-tonnage cargo requiring specialized lifting capabilities. Each movement is carefully engineered to ensure structural safety and operational precision.",
      "Jnros Logistics manages the relocation of industrial machinery, plant equipment, and large structural components across domestic and international destinations.",
      "Our team conducts technical assessments, lifting calculations, and transport planning to eliminate risk and delays.",
      "With strong execution capabilities, we deliver safe and efficient solutions for challenging industrial logistics projects.",
    ],
    image: photo("heavy-lift-chartering.jpg", "Process column on modular transporters beneath a heavy lift vessel's cranes", 700, 400),
  },
  {
    slug: "heavy-cargo-loadout-operations",
    title: "Heavy Cargo Loadout Operations",
    short: "Expert execution of complex loadouts from shore to barge or vessel with maximum safety control.",
    body: [
      "Jnros Logistics manages complex loadout operations involving the transfer of heavy structures and equipment from land-based facilities to marine transport units.",
      "We conduct structural assessments, stability calculations, and equipment planning to ensure secure positioning and safe transfer.",
      "Our operations team coordinates closely with marine engineers, port authorities, and contractors to execute loadouts efficiently.",
      "Through meticulous supervision and safety-driven procedures, we ensure controlled and reliable offshore dispatch operations.",
    ],
    image: photo("heavy-cargo-loadout.jpg", "Container ship being loaded by gantry cranes at a terminal", 1600, 899),
  },
  {
    slug: "heavy-lifting-transportation",
    title: "Heavy Lifting & Transportation",
    short: "Precision lifting and secure transport solutions for oversized and high-tonnage cargo.",
    body: [
      "We provide integrated heavy lifting and transportation solutions supported by specialized equipment and skilled professionals.",
      "Our services include crane operations, engineered lifting plans, route analysis, and secure cargo handling for oversized loads.",
      "Jnros Logistics ensures compliance with regulatory requirements while maintaining strict safety standards throughout transport operations.",
      "From on-site lifting to final delivery, we execute each movement with precision, efficiency, and operational discipline.",
    ],
    image: photo("heavy-lifting-transportation.jpeg", "Locomotive carried on a multi-axle hydraulic trailer", 1280, 960),
  },
].map((o, i) => offering("/solutions", i + 1, o));

export const services: Offering[] = [
  {
    slug: "international-air-freight",
    title: "International Air Freight",
    short:
      "We provide reliable international air freight solutions for time-critical and high-value shipments. Our services ensure fast transit, secure handling, and seamless global connectivity.",
    body: [
      "Jnros Logistics provides reliable international air freight solutions for time-sensitive and high-value cargo. We work closely with leading airlines to ensure fast transit times, secure handling, and flexible routing options across global destinations.",
      "Our air freight services are tailored to meet diverse industry requirements, including express shipments, consolidated cargo, and special handling needs. From pickup to final delivery, we maintain strict control over every stage of the shipment.",
      "We ensure accurate documentation, regulatory compliance, and real-time coordination to minimize delays and ensure smooth cargo movement. Our experienced team manages customs requirements and airline procedures efficiently.",
      "With a strong global network and customer-focused approach, Jnros Logistics delivers air freight solutions that prioritize speed, safety, and reliability—keeping your supply chain moving without disruption.",
    ],
    image: photo("international-air-freight.avif", "Cargo pallets on an airport apron in front of a jet", 740, 740),
  },
  {
    slug: "global-air-charter-operations",
    title: "Global Air Charter Operations",
    short:
      "Our global air charter operations offer flexible and dedicated aircraft solutions for oversized, urgent, and specialized cargo. We manage end-to-end charter planning to ensure efficiency and precision.",
    body: [
      "Our global air charter operations offer customized aircraft solutions for urgent, oversized, or specialized cargo. We arrange dedicated charter flights to meet exact cargo dimensions, weight, and delivery timelines.",
      "Jnros Logistics manages the complete charter process, including aircraft selection, route planning, permits, and ground handling. This ensures maximum flexibility and operational efficiency for critical shipments.",
      "We specialize in handling complex cargo requirements such as heavy machinery, project cargo, and time-critical consignments. Our team ensures secure loading, compliance, and continuous monitoring throughout the journey.",
      "With access to a worldwide charter network, we deliver dependable and cost-effective air charter solutions, even in challenging or remote locations.",
    ],
    image: photo("global-air-charter.avif", "Aircraft at an airport stand with cargo pallets waiting to load", 740, 493),
  },
  {
    slug: "international-ocean-freight",
    title: "International Ocean Freight",
    short:
      "Jnros Logistics delivers cost-effective international ocean freight services for containerized, break bulk, and project cargo. We ensure safe, compliant, and timely delivery across global trade routes.",
    body: [
      "Jnros Logistics offers comprehensive international ocean freight services for containerized, break bulk, and project cargo. We provide flexible shipping options to suit cost, schedule, and cargo-specific requirements.",
      "Our ocean freight solutions include full container load (FCL), less-than-container load (LCL), and specialized cargo movements. We coordinate closely with shipping lines to ensure smooth vessel planning and execution.",
      "We handle all documentation, customs coordination, and port operations to ensure seamless cargo flow across international trade routes. Our expertise minimizes delays and enhances supply chain efficiency.",
      "Backed by a strong global network, Jnros Logistics ensures safe, reliable, and cost-effective ocean freight services tailored to your business needs.",
    ],
    image: photo("international-ocean-freight.avif", "Loaded container ship sailing out of a port", 740, 493),
  },
  {
    slug: "overland-transport",
    title: "Overland Transport",
    short:
      "We offer dependable overland transport solutions for domestic and cross-border cargo movement. Our fleet and route planning ensure secure, efficient, and on-time deliveries.",
    body: [
      "Our overland transport services provide efficient inland and cross-border cargo movement through a reliable fleet and experienced operations team. We support both standard and specialized transportation requirements.",
      "Jnros Logistics plans routes carefully to ensure safety, regulatory compliance, and on-time delivery. From short-distance movements to long-haul transport, we maintain complete control over cargo movement.",
      "We handle diverse cargo types, including general freight, oversized loads, and sensitive shipments. Real-time coordination ensures smooth transit and quick issue resolution.",
      "With a strong focus on reliability and efficiency, our overland transport solutions support seamless connectivity between ports, warehouses, and final destinations.",
    ],
    image: photo("overland-transport.avif", "Container truck at a port terminal", 740, 493),
  },
  {
    slug: "warehousing-and-distribution",
    title: "Warehousing and Distribution",
    short:
      "Our warehousing and distribution services provide secure storage, inventory management, and timely distribution. We support smooth supply chain operations with scalable and efficient solutions.",
    body: [
      "Jnros Logistics offers secure warehousing and efficient distribution services to support streamlined supply chain operations. Our facilities are designed to handle a wide range of cargo types safely.",
      "We provide inventory management, cargo handling, storage, and order fulfillment services tailored to client requirements. Advanced systems ensure accuracy and transparency at every stage.",
      "Our distribution solutions ensure timely dispatch and efficient delivery, supporting both domestic and international supply chains. We adapt storage solutions to meet short-term and long-term needs.",
      "With a focus on safety, organization, and efficiency, our warehousing services add value by optimizing storage and distribution processes.",
    ],
    image: photo("warehousing-and-distribution.avif", "Forklift in a warehouse aisle lined with stacked cartons", 740, 470),
  },
  {
    slug: "dangerous-goods-handling",
    title: "Dangerous Goods Handling",
    short:
      "We specialize in the safe handling and transportation of dangerous goods in compliance with international safety regulations. Our trained professionals ensure proper packaging, documentation, and risk management.",
    body: [
      "We specialize in the safe handling and transportation of dangerous goods in full compliance with international regulations. Our team is trained to manage hazardous materials across air, ocean, and land transport.",
      "Jnros Logistics ensures proper classification, packaging, labeling, and documentation as per IATA, IMO, and ADR guidelines. Safety remains our top priority at every stage.",
      "We coordinate closely with carriers, authorities, and handling agents to minimize risk and ensure smooth movement of dangerous goods shipments.",
      "Our structured processes and compliance-driven approach ensure secure, reliable, and legally compliant transportation of hazardous cargo worldwide.",
    ],
    image: photo("dangerous-goods-handling.avif", "Two workers in hard hats moving a crate on a pallet jack", 740, 416),
  },
  {
    slug: "customs-clearance",
    title: "Customs Clearance",
    short:
      "Our customs clearance services simplify import and export procedures through accurate documentation and regulatory compliance. We ensure smooth, hassle-free cargo movement across borders.",
    body: [
      "Our customs clearance services simplify complex import and export procedures. We manage documentation, duty assessment, and regulatory compliance to ensure smooth border clearance.",
      "Jnros Logistics works closely with customs authorities to minimize delays and avoid unnecessary penalties. Our team stays updated with changing regulations and trade requirements.",
      "We handle clearance for a wide range of cargo types, including general goods, project cargo, and specialized shipments. Accuracy and transparency guide every transaction.",
      "By streamlining customs processes, we help clients achieve faster cargo release and uninterrupted supply chain operations.",
    ],
    image: photo("customs-clearance.avif", "Inspector with a clipboard beside an open cargo container", 740, 492),
  },
  {
    slug: "project-and-heavy-cargo",
    title: "Project and Heavy Cargo",
    short:
      "We manage complex project and heavy cargo logistics with detailed planning and specialized equipment. From oversized machinery to industrial shipments, we deliver safe and precise execution.",
    body: [
      "Jnros Logistics specializes in managing complex project and heavy cargo logistics for industrial and infrastructure projects. We handle oversized, overweight, and high-value cargo with detailed planning.",
      "Our services include route surveys, equipment selection, lifting coordination, and transportation planning to ensure safe and efficient execution. Each project is managed with precision.",
      "We coordinate with multiple stakeholders, including ports, carriers, and authorities, to ensure seamless execution from origin to destination.",
      "With proven expertise and specialized handling capabilities, we deliver project and heavy cargo solutions that meet the highest standards of safety, accuracy, and reliability.",
    ],
    image: photo("project-and-heavy-cargo.avif", "Trucks and workers at a busy container port", 740, 415),
  },
].map((o, i) => offering("/services", i + 1, o));

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

/* ------------------------------------------------------------------------ */
/* Page heroes and shared photography                                        */
/* ------------------------------------------------------------------------ */

export const pageImages = {
  about: photo("geared-bulk-carrier.jpg", "Geared bulk carrier moored at an industrial berth", 1600, 800),
  solutions: photo("column-loadout.png", "Process column on modular trailers at the quayside, beneath a ship's cranes", 1024, 576),
  services: photo("air-cargo-loading.jpg", "Cargo being loaded into the nose of a freighter aircraft at sunset", 1500, 857),
  gallery: photo("excavator-transport.jpeg", "Excavator loaded on a low-bed trailer", 1280, 960),
  contact: photo("container-truck-highway.jpg", "Container truck on an open highway", 1500, 818),
  cta: photo("container-terminal-dusk.avif", "Container ship under gantry cranes at dusk", 740, 493),
  notFound: photo("hero-port-aerial.jpg", "Aerial view of a container port", 1500, 999),
};

/** "Our Recent Works": the photos on the live gallery page. */
export const recentWorks: Img[] = [
  photo("recent-work-01.jpeg", "Mining dump truck lifted by a ship's crane at night", 478, 640),
  photo("recent-work-02.jpeg", "Row of yellow mining dump trucks parked on site", 320, 240),
  photo("recent-work-03.jpeg", "Mining dump trucks lashed on a barge deck", 640, 480),
  photo("recent-work-04.jpeg", "Mining dump trucks lined up on a barge beside the hull", 640, 480),
  photo("recent-work-05.jpeg", "Barge carrying a row of mining dump trucks on a river", 640, 480),
  photo("recent-work-06.jpeg", "Dump truck secured on a barge deck", 640, 480),
  photo("recent-work-07.jpeg", "Mining dump trucks on a barge under way", 640, 480),
  photo("recent-work-08.jpeg", "Worker standing beside mining dump trucks on a barge", 640, 480),
  photo("recent-work-09.jpeg", "Mining dump trucks secured on a barge deck", 640, 480),
];

/* ------------------------------------------------------------------------ */
/* Home                                                                      */
/* ------------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Project Cargo · Breakbulk · ODC · Heavy Lift",
  lines: ["Engineered", "Logistics for", "Complex Cargo"],
  intro: site.description,
  slides: [
    { image: photo("hero-container-ship-port.jpg", "Container ship berthed beneath gantry cranes", 1500, 1000), caption: "Delivering Precision Across Global Trade Routes" },
    { image: photo("hero-transformer-transport.jpeg", "Transformer carried on a multi-axle hydraulic trailer along a highway", 1600, 900), caption: "Engineered Logistics Without Boundaries" },
    { image: photo("hero-port-aerial.jpg", "Aerial view of a container port with a ship heading out to sea", 1500, 999), caption: "Moving Industrial Cargo, Powering Progress" },
    { image: photo("hero-vessel-transport.jpeg", "Industrial vessel loaded on a multi-axle trailer", 1280, 720), caption: "Where Technical Expertise Meets Global Reach" },
  ],
};

export const stats = [
  { value: 15, suffix: "+", eyebrow: "Location", label: "Countries", detail: "Serving key global trade routes across multiple countries." },
  { value: 200, suffix: "+", eyebrow: "Completed", label: "Projects", detail: "Successfully executing complex logistics and cargo operations." },
  { value: 50, suffix: "+", eyebrow: "Storage", label: "Warehouses", detail: "Secure and strategically located facilities supporting seamless distribution." },
  { value: 40, suffix: "+", eyebrow: "Dedicated", label: "Professionals", detail: "A skilled team committed to safe, efficient, and reliable logistics solutions." },
] as const;

/** The two counters beside the About text (home and About page). */
export const aboutCounters = [
  { value: 200, suffix: "+", label: "Clients" },
  { value: 26, suffix: "", label: "Experience" },
] as const;

export const aboutIntro = {
  heading: "About Us",
  paragraphs: [
    "Jnros Logistics is a specialized logistics partner with strong expertise in Project Cargo, EPC logistics, Breakbulk, ODC, and Heavy Lift operations. While we provide international air and ocean freight services, our core strength lies in handling complex, oversized, and heavy-duty industrial cargo across major global trade routes.",
    "We deliver secure and time-sensitive cargo movements through international air freight, global air charter operations, and ocean transport—with particular focus on Breakbulk shipments, Out-of-Gauge (OOG) cargo, Over Dimensional Cargo (ODC), heavy lift consignments, and multi-package project movements. Every shipment is engineered with precision, ensuring technical compliance and operational efficiency.",
  ],
  image: photo("pressure-vessel-transport.jpg", "Pressure vessel on a multi-axle modular trailer", 792, 594),
};

export const specialised = {
  heading: "We Are Specialised In...",
  text: "Delivering expert solutions in ODC, break bulk, Ro-Ro, and bulk carrier shipping, along with structured global air and sea freight management. We handle complex cargo movements with precision, safety, and global coordination. Specialized maritime logistics for oversized, non-containerized, and bulk commodity cargo, integrated with dependable air freight solutions for time-critical shipments. Engineered planning and seamless execution across global trade routes.",
};

export const offers = {
  heading: "Jnros Logistics Offers",
  paragraphs: [
    "Jnros Logistics provides specialized project logistics solutions for oversized, high-value, and technically demanding cargo movements, complemented by efficient international air freight and ocean freight coordination. We manage every phase of the project with detailed planning, route analysis, and coordinated execution to ensure safe and timely delivery across sea, air, and land.",
    "Our team works closely with clients, carriers, ports, regulatory authorities, and global air and ocean partners to handle complex transportation challenges with precision. From initial assessment to final placement, we focus on operational efficiency, risk control, and complete visibility—ensuring every project is executed with confidence and reliability.",
  ],
};

export const servicesIntro = {
  heading: "Our Services",
  text: "Jnros Logistics provides comprehensive logistics solutions designed to meet diverse global transportation needs. From international air and ocean freight to overland transport, warehousing, customs clearance, and specialized project and heavy cargo handling, we ensure seamless coordination at every stage. With a strong focus on safety, compliance, and timely delivery, our services are tailored to support efficient supply chain operations across industries and borders.",
};

export const whyChooseUs = {
  heading: "Why Choose Us",
  paragraphs: [
    "Jnros Logistics delivers engineered logistics solutions across sea, air, and inland transport, with a strong focus on Project Cargo, Breakbulk, ODC, and Heavy Lift movements also providing structured air freight and ocean freight forwarding services. Supported by customs clearance, transport engineering, and specialized cargo handling, we ensure safe, compliant, and time-bound execution from origin to final destination.",
    "With proven expertise in heavy industrial and high-value shipments, our experienced team and global network manage complex cargo operations with precision and structured coordination. Choosing Jnros Logistics means technical reliability, transparent communication, and complete confidence in every movement.",
  ],
};

export const spaces = {
  heading: "About Our Spaces",
  subheading: "Seamless Logistics Across Sea, Air & Land",
  items: [
    {
      title: "Global and Local Expertise",
      icon: "Globe",
      text: "Our team is equipped with the knowledge to manage international compliance and local nuances, providing you with a truly global solution that understands local contexts.",
    },
    {
      title: "Integrated Logistics Services",
      icon: "Network",
      text: "We manage all aspects of transportation and logistics, offering end-to-end solutions that reduce costs and improve delivery times.",
    },
    {
      title: "Customized Service Offerings",
      icon: "SlidersHorizontal",
      text: "Tailored to meet the specific needs of your business, our services ensure that your cargo is handled efficiently, safely, and in compliance with all regulations.",
    },
  ] satisfies Feature[],
};

/** "Sea, Air & Land": the three transport modes, each pointing at the service that covers it. */
export const routeModes = [
  { mode: "Sea", icon: "Ship", service: getService("international-ocean-freight")! },
  { mode: "Air", icon: "Plane", service: getService("international-air-freight")! },
  { mode: "Land", icon: "Truck", service: getService("overland-transport")! },
] satisfies { mode: string; icon: IconName; service: Offering }[];

export const cta = {
  title: "Elevate Your Logistics Experience",
  text: "Embrace the efficiency of Jnros Logistics, where global expertise meets local execution. Contact us today to see how we can transform your logistical operations into a seamless, integrated process.",
  button: { label: "Contact Us Today", href: "/contact" },
};

/* ------------------------------------------------------------------------ */
/* About                                                                     */
/* ------------------------------------------------------------------------ */

export const about = {
  title: "Welcome to Jnros Logistics",
  intro: [
    "Jnros Logistics is a specialized logistics partner with strong expertise in Project Cargo, EPC logistics, Breakbulk, ODC, and Heavy Lift operations along with comprehensive international air freight and ocean freight services. While we provide international air and ocean freight services, our core strength lies in handling complex, oversized, and heavy-duty industrial cargo across major global trade routes.",
    aboutIntro.paragraphs[1],
  ],
  sections: [
    {
      heading: "Breakbulk, ODC, Heavy Lift & Air–Ocean Freight Capabilities",
      paragraphs: [
        "Our operational expertise covers the complete spectrum of Project and Heavy Cargo logistics, including vessel chartering (part and full charter), engineered stowage planning, and lashing supervision along with integrated international ocean freight and air freight coordination for both containerized and specialized cargo movements. We manage port handling, stevedoring coordination, route surveys, and transport engineering to ensure safe execution of complex cargo movements.",
        "With capabilities such as multi-axle hydraulic trailer mobilization, barge operations for coastal and river transport, and structured risk assessment with cargo insurance coordination, we deliver technically sound and operationally secure logistics solutions for high-value industrial consignments.",
      ],
      image: photo("heavy-lift-port.jpg", "Heavy component lifted with a spreader frame at a port", 600, 401),
    },
    {
      heading: "Specialized Support for EPC & Industrial Clients",
      paragraphs: [
        "We understand the schedule sensitivity and execution standards required by EPC contractors, turbine manufacturers, heavy engineering companies, oil & gas operators, renewable energy developers, and infrastructure project owners.",
        "Our team is experienced in handling steam and gas turbine components, generators, rotors, transformers, boilers, pressure vessels, heat exchangers, structural modules, plant machinery, and large industrial skids. We align logistics execution with project timelines, ensuring zero disruption to construction and commissioning schedules.",
      ],
      image: aboutIntro.image,
    },
    {
      heading: "End-to-End Project Execution",
      paragraphs: [
        "Jnros Logistics provides complete logistics planning from factory-to-foundation delivery, including site coordination and just-in-time (JIT) execution strategies. We follow milestone-based shipment planning supported by a dedicated project logistics control team along with integrated coordination of air freight and ocean freight movements to ensure seamless multimodal execution.",
        "With 24/7 monitoring, reporting systems, and proactive coordination, we ensure full visibility and accountability at every stage of cargo movement.",
      ],
      image: photo("container-ship-quay.jpg", "Container ship moored at a quay", 596, 1000),
    },
    {
      heading: "Inland & Global Connectivity",
      paragraphs: [
        "Our inland transport division supports seamless connectivity using specialized ODC trailers, hydraulic axle systems, escort arrangements, and statutory compliance management including state-wise movement permissions, while being strategically integrated with our global air freight and ocean freight network for end-to-end supply chain continuity.",
        "Backed by a strong global agency network, Jnros Logistics delivers reliable, compliant, and technically engineered logistics solutions—whether for routine freight forwarding or highly complex Breakbulk, Project Cargo, ODC, and Heavy Duty Industrial shipments, which remain our primary business focus.",
      ],
      image: photo("global-network.avif", "Aircraft, ship and truck in front of a globe, representing a global logistics network", 740, 423),
    },
  ],
  features: [
    {
      title: "Vast Industry Experience",
      icon: "Award",
      text: "Jnros Logistics is backed by experienced professionals specializing in Project Cargo, Breakbulk, ODC, and Heavy Lift logistics. Our expertise in international air freight, ocean freight operations, customs compliance, and complex cargo handling ensures efficient, reliable, and technically sound execution worldwide.",
    },
    {
      title: "Worldwide Network",
      icon: "Globe",
      text: "Our strong global partner network enables seamless coordination of Project and Heavy Industrial shipments across major trade routes, ensuring controlled transit timelines and dependable service delivery.",
    },
    {
      title: "Comprehensive Capabilities",
      icon: "Layers",
      text: "Across sea, air, and inland transport, we provide end-to-end solutions with a core focus on Breakbulk, ODC, Heavy Lift, and Project Cargo movements, supported by engineered planning and precise operational control with integrated global air freight and ocean freight management services.",
    },
  ] satisfies Feature[],
  commitment: {
    heading: "The Commitment That Drives Jnros Logistics",
    paragraphs: [
      "At Jnros Logistics, our commitment is centered on delivering engineered logistics solutions for Project Cargo, Breakbulk, ODC, and Heavy Lift movements with absolute precision and reliability, complemented by dependable international air freight and ocean freight services. Every assignment is approached with detailed planning, technical evaluation, and strict adherence to safety and regulatory standards.",
      "By combining deep industry expertise, strong global partnerships, and a dedicated project logistics team, we manage complex cargo movements seamlessly across sea, air, and inland corridors. Our focus on transparency, risk control, and time-bound execution enables us to support critical industrial and infrastructure projects while building long-term partnerships based on trust, performance, and consistency.",
    ],
  },
  mission: [
    "To deliver reliable, engineered, and time-critical logistics solutions in Project Cargo, Breakbulk, ODC, and Heavy Lift transportation, with efficient international air and ocean freight services, ensuring precision execution, operational safety, and seamless global coordination.",
    "We are committed to supporting EPC contractors, industrial manufacturers, and infrastructure developers with technically sound planning, risk-controlled execution, and complete end-to-end project logistics management.",
  ],
  vision: [
    "To be a globally trusted logistics partner recognized for excellence in Project Cargo and Heavy Industrial Transportation, while strengthening our presence in international air and ocean freight services, setting industry benchmarks in safety, engineering precision, compliance, and on-time performance.",
    "We aim to build long-term partnerships by consistently delivering complex cargo solutions with integrity, innovation, and operational excellence across international trade routes.",
  ],
  whyChooseUs: {
    heading: "Why Choose Us...",
    items: [
      {
        title: "End-to-End Logistics Solutions",
        icon: "Route",
        text: "Comprehensive services covering air, ocean, land, warehousing, customs, and specialized cargo under one trusted partner.",
      },
      {
        title: "Expertise in Complex Cargo",
        icon: "ShieldCheck",
        text: "Proven capability in handling dangerous goods, oversized, and heavy project cargo with strict safety and regulatory compliance.",
      },
      {
        title: "Global Reach with Local Precision",
        icon: "Globe",
        text: "A worldwide network supported by regional expertise ensures efficient execution and on-time delivery.",
      },
      {
        title: "Commitment to Reliability",
        icon: "Handshake",
        text: "We prioritize safety, transparency, and timely delivery, ensuring confidence and consistency in every shipment.",
      },
    ] satisfies Feature[],
  },
};

/* ------------------------------------------------------------------------ */
/* Contact                                                                   */
/* ------------------------------------------------------------------------ */

export const contact = {
  title: "Contact us",
  intro: "Have a question or an idea? We’re here to listen! Reach out to Jnros Logistics and let’s build something amazing together.",
};

/* ------------------------------------------------------------------------ */
/* Navigation                                                                */
/* ------------------------------------------------------------------------ */

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Solutions",
    href: "/solutions",
    mega: {
      eyebrow: "Jnros Logistics Solution",
      headline: specialised.heading,
      description: "Delivering expert solutions in ODC, break bulk, Ro-Ro, and bulk carrier shipping, along with structured global air and sea freight management.",
      image: pageImages.solutions,
      cta: { label: "All solutions", href: "/solutions" },
      links: solutions.map((s) => ({ label: s.title, href: s.href, description: s.short, image: s.image })),
    },
  },
  {
    label: "Services",
    href: "/services",
    mega: {
      eyebrow: "Our Services",
      headline: servicesIntro.heading,
      description: "Jnros Logistics provides comprehensive logistics solutions designed to meet diverse global transportation needs.",
      image: pageImages.services,
      cta: { label: "All services", href: "/services" },
      links: services.map((s) => ({ label: s.title, href: s.href, description: s.short, image: s.image })),
    },
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export const footerColumns = [
  { title: "Jnros Logistics Solution", links: solutions.map((s) => ({ label: s.title, href: s.href })) },
  { title: "Our Services", links: services.map((s) => ({ label: s.title, href: s.href })) },
];
