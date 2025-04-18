// ==UserScript==
// @name        stageSizeChanger
// @version     1.0-alpha.5
// @author      Den4ik-12
// @include     https://scratch.mit.edu/projects/*
// @include     https://lab.scratch.mit.edu/*
// @grant       none
// @namespace   stageSizeChanger
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/stageSizeChanger.user.js
// @updateURL   https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/stageSizeChanger.user.js
// ==/UserScript==
(async () => {
  const queryList = new Array();
  setInterval(() => {
    const queryListDelete = new Array();
    queryList.forEach((query) => {
      let element = document.querySelector(query.query);
      if (element) {
        queryListDelete.push(query);
        query.callback(element);
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
        query,
        callback,
      });
    });
  };

  const resizePlayerStyle = document.createElement("style");
  document.head.appendChild(resizePlayerStyle);
  const updatePlayerSize = (width, height, stageSizeMode) => {
    stageSizeMode =
      stageSizeMode == "large" ? 1 : stageSizeMode == "small" ? 0.5 : 1;
    const stageWrapperBoundingRect = document
      .querySelector('[class*="stage-wrapper_stage-wrapper"]')
      .getBoundingClientRect();
    resizePlayerStyle.textContent = `.preview .guiPlayer {
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
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage_"] canvas:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *) {
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
    body [class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list-scaler"] {
      transform: scale(calc(min(calc(${stageWrapperBoundingRect.height} * ${width} / ${height}), ${stageWrapperBoundingRect.width}) / ${width})) !important;
    }`;
  };

  const monitorsDivsUpdate = () => {
    const monitorsDivs = document.querySelectorAll(
      'div[class^="monitor_monitor-container_"]',
    );
    const monitorsInfo = monitorsStateClone
      .toArray()
      .filter((x) => x.visible);
    monitorsDivs.forEach((value, index) => {
      value.style.transform = `translate(${monitorsInfo[index]?.x - value.style.left.match(/\d+/gs)[0]}px, ${monitorsInfo[index]?.y - value.style.top.match(/\d+/gs)[0]}px)`;
    });
  };

  let reactInst = Object.values(
    await asyncQuerySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
  ).find((x) => x.child);
  let stateNode = reactInst.child.child.child.stateNode;
  let stageSizeMode = location.pathname.split("/").includes("editor")
    ? stateNode.props.stageSize
    : "large";
  let vm = stateNode.props.vm;
  top.vm = vm;

  vm.runtime.stageWidth = 480;
  vm.runtime.stageHeight = 360;
  vm.runtime.setStageSize = (width, height) => {
    width = Math.round(Math.max(1, width));
    height = Math.round(Math.max(1, height));
    if (vm.runtime.stageWidth !== width || vm.runtime.stageHeight !== height) {
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
  vm.renderer.resize = (...args) => {
    reactInst = Object.values(
      document.querySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
    ).find((x) => x.child);
    stateNode = reactInst.child.child.child.stateNode;
    stageSizeMode = stateNode.props.stageSize;
    updatePlayerSize(
      vm.runtime.stageWidth,
      vm.runtime.stageHeight,
      stageSizeMode,
    );
    ogVmRendererResize.call.apply(ogVmRendererResize, [vm.renderer, ...args]);
    window.dispatchEvent(new Event("resize"));
  };
  let ogVmToJson = vm.toJSON;
  vm.toJSON = (...args) => {
    const result = JSON.parse(ogVmToJson.call.apply(ogVmToJson, [vm, ...args]));
    result.monitors.forEach((x) => {
      x.x += (480 - vm.runtime.stageWidth) / 2;
      x.y += (360 - vm.runtime.stageHeight) / 2;
    });
    return JSON.stringify(result);
  };
  let ogVmDeserializeProject = vm.deserializeProject;
  vm.deserializeProject = (...args) => {
    let result = ogVmDeserializeProject.call.apply(ogVmDeserializeProject, [
      vm,
      ...args,
    ]);
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
    },
    get: function () {
      return this._userscriptStageSizeChanger.y;
    },
  });
  let monitorsStateClone = vm.runtime._monitorState.map((x) => x);
  vm.on("MONITORS_UPDATE", () => {
    for (const monitor of vm.runtime._monitorState.valueSeq()) {
      if (
        monitorsStateClone.size > 0 &&
        monitorsStateClone.get(monitor.get("id")).get("visible") != monitor.get("visible") &&
        (
          monitorsStateClone.get(monitor.get("id")).get("x") != monitor.get("x") ||
          monitorsStateClone.get(monitor.get("id")).get("y") != monitor.get("y")
        )
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

  updatePlayerSize(
    vm.runtime.stageWidth,
    vm.runtime.stageHeight,
    stageSizeMode,
  );

  navigation.addEventListener("navigate", async () => {
    if (location.pathname.split("/").includes("editor")) {
      reactInst = Object.values(
        await asyncQuerySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
      ).find((x) => x.child);
      stateNode = reactInst.child.child.child.stateNode;
      stageSizeMode = stateNode.props.stageSize;
    }
    vm.runtime._monitorState = monitorsStateClone.map((x) => x);
    monitorsDivsUpdate();
    updatePlayerSize(
      vm.runtime.stageWidth,
      vm.runtime.stageHeight,
      stageSizeMode,
    );
  });
})();
