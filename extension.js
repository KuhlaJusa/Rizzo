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
import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { QuickToggle, SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import Shell from 'gi://Shell'

const ExampleToggle = GObject.registerClass(
    class ExampleToggle extends QuickToggle {
        constructor() {
            super({
                title: _('Smile'),
                iconName: 'face-smile-symbolic',
                toggleMode: true,
            });
        }
    });

const ExampleIndicator = GObject.registerClass(
    class ExampleIndicator extends SystemIndicator {
        constructor() {
            super();

            this._indicator = this._addIndicator();
            this._indicator.iconName = 'face-smile-symbolic';

            const toggle = new ExampleToggle();
            toggle.bind_property('checked',
                this._indicator, 'visible',
                GObject.BindingFlags.SYNC_CREATE);
            this.quickSettingsItems.push(toggle);
        }
    });

export default class QuickSettingsExampleExtension extends Extension {
    enable() {
        this._indicator = new ExampleIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);



        console.log("Hello world!\n\n\n\n");
        // this.focusWindowNotifyConnection = Shell.Global.get().display.connect('notify::focus_window', this.onFocusWindowNotify.bind(this)); // wird nie getriggert
        // let x = Shell.Global.get().display.get_focus_window();
        // console.log(Shell.Global.get().display.list_all_windows()) // empty array
        // if (x != null) {
        //     console.log(x.get_title());
        // } else {
        //     console.log("null"); // null?!?
        // }
        // this.onFocusWindowNotify();
        this.restacked = global.display.connect('notify::focus_window', () => console.log("HA\n\n\n\n"));
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
    }
    onFocusWindowNotify() {
        console.log("Signal\n\n\n\n"); // passiert nicht
        let x = Shell.Global.get().display;
        let y = x.get_focus_window();
        if (y != null) {
            console.log(y.get_title());
        } else {
            console.log("y is null");
        }
        this.focusWindowNotifyConnection = Shell.Global.get().display.connect('notify::focus_window', this.onFocusWindowNotify.bind(this));
    }
}
