/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { BoxOptions, OptimizedBuffer, RenderContext } from "@opentui/core";
import { BoxRenderable, RGBA } from "@opentui/core";

/**
 * A custom renderable representing a console button.
 */
export class ButtonRenderable extends BoxRenderable {
  private _label: string = "Button";

  constructor(ctx: RenderContext, options: BoxOptions & { label?: string }) {
    super(ctx, options);

    if (options.label) {
      this._label = options.label;
    }

    // Set some default styling for buttons
    this.borderStyle = "single";
    this.padding = 2;
  }

  protected override renderSelf(buffer: OptimizedBuffer): void {
    super.renderSelf(buffer);

    const centerX =
      this.x + Math.floor(this.width / 2 - this._label.length / 2);
    const centerY = this.y + Math.floor(this.height / 2);

    buffer.drawText(
      this._label,
      centerX,
      centerY,
      RGBA.fromInts(255, 255, 255, 255)
    );
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
    this.requestRender();
  }
}
