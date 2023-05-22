import path from "path";
import fs from "fs";

export interface Button {
  id: string;
  icon: string;
  tooltip: string;
  click: () => void;
}

export interface ToggleButton {
  id: string;
  icon: string;
  tooltip: string;
}

export interface View {
  buttonId?: string; // corresponding buttonId
  onBeforeMount?: () => void;
  onMounted?: (root: HTMLElement) => void;
  onBeforeUnmount?: () => void;
  onUnmounted?: () => void;
}

export interface Page {
  id: string;
  label: string;
  type: string;
  data?: any;
}

interface LayoutController {
  openPage: (page: Page) => void;
  closePage: (pageId: string) => void;
  toggleLeftMenu: (visible?: boolean) => void;
  togglePDFMenuView: (visible?: boolean) => void;
}

interface Controller {
  layout: LayoutController;
  path: typeof path;
  fs: typeof fs;
}

interface Params {
  pluginPath: string;
  pluginId: string;
}

// plugin settings
interface Setting {
  label: string;
  description: string;
}

export interface SettingToggle extends Setting {
  type: "toggle";
  value: boolean;
}

export interface SettingSelect extends Setting {
  type: "select";
  options: Array<{ label: string; icon?: string; value: any }>;
  value: { label: string; icon?: string; value: any };
}

export interface SettingInput extends Setting {
  type: "input";
  inputType: "text" | "number";
  value: string | number;
}

export interface SettingSlider extends Setting {
  type: "slider";
  min: number;
  max: number;
  step?: number; // step between valid values > 0.0
  snap?: boolean; // snap on valid values
  value: number;
}

export class Plugin {
  ribbonBtns: Button[] = [];
  ribbonToggleBtns: ToggleButton[] = [];
  pdfMenuBtns: Button[] = [];
  pdfMenuToggleBtns: ToggleButton[] = [];
  leftMenuViews: View[] = [];
  pdfMenuViews: View[] = [];
  pageViews: View[] = [];
  settings: Array<
    SettingToggle | SettingSelect | SettingSlider | SettingInput
  > = [];
  params: Params;
  controller: Controller;

  constructor(params: Params, controller: Controller) {
    this.params = params;
    this.controller = controller;
  }

  /**
   * Clears all data
   */
  init() {
    this.ribbonBtns = [];
    this.ribbonToggleBtns = [];
    this.pdfMenuBtns = [];
    this.pdfMenuToggleBtns = [];
    this.leftMenuViews = [];
    this.pdfMenuViews = [];
    this.pageViews = [];
    this.settings = [];
  }

  /**
   * Runs when plugin is enabled
   * Put all addXXBtn / addXXView here
   */
  enable() {
    throw new Error("enable() must be implemented");
  }

  /**
   * Runs when plugin is disabled
   */
  disable() {}

  /**
   * Add a button to ribbon
   * @param btn
   */
  addRibbonBtn(btn: Button) {
    this.ribbonBtns.push(btn);
  }

  /**
   * Add a toggle button to ribbon
   * @param btn
   */
  addRibbonToggleBtn(btn: ToggleButton) {
    this.ribbonToggleBtns.push(btn);
  }

  /**
   * Add a button to selection menu in PDF
   * @param btn
   */
  addPDFMenuBtn(btn: Button) {
    this.pdfMenuBtns.push(btn);
  }

  /**
   * Add a toggle button to selection menu in PDF
   * @param btn
   */
  addPDFMenuToggleBtn(btn: ToggleButton) {
    this.pdfMenuToggleBtns.push(btn);
  }

  /**
   * Register toggle view to LeftMenu
   * @param view
   */
  registerLeftMenuView(view: View) {
    this.leftMenuViews.push(view);
  }

  toggleLeftMenu(visible?: boolean) {
    this.controller.layout.toggleLeftMenu(visible);
  }

  /**
   * Register toggle view to selection menu in PDF
   * @param view
   */
  registerPDFMenuView(view: View) {
    this.pdfMenuViews.push(view);
  }

  togglePDFMenuView(visible?: boolean) {
    this.controller.layout.togglePDFMenuView(visible);
  }

  /**
   * Register view to Page
   * @param view
   */
  registerPageView(view: View) {
    this.pageViews.push(view);
  }

  openPage(page: Page) {
    let _page = {} as Page;
    _page = Object.assign(_page, page);
    _page.id = `${this.params.pluginId}-${page.id}`;
    this.controller.layout.openPage(_page);
  }

  closePage(pageId: string) {
    this.controller.layout.closePage(pageId);
  }

  addSetting(
    setting: SettingToggle | SettingSelect | SettingSlider | SettingInput
  ) {
    this.settings.push(setting);
  }

  getSettingValue(label: string) {
    return this.settings.find((setting) => setting.label === label);
  }

  /**
   * No need to call this.
   * PluginManager will call this function automatically
   * when values in settings changed
   */
  saveSettings() {
    this.saveData("pluginSettings.json", JSON.stringify(this.settings));
  }

  /**
   * No need to call this.
   * PluginManager will load settings after plugin is enabled
   */
  loadSettings() {
    let raw = this.loadData("pluginSettings.json", "utf8");
    if (raw) this.settings = JSON.parse(raw);
  }

  /**
   * Save data to local disk, resides in plugin's folder
   * @param fileName - fileName with extension
   * @param options - fs.writeFileSync options
   */
  async saveData(
    fileName: string,
    data: string | NodeJS.ArrayBufferView,
    options?: fs.WriteFileOptions
  ) {
    try {
      let filePath = this.controller.path.join(
        this.params.pluginPath,
        fileName
      );
      this.controller.fs.writeFileSync(filePath, data, options);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Load data from local disk, load from plugin's folder
   * @param fileName - fileName with extension
   * @param encoding - 'ascii' | 'utf8' | 'utf-8' | ...
   */
  loadData(fileName: string, encoding: BufferEncoding) {
    try {
      let filePath = this.controller.path.join(
        this.params.pluginPath,
        fileName
      );
      return this.controller.fs.readFileSync(filePath, { encoding });
    } catch (error) {
      console.log(error);
    }
  }
}
