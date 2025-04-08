document.addEventListener("DOMContentLoaded", function () {
    window.dispatchEvent(new Event("resize"));
});


(function () {
    const baseElement = document.createElement("base");
    baseElement.href = window.location.origin + "/";  // immer vom Root aus
    document.head.insertBefore(baseElement, document.head.firstChild);
})();

