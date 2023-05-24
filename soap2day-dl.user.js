// ==UserScript==
// @name         Soap2day Downloader
// @description  Downloads movies and TV shows from soap2day.to
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       JDipi
// @match        https://soap2day.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soap2day.to
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// ==/UserScript==

/***************** IMPORTANT!!! ********************
For this script to work properly, do the following:
  1) Go to your Tampermonkey dashboard
  2) Click settings
  3) Change the 1st option (Config Mode) to "Advanced"
  4) Scroll down to "Downloads BETA"
  5) Change "Download Mode" to "Browser API"
  6) Save and exit, accept the new "Manage Download"
     permission if prompted.
Doing this allows Tampermonkey to save the media to a
folder in your default download location, rather than
just spewing all the media out.
**************************************************/

(function () {
  // adds item to storage queue and to the ui
  const addToQueue = (url, name) => {
    queue = [];
    $(/*html*/ `
    <li>
      <a href=${url}>${name}</a>
    </li>
    `).appendTo(".dlqueue ul");
    $(".dlqueue li a").each(function () {
      queue.push({ name: $(this).text(), url: $(this).attr("href") });
    });
    GM_setValue("downloadQueue", queue);
  };

  // css to make the header of each season work with flex
  $(".panel-body .row .alert-info-ex h4").css({
    display: "flex",
    width: "100%",
    "justify-content": "space-between",
  });

  // adds download all button to each season
  $(".panel-body .row .alert-info-ex").each((i, el) => {
    $(
      /*html*/ `<button class="downloadAll label label-info">Download All</button>`
    ).appendTo($(el).find("h4"));
  });

  // dlqueue window
  $(/*html*/ `
    <div class="dlqueue">
      <h4>Download Queue</h4>
      <ul>
      </ul>
      <span style="display: flex; justify-content: space-between;">
        <button title="Begin Downloading" class="download label label-info">Download</button>
        <span title="Clear Queue">
          <svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/></svg>      </span>
        </span>
      </div>
    `).prependTo("body");

  // adds a little download button to each episode
  $(".panel-body .row .alert-info-ex div.col-sm-12.col-lg-12")
    .children()
    .each((i, el) => {
      $(el).css({
        display: "flex",
        "align-items": "center",
        height: "fit-content",
      });
      $(/*html*/ `
        <a title='Add "${$(el).text()}" to download queue'>
          <svg width="21" height="21" viewBox="0 0 24 24" style="margin-right: 2px; cursor: pointer;" fill="none" stroke="#8899a4" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg>
        </a>
        `).prependTo($(el));
    });

  // onclick for each download btn
  $("a[title~=Add]").on("click", function (e) {
    let episodePageUrl = window.location.origin + $(this).next().attr("href");
    addToQueue(episodePageUrl, $(this).next().text());
  });

  // download onclick, starts collecting the src urls
  $(".download").on("click", function (e) {
    GM_setValue("downloadQueue", queue);
    GM_setValue("isDownloading", true);
    console.log(GM_getValue("downloadQueue"));
    queue.forEach((el, i) => {
      GM_openInTab(el.url, (loadInBackground = true));
    });
  });

  // clears entire queue
  $("span[title~=Clear]").on("click", function (e) {
    $(this).parent().prev().children().detach();
    queue = [];
    GM_setValue("downloadQueue", queue);
  });

  // adds entire seasons of tv shows to the queue
  $(".downloadAll").on("click", function (e) {
    let episodes = $(this).parent().parent().find("div").children();
    episodes.each(function () {
      let name = $(this).find("a:not(a svg)").text();
      let url = window.location.origin + $(this).find("a[href]").attr("href");
      if (name && url) addToQueue(url, name);
    });
  });

  // warning for no browser mode
  if (GM_info.downloadMode !== "browser") {
    alert(
      `Please change the Tampermonkey download mode to browser and read the important comment at the top of the script!!!`
    );
    return;
  }

  // adds download button to movie pages
  if (
    $(".panel.panel-info.panel-default > .panel-heading")
      .text()
      .includes("Movies") &&
    !window.location.href.includes("movielist")
  ) {
    $(/*html*/ `
      <a class="movie-dl" title='Add movie to download queue'>
        <svg width="21" height="21" viewBox="0 0 24 24" style="margin: 10px; transform: scale(1.5); cursor: pointer;" fill="none" stroke="#8899a4" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg>
      </a>
    `).prependTo($(".thumbnail img").parent());
  }

  // onclick for when you wanna download only a movie
  $(".movie-dl").on("click", function (e) {
    e.preventDefault();
    if ($(".player-title-bar").length) {
      // this is for if the user is on the actual movie page
      addToQueue(window.location.href, $(".player-title-bar").text().trim());
    } else {
      // this is for if the user is on the site homescreen and presses a button to download a movie
      addToQueue(
        `https://soap2day.to${$(this).parent().attr("href")}`,
        $(this).parent().parent().next().text().trim()
      );
    }
  });

  // if the queue exists already, add each item to the ui
  let queue = GM_getValue("downloadQueue", []);
  if (queue.length) {
    queue.forEach((el) => {
      addToQueue(el.url, el.name);
    });
  }

  console.log(GM_getValue("downloadQueue"));

  // if we're in the process of collecting links
  if (GM_getValue("isDownloading")) {
    // resets downloads for testing purposes
    if (GM_getValue("downloads").length > $(".dlqueue ul").children().length) {
      GM_setValue("downloads", []);
    }

    // wait for the video to load in
    let videoFrame = setInterval(() => {
      if ($("video.jw-video").length) {
        let src = $("video.jw-video").attr("src");
        clearInterval(videoFrame);
        let filename =
          "Soap2day downloads" + "/" + $(".player-title-bar").text().trim();
        GM_download(src, filename + ".mp4");
        window.close();
      }
    });
  }

  GM_addStyle(/*css*/ `
    .downloadAll {
      border: none;
    }

    a[title~=Add] svg:hover {
      stroke: black;
    }

    .dlqueue {
      padding: 10px;
      z-index: 1000;
      position: fixed;
      right: 15px;
      top: 20px;
      color: #31708f;
      background-color: #9eeae7;
      border-color: #bce8f1;
      border: 2px solid;
      max-height: 90%;
      overflow-y: scroll;
    }

    .dlqueue li {
      position: relative;
    }

    .dlqueue svg {
      cursor: pointer;
      fill: #31708f;
      transform: scale(0.6);
    }

  `);
})();
