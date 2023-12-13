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

// 마이페이지
const bodyTag = document.querySelector('body')
function mypageOn() {
    layerOn('mypage')
    bodyTag.style.overflow = 'hidden'
}
function mypageOut() {
    layerOut('mypage')
    bodyTag.style.overflow = 'unset'
}

function withdrawal() {
    layerOn('withdrawalLayer')
    const withdrawalBtn = document.querySelector('.withdrawalBtn')
    const txtWrap = document.querySelector('.txt-wrap')
    const btnWrap = document.querySelector('.btn-wrap')
    withdrawalBtn.addEventListener('click',()=>{
        txtWrap.innerText = '회원탈퇴가 완료되었습니다.'
        btnWrap.innerHTML = `<button type="button" class="black-btn" onclick="location='/guphani/html/index.html'">닫기</button>`
    })
    
}