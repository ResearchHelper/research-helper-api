"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
class Plugin {
    constructor(params, controller) {
        this.ribbonBtns = [];
        this.ribbonToggleBtns = [];
        this.pdfMenuBtns = [];
        this.pdfMenuToggleBtns = [];
        this.leftMenuViews = [];
        this.pdfMenuViews = [];
        this.pageViews = [];
        this.settings = [];
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
    disable() { }
    /**
     * Add a button to ribbon
     * @param btn
     */
    addRibbonBtn(btn) {
        this.ribbonBtns.push(btn);
    }
    /**
     * Add a toggle button to ribbon
     * @param btn
     */
    addRibbonToggleBtn(btn) {
        this.ribbonToggleBtns.push(btn);
    }
    /**
     * Add a button to selection menu in PDF
     * @param btn
     */
    addPDFMenuBtn(btn) {
        this.pdfMenuBtns.push(btn);
    }
    /**
     * Add a toggle button to selection menu in PDF
     * @param btn
     */
    addPDFMenuToggleBtn(btn) {
        this.pdfMenuToggleBtns.push(btn);
    }
    /**
     * Register toggle view to LeftMenu
     * @param view
     */
    registerLeftMenuView(view) {
        this.leftMenuViews.push(view);
    }
    toggleLeftMenu(visible) {
        this.controller.layout.toggleLeftMenu(visible);
    }
    /**
     * Register toggle view to selection menu in PDF
     * @param view
     */
    registerPDFMenuView(view) {
        this.pdfMenuViews.push(view);
    }
    togglePDFMenuView(visible) {
        this.controller.layout.togglePDFMenuView(visible);
    }
    /**
     * Register view to Page
     * @param view
     */
    registerPageView(view) {
        this.pageViews.push(view);
    }
    openPage(page) {
        let _page = {};
        _page = Object.assign(_page, page);
        _page.pageId = `${this.params.pluginId}-${page.pageId}`;
        this.controller.layout.openPage(_page);
    }
    closePage(pageId) {
        this.controller.layout.closePage(pageId);
    }
    addSetting(setting) {
        this.settings.push(setting);
    }
    getSettingValue(label) {
        return this.settings.find((setting) => setting.label === label);
    }
    /**
     * No need to call this.
     * PluginManager will call this function automatically
     * when values in settings changed
     */
    saveSettings() {
        console.log("saving");
        this.saveData("pluginSettings.json", JSON.stringify(this.settings));
    }
    /**
     * No need to call this.
     * PluginManager will load settings after plugin is enabled
     */
    loadSettings() {
        let raw = this.loadData("pluginSettings.json", "utf8");
        if (raw)
            this.settings = JSON.parse(raw);
    }
    /**
     * Save data to local disk, resides in plugin's folder
     * @param fileName - fileName with extension
     * @param options - fs.writeFileSync options
     */
    saveData(fileName, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filePath = this.controller.path.join(this.params.pluginPath, fileName);
                this.controller.fs.writeFileSync(filePath, data, options);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /**
     * Load data from local disk, load from plugin's folder
     * @param fileName - fileName with extension
     * @param encoding - 'ascii' | 'utf8' | 'utf-8' | ...
     */
    loadData(fileName, encoding) {
        try {
            let filePath = this.controller.path.join(this.params.pluginPath, fileName);
            return this.controller.fs.readFileSync(filePath, { encoding });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.Plugin = Plugin;
