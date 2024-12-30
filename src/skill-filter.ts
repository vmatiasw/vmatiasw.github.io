import type { Skills } from "./cv-types";

export function createFilterID(type: string, name: string): string {
  return `${type}:${name.replace(/\s+/g, "-")}`.toLowerCase();
}

export function getFilterClassNames(skills: Skills): string {
  const toolsClassId =
    skills.tools?.map((skill) => createFilterID("tools", skill.name)) || [];

  const languagesClassId =
    skills.languages?.map((skill) => {
      const langClassId = createFilterID("languages", skill.name);
      if (skill.technologies) {
        return [
          langClassId,
          ...skill.technologies.map((tech) =>
            createFilterID(`${langClassId}-technologies`, tech),
          ),
        ].join(" ");
      }
      return langClassId;
    }) || [];

  return [...languagesClassId, ...toolsClassId, "skill-filter-item"].join(" ");
}
