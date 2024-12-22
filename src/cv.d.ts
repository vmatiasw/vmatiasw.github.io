export interface CV {
  basics: Basics;
  work: Array<Work>;
  education: Array<Education>;
  skills: Array<Skills>;
  projects: Array<Projects>;
}

// ------------------------- Common -------------------------

type Highlight = Array<String>;

interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

interface Skills {
  icon: string;
  name: string;
  keywords: Array<string>;
}

// ------------------------- Basics -------------------------
interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  languages: Array<Languages>;
  profiles: Array<Profiles>;
}

interface Languages {
  language: Language;
  fluency: string;
}

type Language =
  | "Spanish"
  | "English"
  | "German"
  | "France"
  | "Italian"
  | "Korean"
  | "Portuguese"
  | "Chinese"
  | "Arabic"
  | "Dutch"
  | "Finnish"
  | "Russian"
  | "Turkish"
  | "Hindi"
  | "Bengali"
  | string;

interface Profiles {
  icon: string;
  network: string;
  username: string;
  url: string;
}

// ------------------------- Work -------------------------

interface Work {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: Highlight;
  responsibilities: Array<string>;
  achievements: Array<string>;
  skills: Record<string, string>;
  location: string;
  location_type: string;
}

// ------------------------- Education -------------------------
interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string | null;
  score: int;
  courses: Array<string>;
}
// ------------------------- Projects -------------------------
interface Projects {
  name: string;
  isActive: boolean;
  description: string;
  highlights: Highlight;
  url: string;
  github?: string;
  image: Image;
}
interface Image {
  url: string;
  position: string;
}
