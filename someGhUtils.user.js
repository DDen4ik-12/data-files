// ==UserScript==
// @name        Some GitHub Utils
// @version     1.0
// @author      Den4ik-12
// @include     https://github.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @namespace   http://tampermonkey.net/
// @run-at      document-start
// ==/UserScript==

(() => {
  // Constants
  const commitDialogClassPart = "WebCommitDialog-module__WebCommitDialogDialog",
    buttonQuery = 'button[class*="prc-Button-ButtonBase"]',
    buttonContentQuery = 'span[class*="prc-Button-ButtonContent"]',
    buttonLabelQuery = 'span[class*="prc-Button-Label"]',
    usButtonGroupClass = "us-some-gh-utils_button-group",
    usSubbuttonClass = "us-some-gh-utils_subbutton",
    usSymbol = Symbol("someGhUtils");

  // JS & React utilites
  const fiberUtils = {
    of: (el) =>
      el[Object.keys(el).find((key) => key.startsWith("__reactFiber$"))],
    parentWithProps: (fiber, props) => {
      let target = fiber;
      while (
        !props.isSubsetOf(new Set(Object.keys(target.memoizedProps ?? {})))
      ) {
        target = target.return;
      }
      return target;
    },
  };
  const overrideFunction = function (fn, overrider) {
    const ogFn = fn;
    return function (...args) {
      return overrider.call(this, ogFn.bind(this), ...args);
    };
  };

  // Elements
  const createButton = (classes, variant, props, content) => {
    const button = Object.assign(document.createElement("div"), {
      className: classes.buttonClass,
      ...props,
    });
    button.setAttribute("data-no-visuals", true);
    button.setAttribute("data-size", "medium");
    button.setAttribute("data-variant", variant || "default");

    const buttonContent = Object.assign(document.createElement("span"), {
      className: classes.buttonContentClass,
    });
    buttonContent.setAttribute("data-component", "buttonContent");
    buttonContent.setAttribute("data-align", "center");
    button.append(buttonContent);

    const buttonLabel = Object.assign(document.createElement("span"), {
      className: classes.buttonLabelClass,
    });
    buttonLabel.append(...content);
    buttonLabel.setAttribute("data-component", "text");
    buttonContent.append(buttonLabel);

    return button;
  };
  const createButtonGroup = (classes, filterFn, commitInput, setCommit, file) => {
    const buttonGroup = Object.assign(document.createElement("div"), {
      className: usButtonGroupClass,
    });
    const newButton = createButton(
      classes,
      "primary",
      {
        onclick: () => {
          const emoji = prompt("New template: Emoji", "⬆");
          const name = prompt("New template: Name", "Update");
          const msg = prompt("New template: Message", "$: $ Update");
          const varsCount = msg.match(/\$/g).length;
          let vars = [];
          for (let i = 0; i < varsCount; i++) {
            const varProps = {};
            varProps.type = prompt(`New template - Var #${i + 1}/${varsCount}: Type (available: text, file, emoji, counter)`);
            switch (varProps.type) {
              case "text": {
                varProps.text = prompt(`New template - Var #${i + 1}/${varsCount} (text): Text`);
                break;
              }
            }
            vars.push(varProps);
          }
          const newTemplate = new CommitTemplate({ emoji, name, msg, vars });
          templates.push(newTemplate);
          newButton.before(newTemplate.createButton(classes, commitInput, setCommit, file));
        },
      },
      [document.createTextNode("+")]
    );
    buttonGroup.append(
      ...templates
        .filter(filterFn)
        .map((template) =>
          template.createButton(classes, commitInput, setCommit, file),
        ),
      newButton,
    );
    commitInput.parentNode.before(buttonGroup);
  };

  // Templates
  class CommitTemplate {
    constructor({ isCore, isPullRequest, counter, emoji, name, msg, vars }) {
      this.isCore = !!isCore;
      this.isPullRequest = !!isPullRequest;

      this.emoji = String(emoji);
      this.name = String(name);

      this.msg = String(msg);
      this.vars = Array.isArray(vars) ? vars : [];

      if (!this.isCore && this.vars.some((var_) => var_.type == "counter")) {
          this.counter = parseInt(counter) || 0;
      }
    }
    static deserialize (value) {
      return new CommitTemplate({ ...value, isCore: false });
    }
    serialize () {
      const serialized = {
        isPullRequest: this.isPullRequest,
        emoji: this.emoji,
        name: this.name,
        msg: this.msg,
        vars: this.vars,
      };
      if (this.counter) serialized.counter = this.counter;
      return serialized;
    }
    get nameWithEmoji() {
      if (this.emoji) return `${this.emoji} ${this.name}`;
      return this.name;
    }
    filledMsg(file) {
      let i = -1;
      return this.msg.replaceAll("$", () => {
        i++;
        switch (this.vars[i].type) {
          case "text":
            return this.vars[i].text;
          case "file":
            return this.isPullRequest ? "" : file;
          case "emoji":
            return this.emoji;
          case "counter":
            return String(this.counter || 0);
          default:
            return "";
        }
      });
    }
    createButton(classes, commitInput, setCommit, file) {
      let counterSubbutton;
      if ("counter" in this) {
        counterSubbutton = Object.assign(document.createElement("span"), {
          className: usSubbuttonClass,
          textContent: String(this.counter || 0),
          title: "Reset counter on this template",
          onclick: (event) => {
            event.stopPropagation();
            this.counter = 0;
            counterSubbutton.textContent = "0";
            GM_setValue(
              "templates",
              templates.reduce((acc, template) => template.isCore ? acc : [...acc, template.serialize()], []),
            );
          },
        });
      }

      let removeSubbutton;
      if (!this.isCore) {
        removeSubbutton = Object.assign(document.createElement("span"), {
          className: usSubbuttonClass,
          textContent: "×",
          title: "Remove this template",
          onclick: (event) => {
            event.stopPropagation();
            templates.splice(templates.indexOf(this), 1);
            button.outerHTML = "";
            GM_setValue(
              "templates",
              templates.reduce((acc, template) => template.isCore ? acc : [...acc, template.serialize()], []),
            );
          },
        });
      }

      const buttonContent = [document.createTextNode(this.nameWithEmoji)];
      if (counterSubbutton) {
        buttonContent.push(counterSubbutton);
      }
      if (removeSubbutton) {
        buttonContent.push(removeSubbutton);
      }
      const button = createButton(
        classes,
        null,
        {
          onclick: () => {
            if ("counter" in this) {
              this.counter++;
              counterSubbutton.textContent = String(this.counter || 0);
            }
            setCommit(this.filledMsg(file));
            commitInput.focus();
            GM_setValue(
              "templates",
              templates.reduce((acc, template) => template.isCore ? acc : [...acc, template.serialize()], []),
            );
          },
        },
        buttonContent,
      );
      return button;
    }
  }
  const templates = [
    new CommitTemplate({
      isCore: true,
      emoji: "🐛",
      name: "Bugs",
      msg: "$: $ Bugfixes",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "🔧",
      name: "Fix",
      msg: "$: $ Fix",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "✨",
      name: "New feature",
      msg: "$: $ Add ",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "🧪",
      name: "Test",
      msg: "$: $ Add test",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "🎨",
      name: "Format code",
      msg: "$: $ Format code",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "↩",
      name: "Revert",
      msg: "$: $ Revert changes",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    ...GM_getValue("templates", []).map((value) => CommitTemplate.deserialize(value)),
  ];

  // Commit namming functions
  const renamingVisual = (oldPath, newPath) => {
    const oldPathArr = oldPath.split("/");
    const newPathArr = newPath.split("/");
    if (oldPath == newPath) return newPathArr[newPathArr.length - 1];
    if (oldPathArr.length == 1 || newPathArr.length == 1) {
      return `${oldPath} => ${newPath}`;
    }
    let difI =
      newPathArr.length > oldPathArr.length
        ? oldPathArr.length - 1
        : newPathArr.findIndex((dir, i) => oldPathArr[i] != dir);
    if (difI == -1) difI = newPathArr.length - 1;
    if (difI == 0) {
      return `${oldPathArr.toSpliced(0, difI).join("/")} => ${newPathArr.toSpliced(0, difI).join("/")}`;
    }
    return `.../${oldPathArr.toSpliced(0, difI).join("/")} => .../${newPathArr.toSpliced(0, difI).join("/")}`;
  };
  const defaultCommitName = (isPullRequest, props) => {
    if (isPullRequest) {
      if (
        props.pullRequest.headRefName.startsWith("dependabot") &&
        /^Bump \S+ from `[a-z0-9]{7}` to `[a-z0-9]{7}`$/.test(
          props.mergeRequirements.commitMessageBody,
        )
      ) {
        const [_, module, from, to] =
          props.mergeRequirements.commitMessageBody.match(
            /^Bump (\S+) from `([a-z0-9]{7})` to `([a-z0-9]{7})`$/,
          );
        return `${module}: 📦 Bump from ${from} to ${to}`;
      }
      const pullRequestId = props.mergeRequirements.commitMessageHeadline.match(
        /^Merge pull request #(\d+) from .+$/,
      )[1];
      return `⤴ Merge PR #${pullRequestId} from ${props.pullRequest.headRepository.ownerLogin}/${props.pullRequest.headRefName}`;
    } else {
      if (props.isDelete) {
        const fileName = props.placeholderMessage.match(/^Delete (.+)$/)[1];
        return `${fileName}: 🗑 Delete`;
      }
      if (props.isNewFile) {
        const fileName =
          props.oldPath.length == 0
            ? props.fileName
            : props.fileName.substring(props.oldPath.length + 1);
        return `${fileName}: ➕ Create`;
      }
      if (props.contentChanged) {
        return `${renamingVisual(props.oldPath, props.fileName)}: ⬆ Update`;
      }
      if (props.fileName != props.oldPath) {
        return renamingVisual(props.oldPath, props.fileName);
      }
      return props.message;
    }
  };

  // Observer callback function
  const observerClbk = (mutationsList) => {
    for (const { target } of mutationsList) {
      if (
        !target[usSymbol] &&
        target.className.includes?.(commitDialogClassPart)
      ) {
        target[usSymbol] = true;

        const commitInput = target.querySelector("#commit-message-input");
        const commitDialogNodeProps = fiberUtils.parentWithProps(
          fiberUtils.of(commitInput),
          new Set(["setMessage"]),
        ).memoizedProps;

        commitDialogNodeProps.setMessage(
          defaultCommitName(false, commitDialogNodeProps),
        );

        const buttonClass = target.querySelector(buttonQuery).classList[0];
        const buttonContentClass =
          target.querySelector(buttonContentQuery).className;
        const buttonLabelClass =
          target.querySelector(buttonLabelQuery).className;
        if (!commitDialogNodeProps.isDelete) {
          createButtonGroup(
            { buttonClass, buttonContentClass, buttonLabelClass },
            (template) => !template.isPullRequest,
            commitInput,
            commitDialogNodeProps.setMessage,
            renamingVisual(
              commitDialogNodeProps.oldPath,
              commitDialogNodeProps.fileName,
            ),
          );
        }
      } else if (
        !target[usSymbol] &&
        target.getAttribute("data-testid") == "mergebox-border-container"
      ) {
        target[usSymbol] = true;

        const commitInput = target.querySelector("input");
        const commitInputNodeProps = fiberUtils.parentWithProps(
          fiberUtils.of(commitInput),
          new Set(["onChange", "block"]),
        ).memoizedProps;
        const mergeBoxNodeProps = fiberUtils.parentWithProps(
          fiberUtils.of(commitInput),
          new Set(["mergeRequirements"]),
        ).memoizedProps;

        const newCommitName = defaultCommitName(true, mergeBoxNodeProps);
        commitInputNodeProps.onChange({
          currentTarget: { value: () => newCommitName },
        });
        commitInput.value = newCommitName;

        const buttonClass = target.querySelector(buttonQuery).classList[0];
        const buttonContentClass =
          target.querySelector(buttonContentQuery).className;
        const buttonLabelClass =
          target.querySelector(buttonLabelQuery).className;
        createButtonGroup(
          { buttonClass, buttonContentClass, buttonLabelClass },
          (template) => template.isPullRequest,
          commitInput,
          (newCommitName) => commitInputNodeProps.onChange({
            currentTarget: { value: () => newCommitName },
          }),
        );
      } else if (
        !target[usSymbol] &&
        target.className.includes?.("ActionMenu__ActionMenuOverlay")
      ) {
        target[usSymbol] = true;

        const defaultBranch = fiberUtils.parentWithProps(
          fiberUtils.of(target),
          new Set(["repo"]),
        ).memoizedProps.repo.defaultBranch;
        console.log(defaultBranch);
      } else if (
        !target[usSymbol] &&
        target.className == "js-profile-editable-replace" &&
        target.querySelector("h1.vcard-names")
      ) {
        target[usSymbol] = true;

        const avatar = target.querySelector("img.avatar");
        const userId = avatar.src.match(/^https:\/\/avatars.githubusercontent.com\/u\/(\d+)/)[1];

        const names = target.querySelector("h1.vcard-names");
        const idSpan = Object.assign(document.createElement("span"), {
          className: "vcard-username d-block",
          textContent: `ID: ${userId}`,
          onclick: () => navigator.clipboard.writeText(userId),
        });
        Object.assign(idSpan.style, {
          fontSize: "14px",
          lineHeight: "20px",
          cursor: "pointer",
        });
        names.append(idSpan);
      }
    }
  };

  const style = document.createElement("style");
  style.textContent = `
  .${usButtonGroupClass} {
    display: flex;
    flex-wrap: wrap;
    gap: var(--stack-gap-condensed);
    background-color: var(--bgColor-muted);
    border: var(--borderWidth-thin, .0625rem) solid var(--borderColor-default);
    border-radius: var(--borderRadius-medium);
    width: 100%;
    max-height: 125px;
    padding: var(--base-size-8);
    margin-block: var(--base-size-4, .25rem);
    overflow-y: auto;
  }
  .${usSubbuttonClass} {
    background-color: var(--bgColor-neutral-muted, var(--color-neutral-muted));
    border: var(--borderWidth-thin) solid var(--counter-borderColor);
    color: var(--fgColor-default);
    font-size: var(--text-body-size-small);
    font-weight: var(--base-text-weight-medium);
    line-height: calc(var(--base-size-20) - var(--borderWidth-thin) * 2);
    min-width: var(--base-size-20);
    padding: 0 var(--base-size-6);
    text-align: center;
    border-radius: 2em;
    display: inline-block;
    margin-left: 2px;
  }
  .${usSubbuttonClass}:hover {
    color: var(--fgColor-onEmphasis);
    background-color: var(--bgColor-accent-emphasis);
  `;
  document.head.append(style);
  const observer = new MutationObserver(observerClbk);
  observer.observe(document.body, { childList: true, subtree: true });
})();
