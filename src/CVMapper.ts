import type {
  CV,
  Basics,
  Work,
  Education,
  Project,
  ToProcess,
} from "@/cv-types";
import {
  getFilteredObject,
  collectNestedKeyValues,
  mapObjectFields,
} from "@/data-helpers";
import cvData from "data/cv.json";
import skillsData from "data/skills.json";

const STRONG_PATTERN = /!\{(.*?)\}/g; // Matches !{text} in text
const LINK_PATTERN = /&\{(.*?) - (.*?)\}/g; // Matches &{text-link} in text

interface NamedEntity {
  icon?: string;
  name: string;
  [key: string]: any;
}

interface ProgrammingLanguage extends NamedEntity {
  technologies?: NamedEntity[];
}

interface SkillSet {
  languages?: ProgrammingLanguage[];
  tools?: NamedEntity[];
  databases?: NamedEntity[];
}

type S<T> = T & { skills: SkillSet };

class CVProcessor implements CV {
  public basics: Basics = cvData.basics;
  public work: S<Work>[] = processItems(cvData.work);
  public education: S<Education>[] = processItems(cvData.education);
  public projects: S<Project>[] = processItems(cvData.projects);
  public skills: SkillSet = skillsData;
}

// This instance of CVProcessor is created once during the build process.
// The data is pre-calculated and included in the static files, improving performance.
const cvProcessor = new CVProcessor();
export { cvProcessor as CV };
export type { SkillSet, NamedEntity };

function processItems<T>(items: (ToProcess & T)[]): S<T>[] {
  const formatLinks = (text: string) =>
    text.replace(LINK_PATTERN, (_, text: string, link: string) => {
      return `<a 
          href="${link}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn-text"
          title="Visit ${text}"
          aria-label="Visit ${text}">
            ${text}
        </a>`;
    });
  const formatStrong = (text: string) =>
    text.replace(STRONG_PATTERN, (_, text: string) => {
      return `<strong>${text}</strong>`;
    });

  const formatText = (text: string) =>
    [formatStrong, formatLinks].reduce((acc, fn) => fn(acc), text);

  return items.map((item) => ({
    ...item,
    skills: extractSkills([item]),
    summary: formatText(item.summary),
    body: mapObjectFields(item.body || {}, formatText),
    details: mapObjectFields(item.details || {}, formatText),
  }));
}

function extractSkills(items: ToProcess[]): SkillSet {
  const textSkills = new Set(
    items.flatMap(
      (item) => item.skillNames?.map((value) => value.toLowerCase()) || [],
    ),
  );
  if (textSkills.size === 0) return {};

  const skills = getFilteredObject(skillsData, (obj) =>
    textSkills.has(obj.name.toLowerCase()),
  );

  // Check for unknown skills
  const allSkills = new Set(collectNestedKeyValues(skills, "name"));
  const diff = [...textSkills].filter((x) => !allSkills.has(x));
  console.assert(diff.length == 0, `\x1b[33mUnknown skills: ${diff}\x1b[0m`);

  return skills;
}
