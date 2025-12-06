/**
 * ResizablePanes - Draggable splitter for resizable panels
 * 
 * Creates professional resizable split views for editor/preview layouts.
 */

export interface ResizablePanesOptions {
  container: HTMLElement;
  direction: 'horizontal' | 'vertical';
  initialSizes?: [number, number]; // percentages
  minSizes?: [number, number]; // pixels
  onResize?: (sizes: [number, number]) => void;
}

export class ResizablePanes {
  private container: HTMLElement;
  private direction: 'horizontal' | 'vertical';
  private handle: HTMLElement;
  private pane1: HTMLElement | null = null;
  private pane2: HTMLElement | null = null;
  private isResizing = false;
  private startPos = 0;
  private startSize = 0;
  private minSizes: [number, number];
  private onResize?: (sizes: [number, number]) => void;

  constructor(options: ResizablePanesOptions) {
    this.container = options.container;
    this.direction = options.direction;
    this.minSizes = options.minSizes || [100, 100];
    this.onResize = options.onResize;

    this.handle = document.createElement('div');
    this.init(options.initialSizes);
  }

  private init(initialSizes?: [number, number]): void {
    const children = Array.from(this.container.children) as HTMLElement[];
    if (children.length < 2) {
      console.warn('ResizablePanes requires at least 2 child elements');
      return;
    }

    this.pane1 = children[0];
    this.pane2 = children[1];

    // Set up container styles
    this.container.style.display = 'flex';
    this.container.style.flexDirection = this.direction === 'horizontal' ? 'row' : 'column';
    this.container.style.position = 'relative';

    // Set initial sizes
    const size1 = initialSizes?.[0] || 50;
    const size2 = initialSizes?.[1] || 50;

    if (this.direction === 'horizontal') {
      this.pane1.style.width = `${size1}%`;
      this.pane2.style.width = `${size2}%`;
      this.pane1.style.height = '100%';
      this.pane2.style.height = '100%';
    } else {
      this.pane1.style.height = `${size1}%`;
      this.pane2.style.height = `${size2}%`;
      this.pane1.style.width = '100%';
      this.pane2.style.width = '100%';
    }

    this.pane1.style.overflow = 'hidden';
    this.pane2.style.overflow = 'hidden';

    // Create and insert handle
    this.createHandle();
    this.pane1.insertAdjacentElement('afterend', this.handle);

    // Set up event listeners
    this.setupEventListeners();
  }

  private createHandle(): void {
    const isHorizontal = this.direction === 'horizontal';

    this.handle.className = 'resizable-handle';
    this.handle.style.cssText = `
      ${isHorizontal ? 'width: 6px; height: 100%;' : 'width: 100%; height: 6px;'}
      background: transparent;
      cursor: ${isHorizontal ? 'col-resize' : 'row-resize'};
      position: relative;
      flex-shrink: 0;
      z-index: 100;
      transition: background 0.15s ease;
    `;

    // Create visual indicator
    const indicator = document.createElement('div');
    indicator.className = 'resizable-handle-indicator';
    indicator.style.cssText = `
      position: absolute;
      ${isHorizontal ? 'width: 2px; height: 100%; left: 2px; top: 0;' : 'width: 100%; height: 2px; top: 2px; left: 0;'}
      background: rgba(255, 255, 255, 0.06);
      transition: background 0.15s ease;
    `;
    this.handle.appendChild(indicator);

    // Hover effect
    this.handle.addEventListener('mouseenter', () => {
      indicator.style.background = 'var(--accent, #FF4D00)';
    });

    this.handle.addEventListener('mouseleave', () => {
      if (!this.isResizing) {
        indicator.style.background = 'rgba(255, 255, 255, 0.06)';
      }
    });
  }

  private setupEventListeners(): void {
    this.handle.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));

    // Touch support
    this.handle.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onMouseUp.bind(this));
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.startResize(this.direction === 'horizontal' ? e.clientX : e.clientY);
  }

  private onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    this.startResize(this.direction === 'horizontal' ? touch.clientX : touch.clientY);
  }

  private startResize(pos: number): void {
    this.isResizing = true;
    this.startPos = pos;

    if (this.pane1) {
      this.startSize = this.direction === 'horizontal'
        ? this.pane1.offsetWidth
        : this.pane1.offsetHeight;
    }

    document.body.style.cursor = this.direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    // Highlight handle during resize
    const indicator = this.handle.querySelector('.resizable-handle-indicator') as HTMLElement;
    if (indicator) {
      indicator.style.background = 'var(--accent, #FF4D00)';
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.isResizing) return;
    this.resize(this.direction === 'horizontal' ? e.clientX : e.clientY);
  }

  private onTouchMove(e: TouchEvent): void {
    if (!this.isResizing) return;
    const touch = e.touches[0];
    this.resize(this.direction === 'horizontal' ? touch.clientX : touch.clientY);
  }

  private resize(currentPos: number): void {
    if (!this.pane1 || !this.pane2) return;

    const diff = currentPos - this.startPos;
    const containerSize = this.direction === 'horizontal'
      ? this.container.offsetWidth
      : this.container.offsetHeight;

    let newSize1 = this.startSize + diff;
    let newSize2 = containerSize - newSize1 - 6; // 6px for handle

    // Apply minimum sizes
    if (newSize1 < this.minSizes[0]) {
      newSize1 = this.minSizes[0];
      newSize2 = containerSize - newSize1 - 6;
    }
    if (newSize2 < this.minSizes[1]) {
      newSize2 = this.minSizes[1];
      newSize1 = containerSize - newSize2 - 6;
    }

    // Convert to percentages
    const pct1 = (newSize1 / containerSize) * 100;
    const pct2 = (newSize2 / containerSize) * 100;

    if (this.direction === 'horizontal') {
      this.pane1.style.width = `${pct1}%`;
      this.pane2.style.width = `${pct2}%`;
    } else {
      this.pane1.style.height = `${pct1}%`;
      this.pane2.style.height = `${pct2}%`;
    }

    // Callback
    this.onResize?.([pct1, pct2]);

    // Dispatch resize event for Monaco editor
    window.dispatchEvent(new Event('resize'));
  }

  private onMouseUp(): void {
    if (!this.isResizing) return;

    this.isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const indicator = this.handle.querySelector('.resizable-handle-indicator') as HTMLElement;
    if (indicator) {
      indicator.style.background = 'rgba(255, 255, 255, 0.06)';
    }

    // Save sizes to localStorage
    if (this.pane1 && this.pane2) {
      const size1 = this.direction === 'horizontal'
        ? this.pane1.style.width
        : this.pane1.style.height;
      const size2 = this.direction === 'horizontal'
        ? this.pane2.style.width
        : this.pane2.style.height;

      localStorage.setItem('resizable-panes-sizes', JSON.stringify({
        direction: this.direction,
        sizes: [size1, size2],
      }));
    }
  }

  /**
   * Set pane sizes programmatically
   */
  setSizes(sizes: [number, number]): void {
    if (!this.pane1 || !this.pane2) return;

    if (this.direction === 'horizontal') {
      this.pane1.style.width = `${sizes[0]}%`;
      this.pane2.style.width = `${sizes[1]}%`;
    } else {
      this.pane1.style.height = `${sizes[0]}%`;
      this.pane2.style.height = `${sizes[1]}%`;
    }

    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Get current sizes
   */
  getSizes(): [number, number] {
    if (!this.pane1 || !this.pane2) return [50, 50];

    const size1 = this.direction === 'horizontal'
      ? parseFloat(this.pane1.style.width)
      : parseFloat(this.pane1.style.height);
    const size2 = this.direction === 'horizontal'
      ? parseFloat(this.pane2.style.width)
      : parseFloat(this.pane2.style.height);

    return [size1, size2];
  }

  /**
   * Restore saved sizes from localStorage
   */
  restoreSizes(): void {
    try {
      const saved = localStorage.getItem('resizable-panes-sizes');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.direction === this.direction) {
          const sizes = data.sizes.map((s: string) => parseFloat(s)) as [number, number];
          this.setSizes(sizes);
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Dispose and clean up
   */
  dispose(): void {
    this.handle.remove();
  }
}

export default ResizablePanes;
