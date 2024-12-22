import type {
  CV,
  Basics,
  Work,
  Education,
  Skills,
  Languages,
  Projects,
} from "./cv.d.ts";
import fs from "fs";
const dataSource = JSON.parse(fs.readFileSync("./cv.json", "utf-8"));

class CVRepository implements CV {
  public basics: Basics = dataSource.basics;
  public work: Array<Work> = dataSource.work;
  public education: Array<Education> = dataSource.education;
  public skills: Array<Skills> = dataSource.skills;
  public languages: Array<Languages> = dataSource.languages;
  public projects: Array<Projects> = dataSource.projects;
}

export default new CVRepository();
