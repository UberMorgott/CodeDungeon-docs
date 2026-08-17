(() => {
  const storageKey = "codedungeon-primary-navigation";

  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && typeof saved === "object" ? saved : {};
    } catch (_) {
      return {};
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {
      // Navigation still works with Material defaults when storage is blocked.
    }
  }

  function synchronizeNavigation() {
    const navigation = document.querySelector(".md-nav--primary");
    if (!navigation) return;

    const toggles = navigation.querySelectorAll(
      'input.md-nav__toggle[id^="__nav_"]'
    );
    const state = readState();

    toggles.forEach((toggle) => {
      if (!(toggle.id in state)) {
        state[toggle.id] = true;
      }

      toggle.checked = Boolean(state[toggle.id]);

      if (toggle.dataset.persistentNavigation === "true") return;
      toggle.dataset.persistentNavigation = "true";
      toggle.addEventListener("change", () => {
        const latestState = readState();
        latestState[toggle.id] = toggle.checked;
        writeState(latestState);
      });
    });

    writeState(state);
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(synchronizeNavigation);
  } else {
    document.addEventListener("DOMContentLoaded", synchronizeNavigation);
  }
})();
