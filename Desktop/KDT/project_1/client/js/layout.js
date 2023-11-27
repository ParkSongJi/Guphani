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
