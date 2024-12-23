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
  public work: Work[] = dataSource.work;
  public education: Education[] = dataSource.education;
  public projects: Projects[] = dataSource.projects;
  public skills: Skills = this.extractSkills();

  // ------------------------- Private -------------------------
  private extractSkills(): Skills {
    const skills: Skills = {
      languages: [],
      tools: [],
      soft: [],
    };

    this.extendSkills(skills, this.work);
    this.extendSkills(skills, this.education);
    this.extendSkills(skills, this.projects);

    return skills;
  }

  private extendSkills(
    skills: Skills,
    items: Array<Work | Education | Projects>,
  ): void {
    items.forEach((item) => {
      this.addSkills(skills.languages || [], item.skills?.languages);
      this.addSkills(skills.tools || [], item.skills?.tools);
      this.addSkills(skills.soft || [], item.skills?.soft);
    });
  }

  private addSkills(target: NameAndIcon[], source: NameAndIcon[] = []): void {
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
