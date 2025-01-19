import type {
  CV,
  Basics,
  Work,
  Education,
  Project,
  ToProcessSkills,
} from "@/cv-types";
import { createID, capitalize } from "@/data-helpers";
import cvData from "data/cv.json";
import skillsData from "data/skills.json";

const SKILL_PATTERN = /#\{(.*?)\}/g; // Matches #{word} in text
const SKILL_NAMES = extractSkillNames(skillsData);

interface NamedEntity {
  icon?: string;
  name: string;
  [key: string]: any;
}

interface ProgrammingLanguage extends NamedEntity {
  technologies?: string[];
}

interface SkillSet {
  languages?: ProgrammingLanguage[];
  tools?: NamedEntity[];
}

type S<T> = T & { skills: SkillSet };

class CVProcessor implements CV {
  public basics: Basics = cvData.basics;
  public work: S<Work>[] = processSkillData(cvData.work);
  public education: S<Education>[] = processSkillData(cvData.education);
  public projects: S<Project>[] = processSkillData(cvData.projects);
  public skills: SkillSet = aggregateSkills([
    ...cvData.work,
    ...cvData.education,
    ...cvData.projects,
  ]);
}

// This instance of CVProcessor is created once during the build process.
// The data is pre-calculated and included in the static files, improving performance.
const cvProcessor = new CVProcessor();
export { cvProcessor as CV };
export type { SkillSet, NamedEntity };

function extractSkillNames(data: any): Set<string> {
  const skillNames = new Set<string>();

  function traverseNames(obj: any): void {
    if (typeof obj === "object" && obj !== null) {
      if ("name" in obj && typeof obj.name === "string") {
        skillNames.add(obj.name.toLowerCase());
      }
      Object.values(obj).forEach(traverseNames);
    } else if (Array.isArray(obj)) {
      obj.forEach(traverseNames);
    }
  }

  traverseNames(data);
  return skillNames;
}

function processSkillData<T>(items: (ToProcessSkills & T)[]): S<T>[] {
  const processText = (text: string) =>
    text.replace(SKILL_PATTERN, (match, skillName:string) => {
      return SKILL_NAMES.has(skillName.toLowerCase())
        ? `<em 
            data-checked="false" 
            class="dynamic-child child-${createID(skillName)}">
            ${capitalize(skillName)}
          </em>`
        : skillName;
    });

  const processRecordText = (body: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(body).map(([title, content]) => [
        processText(title),
        Array.isArray(content) ? content.map(processText) : content,
      ]),
    );

  return items.map((item) => ({
    ...item,
    skills: aggregateSkills([item]),
    summary: processText(item.summary),
    body: processRecordText(item.body || {}),
    details: processRecordText(item.details || {}),
  }));
}

function aggregateSkills(items: ToProcessSkills[]): SkillSet {
  const skillsFromText = new Set(
    items
      .flatMap((item) => [
        item.summary,
        ...Object.entries({ ...item.body, ...item.details }).flatMap(
          ([title, content]) => [title, ...content],
        ),
      ])
      .flatMap((text) =>
        (text.match(SKILL_PATTERN) ?? []).map((match) =>
          match.replace(SKILL_PATTERN, "$1").toLowerCase(),
        ),
      ),
  );

  return Object.entries(skillsData).reduce(
    (acc: SkillSet, [category, skills]) => {
      const filteredSkills = skills.filter((skill) =>
        skillsFromText.has(skill.name.toLowerCase()),
      );
      if (filteredSkills.length > 0) {
        acc[category as keyof SkillSet] = filteredSkills;
      }
      return acc;
    },
    {},
  );
}
