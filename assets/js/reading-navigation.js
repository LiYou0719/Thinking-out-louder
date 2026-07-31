(function () {
  "use strict";

  var article = document.querySelector(".article");
  var content = document.querySelector(".article-content");
  var progress = document.querySelector("[data-reading-progress]");
  var progressBar = document.querySelector("[data-reading-progress-bar]");

  if (!article || !content) return;

  function makeUniqueId(heading, usedIds) {
    var existingId = heading.id;
    if (existingId && !usedIds.has(existingId)) {
      usedIds.add(existingId);
      return existingId;
    }

    var base = heading.textContent
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";
    var candidate = base;
    var suffix = 2;

    while (usedIds.has(candidate) || document.getElementById(candidate)) {
      candidate = base + "-" + suffix;
      suffix += 1;
    }

    heading.id = candidate;
    usedIds.add(candidate);
    return candidate;
  }

  var headings = Array.prototype.slice.call(
    content.querySelectorAll("h2, h3")
  );
  var usedIds = new Set();
  var overviewId = content.id || "article-overview";

  content.id = overviewId;

  headings.forEach(function (heading) {
    makeUniqueId(heading, usedIds);
  });

  var tocLinks = [];
  var currentSectionLabels = Array.prototype.slice.call(
    document.querySelectorAll("[data-current-section]")
  );
  var mobileToc = document.querySelector("[data-mobile-toc]");

  function hasOverviewContent() {
    var firstHeading = headings[0];
    var element = content.firstElementChild;

    while (element && element !== firstHeading) {
      var hasText = Boolean(element.textContent.trim());
      var hasMedia = Boolean(element.querySelector("img, canvas, video, table"));
      if (hasText || hasMedia) return true;
      element = element.nextElementSibling;
    }

    return false;
  }

  var hasOverview = hasOverviewContent();
  var sectionLabels = {};
  if (hasOverview) sectionLabels[overviewId] = "Overview";
  headings.forEach(function (heading) {
    sectionLabels[heading.id] = heading.textContent.trim();
  });

  function appendTocItem(list, id, label, level) {
    var item = document.createElement("li");
    var link = document.createElement("a");

    item.className = "toc-item toc-item--" + level;
    link.className = "toc-link toc-link--" + level;
    link.href = "#" + id;
    link.textContent = label;
    link.dataset.sectionId = id;
    item.appendChild(link);
    list.appendChild(item);
    tocLinks.push(link);
  }

  function buildToc(list) {
    if (hasOverview) {
      appendTocItem(list, overviewId, "Overview", "overview");
    }

    headings.forEach(function (heading) {
      var level = heading.tagName.toLowerCase();
      appendTocItem(list, heading.id, heading.textContent.trim(), level);
    });
  }

  function setActiveSection(id) {
    tocLinks.forEach(function (link) {
      var isActive = Boolean(id && link.dataset.sectionId === id);
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    currentSectionLabels.forEach(function (label) {
      label.textContent = id && sectionLabels[id]
        ? sectionLabels[id]
        : hasOverview
          ? "Overview"
          : "Introduction";
    });
  }

  if (headings.length >= 3) {
    Array.prototype.slice.call(
      document.querySelectorAll("[data-toc-list]")
    ).forEach(buildToc);

    var desktopToc = document.querySelector("[data-desktop-toc]");
    if (desktopToc) desktopToc.hidden = false;
    if (mobileToc) mobileToc.hidden = false;

    var activationLine = function () {
      return Math.min(180, window.innerHeight * 0.22);
    };

    function updateActiveFromPosition() {
      var activeId = hasOverview ? overviewId : null;
      var line = activationLine();

      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top <= line) {
          activeId = heading.id;
        }
      });

      setActiveSection(activeId);
    }

    if ("IntersectionObserver" in window) {
      var sectionObserver = new IntersectionObserver(
        updateActiveFromPosition,
        { rootMargin: "-18% 0px -70% 0px", threshold: [0, 1] }
      );
      headings.forEach(function (heading) {
        sectionObserver.observe(heading);
      });
    } else {
      window.addEventListener("scroll", updateActiveFromPosition, {
        passive: true
      });
    }

    tocLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setActiveSection(link.dataset.sectionId);
        if (mobileToc) mobileToc.open = false;
      });
    });

    window.addEventListener("resize", updateActiveFromPosition);
    updateActiveFromPosition();
  }

  if (progress && progressBar) {
    progress.hidden = false;
    var progressTicking = false;

    function updateReadingProgress() {
      var articleRect = article.getBoundingClientRect();
      var scrollableDistance = Math.max(
        1,
        article.offsetHeight - window.innerHeight
      );
      var travelled = Math.min(
        scrollableDistance,
        Math.max(0, -articleRect.top)
      );
      var ratio = travelled / scrollableDistance;

      progressBar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      progressTicking = false;
    }

    function requestProgressUpdate() {
      if (!progressTicking) {
        window.requestAnimationFrame(updateReadingProgress);
        progressTicking = true;
      }
    }

    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
    updateReadingProgress();
  }
})();
