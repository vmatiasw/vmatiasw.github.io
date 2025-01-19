interface CV {
  basics: Basics;
  work: Work[];
  education: Education[];
  projects: Projects[];
}
interface ToProcessTexts {
  summary: string;
  body?: Record<string, string[]>;
  details?: Record<string, string[]>;
}
interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}
interface SpeakLanguage {
  language: string;
  fluency: string;
}
interface Profile {
  icon: string;
  network: string;
  url: string;
}
interface WebSite {
  description: string;
  url: string;
}
interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  website: WebSite;
  printMessage: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  languages: SpeakLanguage[];
  profiles: Profile[];
}
interface Work extends ToProcessTexts {
  name: string;
  position?: string;
  url?: string;
  startDate: string;
  endDate?: string;
  location: string;
  location_type: string;
}
interface Education extends ToProcessTexts {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score: number;
  courses: string[];
}
interface Project extends ToProcessTexts {
  name: string;
  url?: string;
  github?: string;
  image?: string;
}

export type {
  CV,
  ToProcessTexts,
  Location,
  SpeakLanguage,
  Profile,
  WebSite,
  Basics,
  Work,
  Education,
  Project,
};
