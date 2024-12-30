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

interface CVSkill extends NameAndIcon {
  name: string;
  icon: string;
  classId: string;
}
interface CVLanguage extends CVSkill {
  technologies?: string[];
}
type SkillMap = { [name: string]: CVSkill };
type LanguageMap = { [name: string]: CVLanguage };

interface CVSkills {
  languages: LanguageMap;
  tools: SkillMap;
}

class CVRepository implements CV {
  public basics: Basics = dataSource.basics;
  public work: Work[] = dataSource.work;
  public education: Education[] = dataSource.education;
  public projects: Projects[] = dataSource.projects;
  private skills: CVSkills = this.collectAllSkills();

  public get languages(): CVLanguage[] {
    return Object.values(this.skills.languages);
  }

  public languageTecnologies(language: CVLanguage): string[] | null {
    if (!language.technologies) {
      return null;
    }
    return language.technologies;
  }

  public get tools(): CVSkill[] {
    return Object.values(this.skills.tools);
  }

  public createFilterID(type: string, name: string): string {
    return `${type}:${name.replace(/\s+/g, "-")}`.toLowerCase();
  }

  public getFilterClassNames(skills: Skills): string {
    const mapSkillClassIds = (
      skillMap: SkillMap,
      skillList: NameAndIcon[] = [],
    ) => skillList.map((skill) => skillMap[skill.name].classId) || [];

    const mapLanguagesClassIds = (
      skillMap: LanguageMap,
      skillList: Language[] = [],
    ) =>
      skillList.map((skill) => {
        const langClassId = skillMap[skill.name].classId;
        if (skill.technologies) {
          return [
            langClassId,
            ...skill.technologies.map((tech) =>
              this.createFilterID(`${langClassId}-technologies`, tech),
            ),
          ].join(" ");
        }
        return langClassId;
      });

    const toolsClassId = mapSkillClassIds(this.skills.tools, skills.tools);

    const languagesClassId = mapLanguagesClassIds(
      this.skills.languages,
      skills.languages,
    );

    return [...languagesClassId, ...toolsClassId, "skill-filter-item"].join(
      " ",
    );
  }

  // ------------------------- Private -------------------------
  private collectAllSkills(): CVSkills {
    const allSkills: CVSkills = { languages: {}, tools: {} };

    [this.work, this.education, this.projects].forEach((items) =>
      this.aggregateSkills(allSkills, items),
    );

    return allSkills;
  }

  private aggregateSkills(
    skills: CVSkills,
    items: Array<Work | Education | Projects>,
  ): void {
    items.forEach((item) => {
      this.addSkillsToCategory(
        skills.languages || {},
        item.skills?.languages,
        "languages",
      );
      this.addSkillsToCategory(skills.tools || {}, item.skills?.tools, "tools");
    });
  }

  private addSkillsToCategory(
    target: SkillMap,
    source: NameAndIcon[] = [],
    category: string,
  ): void {
    source.forEach((skill) => {
      if (target[skill.name]) {
        const existingSkill = target[skill.name];
        if (existingSkill) {
          this.mergeSkillProperties(existingSkill, skill);
        }
      } else {
        const cvSkill: CVSkill = {
          ...skill,
          classId: this.createFilterID(category, skill.name),
        };
        target[skill.name] = cvSkill;
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
const cvRepository = new CVRepository();
export { cvRepository as CV };
