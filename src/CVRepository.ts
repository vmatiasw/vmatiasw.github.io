import type {
  CV,
  Basics,
  Work,
  Education,
  Skills,
  Projects,
  NameAndIcon,
} from "./cv-types";
import fs from "fs";
const dataSource: CV = JSON.parse(fs.readFileSync("./cv.json", "utf-8"));

class CVRepository implements CV {
  public basics: Basics = dataSource.basics;
  private _work: Work[] = dataSource.work;
  private _education: Education[] = dataSource.education;
  private _projects: Projects[] = dataSource.projects;
  public skills: Skills = this.extractSkills();
  private selectedSkills: Skills = structuredClone(this.skills);

  public get work(): Work[] {
    return this._work;
  }

  public get education(): Education[] {
    return this._education;
  }

  public get projects(): Projects[] {
    return this._projects;
  }

  public removeAllSkills(): void {
    this.selectedSkills = {
      languages: [],
      tools: [],
      soft: [],
    };
  }

  public addAllSkills(): void {
    this.selectedSkills = structuredClone(this.skills);
  }

  public addSkills(skills: Skills): void {
    this.mergeSkills(this.selectedSkills.languages || [], skills.languages || []);
    this.mergeSkills(this.selectedSkills.tools || [], skills.tools || []);
    this.mergeSkills(this.selectedSkills.soft || [], skills.soft || []);
  }

  public removeSkills(skills: Skills): void {
    this.removeSkillsFromList(this.selectedSkills.languages || [], skills.languages || []);
    this.removeSkillsFromList(this.selectedSkills.tools || [], skills.tools || []);
    this.removeSkillsFromList(this.selectedSkills.soft || [], skills.soft || []);
  }

  // ------------------------- Private -------------------------
  private removeSkillsFromList(target: NameAndIcon[], source: NameAndIcon[]): void {
    source.forEach((skill) => {
      const existingSkill = target.find((s) => s.name === skill.name);
      if (existingSkill) {
        this.removeSkill(existingSkill, skill);
      }
    });
  }

  private removeSkill(target: any, source: any): void {
    Object.keys(source).forEach((key) => {
      if (Array.isArray(source[key])) {
        target[key] = target[key].filter((item: any) => !source[key].includes(item));
      } else {
        delete target[key];
      }
    });
  }

  private extractSkills(): Skills {
    const skills: Skills = {
      languages: [],
      tools: [],
      soft: [],
    };

    this.collectSkillsFromItems(skills, this._work);
    this.collectSkillsFromItems(skills, this._education);
    this.collectSkillsFromItems(skills, this._projects);

    return skills;
  }

  private collectSkillsFromItems(
    skills: Skills,
    items: Array<Work | Education | Projects>,
  ): void {
    items.forEach((item) => {
      this.mergeSkills(skills.languages || [], item.skills?.languages);
      this.mergeSkills(skills.tools || [], item.skills?.tools);
      this.mergeSkills(skills.soft || [], item.skills?.soft);
    });
  }

  private mergeSkills(target: NameAndIcon[], source: NameAndIcon[] = []): void {
    source.forEach((skill) => {
      const existingSkill = target.find((s) => s.name === skill.name);
      if (existingSkill) {
        this.mergeSkill(existingSkill, skill);
      } else {
        target.push(skill);
      }
    });
  }

  private mergeSkill(target: any, source: any): void {
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
export default new CVRepository();
