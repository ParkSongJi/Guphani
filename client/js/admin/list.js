// 체크박스 전체선택
const allAgree = document.querySelector('.list-table-wrap #allAgree')

allAgree.addEventListener('change', () => {
    agrees.forEach((el) => {
        el.checked = allAgree.checked;
    });
});

document.addEventListener('click', function (el) {
    if(el.target.type == 'checkbox' ){
        agrees = document.querySelectorAll('.list-table-wrap tbody input[type="checkbox"]')
        // 개별 체크박스에 클릭 이벤트 리스너 추가
        agrees.forEach(function (agree) {
            agree.addEventListener('change', () => {
                // 하나라도 체크가 해제되었을 때 "allAgree" 체크박스도 해제
                if (!agree.checked) {
                    allAgree.checked = false;
                } else {
                    // 모든 체크박스가 체크되었을 때 "allAgree" 체크박스도 체크
                    const allChecked = Array.from(agrees).every((cb) => cb.checked);
                    allAgree.checked = allChecked;
                }
            });
        });

    }
})


const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app:8080/auth/users`, {
    method: 'GET',
    headers: headers,
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
// ... (your existing code)

.then(user => {
    console.log('User Data:', user);

    // Ensure that user.users is an array
    if (Array.isArray(user.users)) {
        const userData = {
            result: '성공',
            message: '전체 회원 정보 조회 성공',
            users: user.users, // Use user.users instead of user
        };

        const tableBody = document.querySelector('.list-table-wrap tbody');
        const itemsPerPage = 15; // Set the number of items per page
        const totalPages = Math.ceil(userData.users.length / itemsPerPage);
   
        // Function to create a table row for a user
        function createUserRow(user, index) {
            const row = document.createElement('tr');
            row.innerHTML = `
          
                <td><input type="checkbox" name="userCheckbox" class="type1"></td>
                <td>${index}</td>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.birthdate}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.isUser}</td>
                <td>${user.joinDate.split('T')[0]}</td>
                <td><a href="./view.html" class="gray-btn view-btn" data-user-id="${user.id}">상세보기</a></td>
            `;

            const viewBtn = row.querySelector('.view-btn');
            viewBtn.addEventListener('click', (event) => {
                const userId = viewBtn.dataset.userId;
                localStorage.setItem('userId', userId);

                // Now you can use the userId variable for further processing
                console.log('Clicked "상세보기" for userId:', userId);
                // Redirect to view.html with the userId in the URL
                window.location.href = `./view.html`;
            });
            
            return row;
        }
        // Function to update pagination
        function updatePagination(currentPage) {
            const paginationUl = document.getElementById('pagination');
            if (paginationUl) {
                paginationUl.innerHTML = '';

                for (let i = 1; i <= totalPages; i++) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="#" data-page="${i}">${i}</a>`;
                    if (i === currentPage) {
                        li.classList.add('on');
                    }
                    paginationUl.appendChild(li);
                }
            } else {
                console.error('Error: Pagination ul not found.');
            }
        }

        

        // Insert user data into the table based on the current page
        
        function insertUserData(page) {
            tableBody.innerHTML = ''; // Clear existing rows
            const startIdx = (page - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            
            userData.users.slice(startIdx, endIdx).forEach((user, index) => {
                const row = createUserRow(user, startIdx + index + 1);
                tableBody.appendChild(row);
            });
        } 

        // Event listener for pagination click
        document.getElementById('pagination').addEventListener('click', (event) => {
            event.preventDefault();
            const clickedPage = parseInt(event.target.dataset.page, 10);
            if (!isNaN(clickedPage)) {
                updatePagination(clickedPage);
                insertUserData(clickedPage);
            }
        });

        // Initial pagination update for the first page
        updatePagination(1);

        // Initial insertion of user data for the first page
        insertUserData(1);

        
/*
        // Insert user data into the table
        userData.users.forEach((user, index) => {
            const row = createUserRow(user, index);
            tableBody.appendChild(row);
        }); */ 
// Update the total count
const totalCountSpan = document.getElementById('totalCount');
if (totalCountSpan) {
    totalCountSpan.textContent = `${user.users.length}건`;
} else {
    console.error('Error: Total count span not found.');
}
} else {
console.error('Error: User data is not in the expected format.');
}
})