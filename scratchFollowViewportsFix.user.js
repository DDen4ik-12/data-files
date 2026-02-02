// ==UserScript==
// @name        scratchFollowViewportsFix
// @version     1.1
// @author      Den4ik-12
// @include     https://scratch.mit.edu/users/*
// @grant       none
// @namespace   scratchFollowViewportsFix
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/scratchFollowViewportsFix.user.js
// @updateURL   https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/scratchFollowViewportsFix.user.js
// ==/UserScript==
(async () => {
  const addUserNode = (user, content) => {
    let userNode = new Object();

    userNode.li = Object.assign(document.createElement("li"), { className: "user thumb item" });

    userNode.a = Object.assign(document.createElement("a"), {
      href: `/users/${user.username}`,
      className: hasMembership.has(user.username) ? "avatar-badge-wrapper" : "",
    });
    userNode.li.appendChild(userNode.a);

    userNode.img = Object.assign(document.createElement("img"), {
      href: `/users/${user.username}`,
      className: `lazy ${hasMembership.has(user.username) ? "avatar-badge" : ""}`,
      width: 60,
      height: 60,
      src: user.profile.images["60x60"],
    });
    userNode.img.setAttribute("data-original", user.profile.images["60x60"]);
    userNode.a.appendChild(userNode.img);

    userNode.span = Object.assign(document.createElement("span"), { className: "title" });
    userNode.li.appendChild(userNode.span);

    userNode.spanA = Object.assign(document.createElement("a"), {
      href: `/users/${user.username}`,
      textContent: user.username,
    });
    userNode.span.appendChild(userNode.spanA);

    content.appendChild(userNode.li);
  };

  const following = await fetch(
    `https://api.scratch.mit.edu/users/${location.pathname.split("/")[2]}/following`,
  )
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return [];
    });
  const followers = await fetch(
    `https://api.scratch.mit.edu/users/${location.pathname.split("/")[2]}/followers`,
  )
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return [];
    });
  const hasMembership = new Set();

  const viewports = [
    ...document.querySelectorAll(
      "div.box.slider-carousel-container.prevent-select > div.box-content.slider-carousel.horizontal#featured > div.viewport",
    ),
  ].filter((viewport) => {
    return (
      viewport.querySelectorAll("ul.scroll-content > li.gallery.thumb.item").length ==
      0
    );
  });
  if (viewports.length > 0) {
    if (viewports[0].querySelector("ul.scroll-content")) {
      let content = viewports[0].querySelector("ul.scroll-content");
      content
        .querySelectorAll("li.user.thumb.item:has(> a.avatar-badge-wrapper) > span.title > a")
        .forEach((nameNode) => hasMembership.add(nameNode.innerText));
      content.innerHTML = "";
      following.forEach((user) => addUserNode(user, content));
    }
  }
  if (viewports.length > 1) {
    if (viewports[1].querySelector("ul.scroll-content")) {
      let content = viewports[1].querySelector("ul.scroll-content");
      content
        .querySelectorAll("li.user.thumb.item:has(> a.avatar-badge-wrapper) > span.title > a")
        .forEach((nameNode) => hasMembership.add(nameNode.innerText));
      content.innerHTML = "";
      followers.forEach((user) => addUserNode(user, content));
    }
  }
})();
