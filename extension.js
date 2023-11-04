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

"use strict";

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { QuickToggle, SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';

Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async','read_bytes_finish');
/* Gio.Subprocess */
Gio._promisify(Gio.Subprocess.prototype, 'communicate_async');
Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_check_async');



const FuckYouGnome = GObject.registerClass(
    class FuckYouGnome extends GObject.Object {
        constructor() {
            super();
            this._restacked = global.display.connect('notify::focus-window', this.onFocusWindowSignal.bind(this));
        }

        destroy() {
            global.display.disconnect(this._restacked);
        }

        async onFocusWindowSignal() {
            /*get all windows /**/
            /*stores the pids in array /**/
            let pidArr = global.display.list_all_windows().map((window) => {
                return window.get_pid();
            });

            /*get the process names for each pid (async)/**/
            /*stores the names in array (sorted)/**/
            let procnameArr = (await Promise.all(
                pidArr.map((pid) => this.pidToProcname(pid))
            )).sort();

            console.log(procnameArr + "\n");

            return;
        }

        async pidToProcname(pid){
            try {

                let flags = Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE | Gio.SubprocessFlags.STDIN_PIPE;
                /*execute command in new process /**/
                let sp = Gio.Subprocess.new(["ps", "-p", pid + "", "-o",  "comm="], flags);
                /*connect to subprocess, wait for finish and read stdout (async) /**/
                let[text, stderr_] = await sp.communicate_utf8_async(null, null);

                /*remove linebreak of output /**/
                if (text){
                    /* text was not (empty string, false, 0, null, undefined, ...) /**/
                    text = text.slice(0,-1);
                }

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
