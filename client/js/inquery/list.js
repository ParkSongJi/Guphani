const userId = localStorage.getItem('_id'); 
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 데이터패치
fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/user/list`,{
    headers: headers
})
.then((response) => {return response.json()})
.then((data) => {
    console.log(data);
    const listWrap = document.querySelector('.list-wrap')
    let html = ''
    if(data.length == 0){
        html +=`
            <li class="no-data">
                <p>등록된 문의가 없습니다.</p>
            </li>
        `
    }
    data.forEach((el) => {
        html +=`
        <li onclick="window.location.href='./inquiryDetail.html?id=${el._id}'">
            <div class="head">
                <p class="bo-tit ellip2">[${el.sort}] ${el.title}</p>
        `   
        if(el.answerStatus == 'N'){
            html += `<span class="bo-status">답변대기</span>`
        }else{
            html += `<span class="bo-status on">답변완료</span>`
        }
        html +=`  
            </div>
            <div class="body">
                <p class="ellip2">${el.contents}</p>
            </div>
            <div class="foot">
                <div class="bo-date">${String(el.createdAt).split('T')[0]}</div>
                <div class="util-wrap">
                    <button type="button" id="delBtn" onclick="del('${el._id}')">삭제</button>
            `
            if(el.answerStatus == 'N'){
                html += `<button type="button" id="modifyBtn" onclick='location.href="./inquiryModify.html?id=${el._id}"'>수정</button>`
            }
            html +=
            `
                </div>
            </div>
        </li>
        `
    });
    listWrap.innerHTML = html;
});

// 삭제
async function del(id) {
    const layerDelBtn = document.getElementById('leyerDelBtn')
    layerOn('inquireDelLayer')

    layerDelBtn.addEventListener('click',()=>{
        const response = fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/delete/${id}`,{
            method:'DELETE',
            headers: headers
        })

        if(response){
            const layerText = document.getElementById('layerText')
            const btnWrap = document.querySelector('#inquireDelLayer .btn-wrap')
            layerText.innerHTML = `문의가 <strong class="txt-point">영구적으로 삭제</strong>되었습니다.`
            btnWrap.innerHTML = `<button type="button" class="black-btn close">닫기</button>`
            layerOn('inquireDelLayer')

            btnWrap.querySelector('.close').addEventListener('click',()=>{
                layerOut('inquireDelLayer')
                location.reload()
            })
        }
    })
}