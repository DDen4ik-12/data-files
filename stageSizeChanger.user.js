// ==UserScript==
// @name        stageSizeChanger
// @version     1.0-alpha.7
// @author      Den4ik-12
// @description Userscript for the Scratch website that allows you to resize the scene.
// @match       https://scratch.mit.edu/projects/*
// @match       https://lab.scratch.mit.edu/*
// @grant       none
// @namespace   stageSizeChanger
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/stageSizeChanger.user.js
// @updateURL   https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/stageSizeChanger.user.js
// ==/UserScript==
(async () => {
  // Query list
  const queryList = new Array();
  setInterval(() => {
    const queryListDelete = new Array();
    queryList.forEach((query) => {
      if (query.all) {
        let element = document.querySelectorAll(query.query);
        if (element.length > 0) {
          queryListDelete.push(query);
          query.callback([...element]);
        }
      } else {
        let element = document.querySelector(query.query);
        if (element) {
          queryListDelete.push(query);
          query.callback(element);
        }
      }
    });
    queryListDelete.forEach((query) => {
      queryList.splice(queryList.indexOf(query), 1);
    });
  }, 10);
  const asyncQuerySelector = (query) => {
    let element = document.querySelector(query);
    if (element) {
      return element;
    }
    return new Promise((callback) => {
      queryList.push({
        all: false,
        query,
        callback,
      });
    });
  };
  const asyncQuerySelectorAll = (query) => {
    let element = [...document.querySelectorAll(query)];
    if (element.length > 0) {
      return element;
    }
    return new Promise((callback) => {
      queryList.push({
        all: true,
        query,
        callback,
      });
    });
  };

  // Resources
  const resources = {
    icon: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOS41Mjk0MSIgaGVpZ2h0PSIxOS41Mjk0MSIgdmlld0JveD0iMCwwLDE5LjUyOTQxLDE5LjUyOTQxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMwLjIzNTI5LC0xNzAuMjM1MykiPjxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjMyLjE1NTU2LDE4My42NjQyOWMtMC4zNzUxNCwwIC0wLjY5MjIyLC0wLjEyODQ3IC0wLjk1MTI1LC0wLjM4NTQyYy0wLjI1OTAzLC0wLjI1Njk1IC0wLjM4ODU0LC0wLjU3MzEzIC0wLjM4ODU0LC0wLjk0ODU0di04LjQ5MjA5YzAsLTAuMzc1NDEgMC4xMjk1MSwtMC42OTI3MSAwLjM4ODU0LC0wLjk1MTg3YzAuMjU5MDMsLTAuMjU5MTYgMC41NzYxMSwtMC4zODg3NSAwLjk1MTI1LC0wLjM4ODc1aDEyLjQ4NzA4YzAuMzc1MTQsMCAwLjY5MjIyLDAuMTI4NDcgMC45NTEyNSwwLjM4NTQyYzAuMjU5MDMsMC4yNTY5NSAwLjM4ODU0LDAuNTczMTMgMC4zODg1NCwwLjk0ODU0djMuNjU4ODVsLTEuMDgzMzMsLTAuMDEwMDh2LTMuNjQyOTRjMCwtMC4wNjQxNyAtMC4wMjY3NCwtMC4xMjI5MSAtMC4wODAyMSwtMC4xNzYyNWMtMC4wNTMzMywtMC4wNTM0NyAtMC4xMTIwOCwtMC4wODAyMSAtMC4xNzYyNSwtMC4wODAyMWgtMTIuNDg3MDhjLTAuMDY0MTYsMCAtMC4xMjI5MSwwLjAyNjc0IC0wLjE3NjI1LDAuMDgwMjFjLTAuMDUzNDcsMC4wNTMzNCAtMC4wODAyMSwwLjExMjA4IC0wLjA4MDIxLDAuMTc2MjV2OC40ODcwOGMwLDAuMDY0MTcgMC4wMjY3NCwwLjEyMjkxIDAuMDgwMjEsMC4xNzYyNWMwLjA1MzMzLDAuMDUzNDcgMC4xMTIwOCwwLjA4MDIxIDAuMTc2MjUsMC4wODAyMWg3LjgwMzUybC0wLjAxMzQsMS4wODMzM3oiIGZpbGw9IiM1NzVlNzUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI0Mi42MDc0MywxNzUuODcyNjNoLTEuOTU4MzRjLTAuMTUzNzUsMCAtMC4yODI0MywtMC4wNTE0NiAtMC4zODYwNCwtMC4xNTQzOGMtMC4xMDM3NSwtMC4xMDI3OCAtMC4xNTU2MiwtMC4yMzA0MSAtMC4xNTU2MiwtMC4zODI5MWMwLC0wLjE1MjUgMC4wNTE4NywtMC4yODE1OSAwLjE1NTYyLC0wLjM4NzI5YzAuMTAzNjEsLTAuMTA1ODQgMC4yMzIyOSwtMC4xNTg3NSAwLjM4NjA0LC0wLjE1ODc1aDIuMzcxODdjMC4xOTExMSwwIDAuMzUwNDgsMC4wNjM4OSAwLjQ3ODEzLDAuMTkxNjdjMC4xMjc3OCwwLjEyNzY0IDAuMTkxNjcsMC4yODcwMSAwLjE5MTY3LDAuNDc4MTJ2Mi4zNzE4OGMwLDAuMTUzNzUgLTAuMDUxNDYsMC4yODI0MyAtMC4xNTQzNywwLjM4NjA0Yy0wLjEwMjc4LDAuMTAzNzUgLTAuMjMwNDEsMC4xNTU2MiAtMC4zODI5MSwwLjE1NTYyYy0wLjE1MjUsMCAtMC4yODE2LC0wLjA1MTg3IC0wLjM4NzI5LC0wLjE1NTYyYy0wLjEwNTg0LC0wLjEwMzYxIC0wLjE1ODc1LC0wLjIzMjI5IC0wLjE1ODc1LC0wLjM4NjA0eiIgZmlsbD0iIzU3NWU3NSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjM0LjE5MDc2LDE4MC4yODkyOWgxLjk1ODM0YzAuMTUzNzUsMCAwLjI4MjQzLDAuMDUxNDYgMC4zODYwNCwwLjE1NDM4YzAuMTAzNzUsMC4xMDI3OCAwLjE1NTYyLDAuMjMwNDEgMC4xNTU2MiwwLjM4MjkxYzAsMC4xNTI1IC0wLjA1MTg3LDAuMjgxNTkgLTAuMTU1NjIsMC4zODcyOWMtMC4xMDM2MSwwLjEwNTg0IC0wLjIzMjI5LDAuMTU4NzUgLTAuMzg2MDQsMC4xNTg3NWgtMi4zNzE4N2MtMC4xOTExMSwwIC0wLjM1MDQ4LC0wLjA2Mzg5IC0wLjQ3ODEzLC0wLjE5MTY3Yy0wLjEyNzc4LC0wLjEyNzY0IC0wLjE5MTY3LC0wLjI4NzAxIC0wLjE5MTY3LC0wLjQ3ODEydi0yLjM3MTg4YzAsLTAuMTUzNzUgMC4wNTE0NiwtMC4yODI0MyAwLjE1NDM3LC0wLjM4NjA0YzAuMTAyNzgsLTAuMTAzNzUgMC4yMzA0MSwtMC4xNTU2MiAwLjM4MjkxLC0wLjE1NTYyYzAuMTUyNSwwIDAuMjgxNiwwLjA1MTg3IDAuMzg3MjksMC4xNTU2MmMwLjEwNTg0LDAuMTAzNjEgMC4xNTg3NSwwLjIzMjI5IDAuMTU4NzUsMC4zODYwNHoiIGZpbGw9IiM1NzVlNzUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI0NC4xMTA3NywxNzkuMDM3NGMwLjA3NTIzLC0wLjIyNTY4IDAuMjg2NDQsLTAuMzc3OSAwLjUyNDMzLC0wLjM3NzloMC44NjEzMmMwLjIzNzkzLDAgMC40NDkxMSwwLjE1MjIyIDAuNTI0MzMsMC4zNzc5bDAuMzI4MjksMC45ODQ4OWMwLjI1OTQ5LDAuMTA4OTkgMC41MDIxMiwwLjI1MDAyIDAuNzIzMDcsMC40MTgxNWwxLjAxNzk4LC0wLjIwODMxYzAuMjMzMDcsLTAuMDQ3NyAwLjQ3MDUsMC4wNTkxIDAuNTg5NDQsMC4yNjUxMWwwLjQzMDY1LDAuNzQ1OTVjMC4xMTg5MywwLjIwNjAyIDAuMDkyNzQsMC40NjUwNCAtMC4wNjUxMSwwLjY0MzAzbC0wLjY4OTI1LDAuNzc3MjZjMC4wMTcxOSwwLjEzNjczIDAuMDI2MDMsMC4yNzYwNiAwLjAyNjAzLDAuNDE3NDVjMCwwLjE0MTM4IC0wLjAwODg0LDAuMjgwNzEgLTAuMDI2MDMsMC40MTc0NGwwLjY4OTI1LDAuNzc3MjljMC4xNTc4NSwwLjE3Nzk3IDAuMTg0MDQsMC40MzcgMC4wNjUxMSwwLjY0MzA1bC0wLjQzMDY1LDAuNzQ1OWMtMC4xMTg5MywwLjIwNjA0IC0wLjM1NjM3LDAuMzEyODIgLTAuNTg5NDQsMC4yNjUxMmwtMS4wMTc5OCwtMC4yMDgzMWMtMC4yMjA5NiwwLjE2ODEzIC0wLjQ2MzU5LDAuMzA5MTcgLTAuNzIzMDcsMC40MTgxNmwtMC4zMjgyOSwwLjk4NDg4Yy0wLjA3NTIyLDAuMjI1NzIgLTAuMjg2NCwwLjM3NzkyIC0wLjUyNDMzLDAuMzc3OTJoLTAuODYxMzJjLTAuMjM3ODksMCAtMC40NDkwOSwtMC4xNTIyMSAtMC41MjQzMywtMC4zNzc5MmwtMC4zMjgyOSwtMC45ODQ4OGMtMC4yNTk0NCwtMC4xMDg5OSAtMC41MDIxMSwtMC4yNTAwMyAtMC43MjMwNCwtMC40MTgxNmwtMS4wMTc5OCwwLjIwODMxYy0wLjIzMzA2LDAuMDQ3NyAtMC40NzA0OSwtMC4wNTkwOCAtMC41ODk0NCwtMC4yNjUxMmwtMC40MzA2NywtMC43NDU5Yy0wLjExODk0LC0wLjIwNjA0IC0wLjA5MjcxLC0wLjQ2NTA4IDAuMDY1MTIsLTAuNjQzMDVsMC42ODkyNCwtMC43NzcyOWMtMC4wMTcxOCwtMC4xMzY3MyAtMC4wMjYwMiwtMC4yNzYwNiAtMC4wMjYwMiwtMC40MTc0NGMwLC0wLjE0MTQgMC4wMDg4NSwtMC4yODA3MiAwLjAyNjAyLC0wLjQxNzQ2bC0wLjY4OTIzLC0wLjc3NzI1Yy0wLjE1Nzg0LC0wLjE3Nzk5IC0wLjE4NDA2LC0wLjQzNzAyIC0wLjA2NTEyLC0wLjY0MzAzbDAuNDMwNjcsLTAuNzQ1OTVjMC4xMTg5NSwtMC4yMDYwMiAwLjM1NjM4LC0wLjMxMjgxIDAuNTg5NDQsLTAuMjY1MTFsMS4wMTc5NywwLjIwODMxYzAuMjIwOTMsLTAuMTY4MTMgMC40NjM2LC0wLjMwOTE2IDAuNzIzMDUsLTAuNDE4MTV6TTI0NS4wNjU3NywxODEuOTc1NThjLTAuNjEwNDgsMCAtMS4xMDUzNiwwLjQ5NDg5IC0xLjEwNTM2LDEuMTA1MzdjMCwwLjYxMDQ5IDAuNDk0ODgsMS4xMDUzNiAxLjEwNTM2LDEuMTA1MzZjMC42MTA0OSwwIDEuMTA1MzcsLTAuNDk0ODcgMS4xMDUzNywtMS4xMDUzNmMwLC0wLjYxMDQ4IC0wLjQ5NDg3LC0xLjEwNTM3IC0xLjEwNTM3LC0xLjEwNTM3eiIgZmlsbD0iIzU3NWU3NSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjMwLjIzNTI5LDE4OS43NjQ3MXYtMTkuNTI5NDFoMTkuNTI5NDF2MTkuNTI5NDF6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+",
  };

  // Site differences
  const siteDifferences = {
    "scratch.mit.edu": {
      outlinedStageButton:
        "button_outlined-button_Uhh7R stage-header_stage-button_32Qds",
      buttonContent: "button_content_W+xEu",
      stageButtonIcon: "stage-header_stage-button-icon_tUZn7",
      inFullscreenButton: {
        query:
          'div[class^="stage-header_stage-menu-wrapper_"] > div[class^="stage-header_unselect-wrapper_"] > span[class^="button_outlined-button_"][role="button"]',
        parentI: 1,
      },
      matchingPage: (x) => {
        if (
          !new URL(x).pathname.split("/").includes("editor") &&
          !new URL(x).pathname.split("/").includes("fullscreen")
        ) {
          return "player";
        } else if (new URL(x).pathname.split("/").includes("editor")) {
          return "editor";
        } else if (new URL(x).pathname.split("/").includes("fullscreen")) {
          return "fullscreen";
        }
      },
      pagesCheck: {
        player: () =>
          !location.pathname.split("/").includes("editor") &&
          !location.pathname.split("/").includes("fullscreen"),
        editor: () => location.pathname.split("/").includes("editor"),
        fullscreen: () => location.pathname.split("/").includes("fullscreen"),
      },
      addListenersTo: [],
    },
    "lab.scratch.mit.edu": {
      defaultPage: "editor",
      outlinedStageButton:
        "button_outlined-button_3tmV_ stage-header_stage-button_XRe-_",
      buttonContent: "button_content_3j5-N",
      stageButtonIcon: "stage-header_stage-button-icon_3X5CV",
      inFullscreenButton: {
        query:
          'div[class^="stage-header_stage-menu-wrapper_"] > span[class^="button_outlined-button_"][role="button"]',
        parentI: 0,
      },
      pagesCheck: {
        player: () => false,
        editor: () =>
          !document.querySelector('[class*="stage-wrapper_full-screen"]'),
        fullscreen: () =>
          !!document.querySelector('[class*="stage-wrapper_full-screen"]'),
      },
      addListenersTo: [
        [
          'div[class^="stage-header_stage-size-row_"] div > span[class^="button_outlined-button_"][role="button"]',
          0,
          "fullscreen",
        ],
        [
          'div[class^="stage-header_stage-menu-wrapper_"] > div[class^="stage-header_unselect-wrapper_"] > span[class^="button_outlined-button_"][role="button"], div[class^="stage-header_stage-menu-wrapper_"] > span[class^="button_outlined-button_"][role="button"]',
          0,
          "editor",
        ],
      ],
    },
  };

  // Site check
  if (!Object.hasOwn(siteDifferences, location.host)) {
    console.error(
      '%c %cThis page doesn\'t supported by userscript "Stage Size Changer"',
      `font-size: 1px; padding: 10px 10px; background: no-repeat url(${resources.icon}); margin-right: 0.25rem;`,
      "",
    );
    return;
  }

  // Player style
  const resizePlayerStyle = document.createElement("style");
  document.head.appendChild(resizePlayerStyle);
  const updatePlayerSize = (width, height, stageSizeMode) => {
    stageSizeMode =
      stageSizeMode == "large" ? 1 : stageSizeMode == "small" ? 0.5 : 1;
    const stageWrapperBoundingRect = document
      .querySelector('[class*="stage-wrapper_stage-wrapper"]')
      .getBoundingClientRect();
    resizePlayerStyle.textContent = `.preview .guiPlayer [class*="stage_stage-overlays"],
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage-overlays"] {
      top: 0;
      left: 0;
    }

    .preview .guiPlayer,
    .preview .guiPlayer [class*="stage_question-wrapper"] {
      width: ${width + 2}px !important;
    }
    .preview .guiPlayer [class*="stage_stage_"]:not([class*="stage-wrapper_full-screen"] *),
    .preview .guiPlayer [class*="monitor-list_monitor-list"]:not([class*="stage-wrapper_full-screen"] *),
    .preview .guiPlayer [class*="stage_stage-bottom-wrapper"]:not([class*="stage-wrapper_full-screen"] *),
    .preview .guiPlayer canvas:not([class*="stage-wrapper_full-screen"] *) {
      width: ${width}px !important;
      height: ${height}px !important;
    }
    .preview .guiPlayer [class*="monitor-list_monitor-list-scaler"]:not([class*="stage-wrapper_full-screen"] *) {
      transform: scale(1) !important;
    }

    [class*="stage-wrapper_stage-wrapper"] [class*="stage_question-wrapper"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *) {
      width: ${width * stageSizeMode}px !important;
    }
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage"]:not([class*="stage-wrapper_full-screen"] *, [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage-wrapper"], .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="monitor-list_monitor-list"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage-bottom-wrapper"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage_"] > div > canvas:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *) {
      width: ${width * stageSizeMode}px !important;
      height: ${height * stageSizeMode}px !important;
    }
    [class*="stage-wrapper_stage-wrapper"] [class*="monitor-list_monitor-list-scaler"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *) {
      transform: scale(${stageSizeMode}) !important;
    }

    body [class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_stage"],
    body [class*="stage-wrapper_full-screen"] [class*="stage-header_stage-menu-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_question-wrapper"],
    body [class*="stage-wrapper_full-screen"] canvas {
      width: min(calc((100vh - 44px) * ${width} / ${height}), 100vw) !important;
    }
    body [class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_stage"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_green-flag-overlay-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list"],
    body [class*="stage-wrapper_full-screen"] canvas {
      height: min(calc(100vh - 44px), calc(100vw * ${height} / ${width})) !important;
    }
    body [class*="stage-wrapper_full-screen"] {
      padding: 0 !important;
    }
    body [class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list-scaler"] {
      transform: scale(calc(min(calc(${stageWrapperBoundingRect.height} * ${width} / ${height}), ${stageWrapperBoundingRect.width}) / ${width})) !important;
    }
    body [class*="stage-wrapper_full-screen"] [class*="stage_stage_"] {
      border-width: 0;
    }`;
  };

  // Monitors div's update
  const monitorsDivsUpdate = () => {
    const monitorsDivs = document.querySelectorAll(
      'div[class^="monitor_monitor-container_"]',
    );
    const monitorsInfo = monitorsStateClone.toArray().filter((x) => x.visible);
    monitorsDivs.forEach((value, index) => {
      value.style.transform = `translate(${monitorsInfo[index]?.x - value.style.left.match(/\d+/gs)[0]}px, ${monitorsInfo[index]?.y - value.style.top.match(/\d+/gs)[0]}px)`;
    });
  };

  // Userscript global style and elements
  const userscriptGlobalStyle = document.createElement("style");
  userscriptGlobalStyle.textContent = `[dir="ltr"] div.userscript-stage-size-changer_stage-button {
    margin-right: 0.2rem;
  }
  [dir="rtl"] div.userscript-stage-size-changer_stage-button {
    margin-left: 0.2rem;
  }`;
  document.head.appendChild(userscriptGlobalStyle);

  const mousePosLabel = document.createElement("span");
  mousePosLabel.textContent = "0, 0";
  Object.assign(mousePosLabel.style, {
    width: `${0.625 * 0.55 * 10}rem`,
    fontSize: "0.625rem",
    fontWeight: "bold",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    whiteSpace: "nowrap",
    padding: "0.25rem",
    userSelect: "none",
    color: "#00bcd4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    direction: "ltr",
  });

  const openSettingsButton = new Object();
  openSettingsButton.container = document.createElement("div");
  openSettingsButton.container.className =
    "userscript-stage-size-changer_stage-button";
  openSettingsButton.button = document.createElement("span");
  openSettingsButton.button.className =
    siteDifferences[location.host]?.outlinedStageButton;
  openSettingsButton.button.role = "button";
  openSettingsButton.button.addEventListener("click", () => {
    const width = prompt("Stage width", vm.runtime.stageWidth);
    const height = prompt("Stage height", vm.runtime.stageHeight);
    if (width == null || height == null) {
      return;
    }
    if (
      width.match(/^\d+$/gs).length == 1 &&
      height.match(/^\d+$/gs).length == 1
    ) {
      vm.runtime.setStageSize(width, height);
    }
  });
  openSettingsButton.container.appendChild(openSettingsButton.button);
  openSettingsButton.buttonContent = document.createElement("div");
  openSettingsButton.buttonContent.className =
    siteDifferences[location.host]?.buttonContent;
  openSettingsButton.button.appendChild(openSettingsButton.buttonContent);
  openSettingsButton.img = document.createElement("img");
  openSettingsButton.img.className =
    siteDifferences[location.host]?.stageButtonIcon;
  Object.assign(openSettingsButton.img, {
    alt: 'Open settings of "Stage Size Changer"',
    title: '"Stage Size Changer" Settings',
    draggable: false,
    src: resources.icon,
  });
  openSettingsButton.buttonContent.appendChild(openSettingsButton.img);

  // Instances getting
  let instancesGroup = new Object();
  top.userscriptStageSizeChanger = instancesGroup;

  const asyncGetStageWrapperState = async () =>
    Object.values(
      await asyncQuerySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
    ).find((x) => x.child).child.child.child.stateNode;
  const getStageWrapperState = () =>
    Object.values(
      document.querySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
    ).find((x) => x.child).child.child.child.stateNode;
  const getScratchBlocks = async () => {
    let wrapper = await asyncQuerySelector('[class^="gui_blocks-wrapper"]');
    let reactInternalKey = Object.keys(wrapper).find((key) =>
      key.startsWith("__reactInternalInstance$"),
    );
    const internal = wrapper[reactInternalKey];
    let childable = internal;
    while (
      ((childable = childable.child),
      !childable || !childable.stateNode || !childable.stateNode.ScratchBlocks)
    ) {}
    return childable.stateNode.ScratchBlocks;
  };

  let stageWrapperState = await asyncGetStageWrapperState();
  let stageSizeMode = siteDifferences[location.host].pagesCheck.editor()
    ? stageWrapperState.props.stageSize
    : "large";
  let vm = stageWrapperState.props.vm;
  let ScratchBlocks;
  if (siteDifferences[location.host].pagesCheck.editor()) {
    ScratchBlocks = await getScratchBlocks();
  }
  Object.assign(instancesGroup, { vm, ScratchBlocks });

  // VM patches
  vm.runtime.stageWidth = 480;
  vm.runtime.stageHeight = 360;
  vm.runtime.setStageSize = (width, height) => {
    width = Math.round(Math.max(1, width));
    height = Math.round(Math.max(1, height));
    if (vm.runtime.stageWidth !== width || vm.runtime.stageHeight !== height) {
      mousePosLabel.style.width = `${0.625 * 0.55 * (width.toString().length + height.toString().length + 4)}rem`;

      const deltaX = width - vm.runtime.stageWidth;
      const deltaY = height - vm.runtime.stageHeight;

      if (vm.runtime._monitorState.size > 0) {
        const offsetX = deltaX / 2;
        const offsetY = deltaY / 2;
        for (const monitor of vm.runtime._monitorState.valueSeq()) {
          vm.runtime.requestUpdateMonitor(
            new Map([
              ["id", monitor.get("id")],
              ["x", monitor.get("x") + offsetX],
              ["y", monitor.get("y") + offsetY],
            ]),
          );
        }
        vm.runtime.emit("MONITORS_UPDATE", vm.runtime._monitorState);
        monitorsDivsUpdate();
      }

      const penIndexInDrawList = vm.renderer._layerGroups.pen.drawListOffset;
      const penDrawableId = vm.renderer._drawList[penIndexInDrawList];
      const penSkinId = vm.renderer._allDrawables[penDrawableId]._skin._id;

      vm.runtime.stageWidth = width;
      vm.runtime.stageHeight = height;
      vm.runtime.renderer.setStageSize(
        -width / 2,
        width / 2,
        -height / 2,
        height / 2,
      );
      vm.renderer.resize(width, height);
      vm.runtime.emit("STAGE_SIZE_CHANGED", width, height);
      vm.emit("STAGE_SIZE_CHANGED", width, height);
      window.dispatchEvent(new Event("resize"));

      if (
        new vm.renderer._allSkins[penSkinId].constructor(0, vm.renderer)
          .drawPoint
      ) {
        const newPenSkin = new vm.renderer._allSkins[penSkinId].constructor(
          penSkinId,
          vm.renderer,
        );
        vm.renderer._allSkins[penSkinId] = newPenSkin;
        vm.renderer._allDrawables[penDrawableId]._skin =
          vm.renderer._allSkins[penSkinId];
        vm.renderer._allDrawables[penDrawableId].updateScale([101, 100]);
        vm.renderer._allDrawables[penDrawableId].updateScale([100, 100]);
      }
    }
  };
  vm.setStageSize = vm.runtime.setStageSize;

  let ogVmRendererResize = vm.renderer.resize;
  vm.renderer.resize = function (...args) {
    stageWrapperState = getStageWrapperState();
    stageSizeMode = stageWrapperState.props.stageSize;
    updatePlayerSize(
      vm.runtime.stageWidth,
      vm.runtime.stageHeight,
      stageSizeMode,
    );
    ogVmRendererResize.call(this, ...args);
    window.dispatchEvent(new Event("resize"));
  };

  let ogVmToJson = vm.toJSON;
  vm.toJSON = function (...args) {
    const result = JSON.parse(ogVmToJson.call(this, ...args));
    result.monitors.forEach((x) => {
      x.x += (480 - vm.runtime.stageWidth) / 2;
      x.y += (360 - vm.runtime.stageHeight) / 2;
    });
    return JSON.stringify(result);
  };
  let ogVmDeserializeProject = vm.deserializeProject;
  vm.deserializeProject = function (...args) {
    let result = ogVmDeserializeProject.call(this, ...args);
    for (const monitor of vm.runtime._monitorState.valueSeq()) {
      vm.runtime.requestUpdateMonitor(
        new Map([
          ["id", monitor.get("id")],
          ["x", monitor.get("x") + (vm.runtime.stageWidth - 480) / 2],
          ["y", monitor.get("y") + (vm.runtime.stageHeight - 360) / 2],
        ]),
      );
    }
    vm.runtime.emit("MONITORS_UPDATE", vm.runtime._monitorState);
    return result;
  };

  vm.runtime.ioDevices.mouse._userscriptStageSizeChanger = { x: 0, y: 0 };
  Object.defineProperty(vm.runtime.ioDevices.mouse, "_scratchX", {
    set: function (set) {
      this._userscriptStageSizeChanger.x = Math.round(
        set * (vm.runtime.stageWidth / 480),
      );
      mousePosLabel.textContent = `${this._userscriptStageSizeChanger.x}, ${this._userscriptStageSizeChanger.y}`;
    },
    get: function () {
      return this._userscriptStageSizeChanger.x;
    },
  });
  Object.defineProperty(vm.runtime.ioDevices.mouse, "_scratchY", {
    set: function (set) {
      this._userscriptStageSizeChanger.y = Math.round(
        set * (vm.runtime.stageHeight / 360),
      );
      mousePosLabel.textContent = `${this._userscriptStageSizeChanger.x}, ${this._userscriptStageSizeChanger.y}`;
    },
    get: function () {
      return this._userscriptStageSizeChanger.y;
    },
  });

  let monitorsStateClone = vm.runtime._monitorState.map((x) => x);
  vm.on("MONITORS_UPDATE", () => {
    for (const monitor of vm.runtime._monitorState.valueSeq()) {
      if (monitorsStateClone.size == 0) {
        continue;
      }
      const monitorFromClone = monitorsStateClone.get(monitor.get("id"));
      if (
        monitorFromClone &&
        monitorFromClone.get("visible") != monitor.get("visible") &&
        (monitorFromClone.get("x") != monitor.get("x") ||
          monitorFromClone.get("y") != monitor.get("y"))
      ) {
        vm.runtime.requestUpdateMonitor(
          new Map([
            ["id", monitor.get("id")],
            ["x", monitorsStateClone.get(monitor.get("id")).get("x")],
            ["y", monitorsStateClone.get(monitor.get("id")).get("y")],
          ]),
        );
      }
    }
    monitorsStateClone = vm.runtime._monitorState.map((x) => x);
    monitorsDivsUpdate();
  });

  const checkUserscriptBlocks = (flag) => {
    switch (flag) {
      case '⇱ have "Stage Size Changer"?':
        return true;
      case "⇱ StageSC: stage width":
        return vm.runtime.stageWidth;
      case "⇱ StageSC: stage height":
        return vm.runtime.stageHeight;
    }
    return null;
  };
  const ogVmPrmtvsArgRprtrBool =
    vm.runtime._primitives.argument_reporter_boolean;
  vm.runtime._primitives.argument_reporter_boolean = function (...args) {
    return ((originalMethod, args, util) => {
      const flag = String(args.VALUE);
      const value = util.getParam(flag);
      if (value === null) {
        return (
          checkUserscriptBlocks(String(flag)) ?? originalMethod?.(args, util)
        );
      }
      return value;
    }).call(this, ogVmPrmtvsArgRprtrBool.bind(this), ...args);
  };
  const ogVmPrmtvsArgRprtrStrNum =
    vm.runtime._primitives.argument_reporter_string_number;
  vm.runtime._primitives.argument_reporter_string_number = function (...args) {
    return ((originalMethod, args, util) => {
      const flag = String(args.VALUE);
      const value = util.getParam(flag);
      if (value === null) {
        return (
          checkUserscriptBlocks(String(flag)) ?? originalMethod?.(args, util)
        );
      }
      return value;
    }).call(this, ogVmPrmtvsArgRprtrStrNum.bind(this), ...args);
  };

  // Toolbox patches
  const injectToolbox = (xmlList, workspace) => {
    const sep = document.createElement("sep");
    sep.setAttribute("gap", "36");
    xmlList.push(sep);

    const label = document.createElement("label");
    label.setAttribute("text", "⇱ Stage Size Changer");
    xmlList.push(label);

    let blocksGroup = new Array();

    blocksGroup[0] = new Object();
    blocksGroup[0].mutation = document.createElement("mutation");
    blocksGroup[0].field = document.createElement("field");
    blocksGroup[0].field.setAttribute("name", "VALUE");
    blocksGroup[0].field.innerHTML = '⇱ have "Stage Size Changer"?';
    blocksGroup[0].block = document.createElement("block");
    blocksGroup[0].block.setAttribute("type", "argument_reporter_boolean");
    blocksGroup[0].block.setAttribute("gap", "16");
    blocksGroup[0].block.appendChild(blocksGroup[0].field);
    blocksGroup[0].block.appendChild(blocksGroup[0].mutation);
    xmlList.push(blocksGroup[0].block);

    blocksGroup[1] = new Object();
    blocksGroup[1].mutation = document.createElement("mutation");
    blocksGroup[1].field = document.createElement("field");
    blocksGroup[1].field.setAttribute("name", "VALUE");
    blocksGroup[1].field.innerHTML = "⇱ StageSC: stage width";
    blocksGroup[1].block = document.createElement("block");
    blocksGroup[1].block.setAttribute(
      "type",
      "argument_reporter_string_number",
    );
    blocksGroup[1].block.setAttribute("gap", "16");
    blocksGroup[1].block.appendChild(blocksGroup[1].field);
    blocksGroup[1].block.appendChild(blocksGroup[1].mutation);
    xmlList.push(blocksGroup[1].block);

    blocksGroup[2] = new Object();
    blocksGroup[2].mutation = document.createElement("mutation");
    blocksGroup[2].field = document.createElement("field");
    blocksGroup[2].field.setAttribute("name", "VALUE");
    blocksGroup[2].field.innerHTML = "⇱ StageSC: stage height";
    blocksGroup[2].block = document.createElement("block");
    blocksGroup[2].block.setAttribute(
      "type",
      "argument_reporter_string_number",
    );
    blocksGroup[2].block.setAttribute("gap", "16");
    blocksGroup[2].block.appendChild(blocksGroup[2].field);
    blocksGroup[2].block.appendChild(blocksGroup[2].mutation);
    xmlList.push(blocksGroup[2].block);

    return xmlList;
  };
  const applyToolboxPatches = () => {
    const isModernBlockly = ScratchBlocks.__esModule;
    if (isModernBlockly) {
      const toolboxCallbacks =
        ScratchBlocks.getMainWorkspace()?.toolboxCategoryCallbacks;
      const ogCallback = toolboxCallbacks.get("PROCEDURE");
      toolboxCallbacks.set("PROCEDURE", function (workspace) {
        const xmlList = ogCallback.call(this, workspace);
        injectToolbox(xmlList, workspace);
        return xmlList;
      });
      const ogWSvgRegTlbxCtgClbk =
        ScratchBlocks.WorkspaceSvg.prototype.registerToolboxCategoryCallback;
      ScratchBlocks.WorkspaceSvg.prototype.registerToolboxCategoryCallback =
        function (...args) {
          return ((ogMethod, key, callback) => {
            if (key === "PROCEDURE") {
              const ogCallback = callback;
              callback = function (workspace) {
                const xmlList = ogCallback.call(this, workspace);
                injectToolbox(xmlList, workspace);
                return xmlList;
              };
              return ogMethod(key, callback);
            }
          }).call(this, ogWSvgRegTlbxCtgClbk.bind(this), ...args);
        };
      const ogBlksArgRprtrBoolInit =
        ScratchBlocks.Blocks.argument_reporter_boolean.init;
      ScratchBlocks.Blocks.argument_reporter_boolean.init = function (...args) {
        return ((originalMethod) => {
          originalMethod();
          queueMicrotask(() => {
            if (
              this.getFieldValue("VALUE") === '⇱ have "Stage Size Changer"?' &&
              !(
                this.dragStrategy instanceof
                ScratchBlocks.dragging.BlockDragStrategy
              ) &&
              !this.isInFlyout
            ) {
              this.setDragStrategy(
                new ScratchBlocks.dragging.BlockDragStrategy(this),
              );
              this.dragStrategy.block?.dispose();
            }
          });
        }).call(this, ogBlksArgRprtrBoolInit.bind(this), ...args);
      };
      const ogBlksArgRprtrStrNumInit =
        ScratchBlocks.Blocks.argument_reporter_string_number.init;
      ScratchBlocks.Blocks.argument_reporter_string_number.init = function (
        ...args
      ) {
        return ((originalMethod) => {
          originalMethod();
          queueMicrotask(() => {
            if (
              (this.getFieldValue("VALUE") === "⇱ StageSC: stage width" ||
                this.getFieldValue("VALUE") === "⇱ StageSC: stage heigth") &&
              !(
                this.dragStrategy instanceof
                ScratchBlocks.dragging.BlockDragStrategy
              ) &&
              !this.isInFlyout
            ) {
              this.setDragStrategy(
                new ScratchBlocks.dragging.BlockDragStrategy(this),
              );
              this.dragStrategy.block?.dispose();
            }
          });
        }).call(this, ogBlksArgRprtrStrNumInit.bind(this), ...args);
      };
    } else {
      const ogProcAddCreateButton = ScratchBlocks.Procedures.addCreateButton_;
      ScratchBlocks.Procedures.addCreateButton_ = function (...args) {
        return ((originalMethod, workspace, xmlList) => {
          originalMethod?.(workspace, xmlList);
          injectToolbox(xmlList, workspace);
        }).call(this, ogProcAddCreateButton.bind(this), ...args);
      };
    }
    const workspace = ScratchBlocks.getMainWorkspace();
    if (isModernBlockly) {
      workspace.getToolbox().forceRerender();
    } else {
      workspace.getToolbox().refreshSelection();
      workspace.toolboxRefreshEnabled_ = true;
    }
  };
  let toolboxPatchesApplied = false;
  if (ScratchBlocks) {
    toolboxPatchesApplied = true;
    applyToolboxPatches();
  }

  // First updates and element additions
  (await asyncQuerySelector('img[class^="stop-all_stop-all_"]')).after(
    mousePosLabel,
  );
  await (async (x1) => {
    let result = await asyncQuerySelector(x1.map((x2) => x2[0]).join(", "));
    for (let i1 = 0; i1 < x1.length; i1++) {
      if (result != document.querySelector(x1[i1][0])) {
        continue;
      }
      for (let i2 = 0; i2 < x1[i1][1]; i2++) {
        result = result.parentElement;
      }
      result.before(openSettingsButton.container);
      return;
    }
  })([
    [
      'div[class^="stage-header_stage-size-row_"] div > span[class^="button_outlined-button_"][role="button"]',
      1,
    ],
    [
      siteDifferences[location.host].inFullscreenButton.query,
      siteDifferences[location.host].inFullscreenButton.parentI,
    ],
  ]);
  updatePlayerSize(
    vm.runtime.stageWidth,
    vm.runtime.stageHeight,
    stageSizeMode,
  );

  // Navigation
  const funcOnClick = {
    player: async () => {
      await funcOnNavigate(undefined, "player");
    },
    editor: async () => {
      await funcOnNavigate(undefined, "editor");
    },
    fullscreen: async () => {
      await funcOnNavigate(undefined, "fullscreen");
    },
  };
  const funcOnNavigate = async (
    event,
    page = siteDifferences[location.host]?.defaultPage,
  ) => {
    page =
      page ??
      siteDifferences[location.host].matchingPage(event.destination.url);
    let intervalId;
    await new Promise((resolve) => {
      intervalId = setInterval(() => {
        if (siteDifferences[location.host].pagesCheck[page]()) {
          resolve();
        }
      });
    });
    clearInterval(intervalId);
    if (siteDifferences[location.host].pagesCheck.editor()) {
      stageWrapperState = await asyncGetStageWrapperState();
      stageSizeMode = stageWrapperState.props.stageSize;
      ScratchBlocks = await getScratchBlocks();
      Object.assign(instancesGroup, { ScratchBlocks });
      if (!toolboxPatchesApplied) {
        toolboxPatchesApplied = true;
        applyToolboxPatches();
      }
    }
    vm.runtime._monitorState =
      monitorsStateClone.size > 0
        ? monitorsStateClone.map((x) => x)
        : vm.runtime._monitorState;

    (await asyncQuerySelector('img[class^="stop-all_stop-all_"]')).after(
      mousePosLabel,
    );
    await (async (x1) => {
      let result = await asyncQuerySelector(x1.map((x2) => x2[0]).join(", "));
      for (let i1 = 0; i1 < x1.length; i1++) {
        if (result != document.querySelector(x1[i1][0])) {
          continue;
        }
        for (let i2 = 0; i2 < x1[i1][1]; i2++) {
          result = result.parentElement;
        }
        result.before(openSettingsButton.container);
        return;
      }
    })([
      [
        'div[class^="stage-header_stage-size-row_"] div > span[class^="button_outlined-button_"][role="button"]',
        1,
      ],
      [
        siteDifferences[location.host].inFullscreenButton.query,
        siteDifferences[location.host].inFullscreenButton.parentI,
      ],
    ]);
    await (async (x1) => {
      if (x1.length == 0) {
        return;
      }
      let elements = await asyncQuerySelectorAll(
        x1.map((x2) => x2[0]).join(", "),
      );
      for (let i1 = 0; i1 < x1.length; i1++) {
        elements
          .filter((x2) =>
            [...document.querySelectorAll(x1[i1][0])].includes(x2),
          )
          .forEach((x2) => {
            let parent = x2;
            for (let i2 = 0; i2 < x1[i1][1]; i2++) {
              parent = parent.parentElement;
            }
            parent.removeEventListener("click", funcOnClick[x1[i1][2]]);
            parent.addEventListener("click", funcOnClick[x1[i1][2]]);
          });
      }
    })(siteDifferences[location.host].addListenersTo);

    monitorsDivsUpdate();
    updatePlayerSize(
      vm.runtime.stageWidth,
      vm.runtime.stageHeight,
      stageSizeMode,
    );
  };
  await (async (x1) => {
    if (x1.length == 0) {
      return;
    }
    let elements = await asyncQuerySelectorAll(
      x1.map((x2) => x2[0]).join(", "),
    );
    for (let i1 = 0; i1 < x1.length; i1++) {
      elements
        .filter((x2) => [...document.querySelectorAll(x1[i1][0])].includes(x2))
        .forEach((x2) => {
          let parent = x2;
          for (let i2 = 0; i2 < x1[i1][1]; i2++) {
            parent = parent.parentElement;
          }
          parent.addEventListener("click", funcOnClick[x1[i1][2]]);
        });
    }
  })(siteDifferences[location.host].addListenersTo);
  navigation.addEventListener("navigate", funcOnNavigate);

  // Start log
  console.log(
    '%c %cUserscript "Stage Size Changer" was runned successfully',
    `font-size: 1px; padding: 10px 10px; background: no-repeat url(${resources.icon}); margin-right: 0.25rem;`,
    "",
  );
})();
