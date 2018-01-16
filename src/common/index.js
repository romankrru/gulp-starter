const $animatedEls = document.querySelectorAll('.should-animate');

const animate = () => {
  $animatedEls.forEach((item) => {
    const $el = item;
    $el.classList.remove('should-animate');
    $el.classList.add('animated');
  });
};

if (document.hasFocus()) {
  animate();
}

window.addEventListener('focus', animate);
