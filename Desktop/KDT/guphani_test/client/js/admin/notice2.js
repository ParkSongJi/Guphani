const modifyBtn = document.getElementById('modifyBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')



modifyBtn.addEventListener('click',()=>{
    layerOn('noticeModifyLayer')
    layerText = `공지사항이<br><strong class="point-txt">수정</strong> 되었습니다.`
    textArea.innerHTML = layerText
})