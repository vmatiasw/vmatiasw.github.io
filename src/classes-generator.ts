import type { Skills } from "./cv-types";

export const SKILL_FILTER_CLASS: string = "skill-filterer";

export function getclassId(type: string, name: string): string {
  return type.toLowerCase() + ":" + name.toLowerCase().replace(/\s+/g, "-");
}

export function getSkillsClassIds(skills: Skills): string {
  const languages: string[] =
    skills.languages?.map((skill) => getclassId("languages", skill.name)) || [];

  const tools = skills.tools
  ?.map((skill) => getclassId("tools", skill.name)) || [];

  // const soft = skills.soft
  // ?.map((skill) => getclassId("soft", skill.name)) || [];, ...soft
  
  return [...languages, ...tools].join(" ");
}
