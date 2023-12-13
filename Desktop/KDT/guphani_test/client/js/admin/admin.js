(function(){
    function includeHtml() {
        const includeTarget = document.querySelectorAll('.includeJs');
        includeTarget.forEach(function(el, idx) {
            const targetFile = el.dataset.includeFile;
            if(targetFile){
                let xhttp = new XMLHttpRequest();
            
                xhttp.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        this.status === 200 ? (el.innerHTML = this.responseText) : null
                        this.status === 404 ? (el.innerHTML = 'include not found.') : null
                    }
                }
                xhttp.open('GET', targetFile, true);
                xhttp.send();
                return;
            }
        });
    };

    includeHtml();
})();

// 레이어 팝업창
function layerOn(el) {
    const layer = document.getElementById(el)
    layer.classList.add('fadeIn')
    layer.classList.remove('fadeOut')
}
function layerOut(el) {
    const layer = document.getElementById(el)
    layer.classList.add('fadeOut')
    layer.classList.remove('fadeIn')
}
