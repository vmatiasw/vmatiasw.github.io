import React, { useState } from "react";
import type { Skills as SkillsType } from "@/cv-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinux } from "@fortawesome/free-brands-svg-icons";
import {
  faCode,
  faDatabase,
  faLeaf,
  faProjectDiagram,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import CV from "@cv";

const iconMap: Record<string, any> = {
  language: faCode,
  database: faDatabase,
  linux: faLinux,
  tools: faProjectDiagram,
  network: faNetworkWired,
  framework: faLeaf,
  library: faLeaf,
  default: faCode,
};

interface Props {
  skills: SkillsType;
}

const SkillsMenu: React.FC<Props> = ({ skills }) => {
  const [selectedSkills, setSelectedSkills] = useState(() =>
    (skills.languages || []).reduce((acc: Record<string, boolean>, skill) => {
      acc[skill.name] = true;
      return acc;
    }, {}),
  );

  const toggleSkill = (skills: SkillsType) => {
    setSelectedSkills((prevSelectedSkills = {}) => {
      const skill = skills.languages?.[0];
      if (!skill) {
        return prevSelectedSkills;
      }
      const skillName = skill.name;
      const isSelected = !prevSelectedSkills[skillName];
      if (isSelected) {
        console.log(`Adding skill: ${skillName}`);
        // CV.addSkills(skills);
      } else {
        console.log(`Removing skill: ${skillName}`);
        // CV.removeSkills(skills);
      }
      return {
        ...prevSelectedSkills,
        [skillName]: isSelected,
      };
    });
  };

  return (
    <ul className="inline-flex flex-wrap gap-4 print:mt-4 [&>li>svg]:text-skin-hue [&>li]:text-sm">
      {skills.languages?.map(({ name, icon }, index) => {
        const isSelected = selectedSkills?.[name] ?? false;
        return (
          <li
            key={index}
            className={`flex items-center gap-1 rounded-md border border-solid px-1 py-0.5 text-xs print:border-none print:bg-transparent print:p-0 print:text-zinc-800 ${
              isSelected
                ? "border-skin-hue/20 bg-skin-button-accent/20 text-skin-hue"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
            onClick={() =>
              toggleSkill({ languages: [{ name: name, icon: icon }] })
            }
            style={{ cursor: "pointer" }}
          >
            {icon && (
              <FontAwesomeIcon
                icon={iconMap[icon] || iconMap.default}
                className="text-skin-hue"
                width={16}
                height={16}
              />
            )}
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SkillsMenu;
