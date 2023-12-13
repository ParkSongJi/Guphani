const postBtn = document.getElementById('postBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('token');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};


// 상세보기 내용 출력
function fn_fetch(link) {
    fetch(link)
    .then((response) => {return response.json()})
    .then((data) => {
        document.getElementById('title').value = data.title
        editor.setMarkdown(data.contents)
    })
}
// 에디터 내용 및 타이틀 내용 유튜브 서버로 전송
async function handleEditor() {
    const title = document.getElementById('title').value
    const contents = editor.getMarkdown();    
    const youtube = document.getElementById('youtube').value
    const data = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app:8080//admin/firstAid/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}`, },
        body: JSON.stringify({ title, contents, youtube})
    })
    .then((response) => {return response.json()})
    .then((data) => { 
        document.getElementById('closeBtn').addEventListener('click',()=>{
            window.location.href = `./view.html?id=${data._id}`
        })
     })
}


postBtn.addEventListener('click',()=>{
    const title = document.getElementById('title')
    const contents = editor.getMarkdown();
    const youtube = document.getElementById('youtube')

    if(title.value == ''){
        layerText = '제목을 입력해주세요.'
        textArea.innerHTML = layerText
        title.focus()
        layerOn('firstAidPostLayer')

        return false
    }
    if(contents.value == ''){
        layerText = '내용을 입력해주세요.'
        textArea.innerHTML = layerText
        layerOn('firstAidPostLayer')

        return false
    }

    if(youtube.value == ''){
        layerText = '유튜브 링크를 입력해주세요.'
        textArea.innerHTML = layerText
        youtube.focus()
        layerOn('firstAidPostLayer')

        return false
    }

    layerText = `응급사항이<br><strong class="point-txt">등록</strong> 되었습니다.`
    textArea.innerHTML = layerText
    layerOn('firstAidPostLayer')
    handleEditor()
    fn_fetch()
})
