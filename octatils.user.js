// ==UserScript==
// @name        OctaTils
// @version     1.2.1
// @author      Den4ik-12
// @include     https://github.com/*
// @connect     simpleicons.org
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// @require     https://cdn.jsdelivr.net/npm/preact
// @require     https://cdn.jsdelivr.net/npm/preact/hooks/dist/hooks.umd.js
// @require     https://cdn.jsdelivr.net/npm/htm
// @namespace   http://tampermonkey.net/
// @run-at      document-start
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/octatils.user.js
// @updateURL   https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/octatils.user.js
// ==/UserScript==

(async () => {
  // Imports
  const Preact = self.preact,
    { useState, useRef, useEffect } = self.preactHooks,
    htm = self.htm.bind(Preact.h);

  // Constants
  const buttonQuery = 'button[class*="prc-Button-ButtonBase"]',
    buttonContentQuery = 'span[class*="prc-Button-ButtonContent"]',
    buttonLabelQuery = 'span[class*="prc-Button-Label"]',
    usElClasses = {
      buttonGroup: "us-octatils_button-group",
      subbutton: "us-octatils_subbutton",
      userIdLabel: "us-octatils_user-id-label",
    },
    usSymbols = {
      renderedList: Symbol("octatils.renderedList"),
      renderedList1stChild: Symbol("octatils.renderedList1stChild"),
    };

  // JS & React utilites
  const fiberUtils = {
    of: (el) => el ? (
      el[Object.keys(el).find((key) => key.startsWith("__reactFiber$"))] ||
      el[Object.keys(el).find((key) => key.startsWith("__reactContainer$"))]
    ) : undefined,
    parentWithProps: (fiber, props) => {
      let target = fiber;
      while (
        !props.isSubsetOf(new Set(Object.keys(target.memoizedProps ?? {})))
      ) {
        target = target.return;
      }
      return target;
    },
    htmlRef: (fiber) => {
      let target = fiber;
      while (typeof target.type !== "string") {
        target = target.child;
      }
      if (!target.sibling) return target.stateNode;
      const siblings = [target.stateNode];
      while (target.sibling) {
        target = target.sibling;
        if (typeof target.type !== "string") siblings.push(target.stateNode);
      }
      return siblings;
    },
    htmlChildsByCompName: (fiber, compName) => {
      let targets = [fiber?.child],
        nextTargets = [],
        findedTargets = [];
      if (!targets[0]) return [];
      do {
        nextTargets = [];
        targets.forEach((target) => {
          if (
            target.elementType === compName ||
            target.elementType?.displayName === compName
          ) {
            findedTargets.push(fiberUtils.htmlRef(target));
          }
          if (target.child) nextTargets.push(target.child);
          if (target.sibling) nextTargets.push(target.sibling);
        });
        targets = nextTargets;
      } while (nextTargets.length > 0)
      return findedTargets;
    },
  };
  const addOrCreateSet = (obj, key, value) => {
    if (key in obj) return obj[key].add(value);
    return (obj[key] = new Set([value]));
  };
  const colorIsBright = (hex) => {
    let r, g, b;
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
      r = hex.slice(1, 2).repeat(2);
      g = hex.slice(2, 3).repeat(2);
      b = hex.slice(3).repeat(2);
    } else if (/^#[0-9a-f]{6}$/i.test(hex)) {
      r = hex.slice(1, 3);
      g = hex.slice(3, 5);
      b = hex.slice(5);
    } else {
      return false;
    }
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    return Math.sqrt(
      0.299 * r ** 2 +
      0.587 * g ** 2 +
      0.114 * b ** 2
    ) > 142;
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
      onClick: (template, setCounter) => {
        template.$counter++;
        saveTemplates();
        setCounter(template.$counter);
      },
      Subbutton: ({ template, setCounter }) => {
        const resetCounter = (event) => {
          event.stopPropagation();
          template.$counter = 0;
          saveTemplates();
          setCounter(0);
        };

        return htm`
        <span
          className=${usElClasses.subbutton}
          title="Reset counter on this template"
          onClick=${resetCounter}
        >
          ${String(template.$counter)}
        </span>
        `;
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
        if (this.vars.some((var_) => var_.type === type)) varTypes[type].onConstruct?.(this, optArgs);
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
        if (this.vars.some((var_) => var_.type === type)) varTypes[type].onSerialize?.(this, serialized);
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
  }
  const templates = [
    // File update core templates
    new CommitTemplate({
      isCore: true,
      emoji: "➕",
      name: "Create",
      msg: "$: $ Create",
      vars: [{ type: "file" }, { type: "emoji" }],
    }),
    new CommitTemplate({
      isCore: true,
      emoji: "⬆",
      name: "Update",
      msg: "$: $ Update",
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
    new CommitTemplate({
      isCore: true,
      emoji: "📄",
      name: "Docs",
      msg: "$: $ docs - ",
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
    if (oldPath === newPath) return newPathArr[newPathArr.length - 1];
    if (oldPathArr.length === 1 || newPathArr.length === 1) {
      return `${oldPath} => ${newPath}`;
    }
    let difI =
      newPathArr.length > oldPathArr.length
        ? oldPathArr.length - 1
        : newPathArr.findIndex((dir, i) => oldPathArr[i] !== dir);
    if (difI === -1) difI = newPathArr.length - 1;
    if (difI === 0) {
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
      if (props.fileName !== props.oldPath) {
        return renamingVisual(props.oldPath, props.fileName);
      }
      return props.message;
    }
  };

  // Directory content config
  const saveDirContentConfig = () => GM_setValue(
    "dirContent",
    dirContentConfig,
  );
  const dirContentConfig = GM_getValue("dirContent", []);

  // Node finders
  class HtmlNodeFinder {
    constructor({ parentQuery, addingType = "set" }) {
      this.parentQuery = parentQuery;
      this.addingType = addingType;
    }
    find() {
      const findedTargets = document.querySelectorAll(this.parentQuery);
      return [...findedTargets].map((findedTarget) => ({
        node: findedTarget,
        addingType: this.addingType,
      }));
    }
  }
  class ReactNodeFinder extends HtmlNodeFinder {
    _findIter(findedTargets, target, i) {
      if (this.parentQuery[i].type === "component") {
        let fiber;
        if (Array.isArray(target)) {
          fiber = fiberUtils.of(target[0]).return;
        } else {
          fiber = fiberUtils.of(target);
        }
        return [
          ...findedTargets,
          ...fiberUtils.htmlChildsByCompName(fiber, this.parentQuery[i].name),
        ];
      } else if (this.parentQuery[i].type === "cssQuery") {
        if (Array.isArray(target)) {
          return target.reduced((findedTargets, node) => [
            ...findedTargets,
            ...node.querySelectorAll(this.parentQuery[i].query),
          ], findedTargets);
        } else {
          return [
            ...findedTargets,
            ...target.querySelectorAll(this.parentQuery[i].query),
          ];
        }
      } else {
        return [];
      }
    }
    find() {
      let findedTargets = reactRoots.values().reduce((findedTargets, { root }) => this._findIter(findedTargets, root, 0), []);
      for (let i = 1; i < this.parentQuery.length; i++) {
        findedTargets = findedTargets.reduce((findedTargets, target) => this._findIter(findedTargets, target, i), []);
      }
      return findedTargets.map((findedTarget) => ({
        node: findedTarget,
        addingType: this.addingType,
      }));
    }
  }

  // Injecting in HTML/React
  const reactRoots = new Map();
  const renderList = [];
  const push2RenderList = (component, finder, propsFn) => {
    renderList.push({ component, finder, propsFn });
  };
  const observerClbk = (mutationsList) => {
    const newReactWrappers = [...document.querySelectorAll("#__primerPortalRoot__, react-app, react-partial")];
    reactRoots.keys().forEach((wrapper) => {
      if (!newReactWrappers.includes(wrapper)) {
        reactRoots.delete(wrapper);
      }
    });
    newReactWrappers.forEach((wrapper) => {
      const root = wrapper.querySelector('[data-component="Portal"] > *, [data-target="react-app.reactRoot"], [data-target="react-partial.reactRoot"]');
      reactRoots.set(wrapper, { root });
    });

    renderList.forEach(({ component, finder, propsFn }) => {
      const findedList = finder.find();
      if (findedList.length === 0) return;
      findedList.forEach((finded) => {
        const findedIsArr = Array.isArray(finded.node);
        if (
          !(
            findedIsArr
              ? finded.node[0][usSymbols.renderedList1stChild]
              : finded.node[usSymbols.renderedList]
          )?.has?.(component)
        ) {
          if (findedIsArr) {
            addOrCreateSet(finded.node[0], usSymbols.renderedList1stChild, component);
          } else {
            addOrCreateSet(finded.node, usSymbols.renderedList, component);
          }
          let renderParent, refParent, props;
          if (finded.addingType === "set") {
            if (findedIsArr) {
              refParent = finded.node[0];
              props = propsFn?.(refParent) || {};
              renderParent = document.createElement("div");
              refParent.before(renderParent);
              finded.node.forEach((node) => node.remove());
            } else {
              refParent = renderParent = finded.node;
              props = propsFn?.(refParent) || {};
              renderParent.innerHTML = "";
            }
          } else if (finded.addingType === "append") {
            if (findedIsArr) {
              refParent = finded.node[finded.node.length - 1];
              props = propsFn?.(refParent) || {};
              renderParent = document.createElement("div");
              refParent.after(renderParent);
            } else {
              refParent = finded.node;
              props = propsFn?.(refParent) || {};
              renderParent = document.createElement("div");
              refParent.append(renderParent);
            }
          } else if (finded.addingType === "before") {
            if (findedIsArr) {
              refParent = finded.node[0];
              props = propsFn?.(refParent) || {};
              renderParent = document.createElement("div");
              refParent.before(renderParent);
            } else {
              refParent = finded.node;
              props = propsFn?.(refParent) || {};
              renderParent = document.createElement("div");
              refParent.before(renderParent);
            }
          }
          Preact.render(htm`<${component} ...${{
            parent: refParent,
            ...props,
          }}/>`, renderParent);
        }
      });
    });
  };

  // Register Preact components
  function Button({ variant = "default", children, ...props }) {
    const buttonClass = document.querySelector(buttonQuery).classList[0];
    const buttonContentClass =
      document.querySelector(buttonContentQuery).className;
    const buttonLabelClass =
      document.querySelector(buttonLabelQuery).className;
    return htm`
    <div
      className=${buttonClass}
      data-no-visuals=${true}
      data-size="medium"
      data-variant=${variant}
      ...${props}
    >
      <span
        className=${buttonContentClass}
        data-component="buttonContent"
        data-align="center"
      >
        <span
          className=${buttonLabelClass}
          data-component="text"
        >
          ${children}
        </span>
      </span>
    </div>
    `;
  }

  function UserIdLabel({ userId }) {
    return htm`
    <span
      className=${`vcard-username d-block ${usElClasses.userIdLabel}`}
      title="Copy ID to clipboard"
      onClick=${() => navigator.clipboard.writeText(userId)}
    >
      ID: ${userId}
    </span>
    `;
  }
  push2RenderList(
    UserIdLabel,
    new HtmlNodeFinder({
      parentQuery: ".js-profile-editable-replace h1.vcard-names",
      addingType: "append",
    }),
    () => {
      const avatar = document.querySelector(".js-profile-editable-replace img.avatar");
      const userId = avatar.src.match(/^https:\/\/avatars.githubusercontent.com\/u\/(\d+)/)[1];
      return { userId };
    }
  );

  function TemplateButton({ template, commitInput, setCommit, setThisTemplates, optInfo }) {
    let [counter, setCounter] = useState(template.$counter || 0);

    const handleClick = () => {
      Object.keys(varTypes).forEach((type) => {
        if (template.vars.some((var_) => var_.type === type)) varTypes[type].onClick?.(template, setCounter);
      });
      setCommit(template.filledMsg(optInfo));
      commitInput.focus();
      saveTemplates();
    };
    const removeTemplate = (event) => {
      event.stopPropagation();
      templates.splice(templates.indexOf(template), 1);
      saveTemplates();
      setThisTemplates([...templates]);
    };

    const removeSubbutton = htm`
    <span
      className=${usElClasses.subbutton}
      title="Remove this template"
      onClick=${removeTemplate}
    >×</span>
    `;
    const varSubbuttons = Object.keys(varTypes).reduce((varSubbuttons, type) =>
      template.vars.some((var_) => var_.type === type) && varTypes[type].Subbutton
        ? [...varSubbuttons, varTypes[type].Subbutton]
        : varSubbuttons, []);

    return htm`
    <${Button} onClick=${handleClick}>
      ${template.nameWithEmoji}
      ${varSubbuttons.map((Subbutton) => htm`
      <${Subbutton}
        template=${template}
        setThisTemplates=${setThisTemplates}
        setCounter=${setCounter}
      />
      `)}
      ${!template.isCore && removeSubbutton}
    </${Button}>
    `;
  }
  function TemplatesGroup({ parent, isDelete, isPullRequest, commitInput, setCommit, optInfo }) {
    const [thisTemplates, setThisTemplates] = useState([...templates]);

    const createTemplate = () => {
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
      saveTemplates();
      setThisTemplates([...templates]);
    };

    return isDelete ? null : htm`
    <div className=${usElClasses.buttonGroup}>
      ${
        thisTemplates
          .filter((template) => template.isPullRequest === isPullRequest)
          .map((template) => htm`
          <${TemplateButton}
            template=${template}
            commitInput=${commitInput}
            setCommit=${setCommit}
            setThisTemplates=${setThisTemplates}
            optInfo=${optInfo}
          />
          `)
      }
      <${Button}
        variant="primary"
        onClick=${createTemplate}
      >+</${Button}>
    </div>
    `;
  }
  push2RenderList(
    TemplatesGroup,
    new ReactNodeFinder({
      parentQuery: [
        { type: "component", name: "WebCommitDialog" },
        { type: "component", name: "Dialog" },
        { type: "cssQuery", query: 'span[class*="WebCommitDialog-module__commitMessageInput"]' },
      ],
      addingType: "before",
    }),
    (parent) => {
      const commitInput = parent.querySelector("#commit-message-input");
      const commitDialogNodeProps = fiberUtils.parentWithProps(
        fiberUtils.of(commitInput),
        new Set(["setMessage"]),
      ).memoizedProps;

      const newCommitName = defaultCommitName(false, commitDialogNodeProps);
      commitDialogNodeProps.setMessage(newCommitName);

      if (commitDialogNodeProps.isDelete) return { isDelete: true };
      const pathArr = commitDialogNodeProps.fileName.split("/");
      return {
        isDelete: false,
        isPullRequest: false,
        commitInput,
        setCommit: commitDialogNodeProps.setMessage,
        optInfo: {
          file: commitDialogNodeProps.isNewFile
            ? pathArr[pathArr.length - 1]
            : renamingVisual(
                commitDialogNodeProps.oldPath,
                commitDialogNodeProps.fileName,
              ),
        },
      };
    },
  );
  push2RenderList(
    TemplatesGroup,
    new ReactNodeFinder({
      parentQuery: [
        { type: "component", name: "MergeBox" },
        { type: "cssQuery", query: '[data-testid="mergebox-border-container"] .TextInput-wrapper' },
      ],
      addingType: "before",
    }),
    (parent) => {
      const commitInput = parent.querySelector("input");
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

      return {
        isDelete: false,
        isPullRequest: true,
        commitInput,
        setCommit: (newCommitName) => {
          commitInputNodeProps.onChange({
            currentTarget: { value: () => newCommitName },
          });
          commitInput.value = newCommitName;
        },
        optInfo: {
          prNum: rwNodeProps.match.params.pr_number,
          prHead: `${mergeBoxNodeProps.pullRequest.headRepository.ownerLogin}/${mergeBoxNodeProps.pullRequest.headRefName}`,
        },
      };
    },
  );

  function DirectoryRowIcon({ parent, defaultD, config }) {
    const [d, setD] = useState(null);
    const path = useRef(null);

    useEffect(async () => {
      Object.assign(parent.style, {
        width: "calc(16px + 0.5rem)",
        height: "calc(16px + 0.5rem)",
        fill: config?.color
          ? colorIsBright(config.color) ? "#1f2328" : "#ffffff"
          : "var(--bgColor-default, var(--color-canvas-default))",
        background: config?.color || "currentColor",
        marginInline: "-0.25rem",
        padding: "0.25rem",
        borderRadius: "0.25rem",
      });

      if (!config?.icon) return;
      const saveKey = `us-some-gh-utils:simple-icons:${config.icon}`;
      let iconSvg;
      if (saveKey in sessionStorage) {
        iconSvg = sessionStorage[saveKey];
      } else {
        iconSvg = (
          await GM.xmlHttpRequest({
            url: `https://simpleicons.org/icons/${config.icon}.svg`,
          })
        ).responseText;
        sessionStorage.setItem(saveKey, iconSvg);
      }

      const wrapper = document.createElement("div");
      wrapper.innerHTML = iconSvg;
      parent.setAttribute("viewBox", wrapper.querySelector("svg").getAttribute("viewBox"));
      setD(wrapper.querySelector("path").getAttribute("d"));
    }, []);

    return htm`<path d=${d || defaultD} />`;
    /*
    <svg
      ref=${svg}
      className=${className}
      aria-hidden=${true}
      focusable=${false}
      width=${16}
      height=${16}
    />
    */
  }
  push2RenderList(
    DirectoryRowIcon,
    new ReactNodeFinder({
      parentQuery: [
        { type: "component", name: "DirectoryRow" },
        { type: "cssQuery", query: "svg" },
      ],
      addingType: "set",
    }),
    (parent) => {
      const defaultD = parent.querySelector("path").getAttribute("d");
      const item = fiberUtils.parentWithProps(
        fiberUtils.of(parent),
        new Set(["item"]),
      ).memoizedProps.item;
      const config = dirContentConfig.find((configPart) => {
        if (
          configPart.nameMatch &&
          !(new RegExp(...configPart.nameMatch).test(item.name))
        ) return false;
        if (
          configPart.contentType &&
          item.contentType !== configPart.contentType
        ) return false;
        return true;
      });

      return { parent, defaultD, config };
    },
  );

  const style = document.createElement("style");
  style.textContent = `
  .${usElClasses.buttonGroup} {
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

  .${usElClasses.subbutton} {
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
  .${usElClasses.subbutton}:hover {
    color: var(--fgColor-onEmphasis);
    background-color: var(--bgColor-accent-emphasis);
  }

  .${usElClasses.userIdLabel} {
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }`;
  document.head.append(style);

  const observer = new MutationObserver(observerClbk);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  unsafeWindow.someGhUtils = {
    get reactRoots() {
      return reactRoots;
    },
    renderList,
    fiberUtils,
    HtmlNodeFinder,
    ReactNodeFinder,
    Preact,
    htm,
  };
})();
