(function() {
    addCopyrightCurrentDate();

    document.querySelectorAll('section#activites button').forEach(function(item) {
        item.addEventListener('click', showActivityContent);
    })

    document.querySelectorAll( '.year-animated' ).forEach(function(item) {
        animateNumbers( item );
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
    setTimeout(function() {
        let duration = (item.getAttribute('data-endvalue') === null ? new Date().getFullYear() : item.getAttribute('data-endvalue')) * intervalTime;
        let animation = setInterval(function() {
            duration -= intervalTime;
            item.innerHTML = pad(parseInt(item.innerHTML) + 1, 4);
            if(duration <= 0)
                clearInterval(animation);
        }, intervalTime);
    }, item.getAttribute('data-delay') === null ? 250 : item.getAttribute('data-delay'));
}
