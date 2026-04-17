function initScreens() {
  document.querySelectorAll(".theme").forEach((theme) => {
    const main = theme.querySelector("main");
    if (!main) return;

    // Get all sections from main
    const allContent = main.innerHTML;
    
    // Create container for screens
    const container = document.createElement("div");
    container.className = "screen-container";
    
    // Extract sections
    const sectionRegex = /<section class="[^"]*"[^>]*>[\s\S]*?<\/section>/g;
    const matches = allContent.match(sectionRegex) || [];
    
    if (matches.length === 0) {
      console.warn("No sections found in theme");
      return;
    }

    // Create screens from sections
    // Map sections to tabs:
    // Section 0 (hero) -> Tab 0 (Home)
    // Section 1 (path-rewards) -> Tab 1 (Path) Screen 0
    // Section 2 (path-profile) -> Tab 1 (Path) Screen 1
    // Section 3 (rewards-content) -> Tab 2 (Rewards)
    // Section 4 (profile-content) -> Tab 3 (Profile)

    const tabScreens = [[], [], [], []]; // 4 tabs
    
    matches.forEach((match, index) => {
      const screen = document.createElement("div");
      screen.className = "screen";
      screen.innerHTML = match;
      
      // Map sections to tabs
      if (index === 0) {
        // Home
        screen.classList.add("active");
        tabScreens[0].push(screen);
      } else if (index === 1) {
        // Path - rewards screen
        tabScreens[1].push(screen);
      } else if (index === 2) {
        // Path - profile screen
        tabScreens[1].push(screen);
      } else if (index === 3) {
        // Rewards
        tabScreens[2].push(screen);
      } else if (index === 4) {
        // Profile
        tabScreens[3].push(screen);
      }
    });

    // Add all screens to container
    tabScreens.forEach((screens) => {
      screens.forEach((screen) => {
        container.appendChild(screen);
      });
    });

    // Replace main content with screens
    main.innerHTML = "";
    main.appendChild(container);

    // Setup nav click handlers
    const navItems = theme.querySelectorAll(".nav-item");
    navItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        showTab(theme, index);
      });
    });

    // Setup internal navigation buttons
    const buttons = theme.querySelectorAll("[data-goto-tab]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tabIndex = parseInt(btn.getAttribute("data-goto-tab"));
        showTab(theme, tabIndex);
      });
    });

    // Setup internal Path navigation
    const internalButtons = theme.querySelectorAll("[data-goto-internal]");
    internalButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.getAttribute("data-goto-internal");
        if (target === "path-profile") {
          showPathScreen(theme, 1);
        }
      });
    });

    // Bind quiz functionality
    bindQuiz(theme);
  });
}

function showTab(themeElement, tabIndex) {
  const allScreens = themeElement.querySelectorAll(".screen");
  const navItems = themeElement.querySelectorAll(".nav-item");
  
  // Calculate which screen to show based on tab index
  let screenIndex = 0;
  if (tabIndex === 0) screenIndex = 0; // Home
  else if (tabIndex === 1) screenIndex = 1; // Path (first screen)
  else if (tabIndex === 2) screenIndex = 3; // Rewards
  else if (tabIndex === 3) screenIndex = 4; // Profile
  
  // Hide all screens
  allScreens.forEach((screen) => screen.classList.remove("active"));
  navItems.forEach((item) => item.classList.remove("active"));

  // Show selected screen
  if (allScreens[screenIndex]) {
    allScreens[screenIndex].classList.add("active");
  }
  if (navItems[tabIndex]) {
    navItems[tabIndex].classList.add("active");
  }
}

function showPathScreen(themeElement, pathScreenIndex) {
  const allScreens = themeElement.querySelectorAll(".screen");
  
  // Path screens are at index 1 and 2
  const screenIndex = 1 + pathScreenIndex;
  
  // Hide all screens
  allScreens.forEach((screen) => screen.classList.remove("active"));
  
  // Show selected path screen
  if (allScreens[screenIndex]) {
    allScreens[screenIndex].classList.add("active");
  }
}

function bindQuiz(root) {
  const answers = root.querySelectorAll(".answer");
  const result = root.querySelector(".result");
  const resetBtn = root.querySelector(".reset-btn");

  if (!resetBtn || answers.length === 0) return;

  answers.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Disable all answers and show correct ones
      answers.forEach((b) => {
        b.disabled = true;
        if (b.dataset.correct === "true") {
          b.classList.add("correct");
        }
      });

      // Mark selected answer
      if (btn.dataset.correct === "true") {
        btn.classList.add("correct");
        result.textContent = "Correct — \"Báwo ni\" means \"How are you?\"";
        result.className = "result success";
      } else {
        btn.classList.add("wrong");
        result.textContent = "Not quite — the correct answer is \"How are you?\"";
        result.className = "result fail";
      }
    });
  });

  resetBtn.addEventListener("click", () => {
    answers.forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "wrong");
    });
    result.textContent = "";
    result.className = "result";
  });
}

// Theme switcher
const lightWrap = document.querySelector(".light-wrap");
const darkWrap = document.querySelector(".dark-wrap");
const previewGrid = document.getElementById("previewGrid");

document.getElementById("showBoth").addEventListener("click", () => {
  lightWrap.classList.remove("hidden");
  darkWrap.classList.remove("hidden");
  previewGrid.style.gridTemplateColumns = "repeat(2, minmax(320px, 1fr))";
  if (window.innerWidth <= 980) previewGrid.style.gridTemplateColumns = "1fr";
});

document.getElementById("showLight").addEventListener("click", () => {
  lightWrap.classList.remove("hidden");
  darkWrap.classList.add("hidden");
  previewGrid.style.gridTemplateColumns = "1fr";
});

document.getElementById("showDark").addEventListener("click", () => {
  lightWrap.classList.add("hidden");
  darkWrap.classList.remove("hidden");
  previewGrid.style.gridTemplateColumns = "1fr";
});

window.addEventListener("resize", () => {
  if (!lightWrap.classList.contains("hidden") && !darkWrap.classList.contains("hidden")) {
    previewGrid.style.gridTemplateColumns =
      window.innerWidth <= 980 ? "1fr" : "repeat(2, minmax(320px, 1fr))";
  }
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScreens);
} else {
  initScreens();
}
