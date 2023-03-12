let controller;
let slideScene;
let pageScene;

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

let mouse = document.querySelector(".cursor");
let mouseTxt = mouse.querySelector("span");
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

// Event listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
animateSlides();
