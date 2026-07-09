import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  buildCodeCities,
  getLanguageColor,
  type CityConnection,
  type CityFile,
  type CodeCityLayer,
  type CodeCityPerformance,
  type CodeCityProject,
  type PortfolioProjectInput,
} from "./codeCityData";

type SortMode = "name" | "size" | "score" | "newest";

type QualityConfig = {
  pixelRatio: number;
  shadows: boolean;
  windows: boolean;
  maxWindows: number;
};

type CodeCityRefs = {
  root: HTMLElement;
  shell: HTMLElement;
  stage: HTMLElement;
  tooltip: HTMLElement;
  hudTitle: HTMLElement;
  hudFiles: HTMLElement;
  hudFolders: HTMLElement;
  hudLines: HTMLElement;
  hudScore: HTMLElement;
  hudSecurity: HTMLElement;
  repoSearch: HTMLInputElement;
  repoFilter: HTMLSelectElement;
  repoSort: HTMLSelectElement;
  repoList: HTMLElement;
  repoStats: HTMLElement;
  layerControls: HTMLElement;
  fullscreenButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  qualitySelect: HTMLSelectElement;
  modal: HTMLElement;
  modalContent: HTMLElement;
  fallback: HTMLElement;
};

type BuildingRecord = {
  file: CityFile;
  body: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  group: THREE.Group;
  position: THREE.Vector3;
  height: number;
  baseColor: THREE.Color;
};

type RoadRecord = {
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  from?: string;
  to?: string;
  baseColor: THREE.Color;
};

type FlowRecord = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  start: THREE.Vector3;
  end: THREE.Vector3;
  phase: number;
  speed: number;
};

type CodeCityState = {
  cities: CodeCityProject[];
  cityIndex: number;
  layers: Set<CodeCityLayer>;
  performance: CodeCityPerformance;
  search: string;
  filter: string;
  sort: SortMode;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  cityGroup: THREE.Group | null;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  pickables: THREE.Object3D[];
  buildingRecords: Map<string, BuildingRecord>;
  roadRecords: RoadRecord[];
  flowRecords: FlowRecord[];
  hoveredFileId: string;
  selectedFileId: string;
  animationFrame: number;
  resizeObserver: ResizeObserver | null;
  fpsElement: HTMLElement | null;
  frameCount: number;
  fpsStartedAt: number;
  pendingPointerEvent: PointerEvent | null;
  cameraGoal: {
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null;
  reducedMotion: boolean;
};

const qualityOrder: CodeCityPerformance[] = ["ultra", "high", "balanced", "low"];
const qualitySettings: Record<CodeCityPerformance, QualityConfig> = {
  ultra: { pixelRatio: 2, shadows: true, windows: true, maxWindows: 1200 },
  high: { pixelRatio: 1.75, shadows: true, windows: true, maxWindows: 850 },
  balanced: { pixelRatio: 1.35, shadows: false, windows: true, maxWindows: 520 },
  low: { pixelRatio: 1, shadows: false, windows: false, maxWindows: 0 },
};

const defaultLayers: CodeCityLayer[] = [
  "buildings",
  "districts",
  "roads",
  "dependencies",
  "labels",
  "language",
];

const CITY_SCALE = 0.42;
const GROUND_Y = 0;
const DISTRICT_Y = -0.04;
const BUILDING_BASE_Y = 0;
const SCENE_BACKGROUND = 0x05080d;
const SCENE_FOG = 0x05080d;

const roleLabels: Record<string, string> = {
  entry: "Entry tower",
  component: "UI tower",
  api: "Backend tower",
  database: "Data vault",
  utility: "Factory block",
  test: "Lab block",
  asset: "Warehouse",
  config: "Control block",
  docs: "Library block",
  deployment: "Deploy block",
  class: "Office tower",
  security: "Security tower",
};

const connectionLabels: Record<CityConnection["type"], string> = {
  import: "Import path",
  api: "API path",
  database: "Data path",
  http: "HTTP path",
  deployment: "Deployment path",
  security: "Security path",
};

const baseRoleColors: Record<string, string> = {
  entry: "#2f9dff",
  component: "#6bd4ff",
  api: "#3d8dff",
  database: "#8b67ff",
  utility: "#7891aa",
  test: "#7fc8e8",
  asset: "#8c949c",
  config: "#ff6f7d",
  docs: "#cad6e2",
  deployment: "#ffb86b",
  class: "#6ca6d9",
  security: "#ff5e6d",
};

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const currentCity = (state: CodeCityState) => state.cities[state.cityIndex];
const fileById = (city: CodeCityProject, id: string) => city.files.find((file) => file.id === id);
const toWorldX = (value: number) => value * CITY_SCALE;
const toWorldZ = (value: number) => value * CITY_SCALE;

const readPerformance = (): CodeCityPerformance => {
  const saved = localStorage.getItem("code-city-quality");
  return qualityOrder.includes(saved as CodeCityPerformance) ? saved as CodeCityPerformance : "balanced";
};

const makeElement = <T extends HTMLElement>(tag: string, className = "") => {
  const element = document.createElement(tag) as T;
  if (className) element.className = className;
  return element;
};

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child: THREE.Object3D) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material?.dispose();
  });
};

const createShell = (root: HTMLElement): CodeCityRefs => {
  root.innerHTML = `
    <div class="code-city-shell code-city-webgl" data-code-city-shell>
      <div class="code-city-top-hud" aria-live="polite">
        <div>
          <p class="panel-title">repository skyline</p>
          <h3 data-city-title>Code City</h3>
        </div>
        <div class="code-city-metrics">
          <span><b data-city-files>0</b> Files</span>
          <span><b data-city-folders>0</b> Folders</span>
          <span><b data-city-lines>0</b> LOC</span>
          <span><b data-city-score>0</b> Score</span>
          <span><b data-city-security>0</b> Security</span>
        </div>
      </div>

      <div class="code-city-workspace">
        <section class="code-city-canvas-panel">
          <div class="code-city-toolbar" aria-label="Code City controls">
            <button type="button" data-city-fullscreen>Fullscreen</button>
            <button type="button" data-city-reset>Reset Camera</button>
            <label class="code-city-quality">
              <span>Quality</span>
              <select data-city-quality>
                <option value="ultra">Ultra</option>
                <option value="high">High</option>
                <option value="balanced">Balanced</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <div class="code-city-stage" data-city-stage tabindex="0" role="application" aria-label="3D Git City repository skyline">
            <div class="code-city-tooltip" data-city-tooltip hidden></div>
          </div>
          <div class="code-city-layer-control" data-city-layer-controls aria-label="Layer controls"></div>
          <div class="code-city-fallback" data-city-fallback hidden></div>
        </section>

        <aside class="code-city-panel code-city-repo-panel" aria-label="Repository panel">
          <div class="code-city-panel__head">
            <p class="panel-title">repositories</p>
            <span data-city-count></span>
          </div>
          <label class="code-city-field">
            <span>Search repo</span>
            <input data-city-repo-search type="search" placeholder="Project, language, tech" autocomplete="off" />
          </label>
          <label class="code-city-field">
            <span>Filter tech/language</span>
            <select data-city-repo-filter></select>
          </label>
          <label class="code-city-field">
            <span>Sort</span>
            <select data-city-repo-sort>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="score">Score</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <div class="code-city-project-list" data-city-project-list></div>
          <div class="code-city-repo-stats" data-city-repo-stats></div>
        </aside>
      </div>

      <div class="code-city-detail" data-city-modal hidden role="dialog" aria-modal="true" aria-labelledby="city-modal-title">
        <button class="code-city-detail__backdrop" type="button" data-city-modal-close aria-label="Close file details"></button>
        <div class="code-city-detail__panel" data-city-modal-content role="document"></div>
      </div>
    </div>
  `;

  const refs = {
    root,
    shell: root.querySelector<HTMLElement>("[data-code-city-shell]"),
    stage: root.querySelector<HTMLElement>("[data-city-stage]"),
    tooltip: root.querySelector<HTMLElement>("[data-city-tooltip]"),
    hudTitle: root.querySelector<HTMLElement>("[data-city-title]"),
    hudFiles: root.querySelector<HTMLElement>("[data-city-files]"),
    hudFolders: root.querySelector<HTMLElement>("[data-city-folders]"),
    hudLines: root.querySelector<HTMLElement>("[data-city-lines]"),
    hudScore: root.querySelector<HTMLElement>("[data-city-score]"),
    hudSecurity: root.querySelector<HTMLElement>("[data-city-security]"),
    repoSearch: root.querySelector<HTMLInputElement>("[data-city-repo-search]"),
    repoFilter: root.querySelector<HTMLSelectElement>("[data-city-repo-filter]"),
    repoSort: root.querySelector<HTMLSelectElement>("[data-city-repo-sort]"),
    repoList: root.querySelector<HTMLElement>("[data-city-project-list]"),
    repoStats: root.querySelector<HTMLElement>("[data-city-repo-stats]"),
    layerControls: root.querySelector<HTMLElement>("[data-city-layer-controls]"),
    fullscreenButton: root.querySelector<HTMLButtonElement>("[data-city-fullscreen]"),
    resetButton: root.querySelector<HTMLButtonElement>("[data-city-reset]"),
    qualitySelect: root.querySelector<HTMLSelectElement>("[data-city-quality]"),
    modal: root.querySelector<HTMLElement>("[data-city-modal]"),
    modalContent: root.querySelector<HTMLElement>("[data-city-modal-content]"),
    fallback: root.querySelector<HTMLElement>("[data-city-fallback]"),
  };

  if (Object.values(refs).some((value) => value === null)) {
    throw new Error("Code City shell failed to initialize.");
  }

  return refs as CodeCityRefs;
};

const createMaterial = (color: string | THREE.Color, roughness = 0.74, metalness = 0.05) => new THREE.MeshStandardMaterial({
  color,
  roughness,
  metalness,
});

const createRenderer = (refs: CodeCityRefs, state: CodeCityState) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: state.performance !== "low",
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(SCENE_BACKGROUND, 1);
  renderer.shadowMap.enabled = qualitySettings[state.performance].shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  refs.stage.prepend(renderer.domElement);
  state.renderer = renderer;
};

const resizeRenderer = (refs: CodeCityRefs, state: CodeCityState) => {
  if (!state.renderer || !state.camera) return;
  const width = Math.max(320, refs.stage.clientWidth);
  const height = Math.max(320, refs.stage.clientHeight);
  const quality = qualitySettings[state.performance];
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatio));
  state.renderer.setSize(width, height, false);
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
};

const setupScene = (refs: CodeCityRefs, state: CodeCityState) => {
  createRenderer(refs, state);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_BACKGROUND);
  scene.fog = new THREE.Fog(SCENE_FOG, 300, 760);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1600);
  camera.position.set(220, 170, 240);

  const hemi = new THREE.HemisphereLight(0xaedcff, 0x05070b, 1.35);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xc9f2ff, 2.1);
  sun.position.set(90, 220, 120);
  sun.castShadow = qualitySettings[state.performance].shadows;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -260;
  sun.shadow.camera.right = 260;
  sun.shadow.camera.top = 260;
  sun.shadow.camera.bottom = -260;
  scene.add(sun);

  const controls = new OrbitControls(camera, state.renderer!.domElement);
  controls.enableDamping = !state.reducedMotion;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 25);
  controls.minDistance = 105;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.minPolarAngle = Math.PI * 0.16;
  controls.screenSpacePanning = true;
  controls.update();

  state.scene = scene;
  state.camera = camera;
  state.controls = controls;
  resizeRenderer(refs, state);
};

const filePosition = (file: CityFile) => new THREE.Vector3(toWorldX(file.x), BUILDING_BASE_Y, toWorldZ(file.y));

const folderCenter = (folder: CodeCityProject["folders"][number]) => new THREE.Vector3(
  toWorldX(folder.x + folder.width / 2),
  0,
  toWorldZ(folder.y + folder.depth / 2),
);

const folderSize = (folder: CodeCityProject["folders"][number]) => ({
  width: Math.max(28, folder.width * CITY_SCALE),
  depth: Math.max(22, folder.depth * CITY_SCALE),
});

const buildingDimensions = (file: CityFile) => {
  const important = file.role === "entry" || file.security > 92 || file.linesOfCode > 780;
  const baseHeight = clamp(file.linesOfCode * 0.074, 5, 88) * (important ? 1.12 : 1);
  const roleHeight = file.role === "asset" ? 0.42 : file.role === "test" ? 0.62 : file.role === "docs" ? 0.5 : 1;
  const height = clamp(baseHeight * roleHeight, 4, 96);
  const width = clamp(5.2 + file.fileSize * 0.055 + file.complexity * 0.045, 5, file.role === "asset" ? 20 : 16);
  const depth = clamp(5.4 + file.fileSize * 0.05 + file.complexity * 0.04, 5, file.role === "asset" ? 18 : 15);
  return {
    width: file.role === "asset" ? width * 1.4 : width,
    height,
    depth: file.role === "asset" ? depth * 1.15 : depth,
  };
};

const heatColor = (low: string, high: string, amount: number) => {
  const color = new THREE.Color(low);
  color.lerp(new THREE.Color(high), clamp(amount, 0, 1));
  return color;
};

const colorForFile = (file: CityFile, state: CodeCityState) => {
  if (state.layers.has("security")) {
    return heatColor("#14334c", "#ff485c", (88 - file.security) / 34);
  }
  if (state.layers.has("complexity")) {
    return heatColor("#2c9bd6", "#ffb15f", file.complexity / 100);
  }
  if (state.layers.has("language")) {
    return new THREE.Color(getLanguageColor(file.language)).lerp(new THREE.Color("#07131d"), 0.14);
  }
  return new THREE.Color(baseRoleColors[file.role] ?? "#5f86a8");
};

const addRoadSegment = (
  group: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  width: number,
  material: THREE.MeshStandardMaterial,
  state: CodeCityState,
  from?: string,
  to?: string,
) => {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.max(0.1, Math.hypot(dx, dz));
  const geometry = new THREE.BoxGeometry(width, 0.08, length);
  const mesh = new THREE.Mesh(geometry, material.clone());
  const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
  meshMaterial.emissive.copy(meshMaterial.color).multiplyScalar(0.35);
  meshMaterial.emissiveIntensity = 0.42;
  mesh.position.set((start.x + end.x) / 2, 0.05, (start.z + end.z) / 2);
  mesh.rotation.y = Math.atan2(dx, dz);
  mesh.receiveShadow = true;
  group.add(mesh);
  state.roadRecords.push({ mesh, from, to, baseColor: meshMaterial.color.clone() });
};

const addFlowPacket = (
  group: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string,
  state: CodeCityState,
  phase: number,
  speed: number,
) => {
  if (state.performance === "low") return;
  const geometry = new THREE.SphereGeometry(state.performance === "ultra" ? 0.92 : 0.72, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: state.performance === "balanced" ? 0.72 : 0.9,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start);
  group.add(mesh);
  state.flowRecords.push({
    mesh,
    start: start.clone(),
    end: end.clone(),
    phase,
    speed,
  });
};

const addDistrict = (
  group: THREE.Group,
  folder: CodeCityProject["folders"][number],
  state: CodeCityState,
  districtMaterial: THREE.MeshStandardMaterial,
  roadMaterial: THREE.MeshStandardMaterial,
) => {
  const center = folderCenter(folder);
  const size = folderSize(folder);
  const plateGeometry = new THREE.BoxGeometry(size.width, 0.12, size.depth);
  const plate = new THREE.Mesh(plateGeometry, districtMaterial);
  plate.position.set(center.x, DISTRICT_Y, center.z);
  plate.receiveShadow = true;
  group.add(plate);

  const left = center.x - size.width / 2 - 2.1;
  const right = center.x + size.width / 2 + 2.1;
  const top = center.z - size.depth / 2 - 2.1;
  const bottom = center.z + size.depth / 2 + 2.1;
  addRoadSegment(group, new THREE.Vector3(left, 0, top), new THREE.Vector3(right, 0, top), 2.8, roadMaterial, state);
  addRoadSegment(group, new THREE.Vector3(left, 0, bottom), new THREE.Vector3(right, 0, bottom), 2.8, roadMaterial, state);
  addRoadSegment(group, new THREE.Vector3(left, 0, top), new THREE.Vector3(left, 0, bottom), 2.8, roadMaterial, state);
  addRoadSegment(group, new THREE.Vector3(right, 0, top), new THREE.Vector3(right, 0, bottom), 2.8, roadMaterial, state);
};

const addConnectionRoad = (
  group: THREE.Group,
  connection: CityConnection,
  city: CodeCityProject,
  state: CodeCityState,
) => {
  const from = fileById(city, connection.from);
  const to = fileById(city, connection.to);
  if (!from || !to) return;
  const start = filePosition(from);
  const end = filePosition(to);
  const mid = new THREE.Vector3(start.x, 0, end.z);
  const colorMap: Record<CityConnection["type"], string> = {
    import: "#5ac8ff",
    api: "#ffe66b",
    database: "#4dbbff",
    http: "#b56bff",
    deployment: "#ffb86b",
    security: "#ff5e6d",
  };
  const material = createMaterial(colorMap[connection.type], 0.62, 0.04);
  const width = state.layers.has("dependencies") ? 1.55 : 1.2;
  addRoadSegment(group, start, mid, width, material, state, connection.from, connection.to);
  addRoadSegment(group, mid, end, width, material, state, connection.from, connection.to);
  addFlowPacket(group, start, mid, colorMap[connection.type], state, connection.intensity * 0.17, 0.7 + connection.intensity * 0.18);
  addFlowPacket(group, mid, end, colorMap[connection.type], state, connection.intensity * 0.37, 0.7 + connection.intensity * 0.18);
};

const addWindows = (
  group: THREE.Group,
  records: BuildingRecord[],
  state: CodeCityState,
) => {
  const quality = qualitySettings[state.performance];
  if (!quality.windows || quality.maxWindows <= 0) return;

  const matrices: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();
  records.forEach((record) => {
    const { width, height, depth } = buildingDimensions(record.file);
    if (record.file.role === "asset" || record.file.role === "docs") return;
    const columns = clamp(Math.floor(width / 2.4), 1, 5);
    const rows = clamp(Math.floor(height / clamp(7.8 - record.file.complexity / 22, 3.8, 7.8)), 1, 18);
    const xStep = width / (columns + 1);
    const yStep = height / (rows + 1);
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= columns; column += 1) {
        if (matrices.length >= quality.maxWindows) break;
        dummy.position.set(
          record.position.x - width / 2 + column * xStep,
          row * yStep,
          record.position.z + depth / 2 + 0.05,
        );
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.7, 0.9, 1);
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());
      }
    }
  });

  if (!matrices.length) return;
  const geometry = new THREE.BoxGeometry(1, 1, 0.08);
  const material = new THREE.MeshBasicMaterial({
    color: 0xbff4ff,
    transparent: true,
    opacity: state.performance === "ultra" ? 0.9 : 0.68,
  });
  const windows = new THREE.InstancedMesh(geometry, material, matrices.length);
  matrices.forEach((matrix, index) => windows.setMatrixAt(index, matrix));
  windows.instanceMatrix.needsUpdate = true;
  group.add(windows);
};

const createVerticalBuilding = (
  group: THREE.Group,
  file: CityFile,
  state: CodeCityState,
  sharedGeometry: THREE.BoxGeometry,
) => {
  const dimensions = buildingDimensions(file);
  const position = filePosition(file);
  const color = colorForFile(file, state);
  const material = createMaterial(color, file.role === "database" ? 0.58 : 0.72, file.role === "database" ? 0.18 : 0.06);
  material.emissive = color.clone().multiplyScalar(file.linesOfCode > 760 ? 0.24 : 0.07);
  material.emissiveIntensity = file.linesOfCode > 760 ? 0.85 : 0.28;

  const buildingGroup = new THREE.Group();
  buildingGroup.position.set(position.x, 0, position.z);
  buildingGroup.rotation.set(0, 0, 0);

  const body = new THREE.Mesh(sharedGeometry, material);
  body.scale.set(dimensions.width, dimensions.height, dimensions.depth);
  body.position.set(0, BUILDING_BASE_Y + dimensions.height / 2, 0);
  body.castShadow = qualitySettings[state.performance].shadows;
  body.receiveShadow = true;
  body.userData.fileId = file.id;
  body.userData.kind = "building";
  buildingGroup.add(body);

  const capGeometry = new THREE.BoxGeometry(dimensions.width * 0.92, 0.75, dimensions.depth * 0.92);
  const capMaterial = createMaterial(color.clone().lerp(new THREE.Color("#ffffff"), 0.22), 0.68, 0.05);
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.set(0, dimensions.height + 0.38, 0);
  cap.castShadow = qualitySettings[state.performance].shadows;
  cap.userData.fileId = file.id;
  cap.userData.kind = "building";
  buildingGroup.add(cap);

  if (file.role === "entry" || file.role === "security" || file.linesOfCode > 820) {
    const antennaGeometry = new THREE.CylinderGeometry(0.28, 0.28, 7, 8);
    const antennaMaterial = createMaterial("#e8edf2", 0.55, 0.2);
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, dimensions.height + 4.4, 0);
    antenna.userData.fileId = file.id;
    antenna.userData.kind = "building";
    buildingGroup.add(antenna);
  }

  if (state.performance !== "low") {
    const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth));
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xf2f6fa,
      transparent: true,
      opacity: 0.2,
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.position.set(0, BUILDING_BASE_Y + dimensions.height / 2, 0);
    buildingGroup.add(edges);
  }

  group.add(buildingGroup);
  state.pickables.push(body, cap);
  const record: BuildingRecord = {
    file,
    body,
    group: buildingGroup,
    position,
    height: dimensions.height,
    baseColor: color.clone(),
  };
  state.buildingRecords.set(file.id, record);
  return record;
};

const clearCity = (state: CodeCityState) => {
  if (!state.scene || !state.cityGroup) return;
  state.scene.remove(state.cityGroup);
  disposeObject(state.cityGroup);
  state.cityGroup = null;
  state.pickables = [];
  state.buildingRecords.clear();
  state.roadRecords = [];
  state.flowRecords = [];
  state.hoveredFileId = "";
  state.selectedFileId = "";
};

const buildCity = (refs: CodeCityRefs, state: CodeCityState) => {
  if (!state.scene) return;
  refs.tooltip.hidden = true;
  clearCity(state);
  const city = currentCity(state);
  const cityGroup = new THREE.Group();
  cityGroup.name = `Code City - ${city.name}`;
  state.cityGroup = cityGroup;
  state.scene.add(cityGroup);

  const districtMaterial = createMaterial("#111b27", 0.8, 0.03);
  districtMaterial.emissive = new THREE.Color("#17344d");
  districtMaterial.emissiveIntensity = 0.22;
  const groundMaterial = createMaterial("#050a10", 0.94, 0.01);
  const roadMaterial = createMaterial("#28465e", 0.68, 0.02);

  const groundGeometry = new THREE.PlaneGeometry(560, 430);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  ground.receiveShadow = true;
  cityGroup.add(ground);

  const grid = new THREE.GridHelper(560, 56, 0x28516d, 0x132333);
  grid.position.y = 0.015;
  cityGroup.add(grid);

  if (state.layers.has("districts")) {
    city.folders.forEach((folder) => addDistrict(cityGroup, folder, state, districtMaterial, roadMaterial));
  }

  if (state.layers.has("roads")) {
    city.connections.forEach((connection) => {
      if (!state.layers.has("dependencies") && connection.type === "import") return;
      if (!state.layers.has("security") && connection.type === "security") return;
      if (!state.layers.has("database") && connection.type === "database") return;
      if (!state.layers.has("deployment") && connection.type === "deployment") return;
      addConnectionRoad(cityGroup, connection, city, state);
    });
  }

  const sharedBuildingGeometry = new THREE.BoxGeometry(1, 1, 1);
  const records: BuildingRecord[] = [];
  if (state.layers.has("buildings")) {
    city.files.forEach((file) => records.push(createVerticalBuilding(cityGroup, file, state, sharedBuildingGeometry)));
    addWindows(cityGroup, records, state);
  }

  renderHud(refs, state);
  renderRepoPanel(refs, state);
  renderFallback(refs, state);
};

const renderHud = (refs: CodeCityRefs, state: CodeCityState) => {
  const city = currentCity(state);
  refs.hudTitle.textContent = city.name;
  refs.hudFiles.textContent = String(city.metrics.totalFiles);
  refs.hudFolders.textContent = String(city.folders.length);
  refs.hudLines.textContent = formatNumber(city.metrics.totalLines);
  refs.hudScore.textContent = String(city.metrics.gdp);
  refs.hudSecurity.textContent = String(city.metrics.securityScore);
};

const cityLanguages = (city: CodeCityProject) => Array.from(new Set(city.files.map((file) => file.language))).sort();

const allFilters = (cities: CodeCityProject[]) => {
  const values = new Set<string>(["All"]);
  cities.forEach((city) => {
    values.add(city.category);
    city.techStack.forEach((tech) => values.add(tech));
    cityLanguages(city).forEach((language) => values.add(language));
  });
  return Array.from(values);
};

const sortedCities = (state: CodeCityState) => {
  const query = state.search.trim().toLowerCase();
  const filtered = state.cities.filter((city) => {
    const languages = cityLanguages(city);
    const matchesFilter = state.filter === "All"
      || city.category === state.filter
      || city.techStack.includes(state.filter)
      || languages.includes(state.filter);
    const haystack = [city.name, city.description, city.category, city.status, ...city.techStack, ...languages].join(" ").toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });

  return filtered.sort((a, b) => {
    if (state.sort === "size") return b.metrics.totalLines - a.metrics.totalLines;
    if (state.sort === "score") return b.metrics.gdp - a.metrics.gdp;
    if (state.sort === "newest") return b.lastUpdated.localeCompare(a.lastUpdated);
    return a.name.localeCompare(b.name);
  });
};

const renderRepoPanel = (refs: CodeCityRefs, state: CodeCityState) => {
  const city = currentCity(state);
  refs.repoFilter.replaceChildren(...allFilters(state.cities).map((filter) => {
    const option = document.createElement("option");
    option.value = filter;
    option.textContent = filter;
    option.selected = filter === state.filter;
    return option;
  }));
  refs.repoSort.value = state.sort;

  const cities = sortedCities(state);
  const count = refs.root.querySelector<HTMLElement>("[data-city-count]");
  if (count) count.textContent = `${cities.length} repos`;

  refs.repoList.replaceChildren(...cities.map((item) => {
    const button = makeElement<HTMLButtonElement>("button", "code-city-project-button");
    button.type = "button";
    button.dataset.cityProject = item.id;
    button.classList.toggle("is-active", item.id === city.id);
    button.innerHTML = `
      <span>${escapeHtml(item.name)}</span>
      <small>${escapeHtml(item.category)} / ${formatNumber(item.metrics.totalLines)} LOC / ${item.metrics.gdp} score</small>
    `;
    return button;
  }));

  const largestFile = city.files.reduce((largest, file) => file.linesOfCode > largest.linesOfCode ? file : largest, city.files[0]);
  const languages = cityLanguages(city);
  refs.repoStats.innerHTML = `
    <p class="panel-title">selected repo stats</p>
    <h3>${escapeHtml(city.name)}</h3>
    <p>${escapeHtml(city.description)}</p>
    <div class="code-city-stat-grid">
      <span><b>${city.metrics.totalFiles}</b> files</span>
      <span><b>${city.folders.length}</b> folders</span>
      <span><b>${formatNumber(city.metrics.totalLines)}</b> total lines</span>
      <span><b>${languages.length}</b> languages</span>
      <span><b>${city.metrics.complexityScore}</b> complexity</span>
      <span><b>${city.metrics.securityScore}</b> security</span>
      <span><b>${city.metrics.performanceScore}</b> performance</span>
      <span><b>${city.metrics.maintainabilityScore}</b> maintainability</span>
    </div>
    <div class="code-city-largest-file">
      <span>Largest file</span>
      <b>${escapeHtml(largestFile?.path ?? "n/a")}</b>
      <small>${largestFile ? formatNumber(largestFile.linesOfCode) : 0} LOC</small>
    </div>
    <div class="modal-tags">
      ${languages.map((language) => `<span>${escapeHtml(language)}</span>`).join("")}
    </div>
    <div class="code-city-detail-actions">
      <a class="project-action" href="${escapeHtml(city.github)}" target="_blank" rel="noreferrer">GitHub</a>
      ${city.live ? `<a class="project-action is-live" href="${escapeHtml(city.live)}" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
    </div>
  `;
};

const renderLayerControls = (refs: CodeCityRefs, state: CodeCityState) => {
  const layerLabels: Record<CodeCityLayer, string> = {
    buildings: "Buildings",
    districts: "Folder districts",
    roads: "Roads",
    dependencies: "Dependencies",
    labels: "Labels",
    language: "Language colors",
    complexity: "Complexity heatmap",
    security: "Security heatmap",
    database: "Database paths",
    deployment: "Deployment paths",
  };
  const layerOrder: CodeCityLayer[] = [
    "buildings",
    "districts",
    "roads",
    "dependencies",
    "labels",
    "language",
    "complexity",
    "security",
    "database",
    "deployment",
  ];
  refs.layerControls.replaceChildren(...layerOrder.map((layer) => {
    const label = makeElement<HTMLLabelElement>("label", "code-city-layer");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.layers.has(layer);
    input.dataset.cityLayer = layer;
    const span = document.createElement("span");
    span.textContent = layerLabels[layer];
    label.append(input, span);
    return label;
  }));
};

const renderFallback = (refs: CodeCityRefs, state: CodeCityState) => {
  const city = currentCity(state);
  refs.fallback.innerHTML = `
    <div class="code-city-fallback__head">
      <p class="panel-title">mobile / WebGL fallback</p>
      <strong>${escapeHtml(city.name)}</strong>
    </div>
    <div class="code-city-file-table">
      ${city.files.slice(0, 18).map((file) => `
        <button type="button" data-fallback-file="${escapeHtml(file.id)}">
          <span>${escapeHtml(file.path)}</span>
          <small>${escapeHtml(file.language)} / ${formatNumber(file.linesOfCode)} LOC</small>
        </button>
      `).join("")}
    </div>
  `;
};

const connectedIds = (city: CodeCityProject, fileId: string) => {
  const ids = new Set<string>([fileId]);
  city.connections.forEach((connection) => {
    if (connection.from === fileId || connection.to === fileId) {
      ids.add(connection.from);
      ids.add(connection.to);
    }
  });
  return ids;
};

const setHoveredFile = (refs: CodeCityRefs, state: CodeCityState, file: CityFile | null, event?: MouseEvent) => {
  if (state.hoveredFileId === (file?.id ?? "")) return;
  state.hoveredFileId = file?.id ?? "";
  const city = currentCity(state);
  const related = file ? connectedIds(city, file.id) : new Set<string>();

  state.buildingRecords.forEach((record) => {
    const material = record.body.material;
    const isHovered = file?.id === record.file.id;
    const isRelated = file ? related.has(record.file.id) : false;
    material.color.copy(record.baseColor);
    material.emissive.copy(record.baseColor).multiplyScalar(isHovered ? 0.42 : isRelated ? 0.18 : 0.04);
    material.emissiveIntensity = isHovered ? 0.95 : isRelated ? 0.55 : 0.18;
    record.group.scale.setScalar(isHovered ? 1.04 : 1);
  });

  state.roadRecords.forEach((road) => {
    const material = road.mesh.material;
    const roadRelated = file && road.from && road.to && (road.from === file.id || road.to === file.id);
    material.color.copy(roadRelated ? new THREE.Color("#ffffff") : road.baseColor);
    material.emissive.copy(roadRelated ? new THREE.Color("#b9d8f3") : new THREE.Color("#000000"));
    material.emissiveIntensity = roadRelated ? 0.35 : 0;
  });

  state.flowRecords.forEach((flow) => {
    flow.mesh.material.opacity = file ? 0.34 : state.performance === "balanced" ? 0.72 : 0.9;
  });

  if (!file || !event || !state.layers.has("labels")) {
    refs.tooltip.hidden = true;
    return;
  }

  refs.tooltip.hidden = false;
  refs.tooltip.style.left = `${event.offsetX + 18}px`;
  refs.tooltip.style.top = `${event.offsetY + 18}px`;
  refs.tooltip.innerHTML = `
    <b>${escapeHtml(file.name)}</b>
    <span>${escapeHtml(file.path)}</span>
    <small>${escapeHtml(file.language)} / ${formatNumber(file.linesOfCode)} LOC / complexity ${file.complexity}</small>
  `;
};

const pickFile = (refs: CodeCityRefs, state: CodeCityState, event: MouseEvent) => {
  if (!state.renderer || !state.camera) return null;
  const rect = state.renderer.domElement.getBoundingClientRect();
  state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  state.raycaster.setFromCamera(state.pointer, state.camera);
  const hit = state.raycaster.intersectObjects(state.pickables, false)[0];
  const fileId = hit?.object.userData.fileId as string | undefined;
  return fileId ? fileById(currentCity(state), fileId) ?? null : null;
};

const schedulePointerPick = (refs: CodeCityRefs, state: CodeCityState, event: PointerEvent) => {
  state.pendingPointerEvent = event;
  if (state.animationFrame === -1) return;
  window.requestAnimationFrame(() => {
    const pointerEvent = state.pendingPointerEvent;
    state.pendingPointerEvent = null;
    if (!pointerEvent) return;
    setHoveredFile(refs, state, pickFile(refs, state, pointerEvent), pointerEvent);
  });
};

const openFileModal = (refs: CodeCityRefs, state: CodeCityState, file: CityFile) => {
  const city = currentCity(state);
  const folder = city.folders.find((item) => item.id === file.folderId);
  const related = city.connections
    .filter((connection) => connection.from === file.id || connection.to === file.id)
    .map((connection) => {
      const otherId = connection.from === file.id ? connection.to : connection.from;
      const other = fileById(city, otherId);
      return other ? `${connectionLabels[connection.type]} -> ${other.path}` : connectionLabels[connection.type];
    });

  refs.modalContent.innerHTML = `
    <div class="code-city-detail__top">
      <p class="eyebrow">Building details</p>
      <button type="button" data-city-modal-close aria-label="Close file details">x</button>
    </div>
    <h2 id="city-modal-title">${escapeHtml(file.name)}</h2>
    <p>${escapeHtml(file.path)} in ${escapeHtml(city.name)}</p>
    <div class="modal-tags">
      <span>${escapeHtml(file.language)}</span>
      <span>${escapeHtml(roleLabels[file.role] ?? file.role)}</span>
      <span>${formatNumber(file.linesOfCode)} LOC</span>
      <span>${file.fileSize} KB</span>
      <span>${escapeHtml(file.status)}</span>
    </div>
    <div class="code-city-detail-grid">
      <section>
        <p class="panel-title">folder</p>
        <p>${escapeHtml(folder?.name ?? "root")}</p>
      </section>
      <section>
        <p class="panel-title">scores</p>
        <ul>
          <li>Complexity ${file.complexity}</li>
          <li>Security ${file.security}</li>
          <li>Performance ${file.performance}</li>
        </ul>
      </section>
      <section>
        <p class="panel-title">functions / classes</p>
        <ul>
          ${file.functions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          ${file.classes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
      <section>
        <p class="panel-title">imports</p>
        <ul>${file.imports.length ? file.imports.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No import path</li>"}</ul>
      </section>
      <section>
        <p class="panel-title">related files</p>
        <ul>${related.length ? related.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No related dependency</li>"}</ul>
      </section>
      <section>
        <p class="panel-title">security notes</p>
        <ul>${file.issues.length ? file.issues.map((issue) => `<li>${escapeHtml(issue.severity)}: ${escapeHtml(issue.label)}</li>`).join("") : "<li>No active issue notes</li>"}</ul>
      </section>
    </div>
    <div class="code-city-detail-actions">
      <a class="project-action" href="${escapeHtml(city.github)}" target="_blank" rel="noreferrer">GitHub</a>
      ${city.live ? `<a class="project-action is-live" href="${escapeHtml(city.live)}" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
    </div>
  `;
  refs.modal.hidden = false;
  refs.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  refs.modalContent.querySelector<HTMLButtonElement>("[data-city-modal-close]")?.focus();
};

const closeModal = (refs: CodeCityRefs) => {
  refs.modal.hidden = true;
  refs.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

const resetCamera = (state: CodeCityState) => {
  state.cameraGoal = {
    position: new THREE.Vector3(220, 170, 240),
    target: new THREE.Vector3(0, 0, 25),
  };
};

const focusBuilding = (state: CodeCityState, file: CityFile) => {
  const record = state.buildingRecords.get(file.id);
  if (!record) return;
  const target = record.position.clone();
  target.y = Math.max(10, record.height * 0.42);
  state.cameraGoal = {
    position: target.clone().add(new THREE.Vector3(70, 62, 76)),
    target,
  };
};

const switchCity = (refs: CodeCityRefs, state: CodeCityState, cityId: string) => {
  const nextIndex = state.cities.findIndex((city) => city.id === cityId);
  if (nextIndex < 0) return;
  state.cityIndex = nextIndex;
  setHoveredFile(refs, state, null);
  buildCity(refs, state);
  resetCamera(state);
};

const updateQuality = (refs: CodeCityRefs, state: CodeCityState, quality: CodeCityPerformance) => {
  state.performance = quality;
  localStorage.setItem("code-city-quality", quality);
  refs.qualitySelect.value = quality;
  if (state.renderer) {
    state.renderer.shadowMap.enabled = qualitySettings[quality].shadows;
    resizeRenderer(refs, state);
  }
  buildCity(refs, state);
};

const toggleFullscreen = async (refs: CodeCityRefs, state: CodeCityState) => {
  const entering = !refs.shell.classList.contains("is-fullscreen");
  refs.shell.classList.toggle("is-fullscreen", entering);
  document.body.classList.toggle("code-city-fullscreen-open", entering);
  refs.fullscreenButton.setAttribute("aria-pressed", String(entering));
  refs.fullscreenButton.textContent = entering ? "Exit Fullscreen" : "Fullscreen";
  try {
    if (entering && document.fullscreenElement !== refs.shell) {
      await refs.shell.requestFullscreen?.();
    } else if (!entering && document.fullscreenElement) {
      await document.exitFullscreen?.();
    }
  } catch {
    // CSS fullscreen remains available when the browser blocks native fullscreen.
  }
  window.setTimeout(() => resizeRenderer(refs, state), 80);
  window.setTimeout(() => resizeRenderer(refs, state), 260);
};

const bindEvents = (refs: CodeCityRefs, state: CodeCityState) => {
  refs.repoSearch.addEventListener("input", () => {
    state.search = refs.repoSearch.value;
    renderRepoPanel(refs, state);
  });

  refs.repoFilter.addEventListener("change", () => {
    state.filter = refs.repoFilter.value;
    renderRepoPanel(refs, state);
  });

  refs.repoSort.addEventListener("change", () => {
    state.sort = refs.repoSort.value as SortMode;
    renderRepoPanel(refs, state);
  });

  refs.repoList.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-city-project]");
    if (button?.dataset.cityProject) switchCity(refs, state, button.dataset.cityProject);
  });

  refs.layerControls.addEventListener("change", (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>("[data-city-layer]");
    if (!input?.dataset.cityLayer) return;
    const layer = input.dataset.cityLayer as CodeCityLayer;
    if (input.checked) state.layers.add(layer);
    else state.layers.delete(layer);

    if (layer === "complexity" && input.checked) state.layers.delete("security");
    if (layer === "security" && input.checked) state.layers.delete("complexity");

    setHoveredFile(refs, state, null);
    renderLayerControls(refs, state);
    buildCity(refs, state);
  });

  refs.stage.addEventListener("pointermove", (event) => {
    schedulePointerPick(refs, state, event);
  });

  refs.stage.addEventListener("pointerleave", () => {
    setHoveredFile(refs, state, null);
  });

  refs.stage.addEventListener("click", (event) => {
    const file = pickFile(refs, state, event);
    if (file) openFileModal(refs, state, file);
  });

  refs.stage.addEventListener("dblclick", (event) => {
    const file = pickFile(refs, state, event);
    if (file) focusBuilding(state, file);
  });

  refs.modal.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("[data-city-modal-close]")) closeModal(refs);
  });

  refs.fullscreenButton.addEventListener("click", () => {
    void toggleFullscreen(refs, state);
  });

  refs.resetButton.addEventListener("click", () => resetCamera(state));
  refs.qualitySelect.addEventListener("change", () => {
    updateQuality(refs, state, refs.qualitySelect.value as CodeCityPerformance);
  });

  refs.fallback.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-fallback-file]");
    if (!button?.dataset.fallbackFile) return;
    const file = fileById(currentCity(state), button.dataset.fallbackFile);
    if (file) openFileModal(refs, state, file);
  });

  document.addEventListener("fullscreenchange", () => {
    const active = document.fullscreenElement === refs.shell;
    refs.shell.classList.toggle("is-fullscreen", active);
    document.body.classList.toggle("code-city-fullscreen-open", active);
    refs.fullscreenButton.setAttribute("aria-pressed", String(active));
    refs.fullscreenButton.textContent = active ? "Exit Fullscreen" : "Fullscreen";
    resizeRenderer(refs, state);
    window.setTimeout(() => resizeRenderer(refs, state), 160);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(refs);
      if (refs.shell.classList.contains("is-fullscreen") && !document.fullscreenElement) {
        refs.shell.classList.remove("is-fullscreen");
        document.body.classList.remove("code-city-fullscreen-open");
        refs.fullscreenButton.setAttribute("aria-pressed", "false");
        refs.fullscreenButton.textContent = "Fullscreen";
        resizeRenderer(refs, state);
      }
    }
  });

  state.resizeObserver = new ResizeObserver(() => resizeRenderer(refs, state));
  state.resizeObserver.observe(refs.stage);
  window.addEventListener("resize", () => resizeRenderer(refs, state));
  document.addEventListener("visibilitychange", () => {
    refs.shell.classList.toggle("is-paused", document.hidden);
  });
};

const updateCameraTween = (state: CodeCityState) => {
  if (!state.cameraGoal || !state.camera || !state.controls) return;
  const ease = state.reducedMotion ? 1 : 0.08;
  state.camera.position.lerp(state.cameraGoal.position, ease);
  state.controls.target.lerp(state.cameraGoal.target, ease);
  if (
    state.camera.position.distanceTo(state.cameraGoal.position) < 0.4
    && state.controls.target.distanceTo(state.cameraGoal.target) < 0.4
  ) {
    state.camera.position.copy(state.cameraGoal.position);
    state.controls.target.copy(state.cameraGoal.target);
    state.cameraGoal = null;
  }
};

const updateFps = (state: CodeCityState, now: number) => {
  if (!state.fpsElement) return;
  state.frameCount += 1;
  const elapsed = now - state.fpsStartedAt;
  if (elapsed < 600) return;
  const fps = Math.round((state.frameCount * 1000) / elapsed);
  state.fpsElement.textContent = `${fps} FPS`;
  state.frameCount = 0;
  state.fpsStartedAt = now;
};

const updateFlowPackets = (state: CodeCityState, now: number) => {
  if (!state.flowRecords.length || state.performance === "low") return;
  const time = now * 0.00022;
  state.flowRecords.forEach((flow) => {
    const t = (time * flow.speed + flow.phase) % 1;
    flow.mesh.position.lerpVectors(flow.start, flow.end, t);
    flow.mesh.position.y = 0.95 + Math.sin((t + flow.phase) * Math.PI * 2) * 0.08;
    flow.mesh.scale.setScalar(0.82 + Math.sin((t + flow.phase) * Math.PI * 2) * 0.16);
  });
};

const startAnimationLoop = (state: CodeCityState) => {
  const animate = (now: number) => {
    state.animationFrame = window.requestAnimationFrame(animate);
    if (document.hidden || !state.renderer || !state.scene || !state.camera) return;
    updateCameraTween(state);
    updateFlowPackets(state, now);
    state.controls?.update();
    state.renderer.render(state.scene, state.camera);
    updateFps(state, now);
  };
  state.animationFrame = window.requestAnimationFrame(animate);
};

const fallbackToList = (refs: CodeCityRefs, state: CodeCityState) => {
  refs.stage.classList.add("is-webgl-failed");
  refs.fallback.hidden = false;
  refs.stage.innerHTML = `
    <div class="code-city-webgl-fallback">
      <p class="panel-title">WebGL fallback</p>
      <h3>2D file list available</h3>
      <p>Your browser blocked the 3D renderer, so Code City is showing the local project/file fallback.</p>
    </div>
  `;
  renderFallback(refs, state);
};

export const initCodeCity = (projects: PortfolioProjectInput[]) => {
  const root = document.querySelector<HTMLElement>("[data-code-city-root]");
  if (!root) return;

  const refs = createShell(root);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cities = buildCodeCities(projects);
  const state: CodeCityState = {
    cities,
    cityIndex: Math.max(0, cities.findIndex((city) => city.id === "codeguard-os")),
    layers: new Set(defaultLayers),
    performance: reducedMotion ? "low" : readPerformance(),
    search: "",
    filter: "All",
    sort: "score",
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    cityGroup: null,
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    pickables: [],
    buildingRecords: new Map(),
    roadRecords: [],
    flowRecords: [],
    hoveredFileId: "",
    selectedFileId: "",
    animationFrame: 0,
    resizeObserver: null,
    fpsElement: null,
    frameCount: 0,
    fpsStartedAt: performance.now(),
    pendingPointerEvent: null,
    cameraGoal: null,
    reducedMotion,
  };

  refs.qualitySelect.value = state.performance;
  renderLayerControls(refs, state);
  renderRepoPanel(refs, state);
  renderHud(refs, state);

  if (import.meta.env.DEV) {
    state.fpsElement = makeElement("span", "code-city-fps");
    refs.stage.append(state.fpsElement);
  }

  try {
    setupScene(refs, state);
    buildCity(refs, state);
    bindEvents(refs, state);
    startAnimationLoop(state);
  } catch {
    fallbackToList(refs, state);
  }

  document.querySelectorAll<HTMLElement>("[data-enter-code-city]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      window.setTimeout(() => {
        refs.stage.focus();
        resizeRenderer(refs, state);
      }, 280);
    });
  });
};
