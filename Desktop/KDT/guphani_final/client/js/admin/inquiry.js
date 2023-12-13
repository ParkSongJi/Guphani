let layerText = ''
const modifyBtn = document.getElementById('modifyBtn')
const delBtn = document.getElementById('delBtn')
const ansBtn = document.getElementById('ansBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')


ansBtn.addEventListener('click',()=>{
    layerOn('inquiryDetailLayer')
    layerText = `답변이<br><strong class="point-txt">등록</strong> 되었습니다.`
    textArea.innerHTML = layerText
})


delBtn.addEventListener('click',()=>{
    layerOn('inquiryDetailLayer')
    layerText = `해당답변이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
    textArea.innerHTML = layerText
    layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('inquiryDetailLayer')">닫기</button>
        <button type="button" class="point-btn del">삭제</button>
    `
})

document.addEventListener('click',(e)=>{
    if (e.target.matches('.layer-pop .point-btn.del')) {
        layerText = `답변이 <strong class="point-txt">삭제</strong><br>되었습니다.`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('inquiryDetailLayer')">닫기</button>
        `
    }
})



