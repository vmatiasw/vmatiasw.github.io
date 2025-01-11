import type { CV, Basics, Work, Education, Skills, Projects } from "@/cv-types";
import fs from "fs";

const dataSource: CV = JSON.parse(fs.readFileSync("./cv.json", "utf-8"));

interface CVSkill {
  name: string;
  [key: string]: any;
}

type CVSkills = Skills;
class CVRepository implements CV {
  public readonly basics: Basics;
  public readonly work: Work[];
  public readonly education: Education[];
  public readonly projects: Projects[];
  public readonly workSkills: CVSkills;
  public readonly educationSkills: CVSkills;
  public readonly projectsSkills: CVSkills;
  public readonly skills: CVSkills;

  constructor(data: CV) {
    this.basics = data.basics;
    this.work = data.work;
    this.education = data.education;
    this.projects = data.projects;
    this.workSkills = this.collectAllSkills([data.work]);
    this.educationSkills = this.collectAllSkills([data.education]);
    this.projectsSkills = this.collectAllSkills([data.projects]);
    this.skills = this.collectAllSkills([
      data.work,
      data.education,
      data.projects,
    ]);
  }

  // ------------------------- Private -------------------------
  private collectAllSkills(
    source: (Work | Education | Projects)[][],
  ): CVSkills {
    const collectedSkills: CVSkills = { languages: [], tools: [] };

    const skillsSource: Skills[] = source.flatMap((subArray) =>
      subArray.map((item) => ({ ...item.skills })),
    );

    skillsSource.forEach((skill) => {
      this.mergeSkills(collectedSkills.languages, skill.languages);
      this.mergeSkills(collectedSkills.tools, skill.tools);
    });

    return collectedSkills;
  }

  private mergeSkills(
    target: CVSkill[] = [],
    sourceSkills: CVSkill[] = [],
  ): void {
    const targetMap: Map<string, CVSkill> = new Map(
      target.map((skill) => [skill.name, skill]),
    );
    sourceSkills.forEach((skill) => {
      const existingSkill = targetMap.get(skill.name);
      if (existingSkill) {
        const updatedSkill = { ...existingSkill };
        this.mergeSkillProperties(updatedSkill, skill);
        targetMap.set(skill.name, updatedSkill);
      } else {
        targetMap.set(skill.name, { ...skill });
      }
    });
    target.length = 0;
    target.push(...Array.from(targetMap.values()));
  }

  private mergeSkillProperties(
    targetSkill: CVSkill,
    sourceSkill: CVSkill,
  ): void {
    Object.keys(sourceSkill).forEach((key) => {
      if (Array.isArray(sourceSkill[key])) {
        targetSkill[key] = [
          ...new Set([...(targetSkill[key] || []), ...sourceSkill[key]]),
        ];
      } else {
        targetSkill[key] = sourceSkill[key];
      }
    });
  }
}
// This instance of CVRepository is created once during the build process.
// The data is pre-calculated and included in the static files, improving performance.
const cvRepository = new CVRepository(dataSource);
export { cvRepository as CV };
