// 문의하기
const inquiryList = document.querySelectorAll('#inquiryList li')

inquiryList.forEach((el)=>{
    el.addEventListener('click',()=>{
        detail = el.children[3]
        if(detail.classList.contains('fadeIn')){
            detail.classList.add('fadeOut')
            detail.classList.remove('fadeIn')
        }else{
            detail.classList.add('fadeIn')
            detail.classList.remove('fadeOut')
        }
    })
})