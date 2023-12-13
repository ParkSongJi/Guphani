const postBtn = document.getElementById('postBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')



postBtn.addEventListener('click',()=>{
    layerOn('noticePostLayer')
    layerText = `공지사항이<br><strong class="point-txt">등록</strong> 되었습니다.`
    textArea.innerHTML = layerText
})