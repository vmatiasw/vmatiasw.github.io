interface CV {
  basics: Basics;
  work: Work[];
  education: Education[];
  projects: Projects[];
}
interface ToProcess {
  summary: string;
  body?: any //Record<string, string[]>;
  details?: any //Record<string, string[]>;
  skillNames?: string[];
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
interface Network {
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
  profiles: Network[];
  contacts: Network[];
}
interface Work extends ToProcess {
  name: string;
  position?: string;
  url?: string;
  startDate: string;
  endDate?: string;
  location: string;
  location_type: string;
}
interface Education extends ToProcess {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score: number;
}
interface Project extends ToProcess {
  name: string;
  url?: string;
  github?: string;
  image?: string;
}

export type {
  CV,
  ToProcess,
  Location,
  SpeakLanguage,
  Network,
  WebSite,
  Basics,
  Work,
  Education,
  Project,
};
