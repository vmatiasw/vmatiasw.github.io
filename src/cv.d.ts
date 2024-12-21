export interface CV {
  basics: Basics;
  work: Array<Work>;
  // volunteer: Array<Volunteer>;
  education: Array<Education>;
  // awards: Array<Awards>;
  // certificates: Array<Certificates>;
  // publications: Array<Publications>;
  skills: Array<Skills>;
  languages: Array<Languages>;
  projects: Array<Projects>;
}

interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  profiles: Array<Profiles>;
}

interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

interface Profiles {
  icon: string;
  network: string;
  username: string;
  url: string;
}

interface Work {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: Highlight;
}

interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: Highlight;
}

interface Skills {
  icon: string;
  name: string;
  keywords: Array<string>;
}

interface Awards {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface Certificates {
  name: string;
  date: string;
  issuer: string;
  url: string;
}

interface Publications {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

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

interface Projects {
  name: string;
  isActive: boolean;
  description: string;
  highlights: Highlight;
  url: string;
  github?: string;
}

interface Interests {
  name: string;
  keywords: Array<string>;
}

interface References {
  name: string;
  reference: string;
}

type Highlight = Array<String>;
