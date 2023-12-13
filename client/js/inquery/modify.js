const userId = localStorage.getItem('_id'); 
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 문의하기 작성페이지
const selectbox = document.querySelector('#inquiryForm .selectbox')
const modal = document.querySelector('#inquiryForm .modal-wrap')
const li = modal.querySelectorAll('li')
const inquiryType = document.querySelector('.inquiry-type')

selectbox.addEventListener('click',(params)=>{
if(modal.classList.contains('fadeIn')){
    modal.classList.add('fadeOut')
    modal.classList.remove('fadeIn')
}else{
    modal.classList.add('fadeIn')
    modal.classList.remove('fadeOut')
}
})

// 
li.forEach((el)=>{
    el.addEventListener('click',()=>{
        inquiryType.innerText = el.children[0].innerText
        modal.classList.add('fadeOut')
        modal.classList.remove('fadeIn')
    })
})

var herf = window.location.search
var id = herf.split('=')[1]

const inquirySort = document.querySelector('.inquiry-type')
const title = document.getElementById('title')
const contents = document.getElementById('contents')
// 내용 출력
async function viewFetch() {
    const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/modify?id=${id}`,{
        method:'GET',
        headers: headers
    })
    .then((result)=>{return result.json()})
    .then((data)=>{
        console.log(data);
        inquiryType.innerText = data.sort
        title.value = data.title
        contents.value = data.contents
    })
}
viewFetch()

// 수정하기
const modifyBtn = document.getElementById('modifyBtn')

modifyBtn.addEventListener('click',()=>{
    const sort = inquirySort.innerText
    async function modify() {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/modify/${id}`,{
            method:'PUT',
            headers: headers,
            body:JSON.stringify({sort, title:title.value, contents:contents.value})
        })

        if(response.ok){
            layerOn('inquireModifyLayer')
        }
    }
    modify()
})