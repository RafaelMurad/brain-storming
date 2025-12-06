/**
 * SceneInspector - DevTools-like scene graph inspector for Three.js
 * 
 * Displays real-time scene hierarchy, object properties, and stats.
 */

export interface SceneObject {
  uuid: string;
  name: string;
  type: string;
  children: SceneObject[];
  visible: boolean;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  geometry?: {
    type: string;
    vertices: number;
    faces: number;
  };
  material?: {
    type: string;
    color?: string;
    opacity?: number;
  };
}

export interface SceneStats {
  objects: number;
  meshes: number;
  lights: number;
  geometries: number;
  materials: number;
  textures: number;
  vertices: number;
  triangles: number;
}

export interface SceneInspectorOptions {
  container: HTMLElement;
  onSelect?: (uuid: string) => void;
  onVisibilityToggle?: (uuid: string, visible: boolean) => void;
}

export class SceneInspector {
  private container: HTMLElement;
  private treeContainer: HTMLElement;
  private statsContainer: HTMLElement;
  private propertiesContainer: HTMLElement;
  private selectedUuid: string | null = null;
  private sceneData: SceneObject | null = null;
  private stats: SceneStats = this.emptyStats();
  private options: SceneInspectorOptions;

  constructor(options: SceneInspectorOptions) {
    this.container = options.container;
    this.options = options;
    this.treeContainer = document.createElement('div');
    this.statsContainer = document.createElement('div');
    this.propertiesContainer = document.createElement('div');
    
    this.render();
  }

  private emptyStats(): SceneStats {
    return {
      objects: 0,
      meshes: 0,
      lights: 0,
      geometries: 0,
      materials: 0,
      textures: 0,
      vertices: 0,
      triangles: 0,
    };
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="scene-inspector">
        <div class="inspector-header">
          <div class="inspector-tabs">
            <button class="inspector-tab active" data-tab="tree">Scene</button>
            <button class="inspector-tab" data-tab="stats">Stats</button>
            <button class="inspector-tab" data-tab="props">Properties</button>
          </div>
          <button class="inspector-refresh" title="Refresh">🔄</button>
        </div>
        <div class="inspector-content">
          <div class="inspector-panel active" data-panel="tree"></div>
          <div class="inspector-panel" data-panel="stats"></div>
          <div class="inspector-panel" data-panel="props"></div>
        </div>
      </div>
    `;

    this.treeContainer = this.container.querySelector('[data-panel="tree"]')!;
    this.statsContainer = this.container.querySelector('[data-panel="stats"]')!;
    this.propertiesContainer = this.container.querySelector('[data-panel="props"]')!;

    this.addStyles();
    this.setupEventListeners();
    this.renderEmptyState();
  }

  private addStyles(): void {
    const styleId = 'scene-inspector-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .scene-inspector {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #0d0d0d;
        font-family: 'Space Mono', monospace;
        font-size: 11px;
      }

      .inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: #111;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .inspector-tabs {
        display: flex;
        gap: 2px;
      }

      .inspector-tab {
        padding: 5px 10px;
        background: transparent;
        border: 1px solid transparent;
        color: #666;
        font-size: 10px;
        font-family: inherit;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.15s;
      }

      .inspector-tab:hover {
        color: #fff;
        background: rgba(255,255,255,0.05);
      }

      .inspector-tab.active {
        background: rgba(255,77,0,0.15);
        border-color: rgba(255,77,0,0.3);
        color: #FF4D00;
      }

      .inspector-refresh {
        padding: 4px 8px;
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.15s;
      }

      .inspector-refresh:hover {
        color: #fff;
        transform: rotate(90deg);
      }

      .inspector-content {
        flex: 1;
        overflow: hidden;
      }

      .inspector-panel {
        display: none;
        height: 100%;
        overflow-y: auto;
        padding: 8px;
      }

      .inspector-panel.active {
        display: block;
      }

      .scene-tree {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .tree-item {
        padding: 4px 0;
      }

      .tree-node {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 3px;
        transition: background 0.1s;
      }

      .tree-node:hover {
        background: rgba(255,255,255,0.05);
      }

      .tree-node.selected {
        background: rgba(255,77,0,0.15);
      }

      .tree-toggle {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        cursor: pointer;
        flex-shrink: 0;
        transition: transform 0.15s;
      }

      .tree-toggle.expanded {
        transform: rotate(90deg);
      }

      .tree-toggle.empty {
        visibility: hidden;
      }

      .tree-icon {
        width: 16px;
        height: 16px;
        margin: 0 6px;
        font-size: 12px;
        flex-shrink: 0;
      }

      .tree-label {
        flex: 1;
        color: #ccc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tree-type {
        color: #666;
        font-size: 10px;
        margin-left: 8px;
      }

      .tree-visibility {
        width: 16px;
        height: 16px;
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.15s;
      }

      .tree-visibility:hover {
        opacity: 1;
      }

      .tree-visibility.hidden {
        opacity: 0.3;
      }

      .tree-children {
        padding-left: 16px;
        border-left: 1px solid rgba(255,255,255,0.05);
        margin-left: 8px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .stat-card {
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.06);
      }

      .stat-value {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 10px;
        color: #666;
        text-transform: uppercase;
      }

      .stat-card.highlight .stat-value {
        color: #FF4D00;
      }

      .property-section {
        margin-bottom: 16px;
      }

      .property-section-title {
        font-size: 10px;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .property-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
      }

      .property-key {
        color: #888;
      }

      .property-value {
        color: #fff;
        font-weight: 500;
      }

      .property-value.color {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .color-swatch {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        border: 1px solid rgba(255,255,255,0.2);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #444;
        text-align: center;
        padding: 20px;
      }

      .empty-state-icon {
        font-size: 32px;
        margin-bottom: 12px;
        opacity: 0.5;
      }
    `;
    document.head.appendChild(styles);
  }

  private setupEventListeners(): void {
    // Tab switching
    this.container.querySelectorAll('.inspector-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const tabName = target.dataset.tab;

        this.container.querySelectorAll('.inspector-tab').forEach(t => t.classList.remove('active'));
        target.classList.add('active');

        this.container.querySelectorAll('.inspector-panel').forEach(p => p.classList.remove('active'));
        this.container.querySelector(`[data-panel="${tabName}"]`)?.classList.add('active');
      });
    });

    // Refresh button
    this.container.querySelector('.inspector-refresh')?.addEventListener('click', () => {
      this.renderTree();
      this.renderStats();
    });
  }

  private renderEmptyState(): void {
    this.treeContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎬</div>
        <div>Run your code to inspect the scene</div>
      </div>
    `;

    this.statsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div>No scene data available</div>
      </div>
    `;

    this.propertiesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div>Select an object to view properties</div>
      </div>
    `;
  }

  private getObjectIcon(type: string): string {
    switch (type) {
      case 'Scene': return '🎬';
      case 'PerspectiveCamera':
      case 'OrthographicCamera': return '📷';
      case 'AmbientLight': return '💡';
      case 'DirectionalLight': return '☀️';
      case 'PointLight': return '🔆';
      case 'SpotLight': return '🔦';
      case 'Mesh': return '🧊';
      case 'Group': return '📁';
      case 'Line':
      case 'LineSegments': return '📏';
      case 'Points': return '✨';
      case 'GridHelper': return '📐';
      case 'AxesHelper': return '➕';
      default: return '📦';
    }
  }

  private renderTreeNode(obj: SceneObject, depth = 0): string {
    const hasChildren = obj.children && obj.children.length > 0;
    const displayName = obj.name || obj.type;
    const isSelected = this.selectedUuid === obj.uuid;

    return `
      <li class="tree-item" data-uuid="${obj.uuid}">
        <div class="tree-node ${isSelected ? 'selected' : ''}">
          <span class="tree-toggle ${hasChildren ? 'expanded' : 'empty'}">›</span>
          <span class="tree-icon">${this.getObjectIcon(obj.type)}</span>
          <span class="tree-label">${displayName}</span>
          <span class="tree-type">${obj.type !== displayName ? obj.type : ''}</span>
          <span class="tree-visibility ${obj.visible ? '' : 'hidden'}">${obj.visible ? '👁' : '👁‍🗨'}</span>
        </div>
        ${hasChildren ? `
          <ul class="scene-tree tree-children">
            ${obj.children.map(child => this.renderTreeNode(child, depth + 1)).join('')}
          </ul>
        ` : ''}
      </li>
    `;
  }

  private renderTree(): void {
    if (!this.sceneData) {
      this.renderEmptyState();
      return;
    }

    this.treeContainer.innerHTML = `
      <ul class="scene-tree">
        ${this.renderTreeNode(this.sceneData)}
      </ul>
    `;

    // Add click handlers
    this.treeContainer.querySelectorAll('.tree-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const item = target.closest('.tree-item') as HTMLElement;
        const uuid = item?.dataset.uuid;

        if (uuid) {
          this.selectObject(uuid);
        }
      });

      // Toggle children
      const toggle = node.querySelector('.tree-toggle');
      toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = (e.target as HTMLElement).closest('.tree-item') as HTMLElement;
        const children = item?.querySelector('.tree-children') as HTMLElement;
        const toggleEl = e.target as HTMLElement;

        if (children) {
          const isHidden = children.style.display === 'none';
          children.style.display = isHidden ? 'block' : 'none';
          toggleEl.classList.toggle('expanded', isHidden);
        }
      });
    });
  }

  private renderStats(): void {
    this.statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-value">${this.stats.objects}</div>
          <div class="stat-label">Objects</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.meshes}</div>
          <div class="stat-label">Meshes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.lights}</div>
          <div class="stat-label">Lights</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.geometries}</div>
          <div class="stat-label">Geometries</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-value">${this.formatNumber(this.stats.vertices)}</div>
          <div class="stat-label">Vertices</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.formatNumber(this.stats.triangles)}</div>
          <div class="stat-label">Triangles</div>
        </div>
      </div>
    `;
  }

  private renderProperties(obj: SceneObject): void {
    const sections: string[] = [];

    // Basic info
    sections.push(`
      <div class="property-section">
        <div class="property-section-title">Object</div>
        <div class="property-row">
          <span class="property-key">Type</span>
          <span class="property-value">${obj.type}</span>
        </div>
        <div class="property-row">
          <span class="property-key">Name</span>
          <span class="property-value">${obj.name || '(unnamed)'}</span>
        </div>
        <div class="property-row">
          <span class="property-key">Visible</span>
          <span class="property-value">${obj.visible ? 'Yes' : 'No'}</span>
        </div>
      </div>
    `);

    // Transform
    if (obj.position && obj.rotation && obj.scale) {
      sections.push(`
        <div class="property-section">
          <div class="property-section-title">Transform</div>
          <div class="property-row">
            <span class="property-key">Position</span>
            <span class="property-value">${this.formatVector(obj.position)}</span>
          </div>
          <div class="property-row">
            <span class="property-key">Rotation</span>
            <span class="property-value">${this.formatVector(obj.rotation)}</span>
          </div>
          <div class="property-row">
            <span class="property-key">Scale</span>
            <span class="property-value">${this.formatVector(obj.scale)}</span>
          </div>
        </div>
      `);
    }

    // Geometry
    if (obj.geometry) {
      sections.push(`
        <div class="property-section">
          <div class="property-section-title">Geometry</div>
          <div class="property-row">
            <span class="property-key">Type</span>
            <span class="property-value">${obj.geometry.type}</span>
          </div>
          <div class="property-row">
            <span class="property-key">Vertices</span>
            <span class="property-value">${this.formatNumber(obj.geometry.vertices)}</span>
          </div>
          <div class="property-row">
            <span class="property-key">Faces</span>
            <span class="property-value">${this.formatNumber(obj.geometry.faces)}</span>
          </div>
        </div>
      `);
    }

    // Material
    if (obj.material) {
      sections.push(`
        <div class="property-section">
          <div class="property-section-title">Material</div>
          <div class="property-row">
            <span class="property-key">Type</span>
            <span class="property-value">${obj.material.type}</span>
          </div>
          ${obj.material.color ? `
            <div class="property-row">
              <span class="property-key">Color</span>
              <span class="property-value color">
                <span class="color-swatch" style="background: ${obj.material.color}"></span>
                ${obj.material.color}
              </span>
            </div>
          ` : ''}
          ${obj.material.opacity !== undefined ? `
            <div class="property-row">
              <span class="property-key">Opacity</span>
              <span class="property-value">${obj.material.opacity}</span>
            </div>
          ` : ''}
        </div>
      `);
    }

    this.propertiesContainer.innerHTML = sections.join('');
  }

  private formatVector(v: { x: number; y: number; z: number }): string {
    return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
  }

  private formatNumber(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }

  private findObjectByUuid(obj: SceneObject, uuid: string): SceneObject | null {
    if (obj.uuid === uuid) return obj;
    for (const child of obj.children || []) {
      const found = this.findObjectByUuid(child, uuid);
      if (found) return found;
    }
    return null;
  }

  /**
   * Update scene data from sandbox
   */
  updateScene(sceneData: SceneObject, stats: SceneStats): void {
    this.sceneData = sceneData;
    this.stats = stats;
    this.renderTree();
    this.renderStats();

    // Re-select previous object if exists
    if (this.selectedUuid && this.sceneData) {
      const obj = this.findObjectByUuid(this.sceneData, this.selectedUuid);
      if (obj) {
        this.renderProperties(obj);
      }
    }
  }

  /**
   * Select an object in the tree
   */
  selectObject(uuid: string): void {
    this.selectedUuid = uuid;

    // Update UI
    this.treeContainer.querySelectorAll('.tree-node').forEach(node => {
      node.classList.remove('selected');
    });
    const item = this.treeContainer.querySelector(`[data-uuid="${uuid}"]`);
    item?.querySelector('.tree-node')?.classList.add('selected');

    // Find and show properties
    if (this.sceneData) {
      const obj = this.findObjectByUuid(this.sceneData, uuid);
      if (obj) {
        this.renderProperties(obj);
        this.options.onSelect?.(uuid);
      }
    }

    // Switch to properties tab
    this.container.querySelectorAll('.inspector-tab').forEach(t => t.classList.remove('active'));
    this.container.querySelector('[data-tab="props"]')?.classList.add('active');
    this.container.querySelectorAll('.inspector-panel').forEach(p => p.classList.remove('active'));
    this.propertiesContainer.classList.add('active');
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedUuid = null;
    this.treeContainer.querySelectorAll('.tree-node').forEach(node => {
      node.classList.remove('selected');
    });
    this.propertiesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div>Select an object to view properties</div>
      </div>
    `;
  }

  /**
   * Dispose inspector
   */
  dispose(): void {
    this.container.innerHTML = '';
    this.sceneData = null;
    this.stats = this.emptyStats();
  }
}

export default SceneInspector;
