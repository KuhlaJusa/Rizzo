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


const FuckYouGnome = GObject.registerClass(
    class FuckYouGnome extends GObject.Object {
        constructor() {
            super();
            this._restacked = global.display.connect('restacked', () => console.log("HA\n\n\n\n"));
        }

        destroy() {
            global.display.disconnet(this._restacked);
            super.destroy();

        }
    }
);

export default class QuickSettingsExampleExtension extends Extension {
    enable() {



        console.log("Hello world!\n\n\n\n");
        this.logic = new FuckYouGnome();
    }

    disable() {
    }
}
