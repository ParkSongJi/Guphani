const inquiryBtn = document.getElementById('inquiryreg');
const searchSelect = document.getElementById('searchSelect')
const sorts = searchSelect.querySelectorAll('li span')
const title = document.getElementById('title')
const contents = document.getElementById('contents')
const sort = document.getElementById('sort');
sorts.forEach((el)=>{
    el.addEventListener('click',()=>{
        sort.value = el.innerText
    })
})

const userId = localStorage.getItem('_id'); 
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

inquiryBtn.addEventListener('click',()=>{
    async function create() {
        const layerText = document.getElementById('layerText')
        if(sort.value == ''){
            layerText.innerText = '문의 분류를 선택해주세요.'
            layerOn('inquireFormLayer')
            return false
        }
        if(title.value == ''){
            layerText.innerText = '제목을 입력해주세요.'
            layerOn('inquireFormLayer')
            title.focus()
            return false
        }
        if(contents.value == ''){
            layerText.innerText = '내용을 입력해주세요.'
            layerOn('inquireFormLayer')
            return false
        }
    
        const response = await fetch(`http://localhost:8080/inquiry/user/write`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({userId, title:title.value, contents:contents.value, sort:sort.value})
        })

        if(response){
            const btnWrap = document.querySelector('#inquireFormLayer .btn-wrap')
            layerText.innerText = '등록이 완료되었습니다.'
            layerOn('inquireFormLayer')

            btnWrap.innerHTML = `
            <button type="button" class="black-btn" onclick="window.location.href = './inquiryList.html'">닫기</button>
            `
            
        }
    }
    create() 
})
