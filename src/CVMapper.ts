import type {
  CV,
  Basics,
  Work,
  Education,
  Project,
  ToProcessTexts,
} from "@/cv-types";
import {
  createIDFromText,
  capitalize,
  getPurgedObject,
  collectNestedKeyValues,
  mapObjectFields,
  extractUniqueMatches,
} from "@/data-helpers";
import cvData from "data/cv.json";
import skillsData from "data/skills.json";

const SKILL_PATTERN = /#\{(.*?)\}/g; // Matches #{text} in text
const STRONG_PATTERN = /!\{(.*?)\}/g; // Matches !{text} in text
const LINK_PATTERN = /&\{(.*?) - (.*?)\}/g; // Matches &{text-link} in text

const PROCESSED_SKILL_PATTERN =
  /<em[^>]*dynamic-child[^>]*>\\n\s*(.*?)\\n\s*<\/em>/g;
const SKILL_NAMES = collectNestedKeyValues(skillsData, "name");

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
}

type S<T> = T & { skills: SkillSet };

class CVProcessor implements CV {
  public basics: Basics = cvData.basics;
  public work: S<Work>[] = processItems(cvData.work);
  public education: S<Education>[] = processItems(cvData.education);
  public projects: S<Project>[] = processItems(cvData.projects);
  public skills: SkillSet = extractSkillsFromTexts([
    ...cvData.work,
    ...cvData.education,
    ...cvData.projects,
  ]);
}

// This instance of CVProcessor is created once during the build process.
// The data is pre-calculated and included in the static files, improving performance.
const cvProcessor = new CVProcessor();
export { cvProcessor as CV, PROCESSED_SKILL_PATTERN };
export type { SkillSet, NamedEntity };

function processItems<T>(items: (ToProcessTexts & T)[]): S<T>[] {
  const formatSkills = (text: string) =>
    text.replace(SKILL_PATTERN, (match, skillName: string) => {
      if (SKILL_NAMES.has(skillName.toLowerCase()))
        return `<em 
            data-selected="false" 
            class="${createIDFromText(skillName, "child-", undefined, "dynamic-child")}">
            ${capitalize(skillName)}
          </em>`;
      else {
        console.warn(`\x1b[33mUnknown skill: ${skillName}\x1b[0m`);
        return skillName;
      }
    });
  const formatLinks = (text: string) =>
    text.replace(LINK_PATTERN, (match, text: string, link: string) => {
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
    text.replace(STRONG_PATTERN, (match, text: string) => {
      return `<strong>${text}</strong>`;
    });

  const formatText = (text: string) =>
    [formatStrong, formatSkills, formatLinks].reduce(
      (acc, fn) => fn(acc),
      text,
    );

  return items.map((item) => ({
    ...item,
    skills: extractSkillsFromTexts([item]),
    summary: formatText(item.summary),
    body: mapObjectFields(item.body || {}, formatText),
    details: mapObjectFields(item.details || {}, formatText),
  }));
}

function extractSkillsFromTexts(items: ToProcessTexts[]): SkillSet {
  const textSkills = extractUniqueMatches(
    SKILL_PATTERN,
    JSON.stringify(
      items.flatMap((item) => [item.summary, item.body, item.details]),
    ),
  );

  const purgeCondition = (obj: any) =>
    "name" in obj && !textSkills.has(obj.name.toLowerCase());

  const skills = getPurgedObject(skillsData, purgeCondition);

  // Check for unknown skills
  const resultSkills = new Set(collectNestedKeyValues(skills, "name"));
  const diff = [...textSkills].filter((x) => !resultSkills.has(x));
  console.assert(diff.length == 0, `\x1b[33mUnknown skills: ${diff}\x1b[0m`);

  return skills;
}
