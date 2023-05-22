/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
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
    buttonId?: string;
    onBeforeMount?: () => void;
    onMounted?: (root: HTMLElement) => void;
    onBeforeUnmount?: () => void;
    onUnmounted?: () => void;
}
export interface Page {
    pageId: string;
    pageLabel: string;
    pageType: string;
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
    options: Array<{
        label: string;
        icon?: string;
        value: any;
    }>;
    value: {
        label: string;
        icon?: string;
        value: any;
    };
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
    step?: number;
    snap?: boolean;
    value: number;
}
export declare class Plugin {
    ribbonBtns: Button[];
    ribbonToggleBtns: ToggleButton[];
    pdfMenuBtns: Button[];
    pdfMenuToggleBtns: ToggleButton[];
    leftMenuViews: View[];
    pdfMenuViews: View[];
    pageViews: View[];
    settings: Array<SettingToggle | SettingSelect | SettingSlider | SettingInput>;
    params: Params;
    controller: Controller;
    constructor(params: Params, controller: Controller);
    /**
     * Clears all data
     */
    init(): void;
    /**
     * Runs when plugin is enabled
     * Put all addXXBtn / addXXView here
     */
    enable(): void;
    /**
     * Runs when plugin is disabled
     */
    disable(): void;
    /**
     * Add a button to ribbon
     * @param btn
     */
    addRibbonBtn(btn: Button): void;
    /**
     * Add a toggle button to ribbon
     * @param btn
     */
    addRibbonToggleBtn(btn: ToggleButton): void;
    /**
     * Add a button to selection menu in PDF
     * @param btn
     */
    addPDFMenuBtn(btn: Button): void;
    /**
     * Add a toggle button to selection menu in PDF
     * @param btn
     */
    addPDFMenuToggleBtn(btn: ToggleButton): void;
    /**
     * Register toggle view to LeftMenu
     * @param view
     */
    registerLeftMenuView(view: View): void;
    toggleLeftMenu(visible?: boolean): void;
    /**
     * Register toggle view to selection menu in PDF
     * @param view
     */
    registerPDFMenuView(view: View): void;
    togglePDFMenuView(visible?: boolean): void;
    /**
     * Register view to Page
     * @param view
     */
    registerPageView(view: View): void;
    openPage(page: Page): void;
    closePage(pageId: string): void;
    addSetting(setting: SettingToggle | SettingSelect | SettingSlider | SettingInput): void;
    getSettingValue(label: string): SettingToggle | SettingSelect | SettingInput | SettingSlider | undefined;
    /**
     * No need to call this.
     * PluginManager will call this function automatically
     * when values in settings changed
     */
    saveSettings(): void;
    /**
     * No need to call this.
     * PluginManager will load settings after plugin is enabled
     */
    loadSettings(): void;
    /**
     * Save data to local disk, resides in plugin's folder
     * @param fileName - fileName with extension
     * @param options - fs.writeFileSync options
     */
    saveData(fileName: string, data: string | NodeJS.ArrayBufferView, options?: fs.WriteFileOptions): Promise<void>;
    /**
     * Load data from local disk, load from plugin's folder
     * @param fileName - fileName with extension
     * @param encoding - 'ascii' | 'utf8' | 'utf-8' | ...
     */
    loadData(fileName: string, encoding: BufferEncoding): string | undefined;
}
export {};
