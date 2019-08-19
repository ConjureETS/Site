(function() {
    addCopyrightCurrentDate();

    document.querySelectorAll('section#activites button').forEach(function(item) {
        item.addEventListener('click', showActivityContent);
    })

    document.querySelectorAll( '.year-animated' ).forEach(function(item) {
        animateNumbers( item );
    });

    bulmaCarousel.attach('.slider', {
        autoplay: true,
        pagination: false,
        loop: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        icons: {
            previous: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 100 100" width="100" height="100"><defs><clipPath id="_clipPath_Rmt62eEg1OXF13UQV6A0tZ7nRrSHuqzl"><rect width="100" height="100"/></clipPath></defs><g clip-path="url(#_clipPath_Rmt62eEg1OXF13UQV6A0tZ7nRrSHuqzl)"><path d=" M 68.738 87.477 L 68.738 87.477 L 31.262 50 L 68.738 12.523" fill="none" vector-effect="non-scaling-stroke" stroke-width="8" stroke="rgb(132,132,132)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="3"/></g></svg>',
            next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 100 100" width="100" height="100"><defs><clipPath id="_clipPath_sc80dOHRo7GcAKylIDWHu4HjiUHjgH8R"><rect width="100" height="100"/></clipPath></defs><g clip-path="url(#_clipPath_sc80dOHRo7GcAKylIDWHu4HjiUHjgH8R)"><path d=" M 39 12.523 L 39 12.523 L 76.477 50 L 39 87.477" fill="none" vector-effect="non-scaling-stroke" stroke-width="8" stroke="rgb(132,132,132)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="3"/></g></svg>'
        }
    });
})();

function addCopyrightCurrentDate() {
    document.querySelector('footer').querySelector('p').innerHTML += ' ' + new Date().getFullYear();
}

function showActivityContent(e) {
    e.target.parentElement.parentElement.querySelector('.headline').classList.toggle('toggle-visibility');
    e.target.parentElement.parentElement.classList.toggle('slide');
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function animateNumbers(item) {
    let intervalTime = 1;
    let incrementation = 7;
    setTimeout(function() {
        let endValue = item.getAttribute('data-endvalue');
        endValue = parseInt(endValue === null ? new Date().getFullYear() : endValue);
        let duration = endValue * intervalTime / incrementation;
        console.log(duration);
        console.log((endValue === undefined || endValue === 0 ? new Date().getFullYear() : endValue));
        let animation = setInterval(function() {
            duration -= intervalTime;
            let val = parseInt(item.innerHTML);
            item.innerHTML = pad( (val + incrementation > endValue ? val + (endValue - val) : val + incrementation), 4);
            if(duration <= 0)
                clearInterval(animation);
        }, intervalTime);
    }, item.getAttribute('data-delay') === null ? 250 : item.getAttribute('data-delay'));
}
