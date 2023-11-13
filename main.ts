import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { isNumberObject } from 'util/types';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class HelloWorld extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();


		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		const set_cursor_line_delta = (line_delta: number, state: typeof State, view: MarkdownView) => {

			if(state.numRepeat > 0) {
				line_delta *= state.numRepeat;
				state.numRepeat = -1;
			}

			let line_number = line_delta + view.editor.getCursor().line;

			if (line_number < 0) {
				line_number = 0;
			} 
			else if(line_number >=  view.editor.lineCount()) {
				line_number = view.editor.lineCount() - 1;
			}

			if (view.editor.getLine(line_number).length < state.targetCh){
				view.editor.setCursor(line_number, view.editor.getLine(line_number).length);
			} else {
				view.editor.setCursor(line_number, state.targetCh);						
			}		
		}

		const set_cursor_ch_delta = (ch_delta: number, state: typeof State, view: MarkdownView) => {
			if(state.numRepeat > 0){
				ch_delta *= state.numRepeat;
				state.numRepeat = -1;
			}

			const {line: currLine, ch: currCh} = view.editor.getCursor();
			if (ch_delta < 0 && currCh + ch_delta < 0 && currLine > 0) {
				let remaining_delta = ch_delta;
				while (remaining_delta > 0) {
					// TODO: figure out logic for line wrapping
					if(view.editor.getCursor().line == 0){
						break;
					}
				}
				view.editor.setCursor(currLine )
			} else {
				view.editor.setCursor(currLine, currCh + ch_delta);
			}
			state.targetCh = view.editor.getCursor().ch;
		}

		const handle_hjkl = (state: typeof State, event: any, view: MarkdownView) => {
			
			switch(event.key){
				case 'h':
					set_cursor_ch_delta(-1, state, view);
					break;
				case 'j':
					set_cursor_line_delta(1, state, view);
					break;
				case 'k':
					set_cursor_line_delta(-1, state, view);
					break;
				case 'l':
					set_cursor_ch_delta(1, state, view);
					break;			
			}
		}

		const delete_selection = (state: typeof State, view: MarkdownView) => {
			view.editor.replaceSelection("");
			state.targetCh = view.editor.getCursor().ch;
		}

		const handle_select = (state: typeof State, event: any, view: MarkdownView) => {
			new Notice("we are in select");
			view.editor.blur();

			if(!event.defaultPrevented){
				switch(event.key) {
					case 'Escape': case 'v':
						state.handler = handle_normal;
						event.preventDefault();
						state.handler(state, event, view);
						return;
					case 'h': case 'j': case 'k': case 'l': 
						handle_hjkl(state, event, view);
						break;
					case 'd':
						delete_selection(state, view);
						break;
					case 'u':
						view.editor.undo();
						break;
					case 'U':
						view.editor.redo();
						break;
				}
			}
			
			if(state.anchor.valid){
				view.editor.setSelection(state.anchor.position);
			} else {
				state.anchor.position = view.editor.getCursor();
				state.anchor.valid = true;
			}
		}

		const handle_normal = (state: typeof State, event: any, view: MarkdownView) => {

			if(event.cancelable){
				
			}

			// Do not allow typing cursor
			view.editor.blur();


			if(!event.defaultPrevented){
				switch (event.key) {
					case 'i':
						state.mode = Mode.Insert;
						state.handler = handle_insert;
						state.handler(state, event, view);
						return;
					case 'v':
						state.mode = Mode.Select;
						state.handler = handle_select;
						event.preventDefault();
						state.handler(state, event, view);
						return;
					case 'h': case 'j': case 'k': case 'l': 
						handle_hjkl(state, event, view);
						break;
					case 'd':
						delete_selection(state, view);
						break;
					case 'u':
						view.editor.undo();
						break;
					case 'U':
						view.editor.redo();
						break;
				}
			}


			// If it is a digit
			if(event.key.length == 1 && event.key.charAt(0) >= '0' && event.key.charAt(0) <= '9'){
				const curr: number = event.key.charAt(0);

				if(curr == 0 && state.numRepeat == -1) return;

				if(state.numRepeat == -1) {
					state.numRepeat = curr;
				} else {
					state.numRepeat *= 10;
					state.numRepeat += curr;
				}

			} 

			
			view.editor.setSelection({line: view.editor.getCursor().line, ch: view.editor.getCursor().ch + 1},view.editor.getCursor());
		}

		const handle_insert = (state: typeof State, event: any, view: MarkdownView) => {

			if(event.key == 'Escape'){
				state.handler = handle_normal;
				state.handler(state, event, view);
				return;
			}
			
			if(!view.editor.hasFocus()){
				view.editor.setSelection(view.editor.getCursor(), view.editor.getCursor());
				event.preventDefault();
				view.editor.focus();
			}

		}

		enum Mode {
			Normal,
			Insert,
			Select,
		}
		
		const State = {
			command: [],
			mode: Mode.Normal,
			handler:(state: any, event: any, view: MarkdownView) => handle_normal(state, event, view),
			targetCh: 0,
			numRepeat: -1,
			anchor: {
				valid: false,
				position: {
					ch: 0,
					line: 0,
				}
			}
		}


		addEventListener("keydown", async (event) => {
			
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view == undefined) return;
			event.defaultPrevented
			// switch(State.mode) {
			// 	case Mode.Normal:
			// 	case Mode.Visual:
			// 		handle_normal_visual(State, event, view);
			// 		break;
			// 	case Mode.Insert:
			// 		handle_insert(State, event, view);
			// }
			State.handler(State, event, view);


			
			// view?.editor.setCursor(0, 10);
			// if (view?.editor.hasFocus()){
			// 	view?.editor.blur();
			// } else { 
			// 	view?.editor.focus();
			// }
			
			new Notice(event.key);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: HelloWorld;

	constructor(app: App, plugin: HelloWorld) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
