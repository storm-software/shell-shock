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

import { code, Show, splitProps } from "@alloy-js/core";
import { FunctionDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  ClassDeclaration,
  ClassField,
  ClassMethod,
  ClassPropertyGet
} from "@powerlines/plugin-alloy/typescript/components/class-declaration";
import {
  InterfaceDeclaration,
  InterfaceMember
} from "@powerlines/plugin-alloy/typescript/components/interface-declaration";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { TypeDeclaration } from "@powerlines/plugin-alloy/typescript/components/type-declaration";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import defu from "defu";

export interface PromptsBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * A component that generates TypeScript declarations for built-in prompt types and related utilities, such as the base Prompt class, specific prompt types like TextPrompt and SelectPrompt, and utility functions for handling prompt cancellations. This component serves as a central place to define the types and interfaces for prompts used in the Shell Shock CLI, providing a consistent API for creating and managing prompts throughout the application.
 */
export function BasePromptDeclarations() {
  const theme = useTheme();

  return (
    <>
      <TSDoc heading="A utility function to pause execution for a specified duration, which can be used in prompt interactions to create delays or timeouts. The function returns a promise that resolves after the specified duration in milliseconds, allowing it to be used with async/await syntax for easier handling of asynchronous prompt logic.">
        <TSDocParam name="duration">
          {`The duration to sleep in milliseconds.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves after the specified duration, allowing for asynchronous delays in prompt interactions.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="sleep"
        parameters={[{ name: "duration", type: "number" }]}
        returnType="Promise<void>">{code`return new Promise((resolve) => setTimeout(resolve, duration)); `}</FunctionDeclaration>
      <Spacing />
      <TypeDeclaration
        export
        name="PromptParser"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}
        doc="A type for a custom prompt input parser, which can be used to create custom input styles for prompts. The function should return the parsed value for the given input string.">
        {code`(this: Prompt<TValue>, input: string) => TValue; `}
      </TypeDeclaration>
      <Spacing />
      <TypeDeclaration
        export
        name="PromptFormatter"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}
        doc="A type for a custom prompt input formatter, which can be used to create custom display styles for prompts. The function should return the formatted string to display for the given input value.">
        {code`(this: Prompt<TValue>, input: TValue) => string; `}
      </TypeDeclaration>
      <Spacing />
      <FunctionDeclaration
        export
        name="noMask"
        doc="A built-in prompt mask function that just returns the input as is, making it invisible"
        parameters={[{ name: "input", type: "string" }]}
        returnType="string">
        {code`return input; `}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        export
        name="invisibleMask"
        doc="A built-in prompt mask function that makes input invisible"
        parameters={[{ name: "input", type: "string" }]}
        returnType="string">
        {code`return " ".repeat(input.length); `}
      </FunctionDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="PromptState"
        doc="The current state of a prompt"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <InterfaceMember
          name="value"
          type="TValue"
          doc="The current value of the prompt"
        />
        <Spacing />
        <InterfaceMember
          name="isError"
          type="boolean"
          doc="Indicates whether the prompt is in an error state"
        />
        <Spacing />
        <InterfaceMember
          name="errorMessage"
          optional
          type="string"
          doc="If the prompt is in an error state, this will contain the error message to display"
        />
        <Spacing />
        <InterfaceMember
          name="isSubmitted"
          type="boolean"
          doc="Indicates whether the prompt is submitted"
        />
        <Spacing />
        <InterfaceMember
          name="isCancelled"
          type="boolean"
          doc="Indicates whether the prompt is cancelled"
        />
        <Spacing />
        <InterfaceMember
          name="isCompleted"
          type="boolean"
          doc="Indicates whether the prompt is completed, which can be used to indicate that the prompt interaction is finished regardless of whether it was submitted or cancelled"
        />
        <Spacing />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="PromptConfig"
        doc="Configuration options for creating a prompt"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <InterfaceMember
          name="input"
          optional
          type="NodeJS.ReadStream"
          doc="The readable stream to use for prompt input, defaults to process.stdin"
        />
        <Spacing />
        <InterfaceMember
          name="output"
          optional
          type="NodeJS.WriteStream"
          doc="The writable stream to use for prompt output, defaults to process.stdout"
        />
        <Spacing />
        <InterfaceMember
          name="message"
          type="string"
          doc="The prompt message to display"
        />
        <Spacing />
        <InterfaceMember
          name="description"
          optional
          type="string"
          doc="The prompt description message to display"
        />
        <Spacing />
        <InterfaceMember
          name="initialValue"
          optional
          type="TValue"
          doc="The initial value of the prompt"
        />
        <Spacing />
        <InterfaceMember
          name="validate"
          optional
          type="(value: TValue) => boolean | string | null | undefined | Promise<boolean | string | null | undefined>"
          doc="A validation function that returns true if the input is valid, false or a string error message if the input is invalid"
        />
        <Spacing />
        <InterfaceMember
          name="parse"
          optional
          type="PromptParser<TValue>"
          doc="A function that parses the input value and returns the parsed result or throws an error if the input is invalid"
        />
        <Spacing />
        <InterfaceMember
          name="format"
          optional
          type="PromptFormatter<TValue>"
          doc="A function that formats the input value and returns the formatted result or throws an error if the input is invalid"
        />
        <Spacing />
        <InterfaceMember
          name="mask"
          optional
          type="(input: string) => string"
          doc="A function that masks the input value and returns the masked result. This can be used to create password inputs or other sensitive input types where the actual input value should not be displayed. If not provided, the prompt will display the input as is without masking."
        />
        <Spacing />
        <InterfaceMember
          name="maskCompleted"
          optional
          type="(input: string) => string"
          doc="A function that masks the value submitted by the user so that it can then be used in the console output or elsewhere without exposing sensitive information. If not provided, the prompt will use the same mask function for both input and submitted value masking."
        />
        <Spacing />
        <InterfaceMember
          name="defaultErrorMessage"
          optional
          type="string"
          doc="The default error message to display when validation fails"
        />
        <Spacing />
        <InterfaceMember
          name="timeout"
          optional
          type="number"
          doc="The timeout duration in milliseconds for the prompt. If none is provided, the prompt will not time out."
        />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        abstract
        name="Prompt"
        doc="Base prompt class that other prompt types can extend from"
        extends="EventEmitter"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <ClassField name="readline" isPrivateMember type="readline.Interface" />
        <hbr />
        <ClassField name="value" isPrivateMember optional type="TValue" />
        <hbr />
        <ClassField name="isKeyPressed" isPrivateMember type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="isDirty" isPrivateMember type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="isClosed" isPrivateMember type="boolean">
          {code`false; `}
        </ClassField>
        <Spacing />
        <ClassField name="initialValue" abstract protected type="TValue" />
        <hbr />
        <ClassField name="input" protected type="NodeJS.ReadStream">
          {code`process.stdin; `}
        </ClassField>
        <hbr />
        <ClassField name="output" protected type="NodeJS.WriteStream">
          {code`process.stdout; `}
        </ClassField>
        <hbr />
        <ClassField name="message" protected type="string">
          {code`""; `}
        </ClassField>
        <hbr />
        <ClassField name="description" protected type="string">
          {code`""; `}
        </ClassField>
        <hbr />
        <ClassField name="errorMessage" protected type="string | null">
          {code`null; `}
        </ClassField>
        <hbr />
        <ClassField name="defaultErrorMessage" protected type="string">
          {code`"An invalid value was provided"; `}
        </ClassField>
        <hbr />
        <ClassField name="isSubmitted" protected type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="isCancelled" protected type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="isInitial" protected type="boolean">
          {code`true; `}
        </ClassField>
        <hbr />
        <ClassField name="consoleOutput" protected type="string">
          {code`""; `}
        </ClassField>
        <hbr />
        <ClassField name="consoleStatus" protected type="string">
          {code`""; `}
        </ClassField>
        <hbr />
        <ClassField name="displayValue" protected type="string">
          {code`""; `}
        </ClassField>
        <hbr />
        <ClassField
          name="validate"
          protected
          type="(value: TValue) => boolean | string | null | undefined | Promise<boolean | string | null | undefined>">
          {code`() => true; `}
        </ClassField>
        <hbr />
        <ClassField name="parse" protected type="PromptParser<TValue>">
          {code`(value: string) => value as TValue; `}
        </ClassField>
        <hbr />
        <ClassField name="format" protected type="PromptFormatter<TValue>">
          {code`(value: TValue) => String(value); `}
        </ClassField>
        <hbr />
        <ClassField name="mask" protected type="(input: string) => string">
          {code`noMask; `}
        </ClassField>
        <hbr />
        <ClassField
          name="maskCompleted"
          protected
          type="(input: string) => string">
          {code`this.mask; `}
        </ClassField>
        <hbr />
        <ClassField name="cursor" protected type="number">
          {code`0; `}
        </ClassField>
        <hbr />
        <ClassField name="cursorOffset" protected type="number">
          {code`0; `}
        </ClassField>
        <hbr />
        <ClassField name="cursorHidden" protected type="boolean">
          {code`false; `}
        </ClassField>
        <Spacing />
        {code`constructor(protected config: PromptConfig<TValue>) {
          super();

          if (config.input) {
            this.input = config.input;
          }
          if (config.output) {
            this.output = config.output;
          }
          if (config.defaultErrorMessage) {
            this.defaultErrorMessage = config.defaultErrorMessage;
          }
          if (config.description) {
            this.description = config.description;
          }
          if (config.validate) {
            this.validate = config.validate;
          }
          if (config.parse) {
            this.parse = config.parse.bind(this);
          }
          if (config.format) {
            this.format = config.format.bind(this);
          }

          if (config.maskCompleted) {
            this.maskCompleted = config.maskCompleted;
          }
          if (config.mask) {
            this.mask = config.mask;
          }

          if (config.timeout !== undefined && !Number.isNaN(config.timeout)) {
            setTimeout(() => {
              if (!this.isCompleted) {
                this.cancel();
              }
            }, config.timeout);
          }

          this.message = config.message;

          this.#readline = readline.createInterface({
            input: this.input,
            escapeCodeTimeout: 50
          });
          readline.emitKeypressEvents(this.input, this.#readline);

          if (this.input.isTTY) {
            this.input.setRawMode(true);
          }

          this.input.on("keypress", this.keypress.bind(this));
        }

        [Symbol.dispose]() {
          this.close();
        } `}
        <Spacing />
        <ClassPropertyGet
          public
          name="value"
          type="TValue"
          doc="A getter for the prompt value that returns the current value or the initial value if the current value is not set">
          {code`return this.#value || this.initialValue; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet public name="isError" type="boolean">
          {code`return !!this.errorMessage; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet protected name="isSelect" type="boolean">
          {code`return false; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet protected name="isCompleted" type="boolean">
          {code`return this.isCancelled || this.isSubmitted; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet protected name="isPlaceholder" type="boolean">
          {code`return (this.displayValue === this.format(this.initialValue) && !this.#isDirty) || !this.#isKeyPressed; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet protected name="status" type="string">
          {code`return this.isSubmitted ? "" : \` \\n    \${
              colors.italic(
                this.isError
                  ? colors.text.prompt.description.error(splitText(this.errorMessage, "3/4").join("\\n"))
                  : this.isCancelled
                    ? colors.text.prompt.description.cancelled(splitText("Input was cancelled by user", "3/4").join("\\n"))
                    : this.description
                      ? colors.text.prompt.description.active(splitText(this.description, "3/4").join("\\n"))
                      : ""
              )
            }\`; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet
          doc="A property to check if the cursor is at the start"
          name="isCursorAtStart"
          protected
          type="boolean">
          {code`return this.cursor === 0 || (this.isPlaceholder && this.cursor === 1); `}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertyGet
          doc="A property to check if the cursor is at the end"
          name="isCursorAtEnd"
          protected
          type="boolean">
          {code`return this.cursor === this.displayValue.length || (this.isPlaceholder && this.cursor === this.displayValue.length - 1); `}
        </ClassPropertyGet>
        <Spacing />
        <ClassMethod
          doc="A method to change the prompt value, which also updates the display value and fires a state update event. This method can be called by subclasses whenever the prompt value needs to be updated based on user input or other interactions."
          name="changeValue"
          protected
          parameters={[{ name: "value", type: "TValue" }]}>
          {code`const previousValue = this.value;

          let updatedValue = value;
          if (value === undefined || value === "") {
            updatedValue = this.initialValue;
          } else {
            updatedValue = value;
          }

          this.displayValue = this.mask(this.format(updatedValue));
          this.#value = updatedValue;

          if (!this.#isDirty && this.#value !== this.initialValue) {
            this.#isDirty = true;
          }

          this.onChange(previousValue);
          setTimeout(() => {
            Promise.resolve(this.checkValidations(updatedValue)).then(() => this.sync());
          }, 0);

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to emit the current state"
          name="sync"
          protected>
          {code`this.emit("state", {
            value: this.value,
            errorMessage: this.errorMessage,
            isError: this.isError,
            isSubmitted: this.isSubmitted,
            isCancelled: this.isCancelled,
            isCompleted: this.isCompleted
          });
          this.render(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod doc="A method to ring the bell" name="bell" protected>
          {code`this.output.write(beep); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          protected
          returnType="string">
          {code`return this.isPlaceholder
            ? colors.text.prompt.input.disabled(this.displayValue)
            : this.isError
              ? colors.text.prompt.input.error(this.displayValue)
              : this.isSubmitted
                ? colors.text.prompt.input.submitted(this.maskCompleted(this.displayValue))
                : this.isCancelled
                  ? colors.text.prompt.input.cancelled(this.maskCompleted(this.displayValue))
              : colors.bold(colors.text.prompt.input.active(this.displayValue)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle changes in the prompt value"
          name="onChange"
          protected
          parameters={[
            {
              name: "previousValue",
              type: "TValue"
            }
          ]}>
          {code` // can be implemented by subclasses to handle value changes if needed, this method is called whenever the prompt value changes and receives the previous value as an argument for reference`}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle key press events and determine the corresponding action"
          name="onKeyPress"
          protected
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`const action = this.getAction(key);
          if (!action) {
            this.bell();
          } else if (typeof (this as any)[action] === "function") {
            (this as any)[action](key);
          } `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to close the prompt and clean up resources, which also emits a submit or cancel event based on the prompt state. This method should be called when the prompt interaction is finished and the prompt needs to be closed."
          name="close"
          async
          protected>
          {code`if (this.#isClosed) {
            return;
          }

          this.output.write(cursor.show);
          this.input.removeListener("keypress", this.keypress);

          if (this.input.isTTY) {
            this.input.setRawMode(false);
          }

          this.#readline.close();
          this.emit(this.isSubmitted ? "submit" : "cancel", this.value);
          this.#isClosed = true; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to validate the prompt input using the provided validator function, which updates the error message and error state based on the validation result. This method is called whenever the prompt value changes and needs to be validated."
          name="checkValidations"
          async
          protected
          parameters={[
            {
              name: "value",
              type: "TValue"
            }
          ]}>
          {code`let result = await this.validate(value);
          if (typeof result === "string") {
            this.errorMessage = result;
          } else if (typeof result === "boolean") {
            this.errorMessage = result ? null : this.defaultErrorMessage;
          } else {
            this.errorMessage = null;
          } `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to route key press events to specific prompt actions based on the key pressed. This method maps various key combinations and keys to corresponding actions that can be handled by the prompt, such as submitting, cancelling, navigating, etc."
          name="getAction"
          protected
          parameters={[{ name: "key", type: "readline.Key" }]}
          returnType="string | false">
          {code`if (key.meta && key.name !== "escape") {
            return false;
          }

          let action: string | undefined;
          if (key.ctrl) {
            if (key.name === "a") action = "first";
            if (key.name === "c") action = "cancel";
            if (key.name === "d") action = "cancel";
            if (key.name === "e") action = "last";
            if (key.name === "g") action = "reset";
          }

          if (key.name === "return") action = "submit";
          if (key.name === "enter") action = "submit";
          if (key.name === "backspace") action = "backspace";
          if (key.name === "delete") action = "delete";
          if (key.name === "cancel") action = "cancel";
          if (key.name === "escape") action = "cancel";
          if (key.name === "tab") action = "next";
          if (key.name === "pagedown") action = "nextPage";
          if (key.name === "pageup") action = "prevPage";
          if (key.name === "home") action = "home";
          if (key.name === "end") action = "end";

          if (key.name === "up") action = "up";
          if (key.name === "down") action = "down";
          if (key.name === "right") action = "right";
          if (key.name === "left") action = "left";

          return action || false; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the left or right by a \`count\` of positions"
          name="moveCursor"
          parameters={[
            {
              name: "count",
              type: "number"
            }
          ]}
          protected>
          {code`
          this.cursor += count;
          this.cursorOffset += count; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to remove the character backward of the cursor"
          name="backspace"
          protected>
          {code`if (this.isCursorAtStart) {
            return this.bell();
          }

          if (this.displayValue === "") {
            return this.bell();
          }

          this.changeValue(this.parse(\`\${
            this.displayValue.slice(0, this.cursor - 1)
          }\${
            this.displayValue.slice(this.cursor)
          }\`));

          if (this.isCursorAtStart) {
            this.cursorOffset = 0;
          } else {
            this.cursorOffset += 2;
            this.moveCursor(-1);
          }

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to remove the character forward of the cursor"
          name="delete"
          protected>
          {code`if (this.cursor >= this.displayValue.length) {
            return this.bell();
          }

          this.changeValue(this.parse(\`\${
            this.displayValue.slice(0, this.cursor)
          }\${
            this.displayValue.slice(this.cursor + 1)
          }\`));

          if (this.isCursorAtEnd) {
            this.cursorOffset = 0;
          } else {
            this.cursorOffset += 2;
          }

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to reset the prompt input"
          name="reset"
          protected>
          {code`this.changeValue(this.initialValue);
          this.cursorOffset = 0;

          this.errorMessage = null;
          this.isCancelled = false;
          this.isSubmitted = false;

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to cancel the prompt input"
          name="cancel"
          protected>
          {code`this.errorMessage = null;
          this.isCancelled = true;
          this.isSubmitted = false;

          this.sync();
          this.output.write("\\n");
          this.close(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to submit the prompt input"
          name="submit"
          async
          protected>
          {code`this.cursorOffset = 0;
          this.cursor = this.displayValue.length;

          await this.checkValidations(this.value);
          if (this.isError) {
            this.sync();
            this.bell();
          } else {
            this.isSubmitted = true;
            this.isCancelled = false;

            this.sync();
            this.output.write("\\n");
            this.close();
          } `}
        </ClassMethod>
        <Spacing />
        <ClassMethod doc="A method to render the prompt" name="render" private>
          {code`if (this.#isClosed) {
            return;
          }

          if (!this.isInitial) {
            if (this.consoleStatus) {
              this.output.write(cursor.down(stripAnsi(this.consoleStatus).split(/\\r?\\n/).map(line => Math.ceil(line.length / this.output.columns)).reduce((a, b) => a + b) - 1) + clear(this.consoleStatus, this.output.columns));
            }

            this.output.write(clear(this.consoleOutput, this.output.columns));
          } else if (this.cursorHidden) {
            this.output.write(cursor.hide);
          }

          this.consoleOutput = \` \${
          this.isSubmitted
            ? colors.text.prompt.icon.submitted("${
              theme.icons.prompt.submitted
            }")
            : this.isCancelled
              ? colors.text.prompt.icon.cancelled("${
                theme.icons.prompt.cancelled
              }")
              : this.isError
                ? colors.text.prompt.icon.error("${theme.icons.prompt.error}")
                : colors.text.prompt.icon.active("${theme.icons.prompt.active}")
          }  \${
            this.isCompleted
            ? colors.text.prompt.message.submitted(this.message)
            : colors.bold(colors.text.prompt.message.active(this.message))
          } \${
            colors.border.app.divider.tertiary(
              this.isCompleted
                ? (process.platform === "win32" ? "..." : "…")
                : (process.platform === "win32" ? "»" : "›")
            )
          } \`;
          this.consoleOutput += this.onRender();

          if (this.isInitial) {
            this.isInitial = false;
          }

          this.output.write(erase.line + cursor.to(0) + this.consoleOutput + (this.status ? cursor.save + this.status + cursor.restore + cursor.move(this.cursorOffset, 0) : cursor.save));
          this.consoleStatus = this.status; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle key press events and determine the corresponding action"
          name="keypress"
          private
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`if (this.#isClosed) {
            return;
          }

          if (!this.#isKeyPressed) {
            this.#isKeyPressed = true;
          }

          return this.onKeyPress(char, key); `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="PromptFactoryConfig"
        extends="PromptConfig<TValue>"
        doc="Configuration options for creating a prompt with a prompt factory function"
        typeParameters={[{ name: "TValue", default: "string" }]}>
        <InterfaceMember
          name="onState"
          optional
          type="(state: PromptState<TValue>) => any"
          doc="A function that is called when the prompt state changes, useful for updating the prompt message or other properties dynamically"
        />
        <Spacing />
        <InterfaceMember
          name="onSubmit"
          optional
          type="(value: TValue) => any"
          doc="A function that is called when the prompt is submitted, useful for handling the submitted value or performing actions based on the prompt state"
        />
        <Spacing />
        <InterfaceMember
          name="onCancel"
          optional
          type="(event: any) => any"
          doc="A function that is called when the prompt is canceled, useful for handling the canceled value or performing actions based on the prompt state"
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="A unique symbol used to indicate that a prompt was cancelled, which can be returned from a prompt function to signal that the prompt interaction should be cancelled and any pending promises should be rejected with this symbol. This allows for a consistent way to handle prompt cancellations across different prompt types and interactions." />
      <VarDeclaration export name="CANCEL_SYMBOL">
        {code`Symbol("shell-shock:prompts:cancel"); `}
      </VarDeclaration>
      <Spacing />
      <TSDoc heading="A utility function to check if a given value is the {@link CANCEL_SYMBOL | cancel symbol}, which can be used to determine if a prompt interaction was cancelled based on the value returned from a prompt factory function. This function checks if the provided value is strictly equal to the {@link CANCEL_SYMBOL | CANCEL_SYMBOL}, allowing for a consistent way to handle prompt cancellations across different prompt types and interactions.">
        <TSDocParam name="value">{`The value to check.`}</TSDocParam>
        <TSDocReturns>
          {`A boolean indicating whether the provided value is the {@link CANCEL_SYMBOL | cancel symbol}, which can be used to determine if a prompt interaction was cancelled.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="isCancel"
        export
        parameters={[
          {
            name: "value",
            type: "any"
          }
        ]}
        returnType="value is typeof CANCEL_SYMBOL">
        {code`return value === CANCEL_SYMBOL; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * Declarations for a text-based prompt that allows users to input and edit text, with support for cursor movement, deletion, and custom masking. This prompt type can be used for various text input scenarios, such as entering a username, password, or any other string input. The TextPrompt class extends the base Prompt class and implements specific logic for handling text input and editing interactions.
 */
export function TextPromptDeclarations() {
  return (
    <>
      <InterfaceDeclaration
        name="StringPromptConfig"
        extends="PromptConfig<string>"
        doc="Configuration options for creating a text-based prompt">
        <InterfaceMember
          name="initialValue"
          optional
          type="string"
          doc="The initial value of the prompt"
        />
        <Spacing />
        <InterfaceMember
          name="mask"
          optional
          type="(input: string) => string"
          doc="A function that masks the input value and returns the masked result"
        />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        name="StringPrompt"
        doc="A prompt for text input"
        extends="Prompt<string>">
        <ClassField name="isInvalid" isPrivateMember type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="initialValue" protected override type="string">
          {code`""; `}
        </ClassField>
        <Spacing />
        {code`constructor(config: StringPromptConfig) {
          super(config);

          if (config.initialValue) {
            this.initialValue = config.initialValue;
          }

          this.cursor = 0;
          this.sync();
          this.first();
        } `}
        <Spacing />
        <ClassMethod
          doc="A method to handle onKeyPress events and determine the corresponding action"
          name="onKeyPress"
          override
          protected
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`const action = this.getAction(key);
          if (action && typeof (this as any)[action] === "function") {
            return (this as any)[action]();
          }

          if (!char || char.length === 0) {
            return this.bell();
          }

          const value = \`\${
            this.value.slice(0, this.cursor)
          }\${
            char
          }\${
            this.value.slice(this.cursor)
          }\`;

          this.changeValue(value);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle changes in the prompt value"
          name="onChange"
          override
          protected
          parameters={[
            {
              name: "previousValue",
              type: "string"
            }
          ]}>
          {code`this.#isInvalid = false;
          this.cursor = this.displayValue.slice(0, this.cursor).length + 1; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to reset the prompt input"
          name="reset"
          override
          protected>
          {code`this.cursor = Number(!!this.initialValue);
          super.reset(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to validate the prompt input"
          name="checkValidations"
          override
          async
          protected>
          {code`await super.checkValidations(this.value);
          this.#isInvalid = this.isError; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the end of the input"
          name="next"
          protected>
          {code`this.changeValue(this.initialValue);
          this.cursor = this.displayValue.length;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the start"
          name="first"
          protected>
          {code`this.cursor = 0;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the end"
          name="last"
          protected>
          {code`this.cursor = this.value.length;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the left"
          name="left"
          protected>
          {code`if (this.cursor <= 0) {
            return this.bell();
          }

          this.moveCursor(-1);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the right"
          name="right"
          protected>
          {code`if (this.cursor >= this.displayValue.length) {
            return this.bell();
          }

          this.moveCursor(1);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          override
          protected
          returnType="string">
          {code`return this.isPlaceholder
            ? colors.text.prompt.input.disabled(this.displayValue)
            : this.#isInvalid
              ? colors.text.prompt.input.error(this.displayValue)
              : this.isSubmitted
                ? colors.text.prompt.input.submitted(this.displayValue)
                : this.isCancelled
                  ? colors.text.prompt.input.cancelled(this.displayValue)
              : colors.bold(colors.text.prompt.input.active(this.displayValue)); `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="A type definition for the configuration options to pass to the text prompt, which extends the base PromptConfig with additional options specific to text prompts. This type can be used when creating a text prompt using the {@link text | text prompt factory function} or when manually creating an instance of the TextPrompt class. The TextConfig type includes all the properties of the base PromptConfig, such as message, description, initialValue, validate, parse, format, mask, etc., as well as any additional properties that are specific to text prompts." />
      <TypeDeclaration name="TextConfig" export>
        {code`PromptFactoryConfig<string> & StringPromptConfig; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a text prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocRemarks>
          {code`This function can be used to easily create and run a text prompt without needing to manually create an instance of the TextPrompt class and handle its events. The function accepts a configuration object that extends the base PromptFactoryConfig with additional options specific to text prompts, such as the initial value and mask function. The returned promise allows for easy handling of the prompt result using async/await syntax or traditional promise chaining.`}
        </TSDocRemarks>
        <TSDocExample>
          {`import { text, isCancel } from "shell-shock:prompts";

async function run() {
  const name = await text({
    message: "What is your name?",
    description: "Please enter your full name",
    validate: value => value.trim().length > 0 || "Name cannot be empty"
  });
  if (isCancel(name)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("Hello, " + name + "!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the text prompt, which extends the base PromptConfig with additional options specific to text prompts`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="text"
        export
        parameters={[
          {
            name: "config",
            type: "TextConfig"
          }
        ]}
        returnType="Promise<string | symbol>">
        {code`return new Promise<string | symbol>((response, reject) => {
            const prompt = new StringPrompt(config);

            prompt.on("state", state => config.onState?.(state));
            prompt.on("submit", value => response(value));
            prompt.on("cancel", event => response(CANCEL_SYMBOL));
          });`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * Declarations for a select prompt that allows users to choose from a list of options, with support for pagination, option descriptions, and disabled options. This prompt type can be used for scenarios where the user needs to select one option from a predefined list, such as choosing a color, selecting a file, or picking an item from a menu. The SelectPrompt class extends the base Prompt class and implements specific logic for handling option selection and navigation interactions.
 */
export function SelectPromptDeclarations() {
  return (
    <>
      <InterfaceDeclaration
        name="PromptOptionConfig"
        doc="Configuration for an option the user can select from the select prompt"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <InterfaceMember
          name="label"
          optional
          type="string"
          doc="The message label for the option"
        />
        <Spacing />
        <InterfaceMember
          name="icon"
          optional
          type="string"
          doc="An icon for the option"
        />
        <Spacing />
        <InterfaceMember
          name="value"
          type="TValue"
          doc="The value of the option"
        />
        <Spacing />
        <InterfaceMember
          name="description"
          optional
          type="string"
          doc="The description of the option"
        />
        <Spacing />
        <InterfaceMember
          name="selected"
          optional
          type="boolean"
          doc="Whether the option is selected"
        />
        <Spacing />
        <InterfaceMember
          name="disabled"
          optional
          type="boolean"
          doc="Whether the option is disabled"
        />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="PromptOption"
        extends="PromptOptionConfig<TValue>"
        doc="An option the user can select from the select prompt"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <InterfaceMember
          name="label"
          type="string"
          doc="The message label for the option"
        />
        <InterfaceMember
          name="index"
          type="number"
          doc="The index of the option"
        />
        <Spacing />
        <InterfaceMember
          name="selected"
          type="boolean"
          doc="Whether the option is selected"
        />
        <Spacing />
        <InterfaceMember
          name="disabled"
          type="boolean"
          doc="Whether the option is disabled"
        />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="SelectPromptConfig"
        extends="PromptConfig<TValue>"
        doc="An options object for configuring a select prompt"
        typeParameters={[
          {
            name: "TValue",
            default: "string"
          }
        ]}>
        <InterfaceMember
          name="hint"
          optional
          type="string"
          doc="A hint to display to the user"
        />
        <Spacing />
        <InterfaceMember
          name="options"
          type="Array<string | PromptOptionConfig<TValue>>"
          doc="The options available for the select prompt"
        />
        <Spacing />
        <InterfaceMember
          name="optionsPerPage"
          optional
          type="number"
          doc="The number of options to display per page, defaults to 8"
        />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        name="SelectPrompt"
        doc="A prompt for selecting an option from a list"
        extends="Prompt<TValue>"
        typeParameters={[{ name: "TValue", default: "string" }]}>
        <ClassField name="initialValue" protected override type="TValue" />
        <hbr />
        <ClassField name="optionsPerPage" protected type="number">
          {code`8; `}
        </ClassField>
        <hbr />
        <ClassField name="options" protected type="PromptOption<TValue>[]">
          {code`[]; `}
        </ClassField>
        <hbr />
        <ClassField name="cursorHidden" protected override type="boolean">
          {code`true; `}
        </ClassField>
        <Spacing />
        {code`constructor(config: SelectPromptConfig<TValue>) {
          super(config);

          if (config.initialValue) {
            this.initialValue = config.initialValue as TValue;
          } else {
            this.initialValue = undefined as unknown as TValue;
          }

          this.options = config.options.map((opt, index) => {
            let option = {} as Partial<PromptOption<TValue>>;
            if (typeof opt === "string") {
              option = { label: opt, value: opt as TValue, selected: false, disabled: false };
            } else if (typeof opt === "object") {
              option = opt;
            } else {
              throw new Error(\`Invalid option provided to SelectPrompt at index #\${index}\`);
            }

            return {
              label: String(option.value) || "",
              ...option,
              description: option.description,
              selected: !!option.selected || (this.initialValue !== undefined && option.value === this.initialValue),
              disabled: !!option.disabled
            } as PromptOption<TValue>;
          }).sort((a, b) => a.label.localeCompare(b.label)).map((option, index) => ({ ...option, index }));

          const selected = this.options.findIndex(option => option.selected);
          if (selected > -1) {
            this.cursor = selected;
            if (this.options[this.cursor]) {
              this.initialValue = this.options[this.cursor].value as TValue;
            }
          }

          if (this.initialValue === undefined && this.options.length > 0 && this.options[0]) {
            this.initialValue = this.options[0].value as TValue;
          }

          if (config.optionsPerPage) {
            this.optionsPerPage = config.optionsPerPage;
          }

          this.sync();
        } `}
        <Spacing />
        <ClassPropertyGet
          doc="Returns the currently selected option"
          name="selectedOption"
          type="PromptOption<TValue> | null"
          protected>
          {code`return this.options.find(option => option.value === this.value) ?? null; `}
        </ClassPropertyGet>
        <Spacing />
        <ClassMethod
          doc="A method to route key press events to specific prompt actions based on the key pressed. This method maps various key combinations and keys to corresponding actions that can be handled by the prompt, such as submitting, cancelling, navigating, etc."
          name="getAction"
          override
          protected
          parameters={[{ name: "key", type: "readline.Key" }]}
          returnType="string | false">
          {code`let action = super.getAction(key);
          if (!action) {
            if (key.name === "j") action = "down";
            if (key.name === "k") action = "up";
          }

          return action || false; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to reset the prompt input"
          name="reset"
          override
          protected>
          {code`this.moveCursor(0);
          super.reset(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to submit the prompt input"
          name="submit"
          async
          override
          protected>
          {code`if (!this.selectedOption?.disabled) {
            await super.submit();
          } else {
            this.bell();
          } `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the end of the input"
          name="next"
          protected>
          {code`this.moveCursor((this.cursor + 1) % this.options.length);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the left or right by a \`count\` of positions"
          name="moveCursor"
          parameters={[
            {
              name: "count",
              type: "number"
            }
          ]}
          override
          protected>
          {code`this.cursor = count;

          this.changeValue(this.options[count]!.value);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the first option"
          name="first"
          protected>
          {code`this.moveCursor(0);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the last option"
          name="last"
          protected>
          {code`this.moveCursor(this.options.length - 1);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the start"
          name="first"
          protected>
          {code`this.cursor = 0;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the up"
          name="up"
          protected>
          {code`if (this.cursor === 0) {
            this.moveCursor(this.options.length - 1);
          } else {
            this.moveCursor(this.cursor - 1);
          }

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the down"
          name="down"
          protected>
          {code`if (this.cursor === this.options.length - 1) {
            this.moveCursor(0);
          } else {
            this.moveCursor(this.cursor + 1);
          }

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          override
          protected>
          {code`const spacing = Math.max(...this.options.map(option => option.label?.length || 0)) + 2;

          const startIndex = Math.max(Math.min(this.options.length - this.optionsPerPage, this.cursor - Math.floor(this.optionsPerPage / 2)), 0);
          const endIndex = Math.min(startIndex + this.optionsPerPage, this.options.length);

          let output = "";
          if (!this.isCompleted) {
            output += " \\n";
            for (let index = startIndex; index < endIndex; index++) {
              output += \`\${
                this.options[index].disabled
                  ? this.cursor === index
                    ? colors.bold(colors.text.prompt.input.disabled(">"))
                    : index === startIndex
                      ? colors.border.app.divider.tertiary("↑")
                        : index === endIndex - 1
                        ? colors.border.app.divider.tertiary("↓")
                        : " "
                  : this.cursor === index
                    ? colors.bold(colors.text.prompt.input.active(">"))
                    : index === startIndex
                      ? colors.border.app.divider.tertiary("↑")
                        : index === endIndex - 1
                          ? colors.border.app.divider.tertiary("↓")
                          : " "
              } \${
                this.options[index]!.disabled
                  ? this.cursor === index
                    ? colors.bold(colors.text.prompt.input.disabled(this.options[index]!.icon ? colors.underline(\`\${this.options[index]!.icon}  \`) : ""))
                    : colors.strikethrough(colors.text.prompt.input.disabled(this.options[index]!.icon ? \`\${this.options[index].icon}  \` : ""))
                  : this.cursor === index
                    ? colors.bold(colors.text.prompt.input.active(this.options[index]!.icon ? colors.underline(\`\${this.options[index]!.icon}  \`) : ""))
                    : colors.text.prompt.input.inactive(this.options[index]!.icon ? \`\${this.options[index].icon}  \` : "")
              }\${
                this.options[index]!.disabled
                  ? this.cursor === index
                    ? colors.bold(colors.underline(colors.text.prompt.input.disabled(this.options[index].label)))
                    : colors.strikethrough(colors.text.prompt.input.disabled(this.options[index]!.label))
                  : this.cursor === index
                    ? colors.bold(colors.underline(colors.text.prompt.input.active(this.options[index]!.label)))
                    : colors.text.prompt.input.inactive(this.options[index]!.label)
              } \${" ".repeat(spacing - this.options[index]!.label.length - (this.options[index]!.icon ? this.options[index]!.icon!.length + 1 : 0))}\${
                this.options[index]!.description && this.cursor === index
                    ? colors.italic(colors.text.prompt.description.active(this.options[index]!.description))
                    : ""
              } \\n\`;
            }
          } else {
            this.displayValue = this.selectedOption?.label || String(this.value);
            output += super.onRender();
          }

          return output; `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="A type definition for the configuration options to pass to the select prompt, which extends the base PromptConfig with additional options specific to select prompts. This type can be used when creating a select prompt using the {@link select | select prompt factory function}.">
        <TSDocRemarks>
          {`The Select Config type includes all the properties of the base PromptConfig, such as message, description, initialValue, validate, parse, format, etc., as well as any additional properties that are specific to select prompts, such as the list of options and pagination settings.`}
        </TSDocRemarks>
      </TSDoc>
      <TypeDeclaration export name="SelectConfig">
        {code`PromptFactoryConfig<string> & SelectPromptConfig; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a select prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocExample>
          {`import { select, isCancel } from "shell-shock:prompts";

async function run() {
  const color = await select({
    message: "What is your favorite color?",
    description: "Please select your favorite color",
    validate: value => value.trim().length > 0 || "Color cannot be empty",
    options: [
      { label: "Red", value: "red", description: "The color of fire and blood" },
      { label: "Green", value: "green", description: "The color of nature and growth" },
      { label: "Blue", value: "blue", description: "The color of the sky and sea" },
      { label: "Yellow", value: "yellow", description: "The color of sunshine and happiness" }
    ]
  });
  if (isCancel(color)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("Your favorite color is " + color + "!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the select prompt, which extends the base PromptConfig with additional options specific to select prompts`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="select"
        export
        parameters={[
          {
            name: "config",
            type: "SelectConfig"
          }
        ]}
        returnType="Promise<string | symbol>">
        {code`return new Promise<string | symbol>((response, reject) => {
            const prompt = new SelectPrompt(config);

            prompt.on("state", state => config.onState?.(state));
            prompt.on("submit", value => response(value));
            prompt.on("cancel", event => response(CANCEL_SYMBOL));
          });`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component that renders the declarations for the built-in numeric prompt, which allows users to input and select numeric values with various configuration options such as floating point support, precision, increment, and min/max values.
 */
export function NumericPromptDeclarations() {
  return (
    <>
      <InterfaceDeclaration
        name="NumberPromptConfig"
        extends="PromptConfig<number>"
        doc="Configuration options for creating a numeric prompt">
        <InterfaceMember
          name="isFloat"
          optional
          type="boolean"
          doc="Whether the prompt should accept floating point numbers"
        />
        <Spacing />
        <InterfaceMember
          name="precision"
          optional
          type="number"
          doc="The number of decimal places to round the input to, defaults to 2"
        />
        <Spacing />
        <InterfaceMember
          name="increment"
          optional
          type="number"
          doc="The increment value for the number prompt, defaults to 1"
        />
        <Spacing />
        <InterfaceMember
          name="min"
          optional
          type="number"
          doc="The minimum value for the number prompt, defaults to -Infinity"
        />
        <Spacing />
        <InterfaceMember
          name="max"
          optional
          type="number"
          doc="The maximum value for the number prompt, defaults to Infinity"
        />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        name="NumberPrompt"
        doc="A prompt for selecting a number input"
        extends="Prompt<number>">
        <ClassField name="isInvalid" isPrivateMember type="boolean">
          {code`false; `}
        </ClassField>
        <Spacing />
        <ClassField name="initialValue" protected override type="number">
          {code`0; `}
        </ClassField>
        <hbr />
        <ClassField name="defaultErrorMessage" protected override type="string">
          {code`"A valid numeric value must be provided"; `}
        </ClassField>
        <hbr />
        <ClassField name="isFloat" protected type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="precision" protected type="number">
          {code`2; `}
        </ClassField>
        <hbr />
        <ClassField name="increment" protected type="number">
          {code`1; `}
        </ClassField>
        <hbr />
        <ClassField name="min" protected type="number">
          {code`Number.NEGATIVE_INFINITY; `}
        </ClassField>
        <hbr />
        <ClassField name="max" protected type="number">
          {code`Number.POSITIVE_INFINITY; `}
        </ClassField>
        <Spacing />
        {code`constructor(config: NumberPromptConfig) {
          super(config);

          if (config.initialValue) {
            this.initialValue = config.initialValue;
          }

          this.isFloat = !!config.isFloat;
          if (config.precision !== undefined) {
            this.precision = config.precision;
          }
          if (config.increment !== undefined) {
            this.increment = config.increment;
          }
          if (config.min !== undefined) {
            this.min = config.min;
          }
          if (config.max !== undefined) {
            this.max = config.max;
          }

          if (config.parse) {
            this.parse = config.parse.bind(this);
          } else {
            const parse = (value: string) => this.isFloat ? Math.round(Math.pow(10, this.precision) * Number.parseFloat(value)) / Math.pow(10, this.precision) : Number.parseInt(value);
            this.parse = parse.bind(this);
          }

          if (config.validate) {
            this.validate = config.validate.bind(this);
          } else {
            const validate = (value: number) => !Number.isNaN(value) && value >= this.min && value <= this.max;
            this.validate = validate.bind(this);
          }

          this.changeValue(this.initialValue);
          this.sync();
        } `}
        <Spacing />
        <ClassMethod
          doc="A method to handle key press events and determine the corresponding action"
          name="onKeyPress"
          override
          protected
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`const action = this.getAction(key);
          if (action && typeof (this as any)[action] === "function") {
            return (this as any)[action]();
          }

          if ((char !== "-" || (char === "-" && this.cursor !== 0)) && !(char === "." && this.isFloat) && !/[0-9]/.test(char)) {
            return this.bell();
          }

          const displayValue = \`\${
            this.displayValue.slice(0, this.cursor)
          }\${
            char
          }\${
            this.displayValue.slice(this.cursor)
          }\`;

          let value = this.parse(displayValue);
          if (!Number.isNaN(value)) {

            value = Math.min(value, this.max);
            if (value > this.max) {
              value = this.max;
            }
            if (value < this.min) {
              value = this.min;
            }
          }

          this.changeValue(value);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle changes in the prompt value"
          name="onChange"
          override
          protected
          parameters={[
            {
              name: "previousValue",
              type: "number"
            }
          ]}>
          {code`this.#isInvalid = false;
          this.cursor = this.displayValue.slice(0, this.cursor).length + 1; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to validate the prompt input"
          name="checkValidations"
          override
          async
          protected>
          {code`await super.checkValidations(this.value);
          this.#isInvalid = this.isError; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the end of the input"
          name="next"
          protected>
          {code`this.changeValue(this.initialValue);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the up"
          name="up"
          protected>
          {code`let value = this.value;
          if (this.displayValue === "") {
            value = this.min < 0 ? 0 : this.min;
          } else if (value >= this.max) {
            return this.bell();
          }

          this.changeValue(value + this.increment);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the down"
          name="down"
          protected>
          {code`let value = this.value;
          if (this.displayValue === "") {
            value = this.min < 0 ? 0 : this.min;
          } else if (value <= this.min) {
            return this.bell();
          }

          this.changeValue(value === this.min ? this.min : value - this.increment);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the left"
          name="left"
          protected>
          {code`if (this.cursor <= 0) {
            return this.bell();
          }

          this.moveCursor(-1);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the right"
          name="right"
          protected>
          {code`if (this.cursor >= this.displayValue.length) {
            return this.bell();
          }

          this.moveCursor(1);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the start"
          name="first"
          protected>
          {code`this.cursor = 0;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the end"
          name="last"
          protected>
          {code`this.cursor = this.displayValue.length;
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          override
          protected
          returnType="string">
          {code`return this.isPlaceholder
            ? colors.text.prompt.input.disabled(this.displayValue)
            : this.#isInvalid
              ? colors.text.prompt.input.error(this.displayValue)
              : this.isSubmitted
                ? colors.text.prompt.input.submitted(this.displayValue)
                : this.isCancelled
                  ? colors.text.prompt.input.cancelled(this.displayValue)
              : colors.bold(colors.text.prompt.input.active(this.displayValue)); `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="An object representing the configuration options for a numeric prompt." />
      <TypeDeclaration name="NumericConfig" export>
        {code`PromptFactoryConfig<number> & NumberPromptConfig; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a numeric prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocExample>
          {`import { numeric, isCancel } from "shell-shock:prompts";

async function run() {
  const age = await numeric({
    message: "How old are you?",
    description: "Please enter your age in years",
    validate: value => value < 21 ? "You must be at least 21 years old" : true,
  });
  if (isCancel(age)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("Your age is " + age + "!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the numeric prompt, which extends the base PromptFactoryConfig with additional options specific to numeric prompts`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="numeric"
        export
        parameters={[
          {
            name: "config",
            type: "NumericConfig"
          }
        ]}
        returnType="Promise<number | symbol>">
        {code`return new Promise<number | symbol>((response, reject) => {
            const prompt = new NumberPrompt(config);

            prompt.on("state", state => config.onState?.(state));
            prompt.on("submit", value => response(value));
            prompt.on("cancel", event => response(CANCEL_SYMBOL));
          });`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component that renders the declarations for the built-in toggle prompt, which allows users to select a boolean value (true/false) with support for custom messages for the true and false states. This prompt type can be used for scenarios where the user needs to toggle a setting on or off, such as enabling or disabling a feature. The TogglePrompt class extends the base Prompt class and implements specific logic for handling boolean input and rendering interactions.
 */
export function TogglePromptDeclarations() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="TogglePromptConfig"
        extends="PromptConfig<boolean>"
        doc="Configuration options for creating a boolean toggle prompt">
        <InterfaceMember
          name="trueMessage"
          optional
          type="string"
          doc="The message for the true state of the prompt"
        />
        <Spacing />
        <InterfaceMember
          name="falseMessage"
          optional
          type="string"
          doc="The message for the false state of the prompt"
        />
        <Spacing />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        export
        name="TogglePrompt"
        doc="A prompt for toggling a boolean input"
        extends="Prompt<boolean>">
        <ClassField name="initialValue" protected override type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="trueMessage" protected type="string">
          {code`"Yes"; `}
        </ClassField>
        <hbr />
        <ClassField name="falseMessage" protected type="string">
          {code`"No"; `}
        </ClassField>
        <hbr />
        <ClassField name="cursorHidden" protected override type="boolean">
          {code`true; `}
        </ClassField>
        <Spacing />
        {code`constructor(config: TogglePromptConfig) {
          super(config);

          if (config.initialValue) {
            this.initialValue = config.initialValue;
          }

          if (config.trueMessage) {
            this.trueMessage = config.trueMessage;
          }
          if (config.falseMessage) {
            this.falseMessage = config.falseMessage;
          }

          this.sync();
        } `}
        <Spacing />
        <ClassMethod
          doc="Update the toggle value to a checked state based on user input"
          name="check"
          protected>
          {code`if (this.value === true) {
            return this.bell();
          }

          this.changeValue(true);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="Update the toggle value to an unchecked state based on user input"
          name="uncheck"
          protected>
          {code`if (this.value === false) {
            return this.bell();
          }

          this.changeValue(false);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to handle key press events and determine the corresponding action"
          name="onKeyPress"
          override
          protected
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`const action = this.getAction(key);
          if (action && typeof (this as any)[action] === "function") {
            return (this as any)[action]();
          }

          if (char === " ") {
            this.changeValue(!this.value);
          } else if (char === "1") {
            this.changeValue(true);
          } else if (char === "0") {
            this.changeValue(false);
          } else {
            return this.bell();
          }

          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to remove the character backward of the cursor"
          name="backspace"
          protected>
          {code`this.uncheck(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the left"
          name="left"
          protected>
          {code`this.uncheck(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to the right"
          name="right"
          protected>
          {code`this.check(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to down"
          name="down"
          protected>
          {code`this.uncheck(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move the cursor to up"
          name="up"
          protected>
          {code`this.check(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to move to the next value"
          name="next"
          protected>
          {code`this.changeValue(!this.value);
          this.sync(); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          override
          protected
          returnType="string">
          {code`return this.isSubmitted
              ? colors.text.prompt.input.submitted(this.value ? this.trueMessage : this.falseMessage)
              : this.isCancelled
                ? colors.text.prompt.input.cancelled(this.value ? this.trueMessage : this.falseMessage)
            : \`\${
                this.value ? colors.text.prompt.input.inactive(this.falseMessage) : colors.underline(colors.bold(colors.text.prompt.input.active(this.falseMessage)))
            } \${colors.border.app.divider.tertiary("/")} \${
                this.value ? colors.underline(colors.bold(colors.text.prompt.input.active(this.trueMessage))) : colors.text.prompt.input.inactive(this.trueMessage)
            }\`; `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="An object representing the configuration options for a toggle prompt, which extends the base PromptFactoryConfig with additional options specific to the toggle prompt." />
      <TypeDeclaration name="ToggleConfig" export>
        {code`PromptFactoryConfig<boolean> & TogglePromptConfig; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a toggle prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocExample>
          {`import { toggle, isCancel } from "shell-shock:prompts";

async function run() {
  const likesIceCream = await toggle({
    message: "Do you like ice cream?"
  });
  if (isCancel(likesIceCream)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("You" + (likesIceCream ? " like ice cream" : " don't like ice cream") + "!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the toggle prompt, which extends the base PromptFactoryConfig with additional options specific to the toggle prompt`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="toggle"
        export
        parameters={[
          {
            name: "config",
            type: "ToggleConfig"
          }
        ]}
        returnType="Promise<boolean | symbol>">
        {code`return new Promise<boolean | symbol>((response, reject) => {
            const prompt = new TogglePrompt(config);

            prompt.on("state", state => config.onState?.(state));
            prompt.on("submit", value => response(value));
            prompt.on("cancel", event => response(CANCEL_SYMBOL));
          });`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component that renders the declarations for the built-in confirm prompt, which allows users to select a boolean value (true/false) with support for custom messages for the true and false states. This prompt type can be used for scenarios where the user needs to toggle a setting on or off, such as enabling or disabling a feature. The ConfirmPrompt class extends the base Prompt class and implements specific logic for handling boolean input and rendering interactions.
 */
export function ConfirmPromptDeclarations() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="ConfirmPromptConfig"
        extends="PromptConfig<boolean>"
        doc="Configuration options for creating a boolean confirm prompt">
        <TSDoc heading="The message for the \`Yes\` state of the prompt">
          <TSDocDefaultValue type={ReflectionKind.string} defaultValue="Yes" />
        </TSDoc>
        <InterfaceMember name="yesMessage" optional type="string" />
        <Spacing />
        <TSDoc heading="The \`Yes\` option when choosing between yes/no">
          <TSDocDefaultValue type={ReflectionKind.string} defaultValue="1" />
        </TSDoc>
        <InterfaceMember name="yesOption" optional type="string" />
        <Spacing />
        <TSDoc heading="The message for the \`No\` state of the prompt">
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="(Y/n)"
          />
        </TSDoc>
        <InterfaceMember name="noMessage" optional type="string" />
        <Spacing />
        <TSDoc heading="The \`No\` option when choosing between yes/no">
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="(y/N)"
          />
        </TSDoc>
        <InterfaceMember name="noOption" optional type="string" />
      </InterfaceDeclaration>
      <Spacing />
      <ClassDeclaration
        export
        name="ConfirmPrompt"
        doc="A prompt for confirming a boolean input"
        extends="Prompt<boolean>">
        <ClassField name="initialValue" protected override type="boolean">
          {code`false; `}
        </ClassField>
        <hbr />
        <ClassField name="yesMessage" protected type="string">
          {code`"Yes"; `}
        </ClassField>
        <hbr />
        <ClassField name="yesOption" protected type="string">
          {code`"(Y/n)"; `}
        </ClassField>
        <hbr />
        <ClassField name="noMessage" protected type="string">
          {code`"No"; `}
        </ClassField>
        <hbr />
        <ClassField name="noOption" protected type="string">
          {code`"(y/N)"; `}
        </ClassField>
        <hbr />
        <ClassField name="cursorHidden" protected override type="boolean">
          {code`true; `}
        </ClassField>
        <Spacing />
        {code`constructor(config: ConfirmPromptConfig) {
          super(config);

          if (config.initialValue) {
            this.initialValue = config.initialValue;
          }

          if (config.yesMessage) {
            this.yesMessage = config.yesMessage;
          }
          if (config.yesOption) {
            this.yesOption = config.yesOption;
          }
          if (config.noMessage) {
            this.noMessage = config.noMessage;
          }
          if (config.noOption) {
            this.noOption = config.noOption;
          }

          this.sync();
        } `}
        <Spacing />
        <ClassMethod
          doc="A method to handle key press events and determine the corresponding action"
          name="onKeyPress"
          override
          protected
          parameters={[
            {
              name: "char",
              type: "string"
            },
            {
              name: "key",
              type: "readline.Key"
            }
          ]}>
          {code`const action = this.getAction(key);
          if (action && typeof (this as any)[action] === "function") {
            return (this as any)[action]();
          }

          if (char.toLowerCase() === "y" || char.toLowerCase() === "t" || char.toLowerCase() === "0") {
            this.changeValue(true);
            return this.submit();
          } else if (char.toLowerCase() === "n" || char.toLowerCase() === "f" || char.toLowerCase() === "1") {
            this.changeValue(false);
            return this.submit();
          } else {
            return this.bell();
          } `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          doc="A method to render the prompt"
          name="onRender"
          override
          protected
          returnType="string">
          {code`return this.isSubmitted
              ? colors.text.prompt.input.submitted(this.value ? this.yesMessage : this.noMessage)
              : this.isCancelled
                ? colors.text.prompt.input.cancelled(this.value ? this.yesMessage : this.noMessage)
            : colors.text.prompt.input.inactive(this.initialValue ? this.yesOption : this.noOption); `}
        </ClassMethod>
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="An object representing the configuration options for a confirm prompt, which extends the base PromptFactoryConfig with additional options specific to the confirm prompt." />
      <TypeDeclaration name="ConfirmConfig" export>
        {code`PromptFactoryConfig<boolean> & ConfirmPromptConfig; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a confirm prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocExample>
          {`import { confirm, isCancel } from "shell-shock:prompts";

async function run() {
  const likesIceCream = await confirm({
    message: "Do you like ice cream?"
  });
  if (isCancel(likesIceCream)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("You" + (likesIceCream ? " like ice cream" : " don't like ice cream") + "!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the confirm prompt, which extends the base PromptFactoryConfig with additional options specific to the confirm prompt`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="confirm"
        export
        parameters={[
          {
            name: "config",
            type: "ConfirmConfig"
          }
        ]}
        returnType="Promise<boolean | symbol>">
        {code`return new Promise<boolean | symbol>((response, reject) => {
            const prompt = new ConfirmPrompt(config);

            prompt.on("state", state => config.onState?.(state));
            prompt.on("submit", value => response(value));
            prompt.on("cancel", event => response(CANCEL_SYMBOL));
          }); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * Declarations for a password prompt that allows users to input and edit text, with support for cursor movement, deletion, and custom masking. This prompt type can be used for various text input scenarios, such as entering a password or any other string input. The PasswordPrompt class extends the base Prompt class and implements specific logic for handling password input and editing interactions.
 */
export function PasswordPromptDeclaration() {
  return (
    <>
      <FunctionDeclaration
        export
        name="passwordMask"
        doc="A built-in prompt mask function that masks input with asterisks"
        parameters={[{ name: "input", type: "string" }]}
        returnType="string">
        {code`return "*".repeat(input.length); `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="An object representing the configuration options for a password prompt, which extends the base PromptFactoryConfig with additional options specific to password prompts." />
      <TypeDeclaration name="PasswordConfig" export>
        {code`Omit<TextConfig, "mask" | "maskCompleted">; `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to create and run a password prompt, which returns a promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocRemarks>
          {code`This function creates an instance of the TextPrompt class with the provided configuration options and a custom mask function to handle password input. It sets up event listeners for state updates, submission, and cancellation to handle the prompt interactions and return the appropriate results. The password prompt allows users to input text that is masked for privacy, making it suitable for scenarios like entering passwords or sensitive information.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocExample>
          {`import { password, isCancel } from "shell-shock:prompts";

async function run() {
  const userPassword = await password({
    message: "Enter your password"
  });
  if (isCancel(userPassword)) {
    console.log("Prompt was cancelled");
    return;
  }

  console.log("You entered a password!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="config">
          {`The configuration options to pass to the password prompt, which extends the base PromptConfig with additional options specific to password prompts`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves with the submitted value or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="password"
        export
        parameters={[
          {
            name: "config",
            type: "PasswordConfig"
          }
        ]}
        returnType="Promise<string | symbol>">
        {code`return text({
            ...config,
            mask: passwordMask,
            maskCompleted: () => "*******"
          });`}
      </FunctionDeclaration>
    </>
  );
}

export function WaitForKeyPressDeclaration() {
  return (
    <>
      <TSDoc heading="A function to create and run a wait-for-key-press prompt, which returns a promise that resolves when any key is pressed or rejects with a {@link CANCEL_SYMBOL | cancel symbol} if the prompt is cancelled.">
        <TSDocRemarks>
          {code`This function creates an instance of the Prompt class with a custom onKeyPress handler that resolves the promise when any key is pressed. It sets up event listeners for state updates and cancellation to handle the prompt interactions and return the appropriate results. The wait-for-key-press prompt is useful for scenarios where you want to pause execution until the user presses any key, such as waiting for user input before proceeding with a task.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocExample>
          {`import { waitForKeyPress } from "shell-shock:prompts";

async function run() {
  const result = await waitForKeyPress();
  console.log("A key was pressed!");
}

run(); `}
        </TSDocExample>
        <Spacing />
        <TSDocParam name="timeout">
          {`The amount of time in milliseconds to wait before automatically resolving the prompt, defaults to 2 hours (7200000 ms)`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves when any key is pressed`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="waitForKeyPress"
        export
        parameters={[
          {
            name: "timeout",
            default: "7200000"
          }
        ]}>
        {code`process.stdin.setRawMode(true);
        return new Promise(resolve => process.stdin.once("data", () => {
          if (timeout >= 0) {
            setTimeout(() => {
              process.stdin.setRawMode(false);
              resolve(void 0);
            }, timeout);
          }

          process.stdin.setRawMode(false);
          resolve(void 0);
        })); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A built-in prompts module for Shell Shock.
 */
export function PromptsBuiltin(props: PromptsBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <BuiltinFile
      id="prompts"
      description="A collection of prompts that allow for interactive input in command-line applications."
      {...rest}
      imports={defu(rest.imports ?? {}, {
        "node:events": "EventEmitter",
        "node:readline": "readline"
      })}
      builtinImports={defu(rest.builtinImports ?? {}, {
        console: [
          "erase",
          "beep",
          "cursor",
          "colors",
          "clear",
          "stripAnsi",
          "splitText"
        ],
        env: ["env", "isCI", "isTest", "isWindows", "isDevelopment", "isDebug"]
      })}>
      <Spacing />
      <BasePromptDeclarations />
      <Spacing />
      <TextPromptDeclarations />
      <Spacing />
      <SelectPromptDeclarations />
      <Spacing />
      <NumericPromptDeclarations />
      <Spacing />
      <TogglePromptDeclarations />
      <Spacing />
      <PasswordPromptDeclaration />
      <Spacing />
      <ConfirmPromptDeclarations />
      <Spacing />
      <WaitForKeyPressDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
