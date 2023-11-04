
import Gio from 'gi://Gio';
Gio._promisify(Gio.Subprocess.prototype, 'communicate_async');
Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_check_async');
Gio._promisify(Gio.DataInputStream.prototype, 'read_line_async',
    'read_line_finish_utf8');
Gio._promisify(Gio.OutputStream.prototype, 'write_bytes_async');
"use strict";

export class RatbagInterface {
    constructor() {
        this.device_list = [];
    }
    async init() {
        let flags = Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE | Gio.SubprocessFlags.STDIN_PIPE;
        let proc = Gio.Subprocess.new(
            ["ratbagctl", "--version"], flags
        )
        let [text, stderr_] = await proc.communicate_utf8_async(null, null);
        console.log("Detected ratbagctl version: " + text);
        this.device_list = await this.get_device_list();
    }
    async get_device_list() {
        let flags = Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE | Gio.SubprocessFlags.STDIN_PIPE;
        let proc = Gio.Subprocess.new(
            ["ratbagctl", "list"], flags
        )
        let [text, stderr_] = await proc.communicate_utf8_async(null, null);
        text = text.split("\n");
        text = text.map((str) => (str.split(":"))[0]).slice(0,-1);


        console.log("Detected ratbagctl version: " + text);
        console.log(text);
        return null

    }

}


class RatbagDevice {}
