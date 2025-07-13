// ==UserScript==
// @name        stageSizeChanger
// @version     1.0-alpha.9
// @author      Den4ik-12
// @description Userscript for the Scratch website that allows you to resize the scene.
// @match       https://scratch.mit.edu/projects/*
// @match       https://lab.scratch.mit.edu/*
// @grant       none
// @run-at      document-start
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
          'div[class^="stage-header_stage-menu-wrapper_"] > div[class^="stage-header_unselect-wrapper_"] > span[class^="button_outlined-button_"][role="button"], div[class^="stage-header_embed-scratch-logo_"] > a',
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
        } else if (
          new URL(x).pathname.split("/").includes("fullscreen") ||
          new URL(x).pathname.split("/").includes("embed")
        ) {
          return "fullscreen";
        }
      },
      pagesCheck: {
        player: () =>
          !location.pathname.split("/").includes("editor") &&
          !location.pathname.split("/").includes("fullscreen"),
        editor: () => location.pathname.split("/").includes("editor"),
        fullscreen: () =>
          location.pathname.split("/").includes("fullscreen") ||
          location.pathname.split("/").includes("embed"),
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

  // Utilites
  const escapeHTML = (str) =>
      str.replace(/([<>'"&])/g, (_, l) => `&#${l.charCodeAt(0)};`),
    overrideFunction = function (func, overrider) {
      const ogFunction = func;
      return function (...args) {
        return overrider.call(this, ogFunction.bind(this), ...args);
      };
    },
    defined = (x) => typeof x != "undefined" && x != null,
    hex2Hsl = (hex) => {
      let r = 0,
        g = 0,
        b = 0;
      if (hex.length == 4 || hex.length == 5) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length == 7 || hex.length == 9) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      r /= 255;
      g /= 255;
      b /= 255;
      let max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h,
        s,
        l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return [h, s, l];
    },
    hsl2Hex = (h, s, l) => {
      let r, g, b;
      if (s == 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q,
          hue2Rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
        r = hue2Rgb(p, q, h + 1 / 3);
        g = hue2Rgb(p, q, h);
        b = hue2Rgb(p, q, h - 1 / 3);
      }
      r = Math.round(r * 255)
        .toString(16)
        .padStart(2, "0");
      g = Math.round(g * 255)
        .toString(16)
        .padStart(2, "0");
      b = Math.round(b * 255)
        .toString(16)
        .padStart(2, "0");
      return `#${r}${g}${b}`;
    };

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
    .preview .guiPlayer [class*="stage_question-wrapper"],
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_question-wrapper"] {
      width: auto !important;
    }

    .preview .guiPlayer {
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
      ),
      monitorsInfo = monitorsStateClone.toArray().filter((x) => x.visible);
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

  const spacer = document.createElement("div");
  spacer.style.marginLeft = "auto";

  const openSettingsButton = new Object();
  openSettingsButton.container = document.createElement("div");
  openSettingsButton.container.className =
    "userscript-stage-size-changer_stage-button";
  openSettingsButton.button = document.createElement("span");
  openSettingsButton.button.className =
    siteDifferences[location.host]?.outlinedStageButton;
  openSettingsButton.button.role = "button";
  openSettingsButton.button.addEventListener("click", () => {
    const width = prompt("Stage width", vm.runtime.stageWidth),
      height = prompt("Stage height", vm.runtime.stageHeight);
    if (!defined(width) || !defined(height)) {
      return;
    }
    if (/^\d+$/.test(width) && /^\d+$/.test(height)) {
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
      ).find((x) => x.child).child.child.child.stateNode,
    getStageWrapperState = () =>
      Object.values(
        document.querySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
      ).find((x) => x.child).child.child.child.stateNode,
    getBlocksComponent = async () => {
      let wrapper = await asyncQuerySelector('[class^="gui_blocks-wrapper"]');
      let reactInternalKey = Object.keys(wrapper).find((key) =>
        key.startsWith("__reactInternalInstance$"),
      );
      const internal = wrapper[reactInternalKey];
      let childable = internal;
      while (
        ((childable = childable.child),
        !childable ||
          !childable.stateNode ||
          !childable.stateNode.ScratchBlocks)
      ) {}
      return childable.stateNode;
    };

  let stageWrapperState = await asyncGetStageWrapperState(),
    stageSizeMode = siteDifferences[location.host].pagesCheck.editor()
      ? stageWrapperState.props.stageSize
      : "large",
    vm = stageWrapperState.props.vm,
    blocksComponent,
    ScratchBlocks;
  if (siteDifferences[location.host].pagesCheck.editor()) {
    blocksComponent = await getBlocksComponent();
    ScratchBlocks = blocksComponent.ScratchBlocks;
  }
  Object.assign(instancesGroup, { vm, blocksComponent, ScratchBlocks });

  // Patches: Stage size properties
  vm.runtime.stageWidth = 480;
  vm.runtime.stageHeight = 360;
  vm.runtime.setStageSize = (width, height) => {
    width = Math.round(Math.max(1, width));
    height = Math.round(Math.max(1, height));
    if (vm.runtime.stageWidth !== width || vm.runtime.stageHeight !== height) {
      mousePosLabel.style.width = `${0.625 * 0.55 * (width.toString().length + height.toString().length + 4)}rem`;

      const deltaX = width - vm.runtime.stageWidth,
        deltaY = height - vm.runtime.stageHeight;

      if (vm.runtime._monitorState.size > 0) {
        const offsetX = deltaX / 2,
          offsetY = deltaY / 2;
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

      const penIndexInDrawList = vm.renderer._layerGroups.pen.drawListOffset,
        penDrawableId = vm.renderer._drawList[penIndexInDrawList],
        penSkinId = vm.renderer._allDrawables[penDrawableId]?._skin?._id;

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
        defined(vm.renderer._allSkins[penSkinId]?.constructor) &&
        defined(new vm.renderer._allSkins[penSkinId].constructor(0, vm.renderer)
          .drawPoint)
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
  Object.defineProperty(vm.runtime.constructor, "STAGE_WIDTH", {
    set: () => {},
    get: () => {
      return vm.runtime.stageWidth;
    },
  });
  Object.defineProperty(vm.runtime.constructor, "STAGE_HEIGHT", {
    set: () => {},
    get: () => {
      return vm.runtime.stageHeight;
    },
  });
  vm.runtime.on("STAGE_SIZE_CHANGED", (width, height) => {
    const params = new URLSearchParams(location.search);
    if (width == 480 && height == 360) {
      params.delete("StageSC_size");
    } else {
      params.set("StageSC_size", `${width}x${height}`);
    }
    history.replaceState("", "", `?${params.toString()}`);
  });

  // Patches: Resize
  vm.renderer.resize = overrideFunction(
    vm.renderer.resize,
    (ogMethod, ...args) => {
      stageWrapperState = getStageWrapperState();
      stageSizeMode = stageWrapperState.props.stageSize;
      updatePlayerSize(
        vm.runtime.stageWidth,
        vm.runtime.stageHeight,
        stageSizeMode,
      );
      ogMethod(...args);
      window.dispatchEvent(new Event("resize"));
    },
  );

  // Patches: Project save and load
  vm.toJSON = overrideFunction(vm.toJSON, (ogMethod, ...args) => {
    const result = JSON.parse(ogMethod(...args));
    result.monitors.forEach((x) => {
      x.x += (480 - vm.runtime.stageWidth) / 2;
      x.y += (360 - vm.runtime.stageHeight) / 2;
    });
    return JSON.stringify(result);
  });
  vm.deserializeProject = overrideFunction(
    vm.deserializeProject,
    async (ogMethod, json, zip) => {
      const result = await ogMethod(json, zip);
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
      const stageComments = json.targets.find((x) => x.isStage).comments;
      if (defined(stageComments)) {
        const twConfigComment = Object.values(stageComments).find((x) => x.text.includes("// _twconfig_"));
        if (defined(twConfigComment)) {
          let twConfig;
          try {
            twConfig = JSON.parse(twConfigComment.text.match(/\{.*\}(?=( \/\/ _twconfig_$))/g)[0]);
          } catch {}
          if (defined(twConfig?.width) || defined(twConfig?.height)) {
            vm.runtime.setStageSize(
              twConfig?.width ? parseInt(twConfig.width) : vm.runtime.stageWidth,
              twConfig?.height ? parseInt(twConfig.height) : vm.runtime.stageHeight,
            );
          }
        }
      }
      return result;
    },
  );

  // Patches: Mouse position
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

  // Patches: Monitors update
  let monitorsStateClone = vm.runtime._monitorState.map((x) => x);
  vm.on("MONITORS_UPDATE", () => {
    for (const monitor of vm.runtime._monitorState.valueSeq()) {
      if (monitorsStateClone.size == 0) {
        continue;
      }
      const monitorFromClone = monitorsStateClone.get(monitor.get("id"));
      if (
        defined(monitorFromClone) &&
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

  // Patches: Blocks and toolbox
  const userscriptBlocks = {},
    usBlkParamNamesIdsDflt = {},
    getUsCategoryColor = () => {
      const themeConvert = (hex, type) => {
        const userscriptHsl = hex2Hsl(hex),
          newMotionHsl = hex2Hsl(type == "quaternary"
            ? ScratchBlocks.Colours.motion.quaternary ?? ScratchBlocks.Colours.motion.tertiary
            : ScratchBlocks.Colours.motion[type]),
          oldMotionHsl = hex2Hsl(
            {
              primary: "#4c97ff",
              secondary: "#4280d7",
              tertiary: "#3373cc",
              quaternary: "#3373cc",
            }[type],
          );
        return hsl2Hex(
          userscriptHsl[0],
          Math.max(
            Math.min(userscriptHsl[1] * (newMotionHsl[1] / oldMotionHsl[1]), 1),
            0,
          ),
          Math.max(
            Math.min(userscriptHsl[2] * (newMotionHsl[2] / oldMotionHsl[2]), 1),
            0,
          ),
        );
      };
      return {
        primary: themeConvert("#8c9abf", "primary"),
        secondary: themeConvert("#7d8aab", "secondary"),
        tertiary: themeConvert("#6f7b99", "tertiary"),
        quaternary: themeConvert("#6f7b99", "quaternary"),
      };
    },
    getUserscriptBlock = (procedureCode) => {
      if (!Object.hasOwn(userscriptBlocks, procedureCode)) {
        return;
      }
      return userscriptBlocks[procedureCode];
    },
    parseArguments = (code) =>
      code
        .split(/(?=[^\\]%[nbs])/g)
        .map((i) => i.trim())
        .filter((i) => i.charAt(0) == "%")
        .map((i) => i.substring(0, 2)),
    fixDisplayName = (displayName) =>
      displayName.replace(
        /([^\s])(%[nbs])/g,
        (_, before, arg) => `${before} ${arg}`,
      ),
    getNamesIdsDefaults = (blockData) => [
      blockData.args,
      blockData.args.map((_, i) => `arg${i}`),
      blockData.args.map((_, i) => ""),
    ],
    generateUsBlocksXML = () => {
      let xml = "";
      for (const procedureCode of Object.keys(userscriptBlocks)) {
        const blockData = userscriptBlocks[procedureCode];
        if (blockData.hidden) continue;
        const [names, ids, defaults] = getNamesIdsDefaults(blockData);
        if (blockData.type == "command") {
          xml +=
            '<block type="procedures_call" gap="16"><mutation generateshadows="true" warp="false"' +
            ` proccode="${escapeHTML(procedureCode)}"` +
            ` argumentnames="${escapeHTML(JSON.stringify(names))}"` +
            ` argumentids="${escapeHTML(JSON.stringify(ids))}"` +
            ` argumentdefaults="${escapeHTML(JSON.stringify(defaults))}"` +
            "></mutation></block>";
        } else if (blockData.type == "reporter") {
          xml +=
            '<block type="argument_reporter_string_number" gap="16">' +
            `<field name="VALUE">${escapeHTML(
              `\u200B\u200BuserscriptStageSizeChanger\u200B\u200B${JSON.stringify(
                {
                  id: blockData.id,
                },
              )}`,
            )}</field>` +
            '<mutation generateshadows="true" warp="false"' +
            ` proccode="${escapeHTML(procedureCode)}"` +
            "></mutation></block>";
        } else if (blockData.type == "boolean") {
          xml +=
            '<block type="argument_reporter_boolean" gap="16">' +
            `<field name="VALUE">${escapeHTML(
              `\u200B\u200BuserscriptStageSizeChanger\u200B\u200B${JSON.stringify(
                {
                  id: blockData.id,
                },
              )}`,
            )}</field>` +
            '<mutation generateshadows="true" warp="false"' +
            ` proccode="${escapeHTML(procedureCode)}"` +
            "></mutation></block>";
        }
      }
      return xml;
    },
    addUserscriptBlock = (
      procedureCode,
      displayName,
      args,
      type,
      handler,
      hidden,
    ) => {
      if (getUserscriptBlock(procedureCode)) {
        return;
      }
      const procCodeArgs = parseArguments(procedureCode);
      if (args.length !== procCodeArgs.length) {
        return;
      }
      if (defined(displayName)) {
        displayName = fixDisplayName(displayName);
        const displayNameArgs = parseArguments(displayName);
        if (JSON.stringify(procCodeArgs) != JSON.stringify(displayNameArgs)) {
          displayName = procedureCode;
        }
      } else {
        displayName = procedureCode;
      }
      const blockData = {
        id: procedureCode,
        displayName,
        args,
        type,
        handler,
        hidden,
      };
      userscriptBlocks[procedureCode] = blockData;
      usBlkParamNamesIdsDflt[procedureCode] = getNamesIdsDefaults(blockData);
    };
  vm.runtime.monitorBlocks.constructor.prototype.getProcedureParamNamesIdsAndDefaults =
    overrideFunction(
      vm.runtime.monitorBlocks.constructor.prototype
        .getProcedureParamNamesIdsAndDefaults,
      (ogMethod, name) => {
        return usBlkParamNamesIdsDflt[name] || ogMethod(name);
      },
    );
  vm.runtime.sequencer.stepToProcedure = overrideFunction(
    vm.runtime.sequencer.stepToProcedure,
    (ogMethod, thread, procedureCode) => {
      const blockData = getUserscriptBlock(procedureCode);
      if (defined(blockData)) {
        const stackFrame = thread.peekStackFrame();
        blockData.handler(stackFrame.params, thread);
        return;
      }
      return ogMethod(thread, procedureCode);
    },
  );
  vm.runtime._primitives.argument_reporter_string_number = overrideFunction(
    vm.runtime._primitives.argument_reporter_string_number,
    (ogMethod, args, util) => {
      const flag = String(args.VALUE),
        value = util.getParam(flag);
      if (value == null) {
        let id;
        if (
          flag.startsWith("\u200B\u200BuserscriptStageSizeChanger\u200B\u200B")
        ) {
          try {
            id = JSON.parse(
              flag.replace(
                /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                "",
              ),
            ).id;
          } catch {}
        }
        const blockData = getUserscriptBlock(id);
        return defined(blockData)
          ? blockData.handler(args, util)
          : ogMethod?.(args, util);
      }
      return value;
    },
  );
  vm.runtime._primitives.argument_reporter_boolean = overrideFunction(
    vm.runtime._primitives.argument_reporter_boolean,
    (ogMethod, args, util) => {
      const flag = String(args.VALUE),
        value = util.getParam(flag);
      if (value == null) {
        let id;
        if (
          flag.startsWith("\u200B\u200BuserscriptStageSizeChanger\u200B\u200B")
        ) {
          try {
            id = JSON.parse(
              flag.replace(
                /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                "",
              ),
            ).id;
          } catch {}
        }
        const blockData = getUserscriptBlock(id);
        return defined(blockData)
          ? blockData.handler(args, util)
          : ogMethod?.(args, util);
      }
      return value;
    },
  );
  const applyToolboxPatches = () => {
    if (defined(ScratchBlocks.registry)) {
      ScratchBlocks.BlockSvg.prototype.applyColour = overrideFunction(
        ScratchBlocks.BlockSvg.prototype.applyColour,
        function (ogMethod, ...args) {
          if (
            (!this.isInsertionMarker() && this.type == "procedures_call") ||
            ((this.type == "argument_reporter_string_number" ||
              this.type == "argument_reporter_boolean") &&
              this.inputList[0].fieldRow[0].text_.startsWith(
                "\u200B\u200BuserscriptStageSizeChanger\u200B\u200B",
              ))
          ) {
            let id;
            if (this.type != "procedures_call") {
              try {
                id = JSON.parse(
                  this.inputList[0].fieldRow[0].text_.replace(
                    /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                    "",
                  ),
                ).id;
              } catch {}
            }
            const block =
                this.type == "procedures_call"
                  ? this.procCode_ && getUserscriptBlock(this.procCode_)
                  : getUserscriptBlock(id),
              color = getUsCategoryColor();
            if (defined(block)) {
              this.style = {
                ...this.style,
                colourPrimary: color.primary,
                colourSecondary: color.secondary,
                colourTertiary: color.tertiary,
                colourQuaternary: color.quaternary,
              };
              this.pathObject.setStyle(this.style);
              this.customContextMenu = null;
            }
          }
          return ogMethod(...args);
        },
      );
    } else {
      ScratchBlocks.BlockSvg.prototype.updateColour = overrideFunction(
        ScratchBlocks.BlockSvg.prototype.updateColour,
        function (ogMethod, ...args) {
          if (
            (!this.isInsertionMarker() && this.type == "procedures_call") ||
            ((this.type == "argument_reporter_string_number" ||
              this.type == "argument_reporter_boolean") &&
              this.inputList[0].fieldRow[0].text_.startsWith(
                "\u200B\u200BuserscriptStageSizeChanger\u200B\u200B",
              ))
          ) {
            let id;
            if (this.type != "procedures_call") {
              try {
                id = JSON.parse(
                  this.inputList[0].fieldRow[0].text_.replace(
                    /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                    "",
                  ),
                ).id;
              } catch {}
            }
            const block =
                this.type == "procedures_call"
                  ? this.procCode_ && getUserscriptBlock(this.procCode_)
                  : getUserscriptBlock(id),
              color = getUsCategoryColor();
            if (defined(block)) {
              this.colour_ = color.primary;
              this.colourSecondary_ = color.secondary;
              this.colourTertiary_ = color.tertiary;
              this.colourQuaternary_ = color.quaternary;
              this.customContextMenu = null;
            }
          }
          return ogMethod(...args);
        },
      );
    }
    ScratchBlocks.BlockSvg.prototype.render = overrideFunction(
      ScratchBlocks.BlockSvg.prototype.render,
      function (ogMethod, optBubble) {
        if (
          (this.type == "argument_reporter_string_number" ||
            this.type == "argument_reporter_boolean") &&
          this.inputList[0].fieldRow[0].text_.startsWith(
            "\u200B\u200BuserscriptStageSizeChanger\u200B\u200B",
          )
        ) {
          const ogText = this.inputList[0].fieldRow[0].text_;
          try {
            this.inputList[0].fieldRow[0].text_ = getUserscriptBlock(
              JSON.parse(
                this.inputList[0].fieldRow[0].text_.replace(
                  /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                  "",
                ),
              ).id,
            ).displayName;
          } catch {
            return ogMethod(optBubble);
          }
          const result = ogMethod(optBubble);
          this.inputList[0].fieldRow[0].textElement_.innerHTML =
            this.inputList[0].fieldRow[0].text_.replace(" ", "\u00A0");
          const textWidth =
            this.inputList[0].fieldRow[0].textElement_.getBBox().width;
          this.inputList[0].fieldRow[0].textElement_.setAttribute(
            "x",
            textWidth / 2,
          );
          this.svgPath_.setAttribute(
            "d",
            this.svgPath_
              .getAttribute("d")
              .replace(
                new RegExp(`(?<=m ${this.height / 2},0 H )\\d*\.?\\d+`),
                textWidth +
                  this.inputList[0].fieldRow[0].textElement_.transform
                    .baseVal[0].matrix.e *
                    2 -
                  this.height / 2,
              ),
          );
          this.width =
            textWidth +
            this.inputList[0].fieldRow[0].textElement_.transform.baseVal[0]
              .matrix.e *
              2;
          this.inputList[0].fieldRow[0].text_ = ogText;
          return result;
        } else {
          return ogMethod(optBubble);
        }
      },
    );
    vm.runtime.getBlocksXML = overrideFunction(
      vm.runtime.getBlocksXML,
      (ogMethod, target) => {
        const result = ogMethod(target);
        let workspace;
        if (defined(ScratchBlocks.registry)) {
          workspace = ScratchBlocks.common.getMainWorkspace();
        }
        result.unshift({
          id: "userscript-stage-size-changer",
          xml:
            "<category" +
            ' name="StageSC"' +
            ` ${ScratchBlocks.registry ? "toolboxitemid" : "id"}="userscript-stage-size-changer"` +
            ` colour="${getUsCategoryColor().primary}"` +
            ` secondaryColour="${getUsCategoryColor().secondary}"` +
            ` iconURI="${resources.icon}"` +
            `>${generateUsBlocksXML()}</category>`,
        });
        return result;
      },
    );
    if (!defined(ScratchBlocks.registry)) {
      ScratchBlocks.Procedures.getDefineBlock = overrideFunction(
        ScratchBlocks.Procedures.getDefineBlock,
        (ogMethod, procedureCode, workspace) => {
          const result = ogMethod(procedureCode, workspace);
          if (result) {
            return result;
          }
          const block = getUserscriptBlock(procedureCode);
          if (block) {
            return {
              workspace,
              getInput() {
                return {
                  connection: {
                    targetBlock() {
                      return null;
                    },
                  },
                };
              },
            };
          }
          return result;
        },
      );
    }
    const newCreateAllInputs = (ogMethod) =>
      function (...args) {
        const blockData = getUserscriptBlock(this.procCode_);
        if (defined(blockData)) {
          const ogProcedureCode = this.procCode_;
          this.procCode_ = blockData.displayName;
          const ret = ogMethod.call(this, ...args);
          this.procCode_ = ogProcedureCode;
          return ret;
        }
        return ogMethod.call(this, ...args);
      };
    if (defined(ScratchBlocks.registry)) {
      ScratchBlocks.Block.prototype.doInit_ = overrideFunction(
        ScratchBlocks.Block.prototype.doInit_,
        function (ogMethod, ...args) {
          const result = ogMethod(...args);
          if (this.type == "procedures_call") {
            const ogCreateAllInputs = this.createAllInputs_;
            this.createAllInputs_ = newCreateAllInputs(ogCreateAllInputs);
            return result;
          }
        },
      );
      ScratchBlocks.Blocks.argument_reporter_string_number.init =
        overrideFunction(
          ScratchBlocks.Blocks.argument_reporter_string_number.init,
          (ogMethod) => {
            ogMethod();
            queueMicrotask(() => {
              if (
                !this.getFieldValue("VALUE").startsWith(
                  "\u200B\u200BuserscriptStageSizeChanger\u200B\u200B",
                ) ||
                this.dragStrategy instanceof
                  ScratchBlocks.dragging.BlockDragStrategy ||
                this.isInFlyout
              ) {
                return;
              }
              let block;
              try {
                block = getUserscriptBlock(
                  JSON.parse(
                    this.getFieldValue("VALUE").replace(
                      /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                      "",
                    ),
                  ).id,
                );
              } catch {
                return;
              }
              if (defined(block)) {
                this.setDragStrategy(
                  new ScratchBlocks.dragging.BlockDragStrategy(this),
                );
                this.dragStrategy.block?.dispose();
              }
            });
          },
        );
      ScratchBlocks.Blocks.argument_reporter_boolean.init = overrideFunction(
        ScratchBlocks.Blocks.argument_reporter_boolean.init,
        (ogMethod) => {
          ogMethod();
          queueMicrotask(() => {
            if (
              !this.getFieldValue("VALUE").startsWith(
                "\u200B\u200BuserscriptStageSizeChanger\u200B\u200B",
              ) ||
              this.dragStrategy instanceof
                ScratchBlocks.dragging.BlockDragStrategy ||
              this.isInFlyout
            ) {
              return;
            }
            let block;
            try {
              block = getUserscriptBlock(
                JSON.parse(
                  this.getFieldValue("VALUE").replace(
                    /^\u200B\u200BuserscriptStageSizeChanger\u200B\u200B/,
                    "",
                  ),
                ).id,
              );
            } catch {
              return;
            }
            if (defined(block)) {
              this.setDragStrategy(
                new ScratchBlocks.dragging.BlockDragStrategy(this),
              );
              this.dragStrategy.block?.dispose();
            }
          });
        },
      );
    } else {
      const ogCreateAllInputs =
        ScratchBlocks.Blocks.procedures_call.createAllInputs_;
      ScratchBlocks.Blocks.procedures_call.createAllInputs_ =
        newCreateAllInputs(ogCreateAllInputs);
    }
    ScratchBlocks.Events.disable();
    const workspace = ScratchBlocks.getMainWorkspace();
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(
      ScratchBlocks.Xml.workspaceToDom(workspace),
      workspace,
    );
    if (defined(blocksComponent.getToolboxXML())) {
      workspace.updateToolbox(blocksComponent.getToolboxXML());
    }
    if (defined(ScratchBlocks.registry)) {
      workspace.getToolbox().forceRerender();
    } else {
      workspace.getToolbox().refreshSelection();
      workspace.toolboxRefreshEnabled_ = true;
    }
    ScratchBlocks.Events.enable();
    console.log(
      "%c %cToolbox patches applied",
      `font-size: 1px; padding: 10px 10px; background: no-repeat url(${resources.icon}); margin-right: 0.25rem;`,
      "",
    );
  };
  let toolboxPatchesApplied = false;
  if (defined(ScratchBlocks)) {
    toolboxPatchesApplied = true;
    applyToolboxPatches();
  }
  addUserscriptBlock(
    '\u200B\u200Bhave "Stage Size Changer"?\u200B\u200B',
    'have "Stage Size Changer"?',
    [],
    "boolean",
    () => {
      return true;
    },
    false,
  );
  addUserscriptBlock(
    "\u200B\u200Bstage width\u200B\u200B",
    "stage width",
    [],
    "reporter",
    () => {
      return vm.runtime.stageWidth;
    },
    false,
  );
  addUserscriptBlock(
    "\u200B\u200Bstage height\u200B\u200B",
    "stage height",
    [],
    "reporter",
    () => {
      return vm.runtime.stageHeight;
    },
    false,
  );
  addUserscriptBlock(
    "\u200B\u200Bset stage size width:\u200B\u200B %n \u200B\u200Bheight:\u200B\u200B %n",
    "set stage size width: %n height: %n",
    ["width", "height"],
    "command",
    (args) => {
      vm.runtime.setStageSize(args.width, args.height);
    },
    false,
  );

  // First updates and element additions
  (await asyncQuerySelector('div[class^="controls_controls-container_"]')).after(
    spacer,
  );
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

  // Search parameter "StageSC_size"
  if (/\d+x\d+/.test((new URL(location.href)).searchParams.get("StageSC_size"))) {
    const param = (new URL(location.href)).searchParams.get("StageSC_size");
    vm.runtime.setStageSize(...param.match(/\d+/g).map((x) => parseInt(x)));
  }

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

    /*const params = new URLSearchParams(location.search);
    if (vm.runtime.stageWidth == 480 && vm.runtime.stageHeight == 360) {
      params.delete("StageSC_size");
    } else {
      params.set("StageSC_size", `${vm.runtime.stageWidth}x${vm.runtime.stageHeight}`);
    }
    history.replaceState("", "", `?${params.toString()}`);*/

    if (siteDifferences[location.host].pagesCheck.editor()) {
      stageWrapperState = await asyncGetStageWrapperState();
      stageSizeMode = stageWrapperState.props.stageSize;
      blocksComponent = await getBlocksComponent();
      ScratchBlocks = blocksComponent.ScratchBlocks;
      Object.assign(instancesGroup, { blocksComponent, ScratchBlocks });
      if (!toolboxPatchesApplied) {
        toolboxPatchesApplied = true;
        applyToolboxPatches();
      }
    }
    vm.runtime._monitorState =
      monitorsStateClone.size > 0
        ? monitorsStateClone.map((x) => x)
        : vm.runtime._monitorState;

    (await asyncQuerySelector('div[class^="controls_controls-container_"]')).after(
      spacer,
    );
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
