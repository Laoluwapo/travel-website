let controller;
let slideScene;
let pageScene;

// gsap.config({ nullTargetWarn: false });

// Functions
function animateSlides() {
  // Initialize the controller
  controller = new ScrollMagic.Controller();
  // Select elements
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // Loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealtext = slide.querySelector(".reveal-text");
    //GSAP
    const slideTL = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTL
      .fromTo(revealImg, { x: "0%" }, { x: "100%" })
      .fromTo(img, { scale: 2 }, { scale: 1 }, "-=1")
      .fromTo(revealtext, { x: "0%" }, { x: "100%" }, "-=0.75")
      .fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    // Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.2,
      reverse: false,
    })
      .setTween(slideTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);
    // New Animation
    const pageTL = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    if (nextSlide === "end") {
      return false;
    }
    pageTL
      .fromTo(nextSlide, { y: "0%" }, { y: "50%" })
      .fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 })
      .fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    // Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setTween(pageTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
// Function that adds the cursor div to the main cursor
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

// Add cursor animations
function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseTxt.innerText = "";
  }
}

// Function to toggle the nav
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(2500px at 100% -10%",
    });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(50px at 100% -10%",
    });
    document.body.classList.remove("hide");
  }
}

// Barba js Page Transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        // Get all instances of ScrollTrigger
        const triggers = ScrollTrigger.getAll();
        // Kill each instance of ScrollTrigger
        triggers.forEach((trigger) => trigger.kill());
        // Refresh ScrollTrigger to remove any cached values
        ScrollTrigger.refresh();
        // slideScene.destroy();
        // pageScene.destroy();
        // controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        gsap.fromTo(
          ".nav-header",
          1,
          { y: "100%" },
          { y: "0%", ease: "power2.inOut" }
        );
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        // Tell barba when to start animation
        let done = this.async();
        // An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        // Fade current section out
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        // Tell barba when to start animation
        let done = this.async();
        // Scroll to the top
        window.scrollTo(0, 0);
        // An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        // Fade next section in
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

// Event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

animateSlides();
