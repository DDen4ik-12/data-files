// ==UserScript==
// @name GH Customized Directories
// @version 1.0
// @author Den4ik-12
// @match https://github.com/*
// @connect simpleicons.org
// @connect www.svgrepo.com
// @connect api.github.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @grant GM.xmlHttpRequest
// @namespace ghCustomizedDirectories
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/ghCustomizedDirectories.user.js
// @updateURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/ghCustomizedDirectories.user.js
// ==/UserScript==

// Get config and if it not exists or not valid set new
let config = GM_getValue("config", null);
if (!Array.isArray(config)) {
  GM_setValue("config", []);
  config = [];
}

// Get addContentTypeIcons param and if it not exists or not valid set new
let addContentTypeIcons = GM_getValue("addContentTypeIcons", null);
if (typeof addContentTypeIcons != "boolean") {
  GM_setValue("addContentTypeIcons", false);
  addContentTypeIcons = false;
}

let contentTypeIcons = {
  directory: '<svg aria-hidden="true" focusable="false" class="octicon us-gh-cstm-dir_content-type-icon" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" display="inline-block" overflow="visible"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path></svg>',
  submodule: '<svg aria-hidden="true" focusable="false" class="octicon us-gh-cstm-dir_content-type-icon" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" display="inline-block" overflow="visible"><path d="M0 2.75C0 1.784.784 1 1.75 1H5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1h6.75c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm9.42 9.36 2.883-2.677a.25.25 0 0 0 0-.366L9.42 6.39a.249.249 0 0 0-.42.183V8.5H4.75a.75.75 0 0 0 0 1.5H9v1.927c0 .218.26.331.42.183Z"></path></svg>',
}

// style - Userscript style element
// simpleIcons - Array of wrappers with SVG icons obtained from simpleicons.org
// svgRepo - Array of wrappers with SVG icons obtained from www.svgrepo.com
// main - Main method of userscript
const style = document.createElement("style"),
  simpleIcons = {},
  svgRepo = {},
  main = async () => {
    // Async query selector
    const queryList = new Array();
    setInterval(() => {
      const queryListDelete = new Array();
      queryList.forEach((query) => {
        let elements = [...document.querySelectorAll(query.query)];
        if (elements.length == query.count) {
          queryListDelete.push(query);
          query.callback(elements);
        }
      });
      queryListDelete.forEach((query) => {
        queryList.splice(queryList.indexOf(query), 1);
      });
    }, 10);
    const asyncQuerySelectorAll = (query, count) => {
      let elements = [...document.querySelectorAll(query)];
      if (elements.length == count) {
        return elements;
      }
      return new Promise((callback) => {
        queryList.push({
          query,
          count,
          callback,
        });
      });
    };

    // applyStyles - Method for apply styles for directory
    // colorIsBright - Method for calculating whether a color is bright
    // getReactInstanceOf - Method for getting React instance of element
    const applyStyles = () => {
        // Reset userscript style element
        style.textContent = `.react-directory-row .react-directory-filename-column div.overflow-hidden a {
          display: flex;
          align-items: center;
        }
        .us-gh-cstm-dir_content-type-icon {
          margin-left: 6px;
        }`;

        config
          // Sort config parts by priority
          .sort(
            (configPart1, configPart2) =>
              (configPart1.priority ?? 0) - (configPart2.priority ?? 0),
          )
          .forEach((configPart, i) => {
            // If bgColor param exists and is valid, add styles to userscript style element
            if (/^#([0-9a-f]{3}){1,2}$/i.test(configPart.bgColor)) {
              style.textContent += `
              .us-gh-cstm-dir_${i} .react-directory-filename-column div.overflow-hidden {
                outline: 4px solid ${configPart.bgColor};
                background: ${configPart.bgColor};
                border-radius: 2px;
              }
              .us-gh-cstm-dir_${i} .react-directory-filename-column div.overflow-hidden a {
                color: ${colorIsBright(configPart.bgColor) ? "#1f2328" : "#f0f6fc"} !important;
              }
            `;
            }

            // If icon and iconColor params exists, add styles to userscript style element
            if (!configPart.icon && configPart.iconColor) {
              style.textContent += `
              .us-gh-cstm-dir_${i} .react-directory-filename-column svg {
                color: ${configPart.iconColor} !important;
              }
            `;
            }

            // Set SVG wrapper
            let svgWrapper;
            if (configPart.icon) {
              if (/^@simpleicons:\/\/[0-9a-z]+$/.test(configPart.icon)) {
                svgWrapper = simpleIcons[configPart.icon.match(/^@simpleicons:\/\/([0-9a-z]+)$/)[1]];
              } else if (/^@svgrepo:\/\/[0-9]+\/[-0-9a-z]+$/.test(configPart.icon)) {
                const [id, name] = configPart.icon.match(/^@svgrepo:\/\/([0-9]+)\/([-0-9a-z]+)$/).toSpliced(0, 1);
                svgWrapper = svgRepo[`${id}/${name}`];
              }
            }

            dirRows
              // Filter directory rows by matching the config (nameMatch and contentType params)
              .filter(
                (row) =>
                  (!configPart.nameMatch ||
                    new RegExp(...configPart.nameMatch).test(
                      getReactInstanceOf(row, "fiber").child.child.child
                        .memoizedProps.item.name,
                    )) &&
                  (!configPart.contentType ||
                    getReactInstanceOf(row, "fiber").child.child.child
                      .memoizedProps.item.contentType ==
                      configPart.contentType),
              )
              // Add userscript param for directory rows
              .forEach((row) => {
                row.usGhCstmDir = { i, svgWrapper };
              });
          });

        // Add userscript class, replace current icons and add content type icons for directory rows
        dirRows.forEach((row) => {
          if (typeof row.usGhCstmDir == "object") {
            row.classList.add(`us-gh-cstm-dir_${row.usGhCstmDir.i}`);
            if (row.usGhCstmDir.svgWrapper) {
              row
                .querySelectorAll(".react-directory-filename-column svg:not(.us-gh-cstm-dir_content-type-icon)")
                .forEach((node) => {
                  const savedClassList = node.classList;
                  row.usGhCstmDir.svgWrapper.children[0].classList = savedClassList;
                  node.outerHTML = row.usGhCstmDir.svgWrapper.innerHTML;
                });
            }
          }
          if (
            addContentTypeIcons &&
            getReactInstanceOf(row, "fiber").child.child.child
              .memoizedProps.item.contentType in contentTypeIcons &&
            row.querySelector(".us-gh-cstm-dir_content-type-icon") == null
          ) {
            row
              .querySelectorAll(".react-directory-filename-column div.overflow-hidden a")
              .forEach((node) => {
                const wrapper = document.createElement("div");
                wrapper.innerHTML = contentTypeIcons[
                  getReactInstanceOf(row, "fiber").child.child.child
                    .memoizedProps.item.contentType
                ];
                node.appendChild(wrapper.children[0]);
              });
          }
        });

        // Append userscript style to page's head
        document.head.appendChild(style);
      },
      colorIsBright = (hex) => {
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
        ) > 127.5;
      },
      getReactInstanceOf = (element, type) => {
        switch (type) {
          case "fiber": {
            return (element ?? {})[
              Object.keys(element ?? {}).find((key) =>
                key.startsWith("__reactFiber$"),
              )
            ];
          }
          default:
            return;
        }
      };

    // If turbo-frame#repo-content-turbo-frame element don't exists, it's not a directory page
    if (!document.querySelector("turbo-frame#repo-content-turbo-frame")) return;

    // Check content count in directory
    const contentCount = Object.keys(
      (
        await GM.xmlHttpRequest({
          url: `https://api.github.com/repos/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/contents/${location.pathname
            .split("/")
            .toSpliced(0, 5)
            .join("/")}${
            location.pathname.split("/")[3] == "tree"
              ? `?ref=${location.pathname.split("/")[4]}`
              : ""
          }`,
          responseType: "json",
        })
      ).response,
    ).length;

    // Get directory rows and table
    let dirRows = await asyncQuerySelectorAll(
      ".react-directory-row",
      contentCount,
    );
    const dirTableBody = document.querySelector(
      'table[aria-labelledby="folders-and-files"] > tbody',
    );

    // Preload icons
    for (const configPart of config) {
      if (configPart.icon) {
        if (/^@simpleicons:\/\/[0-9a-z]+$/.test(configPart.icon)) {
          const name = configPart.icon.match(/^@simpleicons:\/\/([0-9a-z]+)$/)[1];
          if (!(name in simpleIcons)) {
            const svg = (
              await GM.xmlHttpRequest({
                url: `https://simpleicons.org/icons/${name}.svg`,
              })
            ).responseText;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = svg;
            wrapper.children[0].setAttribute("aria-hidden", true);
            wrapper.children[0].setAttribute("focusable", false);
            wrapper.children[0].setAttribute("width", 16);
            wrapper.children[0].setAttribute("height", 16);

            simpleIcons[name] = wrapper;
          }
        } else if (/^@svgrepo:\/\/[0-9]+\/[-0-9a-z]+$/.test(configPart.icon)) {
          const [id, name] = configPart.icon.match(/^@svgrepo:\/\/([0-9]+)\/([-0-9a-z]+)$/).toSpliced(0, 1);
          if (!(`${id}/${name}` in svgRepo)) {
            const svg = (
              await GM.xmlHttpRequest({
                url: `https://www.svgrepo.com/show/${id}/${name}.svg`,
              })
            ).responseText;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = svg;
            wrapper.children[0].setAttribute("aria-hidden", true);
            wrapper.children[0].setAttribute("focusable", false);
            wrapper.children[0].setAttribute("width", 16);
            wrapper.children[0].setAttribute("height", 16);
            [...wrapper.children[0].children].forEach((node) => node.removeAttribute("fill"));

            svgRepo[`${id}/${name}`] = wrapper;
          }
        }
      }
    }

    // Call method for apply styles
    console.log("!");
    applyStyles();
  };

// Call main method of userscript and link this method to "navigate" event
main();
navigation.addEventListener("navigate", async (event) => {
  await new Promise((resolve) => {
    setInterval(() => {
      if (location.href == new URL(event.destination.url).href) resolve();
    });
  });
  main();
});
