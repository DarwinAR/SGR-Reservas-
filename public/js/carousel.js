const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');

let currentSlide = 0;
let autoSlideInterval;
const SLIDE_DURATION = 5000; // 5 segundos entre slides

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
        const slideIndex = parseInt(indicator.dataset.slide);
        goToSlide(slideIndex);
        resetAutoSlide();
    });
});

startAutoSlide();
