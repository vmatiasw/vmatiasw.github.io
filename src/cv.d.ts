export interface CV {
  basics: Basics;
  work: Array<Work>;
  education: Array<Education>;
  projects: Array<Projects>;
}

// ------------------------- Common -------------------------

interface nameAndIcon {
  name: string;
  icon: string;
}

interface Language extends nameAndIcon {
  frameworks?: string[];
  standardLibraries?: string[];
  thirdPartyLibraries?: string[];
  tools?: string[];
}
interface Skills {
  languages?: Language[];
  tools?: nameAndIcon[];
  soft?: nameAndIcon[];
}

interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
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
  languages: Array<SpeakLanguage>;
  profiles: Array<Profile>;
}

interface SpeakLanguage {
  language: string;
  proficiency: "basic" | "intermediate" | "advanced" | "native";
}

interface Profile {
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
  highlights: string[];
  responsibilities: string[];
  achievements: string[];
  skills: Skills;
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
  skills: Skills;
  courses: string[];
}
// ------------------------- Projects -------------------------
interface Projects {
  name: string;
  isActive: boolean;
  description: string;
  skills: Skills;
  highlights: Array<string>;
  url: string;
  github?: string;
  image: Image;
}
interface Image {
  url: string;
  position: string;
}
