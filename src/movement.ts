export {}
// export function handle_hjkl (state: typeof State, event: any, view: MarkdownView) {
			
// 			switch(event.key){
// 				case 'h':
// 					set_cursor_ch_delta(-1, state, view);
// 					break;
// 				case 'j':
// 					set_cursor_line_delta(1, state, view);
// 					break;
// 				case 'k':
// 					set_cursor_line_delta(-1, state, view);
// 					break;
// 				case 'l':
// 					set_cursor_ch_delta(1, state, view);
// 					break;			
// 			}
// 		}

// const set_cursor_line_delta = (line_delta: number, state: typeof State, view: MarkdownView) => {

// 			if(state.numRepeat > 0) {
// 				line_delta *= state.numRepeat;
// 				state.numRepeat = -1;
// 			}

// 			let line_number = line_delta + view.editor.getCursor().line;

// 			if (line_number < 0) {
// 				line_number = 0;
// 			} 
// 			else if(line_number >=  view.editor.lineCount()) {
// 				line_number = view.editor.lineCount() - 1;
// 			}

// 			if (view.editor.getLine(line_number).length < state.targetCh){
// 				view.editor.setCursor(line_number, view.editor.getLine(line_number).length);
// 			} else {
// 				view.editor.setCursor(line_number, state.targetCh);						
// 			}		
// 		}
// //numRepeat
// 		const set_cursor_ch_delta = (ch_delta: number, state: typeof State, view: MarkdownView) => {
// 			if(state.numRepeat > 0){
// 				ch_delta *= state.numRepeat;
// 				state.numRepeat = -1;
// 			}

// 			// if (ch_delta < 0 && currCh + ch_delta <= 0 && currLine > 0) {
// 			// 	let remaining_delta = ch_delta;
// 			// 	while (remaining_delta > 0) {
// 			// 		let temp = view.editor.getCursor().ch - remaining_delta;
// 			// 		if(temp > 0){
// 			// 			new Notice("temp > 0");
// 			// 			const lineLength = view.editor.getLine(view.editor.getCursor().line).length;
// 			// 			view.editor.setCursor(lineLength - remaining_delta);
// 			// 			remaining_delta = 0;
// 			// 			break;
// 			// 		} else {
// 			// 			new Notice("temp <= 0");
// 			// 			const targetLine = view.editor.getCursor().line - 1;
// 			// 			remaining_delta -= view.editor.getCursor().ch;
// 			// 			view.editor.setCursor(targetLine, view.editor.getLine(targetLine).length)
// 			// 		}
// 			// 		// TODO: figure out logic for line wrapping
// 			// 		if(view.editor.getCursor().line == 0){
// 			// 			break;
// 			// 		}
// 			// 	}
// 			// 	view.editor.setCursor(currLine)
// 			// } else {
// 			// 	new Notice("took else");
// 			// 	view.editor.setCursor(currLine, currCh + ch_delta);
// 			// }

// 			//TODO: optimize
// 			if(ch_delta < 0) {
// 				for(let i = 0; i < Math.abs(ch_delta); i++){
// 					let {line: currLine, ch: currCh} = view.editor.getCursor();
// 					new Notice(ch_delta.toString());
// 					if(currCh == 0){
// 						view.editor.setCursor(currLine - 1, view.editor.getLine(currLine - 1).length);
// 					} else {
// 						view.editor.setCursor(currLine, currCh - 1);
// 					}
// 				}
// 			} else {
// 				for(let i = 0; i < Math.abs(ch_delta); i++){
// 					let {line: currLine, ch: currCh} = view.editor.getCursor();
// 					view.editor.setCursor(currLine, currCh + ch_delta);
// 				}
// 			}
// 			state.targetCh = view.editor.getCursor().ch;
// 		}
