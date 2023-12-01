let layerText = ''
const modifyBtn = document.getElementById('modifyBtn')
const delBtn = document.getElementById('delBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')

modifyBtn.addEventListener('click',()=>{
    layerOn('userDetailLayer')
    layerText = `회원정보가<br><strong class="point-txt">수정</strong> 되었습니다.`
    textArea.innerHTML = layerText
})
delBtn.addEventListener('click',()=>{
    layerOn('userDetailLayer')
    layerText = `회원정보가 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
    textArea.innerHTML = layerText
    layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('userDetailLayer')">닫기</button>
        <button type="button" class="point-btn del">삭제</button>
    `
})

document.addEventListener('click',(e)=>{
    if (e.target.matches('.layer-pop .point-btn.del')) {
        layerText = `회원정보가 <strong class="point-txt">삭제</strong><br>되었습니다.`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('userDetailLayer')">닫기</button>
        `
    }
})