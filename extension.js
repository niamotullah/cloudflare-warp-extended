const { St, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

var WarpExtension = GObject.registerClass(
  class WarpExtension extends PanelMenu.Button {
    _init() {
      super._init(0.0);

      // Create label with "warp" text
      this.label = new St.Label({
        text: "warp",
        style_class: "panel-label"
      });
      this.actor.add_child(this.label);

      // Connect click event
      this.actor.connect("button-press-event", this._toggleConnection.bind(this));

      this.isWarpConnected = false;
    }

    _toggleConnection() {
      if (this.isWarpConnected) {
        this._runCommand("warp-cli disconnect");
      } else {
        this._runCommand("warp-cli connect");
      }
      this.isWarpConnected = !this.isWarpConnected;
    }

    _runCommand(command) {
      try {
        GLib.spawn_command_line_async(command);
      } catch (error) {
        logError(`Error running command: ${error.message}`);
      }
    }
  }
);

function init() {
  // Do nothing here
}

let extension = null;

function enable() {
  extension = new WarpExtension();
  Main.panel.addToStatusArea("warp-extension", extension);
}

function disable() {
  if (extension) {
    extension.destroy();
    extension = null;
  }
}

