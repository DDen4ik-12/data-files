// ==UserScript==
// @name        stageSizeChanger
// @version     1.0-alpha.1
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

  let resizePlayerStyle = document.createElement("style");
  document.head.appendChild(resizePlayerStyle);
  let updatePlayerSize = (width, height, stageSizeMode) => {
    stageSizeMode = stageSizeMode == "large" ? 1 : stageSizeMode == "small" ? 0.5 : 1;
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

    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="monitor-list_monitor-list"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage-bottom-wrapper"]:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *),
    [class*="stage-wrapper_stage-wrapper"] [class*="stage_stage_"] canvas:not([class*="stage-wrapper_full-screen"] *, .preview .guiPlayer *) {
      width: ${width * stageSizeMode}px !important;
      height: ${height * stageSizeMode}px !important;
    }

    body [class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_stage"],
    body [class*="stage-wrapper_full-screen"] [class*="stage-header_stage-menu-wrapper"],
    body [class*="stage-wrapper_full-screen"] canvas {
      width: min(calc((100vh - 44px) * ${width} / ${height}), 100vw) !important;
    }

    body [class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_stage"],
    body [class*="stage-wrapper_full-screen"] [class*="stage_green-flag-overlay-wrapper"],
    body [class*="stage-wrapper_full-screen"] canvas {
      height: min(calc(100vh - 44px), calc(100vw * ${height} / ${width})) !important;
    }`;
  };

  let reactInst = Object.values(
    await asyncQuerySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
  ).find((x) => x.child);
  let stateNode = reactInst.child.child.child.stateNode;
  let stageSizeMode = location.pathname.split("/").includes("editor") ? stateNode.props.stageSize : "large";
  let vm = stateNode.props.vm;

  vm.runtime.stageWidth = 480;
  vm.runtime.stageHeight = 360;
  vm.runtime.setStageSize = (width, height) => {
    width = Math.round(Math.max(1, width));
    height = Math.round(Math.max(1, height));
    if (vm.runtime.stageWidth !== width || vm.runtime.stageHeight !== height) {
      const deltaX = width - vm.runtime.stageWidth;
      const deltaY = height - vm.runtime.stageHeight;

      console.log(vm.runtime._monitorState.valueSeq().toArray());

      if (vm.runtime._monitorState.size > 0) {
        const offsetX = deltaX / 2;
        const offsetY = deltaY / 2;
        for (const monitor of vm.runtime._monitorState.valueSeq()) {
          const newMonitor = monitor
            .set("x", monitor.get("x") + offsetX)
            .set("y", monitor.get("y") + offsetY);
          vm.runtime.requestUpdateMonitor(newMonitor);
        }
        vm.runtime.emit("MONITORS_UPDATE", vm.runtime._monitorState);
      }

      console.log(vm.runtime._monitorState.valueSeq().toArray());

      vm.runtime.stageWidth = width;
      vm.runtime.stageHeight = height;
      if (vm.runtime.renderer) {
        vm.runtime.renderer.setStageSize(
          -width / 2,
          width / 2,
          -height / 2,
          height / 2,
        );
        vm.renderer.resize(width, height);
      }
      vm.runtime.emit("STAGE_SIZE_CHANGED", width, height);
      updatePlayerSize(width, height, stageSizeMode);
      window.dispatchEvent(new Event("resize"));
    }
  };
  vm.setStageSize = vm.runtime.setStageSize;
  let ogRendererResize = vm.renderer.resize;
  vm.renderer.resize = (...args) => {
    updatePlayerSize(vm.runtime.stageWidth, vm.runtime.stageHeight, stageSizeMode);
    ogRendererResize.call.apply(ogRendererResize, [
      vm.renderer,
      ...args
    ]);
    window.dispatchEvent(new Event("resize"));
  };

  updatePlayerSize(vm.runtime.stageWidth, vm.runtime.stageHeight, stageSizeMode);

  navigation.addEventListener("navigate", async () => {
    if (location.pathname.split("/").includes("editor")) {
        reactInst = Object.values(
          await asyncQuerySelector('div[class^="stage-wrapper_stage-wrapper_"]'),
        ).find((x) => x.child);
        stateNode = reactInst.child.child.child.stateNode;
        stageSizeMode = stateNode.props.stageSize
    }
    updatePlayerSize(vm.runtime.stageWidth, vm.runtime.stageHeight, stageSizeMode)
  });

  vm.runtime.ioDevices.mouse._stgSzChngrScript = {x: 0, y: 0};
  Object.defineProperty(vm.runtime.ioDevices.mouse, "_scratchX", {
    set: function (set) {
      this._stgSzChngrScript.x = Math.round(set * (vm.runtime.stageWidth / 480));
    },
    get: function () {
      return this._stgSzChngrScript.x;
    }
  });
  Object.defineProperty(vm.runtime.ioDevices.mouse, "_scratchY", {
    set: function (set) {
      this._stgSzChngrScript.y = Math.round(set * (vm.runtime.stageHeight / 360));
    },
    get: function () {
      return this._stgSzChngrScript.y;
    }
  });
})();
