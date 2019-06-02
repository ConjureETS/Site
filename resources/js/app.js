(function() {
    addCopyrightCurrentDate();
})();

function addCopyrightCurrentDate() {
    document.querySelector('footer').querySelector('p').innerHTML += ' ' + new Date().getFullYear();
}