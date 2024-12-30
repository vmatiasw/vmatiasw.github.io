import type {
  CV,
  Basics,
  Work,
  Education,
  Skills,
  Projects,
  NameAndIcon,
  Language,
} from "./cv-types";
import fs from "fs";

const dataSource: CV = JSON.parse(fs.readFileSync("./cv.json", "utf-8"));

type CVSkill = NameAndIcon;
type CVLanguage = Language;
type SkillMap = { [name: string]: CVSkill };
type LanguageMap = { [name: string]: CVLanguage };

interface CVSkills {
  languages: LanguageMap;
  tools: SkillMap;
}

class CVRepository implements CV {
  public readonly basics: Basics;
  public readonly work: Work[];
  public readonly education: Education[];
  public readonly projects: Projects[];
  private skills: CVSkills;

  constructor(data: CV) {
    this.basics = data.basics;
    this.work = data.work;
    this.education = data.education;
    this.projects = data.projects;
    this.skills = this.collectAllSkills();
  }

  public get skillLanguages(): CVLanguage[] {
    return Object.values(this.skills.languages);
  }

  public getLanguageTecnologies(language: CVLanguage): string[] | null {
    if (!language.technologies) {
      return null;
    }
    return [...language.technologies];
  }

  public get skillTools(): CVSkill[] {
    return Object.values(this.skills.tools);
  }

  public createFilterID(type: string, name: string): string {
    return `${type}:${name.replace(/\s+/g, "-")}`.toLowerCase();
  }

  public getFilterClassNames(skills: Skills): string {
    const toolsClassId =
      skills.tools?.map((skill) => this.createFilterID("tools", skill.name)) ||
      [];

    const languagesClassId =
      skills.languages?.map((skill) => {
        const langClassId = this.createFilterID("languages", skill.name);
        if (skill.technologies) {
          return [
            langClassId,
            ...skill.technologies.map((tech) =>
              this.createFilterID(`${langClassId}-technologies`, tech),
            ),
          ].join(" ");
        }
        return langClassId;
      }) || [];

    return [...languagesClassId, ...toolsClassId, "skill-filter-item"].join(
      " ",
    );
  }

  // ------------------------- Private -------------------------
  private collectAllSkills(): CVSkills {
    const allSkills: CVSkills = { languages: {}, tools: {} };

    const source: Skills[] = [
      ...this.work.map((item) => ({ ...item.skills })),
      ...this.education.map((item) => ({ ...item.skills })),
      ...this.projects.map((item) => ({ ...item.skills })),
    ];

    source.forEach((skill) => {
      this.addSkillsToCategory(allSkills.languages, skill.languages);
      this.addSkillsToCategory(allSkills.tools, skill.tools);
    });

    return allSkills;
  }

  private addSkillsToCategory(
    target: SkillMap,
    source: NameAndIcon[] = [],
  ): void {
    source.forEach((skill) => {
      if (target[skill.name]) {
        const existingSkill = { ...target[skill.name] };
        this.mergeSkillProperties(existingSkill, skill);
        target[skill.name] = existingSkill;
      } else {
        target[skill.name] = { ...skill };
      }
    });
  }

  private mergeSkillProperties(target: any, source: any): void {
    Object.keys(source).forEach((key) => {
      if (Array.isArray(source[key])) {
        target[key] = [...new Set([...(target[key] || []), ...source[key]])];
      } else {
        target[key] = source[key];
      }
    });
  }
}
// This instance of CVRepository is created once during the build process.
// The data is pre-calculated and included in the static files, improving performance.
const cvRepository = new CVRepository(dataSource);
export { cvRepository as CV };

// console.assert(
//   JSON.stringify(dataSource) === fs.readFileSync("./cv.json", "utf-8"),
//   "El objeto dataSource fue modificado.",
// );
