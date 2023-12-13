const titleSearch = document.getElementById('titleSearch')
const contentSearch = document.getElementById('contentSearch')
const startDate = document.getElementById('startDate')
const endDate = document.getElementById('endDate')
const schBtn = document.getElementById('schBtn')
const table = document.querySelector('.list-table-wrap table')
const tbody = table.querySelector('tbody')
// let link = window.location.href
let link = ''
let html = ''

// 데이터 출력
fetch('http://localhost:3000/admin/notice/list')
.then((response) => {return response.json()})
.then((data) => {
    data.forEach((el, idx) => {
        html += `
            <tr>
                <td><input type="checkbox" name="" id="check${idx + 1}" class="type1"></td>
                <td>${idx + 1}</td>
                <td>${el.title}</td>
                <td>${el.contents}</td>
                <td>${el.createdAt}</td>
                <td><a href="${el._id}" class="gray-btn view-btn">상세보기</a></td>
            </tr>
        `
    });
    tbody.innerHTML = html  
})

// 검색
schBtn.addEventListener('click', () => {
    const query = {};
    if (titleSearch) {
        query.title = titleSearch.value;
    }
    if (contentSearch) {
        query.contents = contentSearch.value;
    }
    if (startDate && endDate) {
        query.startDate = startDate.value;
        query.endDate = endDate.value;
    }

    const queryString = Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    link = `http://localhost:3000/admin/notice/list?${queryString}`;
    window.location.href = link;
});



const pageUl = document.getElementById('pageUl');
let pageLi = pageUl.querySelectorAll('li a');
let page = '';
function handlePageClick(clickedPage) {
    // 여기서 클릭된 페이지에 대한 처리를 수행
    console.log(clickedPage);
}

pageLi.forEach(el => {
    el.addEventListener('click', () => {
        page = el.innerText;
        handlePageClick(page);
    });
});

// 페이징
const totalPost = 120
const maxPost = 10; // 한 페이지당 리스트개수
const maxPage = 10; // 페이징 개수
let currentPage = page ? parseInt(page) : 1; // (3)
const hidePost = page === 1 ? 0 : (page - 1) * maxPost; // (4)
const totalPage = Math.ceil(totalPost / maxPost); // (5)

pageLi.forEach(el =>{
    el.addEventListener('click',()=>{
        link += `page?=${currentPage}`
        window.location.href = link;
    })
})