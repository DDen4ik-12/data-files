// ==UserScript==
// @name        scratchFollowViewportsFix
// @version     1.0
// @author      Den4ik-12
// @include     https://scratch.mit.edu/users/*
// @grant       none
// @namespace   scratchFollowViewportsFix
// @downloadURL https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/scratchFollowViewportsFix.js
// @updateURL   https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/scratchFollowViewportsFix.js
// ==/UserScript==
(async () => {
  let following = await fetch(
    `https://api.scratch.mit.edu/users/${location.pathname.split("/")[2]}/following`,
  )
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return [];
    });
  let followers = await fetch(
    `https://api.scratch.mit.edu/users/${location.pathname.split("/")[2]}/followers`,
  )
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return [];
    });

  let viewports = [
    ...document.querySelectorAll(
      "div.box.slider-carousel-container.prevent-select > div.box-content.slider-carousel.horizontal#featured > div.viewport",
    ),
  ].filter((x) => {
    return (
      x.querySelectorAll("ul.scroll-content > li.gallery.thumb.item").length ==
      0
    );
  });
  if (viewports.length > 0) {
    if (viewports[0].querySelector("ul.scroll-content")) {
      let content = viewports[0].querySelector("ul.scroll-content");
      content.innerHTML = "";
      following.forEach((x) => {
        let user = new Object();
        user.li = document.createElement("li");
        user.li.className = "user thumb item";

        user.a = document.createElement("a");
        user.a.href = `/users/${x.username}`;
        user.li.appendChild(user.a);

        user.img = document.createElement("img");
        user.img.className = "lazy";
        user.img.width = 60;
        user.img.height = 60;
        user.img.src = x.profile.images["60x60"];
        user.img.setAttribute("data-original", x.profile.images["60x60"]);
        user.a.appendChild(user.img);

        user.span = document.createElement("span");
        user.span.className = "title";
        user.li.appendChild(user.span);

        user.spanA = document.createElement("a");
        user.spanA.href = `/users/${x.username}`;
        user.spanA.textContent = x.username;
        user.span.appendChild(user.spanA);

        content.appendChild(user.li);
      });
    }
  }
  if (viewports.length > 1) {
    if (viewports[1].querySelector("ul.scroll-content")) {
      let content = viewports[1].querySelector("ul.scroll-content");
      content.innerHTML = "";
      followers.forEach((x) => {
        let user = new Object();
        user.li = document.createElement("li");
        user.li.className = "user thumb item";

        user.a = document.createElement("a");
        user.a.href = `/users/${x.username}`;
        user.li.appendChild(user.a);

        user.img = document.createElement("img");
        user.img.className = "lazy";
        user.img.width = 60;
        user.img.height = 60;
        user.img.src = x.profile.images["60x60"];
        user.img.setAttribute("data-original", x.profile.images["60x60"]);
        user.a.appendChild(user.img);

        user.span = document.createElement("span");
        user.span.className = "title";
        user.li.appendChild(user.span);

        user.spanA = document.createElement("a");
        user.spanA.href = `/users/${x.username}`;
        user.spanA.textContent = x.username;
        user.span.appendChild(user.spanA);

        content.appendChild(user.li);
      });
    }
  }
})();
