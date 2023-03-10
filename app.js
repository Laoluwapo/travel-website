let controller;
let slideScene;

function animateSlides() {
  // Initialize the controller
  controller = new ScrollMagic.Controller();
  // Select elements
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // Loop over each slide
  sliders.forEach((slide) => {
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
  });
}

animateSlides();
