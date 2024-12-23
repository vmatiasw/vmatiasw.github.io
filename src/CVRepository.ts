import type { CV, Basics, Work, Education, Skills, Projects } from "./cv.d.ts";
import fs from "fs";
const dataSource = JSON.parse(fs.readFileSync("./cv.json", "utf-8"));

class CVRepository implements CV {
  public basics: Basics = dataSource.basics;
  public work: Work[] = dataSource.work;
  public education: Education[] = dataSource.education;
  public projects: Projects[] = dataSource.projects;
  public skills: Skills = this.calculateSkills();

  private calculateSkills(): Skills {
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
      const languages = item.skills?.languages || [];
      const tools = item.skills?.tools || [];
      const soft = item.skills?.soft || [];

      languages.forEach((language) => {
        const lang = skills?.languages?.find(
          (lang) => lang.name === language.name,
        );
        if (lang) {
          lang.frameworks = Array.from(
            new Set([
              ...(lang.frameworks || []),
              ...(language.frameworks || []),
            ]),
          );

          lang.standardLibraries = Array.from(
            new Set([
              ...(lang.standardLibraries || []),
              ...(language.standardLibraries || []),
            ]),
          );

          lang.thirdPartyLibraries = Array.from(
            new Set([
              ...(lang.thirdPartyLibraries || []),
              ...(language.thirdPartyLibraries || []),
            ]),
          );

          lang.tools = Array.from(
            new Set([...(lang.tools || []), ...(language.tools || [])]),
          );
        } else {
          skills.languages?.push(language);
        }
      });

      tools.forEach((tool) => {
        if (!skills.tools?.find((t) => t.name === tool.name)) {
          skills.tools?.push(tool);
        }
      });

      soft.forEach((soft) => {
        if (!skills.soft?.find((s) => s.name === soft.name)) {
          skills.soft?.push(soft);
        }
      });
    });
  }
}

export default new CVRepository();
