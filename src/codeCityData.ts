export type ProjectCategory = "AI" | "Web" | "Extension" | "Game" | "Security" | "Portfolio";
export type ProjectStatus = "Live" | "GitHub" | "Demo" | "Offline";

export type PortfolioProjectInput = {
  id: string;
  title: string;
  repoName: string;
  type: string;
  status: ProjectStatus;
  categories: ProjectCategory[];
  description: string;
  tech: string[];
  features: string[];
  github: string;
  live?: string;
};

export type CodeCityTheme = "day" | "night" | "cyberpunk" | "winter" | "matrix" | "glass" | "minimal";
export type CodeCityPerformance = "ultra" | "high" | "balanced" | "low";
export type CodeCityLayer =
  | "buildings"
  | "districts"
  | "roads"
  | "dependencies"
  | "labels"
  | "language"
  | "complexity"
  | "security"
  | "database"
  | "deployment";

export type FileRole =
  | "entry"
  | "component"
  | "api"
  | "database"
  | "utility"
  | "test"
  | "asset"
  | "config"
  | "docs"
  | "deployment"
  | "class"
  | "security";

export type CityIssue = {
  severity: "low" | "medium" | "high" | "critical";
  label: string;
};

export type CityFile = {
  id: string;
  folderId: string;
  name: string;
  path: string;
  type: string;
  language: string;
  role: FileRole;
  linesOfCode: number;
  fileSize: number;
  functions: string[];
  classes: string[];
  imports: string[];
  dependencies: string[];
  complexity: number;
  security: number;
  performance: number;
  maintainability: number;
  issues: CityIssue[];
  status: "stable" | "active" | "risky" | "new";
  x: number;
  y: number;
};

export type CityFolder = {
  id: string;
  name: string;
  label: string;
  category: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  files: CityFile[];
};

export type CityConnection = {
  id: string;
  from: string;
  to: string;
  type: "import" | "api" | "database" | "http" | "deployment" | "security";
  intensity: number;
};

export type CodeCityProject = {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  github: string;
  live?: string;
  category: string;
  status: ProjectStatus;
  lastUpdated: string;
  folders: CityFolder[];
  files: CityFile[];
  connections: CityConnection[];
  dependencies: string[];
  metrics: {
    totalFiles: number;
    totalLines: number;
    securityScore: number;
    performanceScore: number;
    maintainabilityScore: number;
    complexityScore: number;
    gdp: number;
  };
};

const languageColors: Record<string, string> = {
  Python: "#4da3ff",
  JavaScript: "#f7d95c",
  TypeScript: "#68d8ff",
  CSS: "#65d889",
  HTML: "#ff9f6e",
  SQL: "#a783ff",
  PHP: "#ffac5f",
  JSON: "#ff6f7d",
  Markdown: "#cad6e2",
  Docker: "#58c8ff",
  SVG: "#b9c2cc",
};

const folderBlueprints = [
  { id: "core", name: "src", label: "Core Hub", category: "Entry", x: -140, y: -74, width: 280, depth: 164 },
  { id: "frontend", name: "src/ui", label: "Frontend District", category: "Interface", x: -565, y: -246, width: 350, depth: 232 },
  { id: "backend", name: "src/api", label: "Backend District", category: "Services", x: 214, y: -246, width: 350, depth: 232 },
  { id: "data", name: "src/data", label: "Database District", category: "Persistence", x: 258, y: 52, width: 304, depth: 232 },
  { id: "quality", name: "tests", label: "Tests District", category: "Quality", x: -565, y: 88, width: 318, depth: 218 },
  { id: "deploy", name: "deploy", label: "Deployment District", category: "Release", x: -142, y: 190, width: 334, depth: 214 },
  { id: "assets", name: "public", label: "Assets District", category: "Media", x: 250, y: 300, width: 312, depth: 180 },
] as const;

const pickLanguage = (project: PortfolioProjectInput, role: FileRole) => {
  if (role === "database") return "SQL";
  if (role === "asset") return "SVG";
  if (role === "docs") return "Markdown";
  if (role === "deployment") return "Docker";
  if (role === "config") return "JSON";
  if (role === "security") return project.tech.includes("Python") ? "Python" : "TypeScript";
  if (project.tech.includes("Python") || project.tech.includes("FastAPI")) return role === "component" ? "TypeScript" : "Python";
  if (project.tech.includes("PHP")) return "PHP";
  if (project.tech.includes("TypeScript") || project.tech.includes("React") || project.tech.includes("Next.js")) return "TypeScript";
  if (project.tech.includes("JavaScript") || project.tech.includes("Extension")) return "JavaScript";
  return "TypeScript";
};

const extForLanguage = (language: string, role: FileRole) => {
  if (role === "docs") return "md";
  if (role === "asset") return "svg";
  if (role === "database") return "sql";
  if (role === "deployment") return "yml";
  if (role === "security") return language === "Python" ? "py" : "ts";
  if (language === "Python") return "py";
  if (language === "PHP") return "php";
  if (language === "CSS") return "css";
  if (language === "HTML") return "html";
  if (language === "JSON") return "json";
  if (role === "component") return "tsx";
  return "ts";
};

const slugPart = (value: string) => value.replace(/[^a-z0-9]+/gi, " ").trim();

const pascal = (value: string) => slugPart(value)
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1).toLowerCase()}`)
  .join("");

const camel = (value: string) => {
  const name = pascal(value);
  return `${name[0]?.toLowerCase() ?? "x"}${name.slice(1)}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const scoreProject = (project: PortfolioProjectInput, kind: "security" | "performance" | "maintainability" | "complexity") => {
  const base = 78 + (project.features.length * 2) + (project.tech.length % 4);
  const statusBoost = project.status === "Live" ? 5 : project.status === "Offline" ? 2 : 0;
  const securityBoost = project.categories.includes("Security") ? 8 : project.tech.includes("MV3") ? 5 : 0;
  const aiPenalty = project.categories.includes("AI") && kind === "complexity" ? 8 : 0;
  const extensionBoost = project.categories.includes("Extension") && kind === "performance" ? 5 : 0;

  if (kind === "security") return clamp(base + securityBoost - (project.categories.includes("Game") ? 4 : 0), 62, 98);
  if (kind === "performance") return clamp(base + statusBoost + extensionBoost, 66, 99);
  if (kind === "maintainability") return clamp(base + (project.categories.includes("Portfolio") ? 5 : 0), 64, 98);
  return clamp(38 + project.tech.length * 5 + project.features.length * 3 + aiPenalty, 34, 92);
};

const issueForFile = (role: FileRole, security: number, complexity: number): CityIssue[] => {
  const issues: CityIssue[] = [];
  if (security < 72) {
    issues.push({ severity: security < 64 ? "critical" : "high", label: "Security review required" });
  }
  if (role === "api" && security < 84) {
    issues.push({ severity: "medium", label: "Harden request validation" });
  }
  if (complexity > 76) {
    issues.push({ severity: "medium", label: "Large module complexity" });
  }
  if (role === "database" && security < 86) {
    issues.push({ severity: "high", label: "Database flow needs audit" });
  }
  if (role === "security" && security < 88) {
    issues.push({ severity: "medium", label: "Security tower wants stronger policy checks" });
  }
  return issues;
};

const createFile = (
  project: PortfolioProjectInput,
  folder: (typeof folderBlueprints)[number],
  role: FileRole,
  index: number,
  xOffset: number,
  yOffset: number,
): CityFile => {
  const language = pickLanguage(project, role);
  const stem = role === "entry"
    ? "main"
    : role === "docs"
      ? "README"
      : role === "deployment"
        ? "pipeline"
        : role === "asset"
          ? `${camel(project.title)}Logo`
          : `${camel(project.title)}${pascal(role)}${index}`;
  const extension = extForLanguage(language, role);
  const name = role === "docs" ? "README.md" : role === "deployment" ? "deploy.pipeline.yml" : `${stem}.${extension}`;
  const path = role === "docs" ? name : `${folder.name}/${name}`;
  const categoryWeight = project.categories.length * 22;
  const techWeight = project.tech.length * 16;
  const roleWeight = {
    entry: 260,
    component: 340,
    api: 310,
    database: 180,
    utility: 230,
    test: 150,
    asset: 80,
    config: 120,
    docs: 90,
    deployment: 130,
    class: 290,
    security: 220,
  }[role];
  const linesOfCode = clamp(roleWeight + categoryWeight + techWeight + index * 37, 54, 980);
  const complexity = clamp(scoreProject(project, "complexity") + index * 3 - (role === "docs" ? 22 : 0), 18, 96);
  const security = clamp(scoreProject(project, "security") - (role === "api" ? 7 : role === "database" ? 5 : 0) + (role === "test" ? 8 : role === "security" ? 11 : 0), 52, 99);
  const performance = clamp(scoreProject(project, "performance") - (linesOfCode > 620 ? 7 : 0), 55, 99);
  const maintainability = clamp(scoreProject(project, "maintainability") - (complexity > 74 ? 8 : 0), 58, 99);
  const functionBase = camel(project.title);
  const fileId = `${project.id}-${folder.id}-${role}-${index}`;

  return {
    id: fileId,
    folderId: `${project.id}-${folder.id}`,
    name,
    path,
    type: role === "component" ? "UI component" : role === "api" ? "API route" : role === "security" ? "Security module" : role,
    language,
    role,
    linesOfCode,
    fileSize: clamp(Math.round(linesOfCode / 7), 8, 150),
    functions: [
      `${functionBase}${pascal(role)}Init`,
      `${functionBase}${pascal(role)}Sync`,
      `${functionBase}${pascal(role)}Report`,
    ].slice(0, role === "asset" || role === "docs" ? 1 : 3),
    classes: role === "class" || role === "component" ? [`${pascal(project.title)}${pascal(role)}`] : [],
    imports: [],
    dependencies: project.tech.slice(0, 4),
    complexity,
    security,
    performance,
    maintainability,
    issues: issueForFile(role, security, complexity),
    status: linesOfCode > 700 ? "active" : security < 72 ? "risky" : index % 5 === 0 ? "new" : "stable",
    x: folder.x + xOffset,
    y: folder.y + yOffset,
  };
};

const connect = (files: CityFile[], fromRole: FileRole, toRole: FileRole, type: CityConnection["type"], intensity = 1): CityConnection[] => {
  const from = files.find((file) => file.role === fromRole);
  const to = files.find((file) => file.role === toRole);
  if (!from || !to) return [];
  from.imports.push(to.path);
  return [{ id: `${from.id}-${to.id}-${type}`, from: from.id, to: to.id, type, intensity }];
};

const connectFiles = (from: CityFile | undefined, to: CityFile | undefined, type: CityConnection["type"], intensity = 1): CityConnection[] => {
  if (!from || !to) return [];
  from.imports.push(to.path);
  return [{ id: `${from.id}-${to.id}-${type}`, from: from.id, to: to.id, type, intensity }];
};

export const getLanguageColor = (language: string) => languageColors[language] ?? "#9da8b5";

export const buildCodeCities = (projects: PortfolioProjectInput[]): CodeCityProject[] => {
  return projects.map((project, projectIndex) => {
    const folderMap = folderBlueprints.map((folder) => ({
      ...folder,
      id: `${project.id}-${folder.id}`,
      files: [] as CityFile[],
    }));

    const byBlueprint = (id: string) => folderMap.find((folder) => folder.id === `${project.id}-${id}`)!;
    const core = folderBlueprints[0];
    const frontend = folderBlueprints[1];
    const backend = folderBlueprints[2];
    const data = folderBlueprints[3];
    const quality = folderBlueprints[4];
    const deploy = folderBlueprints[5];
    const assets = folderBlueprints[6];

    const generatedFiles = [
      createFile(project, core, "entry", 0, 138, 82),
      createFile(project, core, "docs", 1, 42, 34),
      createFile(project, core, "security", 2, 220, 42),

      createFile(project, frontend, "component", 3, 72, 62),
      createFile(project, frontend, "component", 4, 188, 76),
      createFile(project, frontend, "utility", 5, 96, 164),
      createFile(project, frontend, "asset", 6, 268, 158),

      createFile(project, backend, "api", 7, 72, 68),
      createFile(project, backend, "api", 8, 190, 82),
      createFile(project, backend, project.categories.includes("AI") ? "class" : "utility", 9, 112, 166),
      createFile(project, backend, "config", 10, 254, 160),

      createFile(project, data, "database", 11, 78, 78),
      createFile(project, data, "database", 12, 198, 94),
      createFile(project, data, "class", 13, 142, 162),

      createFile(project, quality, "test", 14, 72, 72),
      createFile(project, quality, "test", 15, 188, 84),
      createFile(project, quality, "utility", 16, 128, 152),

      createFile(project, deploy, project.status === "Live" || project.status === "Demo" ? "deployment" : "config", 17, 70, 74),
      createFile(project, deploy, "deployment", 18, 198, 88),
      createFile(project, deploy, "config", 19, 132, 154),

      createFile(project, assets, "asset", 20, 76, 58),
      createFile(project, assets, "asset", 21, 194, 72),
      createFile(project, assets, "docs", 22, 120, 132),

      createFile(project, core, "utility", 23, 42, 126),
      createFile(project, core, "component", 24, 142, 132),
      createFile(project, core, "config", 25, 228, 126),

      createFile(project, frontend, "component", 26, 270, 64),
      createFile(project, frontend, "component", 27, 42, 150),
      createFile(project, frontend, "utility", 28, 196, 166),

      createFile(project, backend, "api", 29, 270, 70),
      createFile(project, backend, project.categories.includes("AI") ? "class" : "utility", 30, 210, 166),

      createFile(project, data, "database", 31, 74, 166),
      createFile(project, data, "utility", 32, 238, 166),

      createFile(project, quality, "test", 33, 62, 154),
      createFile(project, quality, "docs", 34, 238, 152),

      createFile(project, deploy, "config", 35, 260, 150),
      createFile(project, deploy, "deployment", 36, 278, 70),

      createFile(project, assets, "asset", 37, 250, 122),
    ];

    generatedFiles.forEach((file) => {
      byBlueprint(file.folderId.replace(`${project.id}-`, "")).files.push(file);
    });

    const byIndex = (index: number) => generatedFiles[index];
    const connections = [
      ...connect(generatedFiles, "entry", "component", "import", 1.2),
      ...connect(generatedFiles, "entry", "api", "api", 1.5),
      ...connect(generatedFiles, "api", "database", "database", 1.4),
      ...connect(generatedFiles, "component", "asset", "http", 0.8),
      ...connect(generatedFiles, "api", project.categories.includes("AI") ? "class" : "utility", "import", 1.1),
      ...connect(generatedFiles, "test", "api", "import", 0.7),
      ...connect(generatedFiles, project.status === "Live" || project.status === "Demo" ? "deployment" : "config", "entry", "deployment", 1.1),
      ...connectFiles(byIndex(0), byIndex(4), "import", 1.15),
      ...connectFiles(byIndex(0), byIndex(8), "api", 1.35),
      ...connectFiles(byIndex(2), byIndex(7), "security", 1),
      ...connectFiles(byIndex(2), byIndex(11), "security", 0.9),
      ...connectFiles(byIndex(3), byIndex(5), "import", 0.8),
      ...connectFiles(byIndex(4), byIndex(6), "http", 0.75),
      ...connectFiles(byIndex(7), byIndex(12), "database", 1.2),
      ...connectFiles(byIndex(8), byIndex(13), "database", 1),
      ...connectFiles(byIndex(9), byIndex(10), "import", 0.85),
      ...connectFiles(byIndex(14), byIndex(7), "import", 0.75),
      ...connectFiles(byIndex(15), byIndex(8), "import", 0.75),
      ...connectFiles(byIndex(16), byIndex(14), "import", 0.65),
      ...connectFiles(byIndex(18), byIndex(17), "deployment", 1.15),
      ...connectFiles(byIndex(19), byIndex(18), "deployment", 0.9),
      ...connectFiles(byIndex(20), byIndex(3), "http", 0.7),
      ...connectFiles(byIndex(21), byIndex(4), "http", 0.7),
      ...connectFiles(byIndex(22), byIndex(1), "import", 0.55),
      ...connectFiles(byIndex(23), byIndex(0), "import", 0.75),
      ...connectFiles(byIndex(24), byIndex(0), "import", 0.85),
      ...connectFiles(byIndex(25), byIndex(2), "security", 0.7),
      ...connectFiles(byIndex(26), byIndex(3), "import", 0.9),
      ...connectFiles(byIndex(27), byIndex(5), "import", 0.7),
      ...connectFiles(byIndex(28), byIndex(4), "http", 0.72),
      ...connectFiles(byIndex(29), byIndex(31), "database", 1),
      ...connectFiles(byIndex(30), byIndex(8), "import", 0.8),
      ...connectFiles(byIndex(31), byIndex(13), "database", 0.82),
      ...connectFiles(byIndex(32), byIndex(12), "database", 0.75),
      ...connectFiles(byIndex(33), byIndex(7), "import", 0.62),
      ...connectFiles(byIndex(34), byIndex(22), "import", 0.5),
      ...connectFiles(byIndex(35), byIndex(18), "deployment", 0.8),
      ...connectFiles(byIndex(36), byIndex(17), "deployment", 0.95),
      ...connectFiles(byIndex(37), byIndex(21), "http", 0.58),
    ];

    const securityScore = scoreProject(project, "security");
    const performanceScore = scoreProject(project, "performance");
    const maintainabilityScore = scoreProject(project, "maintainability");
    const complexityScore = scoreProject(project, "complexity");
    const totalLines = generatedFiles.reduce((total, file) => total + file.linesOfCode, 0);

    return {
      id: project.id,
      name: project.title,
      description: project.description,
      techStack: project.tech,
      github: project.github,
      live: project.live,
      category: project.categories[0] ?? "Web",
      status: project.status,
      lastUpdated: `2026-07-${String(9 + (projectIndex % 18)).padStart(2, "0")}`,
      folders: folderMap,
      files: generatedFiles,
      connections,
      dependencies: Array.from(new Set(project.tech)),
      metrics: {
        totalFiles: generatedFiles.length,
        totalLines,
        securityScore,
        performanceScore,
        maintainabilityScore,
        complexityScore,
        gdp: Math.round((securityScore + performanceScore + maintainabilityScore + (100 - complexityScore)) / 4),
      },
    };
  });
};
