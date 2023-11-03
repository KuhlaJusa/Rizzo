/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Shell from 'gi://Shell'
import GObject from 'gi://GObject';
import Gio from 'gi://Gio'

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { QuickToggle, SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';


const FuckYouGnome = GObject.registerClass(
    class FuckYouGnome extends GObject.Object {
        constructor() {
            super();
            this._restacked = global.display.connect('notify::focus-window', () => {this.onFocusWindowSignal();});
            //this._restacked = global.display.connect('notify::focus-window', () => {
            //    this.onFocusWindowSignal().resolve().catch();
            //})


        }

        destroy() {
            global.display.disconnect(this._restacked);
        }

        async onFocusWindowSignal() {
            //let fw = global.display.focus_window.get_pid();

            
            let pid_arr = global.display.list_all_windows().map((window) => window.get_pid());
            console.log(pid_arr +"\n\n");
            var procname_arr = await Promise.all(pid_arr.map(
                async (pid) => {
                    let procname = await this.pid_to_procname(pid).then((value) => {console.log(value + "kam wieder\n"); return value;});
                    console.log(procname + "kam wieder again\n");
                    return procname;
                })
            );
            // "ps -p {fw.get_pid()} -o comm="
            console.log(procname_arr + " jetzt\n");
        }
        async pid_to_procname(pid){
            try {

                let flags = Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE | Gio.SubprocessFlags.STDIN_PIPE;
                /*execute command in new process/**/
                let sp = Gio.Subprocess.new(["ps", "-p", pid + "", "-o",  "comm="], flags);
                sp.wait(Gio.Cancellable.new());
                
                /*get outputpipe of process /**/
                let sop = sp.get_stdout_pipe();

                let x = sop.read_bytes(128, null).unref_to_array();
                let text = new TextDecoder().decode(x);

                sp.force_exit();
                return text; 

            } catch(error){
                console.log(error + "\n\n\n");
            }
        }
    }
);


export default class QuickSettingsExampleExtension extends Extension {
    enable() {
        console.log("Hello world!\n\n\n\n");
        this.logic = new FuckYouGnome();
    }

    disable() {
        this.logic.destroy();
    }
}
