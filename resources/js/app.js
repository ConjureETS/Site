(function() {
    addCopyrightCurrentDate();

    document.querySelectorAll('section#activites button').forEach(function(item) {
        item.addEventListener('click', showActivityContent);
    })
})();

function addCopyrightCurrentDate() {
    document.querySelector('footer').querySelector('p').innerHTML += ' ' + new Date().getFullYear();
}

function showActivityContent(e) {
    e.target.parentElement.parentElement.querySelector('.headline').classList.toggle('toggle-visibility');
    e.target.parentElement.parentElement.classList.toggle('slide');
}