// 1. SELECT ELEMENTS
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector("#nav-list");

// 2. TOGGLE MENU FUNCTION
const mobileMenu = () => {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
};

menu.addEventListener("click", mobileMenu);

// 3. CLOSE MENU WHEN A LINK IS CLICKED
// This prevents the menu from staying open and blocking the view after scrolling
document.querySelectorAll(".nav-links a").forEach((n) =>
  n.addEventListener("click", () => {
    menu.classList.remove("is-active");
    menuLinks.classList.remove("active");
  }),
);

// ==========================================
// COUNTDOWN TIMER LOGIC
// ==========================================
const countdown = () => {
  // Set the wedding date (Jan 4, 2027)
  const weddingDate = new Date("Jan 4, 2027 00:00:00").getTime();
  const now = new Date().getTime();
  const diff = weddingDate - now;

  // Time calculations
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const days = Math.floor(diff / msPerDay);
  const hours = Math.floor((diff % msPerDay) / msPerHour);
  const minutes = Math.floor((diff % msPerHour) / msPerMinute);
  const seconds = Math.floor((diff % msPerMinute) / msPerSecond);

  // Update the DOM
  if (diff > 0) {
    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText =
      seconds < 10 ? "0" + seconds : seconds;
  } else {
    // If the date has passed
    document.getElementById("countdown").innerHTML =
      "<h3>Happily Ever After!</h3>";
  }
};

// Run the function every second
setInterval(countdown, 1000);

// Run immediately on load so there isn't a 1-second delay of "00"
countdown();

// ==========================================
// VINYL PLAYER TOGGLE LOGIC
// ==========================================
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-control");

let isPlaying = false;

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  } else {
    bgMusic.play();
    musicToggle.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

// PRO TIP: Start music automatically on first click anywhere on the page
document.addEventListener(
  "click",
  () => {
    if (!isPlaying) {
      // bgMusic.play(); // Uncomment this if you want it to start on first scroll/click
      isPlaying = true;
      musicStatus.innerText = "Pause Music";
    }
  },
  { once: true },
);

// ==========================================
// SMOOTH ACCORDION LOGIC
// ==========================================
class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector("summary");
    this.content = el.querySelector(".detail-content");
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration: 400, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration: 400, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = "";
  }
}

// Apply to all details
document.querySelectorAll("details").forEach((el) => {
  new Accordion(el);
});

// ==========================================
// INTERSECTION OBSERVER FOR SCROLL REVEAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null, // use the viewport
    threshold: 0.15, // trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px", // triggers slightly before it hits the bottom
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Stop observing after it reveals once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply the class and observer to your sections and key images
  const revealElements = document.querySelectorAll(
    "section, .detail-item, .rsvp-image-wrapper, .portrait-graphic",
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal"); // Silently add the hidden state
    observer.observe(el);
  });
});

// ==========================================
// NAVIGATION SCROLL SPY
// ==========================================
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]"); // Only targets sections with an ID
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    // We calculate if the scroll is within the bounds of the section
    if (window.scrollY >= sectionTop - 200) {
      currentSectionId = section.getAttribute("id");
    }
  });

  // console.log("Current Section Detected:", currentSectionId); // DEBUG: Check your console!

  navLinks.forEach((link) => {
    link.classList.remove("active-link");
    const href = link.getAttribute("href").substring(1); // Remove the '#'
    if (href === currentSectionId) {
      link.classList.add("active-link");
    }
  });
});

// ==========================================
// RSVP
// ==========================================
const scriptURL =
  "https://script.google.com/macros/s/AKfycbxJe-Usnh3DwLf264hvxhQfNf0iQ2482Y46Pgq5u-7lLDiDyBfXTb0u9L96ozthgiUIHQ/exec";
const form = document.querySelector("#rsvp-form");
const btn = document.querySelector("#submit-btn");
const msg = document.querySelector("#form-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  btn.disabled = true;
  btn.innerHTML = "Sending..."; // QA Note: Feedback for the user

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      // 1. Start the fade out
      form.style.transition = "opacity 0.4s ease"; // Ensure CSS transition is active
      form.style.opacity = "0";

      setTimeout(() => {
        // 2. Hide the form completely after fade
        form.style.display = "none";

        // 3. Setup the Success Message
        msg.innerHTML = "Thank you! Your RSVP has been recorded.";
        msg.style.display = "block";
        msg.classList.add("fade-in");

        // 4. Reset states in the background
        btn.disabled = false;
        btn.innerHTML = "Confirm RSVP";
        form.reset();
      }, 400);
    })
    .catch((error) => {
      // Crucial: Re-enable button if the network fails so they can try again
      btn.disabled = false;
      btn.innerHTML = "Confirm RSVP";
      console.error("Error!", error.message);
      alert("Maaf, something went wrong. Please try again!");
    });
});
