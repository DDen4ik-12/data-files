// ==UserScript==
// @name        Some GitHub Utils
// @version     1.1
// @author      Den4ik-12
// @include     https://github.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @namespace   http://tampermonkey.net/
// @run-at      document-start
// ==/UserScript==

(async () => {
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
  const createButtonGroup = (classes, isPullRequest, commitInput, setCommit, optInfo) => {
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
            varProps.type = prompt(`New template - Var #${i + 1}/${varsCount}: Type (available: ${Object.keys(varTypes).join(", ")})`);
            varTypes[varProps.type].onCreateVar?.(`New template - Var #${i + 1}/${varsCount}`, varProps);
            vars.push(varProps);
          }
          const newTemplate = new CommitTemplate({ isPullRequest, emoji, name, msg, vars });
          templates.push(newTemplate);
          newButton.before(newTemplate.createButton(classes, commitInput, setCommit, optInfo));
        },
      },
      [document.createTextNode("+")]
    );
    buttonGroup.append(
      ...templates
        .filter((template) => template.isPullRequest == isPullRequest)
        .map((template) =>
          template.createButton(classes, commitInput, setCommit, optInfo),
        ),
      newButton,
    );
    commitInput.parentNode.before(buttonGroup);
  };

  // Templates. Variables types
  const varTypes = {
    text: {
      fill: ({ var_ }) => var_.text,
      onCreateVar: (titleStart, varProps) => {
        varProps.text = prompt(`${titleStart} (text): Text`) || "";
      },
    },
    file: {
      fill: ({ template, file }) => template.isPullRequest ? "" : file,
    },
    prNum: {
      fill: ({ template, prNum }) => template.isPullRequest ? prNum : "",
    },
    prHead: {
      fill: ({ template, prHead }) => template.isPullRequest ? prHead : "",
    },
    emoji: {
      fill: ({ template }) => template.emoji,
    },
    counter: {
      fill: ({ template }) => String(template.$counter || 0),
      onConstruct: (template, optArgs) => {
        if (!template.isCore) template.$counter = parseInt(optArgs?.$counter) || 0;
      },
      onSerialize: (template, serialized) => {
        if (template.$counter) serialized.$counter = template.$counter;
      },
      subbutton: (varSubbuttons, template) => {
        varSubbuttons.counter = Object.assign(document.createElement("span"), {
          className: usSubbuttonClass,
          textContent: String(template.$counter || 0),
          title: "Reset counter on this template",
          onclick: (event) => {
            event.stopPropagation();
            template.$counter = 0;
            varSubbuttons.counter.textContent = "0";
            saveTemplates();
          },
        });
      },
      onClick: (varSubbuttons, template) => {
        template.$counter++;
        varSubbuttons.counter.textContent = String(template.$counter || 0);
      },
    },
  };
  const saveTemplates = () => GM_setValue(
    "templates",
    templates.reduce((acc, template) => template.isCore ? acc : [...acc, template.serialize()], []),
  );
  class CommitTemplate {
    constructor({ isCore, isPullRequest, emoji, name, msg, vars, optArgs }) {
      this.isCore = !!isCore;
      this.isPullRequest = !!isPullRequest;

      this.emoji = String(emoji);
      this.name = String(name);

      this.msg = String(msg);
      this.vars = Array.isArray(vars) ? vars : [];

      Object.keys(varTypes).forEach((type) => {
        if (this.vars.some((var_) => var_.type == type)) varTypes[type].onConstruct?.(this, optArgs);
      });
    }
    static deserialize(value) {
      return new CommitTemplate({ ...value, isCore: false });
    }
    serialize() {
      const serialized = {
        isPullRequest: this.isPullRequest,
        emoji: this.emoji,
        name: this.name,
        msg: this.msg,
        vars: this.vars,
      };
      Object.keys(varTypes).forEach((type) => {
        if (this.vars.some((var_) => var_.type == type)) varTypes[type].onSerialize?.(this, serialized);
      });
      return serialized;
    }
    get nameWithEmoji() {
      if (this.emoji) return `${this.emoji} ${this.name}`;
      return this.name;
    }
    filledMsg(optInfo) {
      let i = -1;
      return this.msg.replaceAll("$", () => {
        i++;
        return varTypes[this.vars[i].type].fill?.({
          _var: this.vars[i],
          template: this,
          ...optInfo,
        }) || "";
      });
    }
    createButton(classes, commitInput, setCommit, optInfo) {
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
            saveTemplates();
          },
        });
      }

      const varSubbuttons = {};
      Object.keys(varTypes).forEach((type) => {
        if (this.vars.some((var_) => var_.type == type)) varTypes[type].subbutton?.(varSubbuttons, this);
      });

      const buttonContent = [document.createTextNode(this.nameWithEmoji), ...Object.values(varSubbuttons)];
      if (removeSubbutton) {
        buttonContent.push(removeSubbutton);
      }
      const button = createButton(
        classes,
        null,
        {
          onclick: () => {
            Object.keys(varTypes).forEach((type) => {
              if (this.vars.some((var_) => var_.type == type)) varTypes[type].onClick?.(varSubbuttons, this);
            });
            setCommit(this.filledMsg(optInfo));
            commitInput.focus();
            saveTemplates();
          },
        },
        buttonContent,
      );
      return button;
    }
  }
  const templates = [
    // File update core templates
    new CommitTemplate({
      isCore: true,
      emoji: "⬆",
      name: "Update",
      msg: "$: $ Update",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
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
      emoji: "📄",
      name: "Docs",
      msg: "$: $ docs - ",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "↩",
      name: "Revert",
      msg: "$: $ Revert changes",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    // Pull request core templates
    new CommitTemplate({
      isCore: true,
      isPullRequest: true,
      emoji: "⤴",
      name: "Pull request",
      msg: "$ Merge PR #$ from $",
      vars: [{ type: "emoji" }, { type: "prNum" }, { type: "prHead" }],
    }),
    // Non-core templates
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
        /[Bb]ump \S+ from `[a-z0-9]{7}` to `[a-z0-9]{7}`$/.test(
          props.mergeRequirements.commitMessageBody,
        )
      ) {
        const [_, module, from, to] =
          props.mergeRequirements.commitMessageBody.match(
            /[Bb]ump (\S+) from `([a-z0-9]{7})` to `([a-z0-9]{7})`$/,
          );
        return `${module}: 📦 Bump from ${from} to ${to}`;
      }
      const prNum = props.mergeRequirements.commitMessageHeadline.match(
        /^Merge pull request #(\d+) from .+$/,
      )[1];
      return `⤴ Merge PR #${prNum} from ${props.pullRequest.headRepository.ownerLogin}/${props.pullRequest.headRefName}`;
    } else {
      if (props.isDelete) {
        const fileName = props.placeholderMessage.match(/^Delete (.+)$/)[1];
        return `${fileName}: 🗑 Delete`;
      }
      if (props.isNewFile) {
        const pathArr = props.fileName.split("/");
        const fileName = pathArr[pathArr.length - 1];
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
          const pathArr = commitDialogNodeProps.fileName.split("/");
          createButtonGroup(
            { buttonClass, buttonContentClass, buttonLabelClass },
            false,
            commitInput,
            commitDialogNodeProps.setMessage,
            {
              file: commitDialogNodeProps.isNewFile
                ? pathArr[pathArr.length - 1]
                : renamingVisual(
                    commitDialogNodeProps.oldPath,
                    commitDialogNodeProps.fileName,
                  ),
            },
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
        const rwNodeProps = fiberUtils.parentWithProps(
          fiberUtils.of(commitInput),
          new Set(["match"]),
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
          true,
          commitInput,
          (newCommitName) => {
            commitInputNodeProps.onChange({
              currentTarget: { value: () => newCommitName },
            });
            commitInput.value = newCommitName;
          },
          {
            prNum: rwNodeProps.match.params.pr_number,
            prHead: `${mergeBoxNodeProps.pullRequest.headRepository.ownerLogin}/${mergeBoxNodeProps.pullRequest.headRefName}`,
          },
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
          title: "Copy ID to clipboard",
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
    max-height: 130px;
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
