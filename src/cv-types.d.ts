export interface CV {
  basics: Basics;
  work: Work[];
  education: Education[];
  projects: Projects[];
}

// ------------------------- Common -------------------------

export interface NameAndIcon {
  name: string;
  icon: string;
}

export interface Language extends NameAndIcon {
  frameworks?: string[];
  standardLibraries?: string[];
  thirdPartyLibraries?: string[];
  tools?: string[];
}
export interface Skills {
  languages?: Language[];
  tools?: NameAndIcon[];
  soft?: NameAndIcon[];
}

export interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

// ------------------------- Basics -------------------------
export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  languages: SpeakLanguage[];
  profiles: Profile[];
}

export interface SpeakLanguage {
  language: string;
  proficiency: "basic" | "intermediate" | "advanced" | "native";
}

export interface Profile {
  icon: string;
  network: string;
  username: string;
  url: string;
}

// ------------------------- Work -------------------------

export interface Work {
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
export interface Education {
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
export interface Projects {
  name: string;
  isActive: boolean;
  description: string;
  skills: Skills;
  highlights: string[];
  url: string;
  github?: string;
  image?: string;
}