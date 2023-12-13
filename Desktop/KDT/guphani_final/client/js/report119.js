async function report119() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLatitude = position.coords.latitude;
                const userLongitude = position.coords.longitude;
                console.log(`사용자의 위치 - 위도: ${userLatitude}, 경도: ${userLongitude}`);

                const ambulanceData = await fetch('https://www.guphani.com/ambulance/getRealTime', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userLatitude,
                        userLongitude,
                    }),
                });
                if (!ambulanceData.ok) {
                    console.error('Failed to fetch emergency data:', ambulanceData.status, ambulanceData.statusText);
                    return;
                }
                const result = await ambulanceData.json();
                console.log('Emergency data received from server:', result);
                // 가장 가까운 null이 아닌 전화번호를 가져옴
                for (let i = 0; i < result.length; i++) {
                    if (result[i].onrTel !== null) {
                        phoneNumber = result[i].onrTel;
                        break;
                    }
                }
                console.log(phoneNumber)

                // 버튼 요소 가져오기
                const callButton = document.getElementById('callButton');
                // 클릭 이벤트 핸들러 함수 정의
                callButton.addEventListener('click', () => {
                    const telLink = `tel:${phoneNumber}`; // 전화번호를 tel 링크로 만들기
                    window.location.href = telLink; // 전화 연결 링크로 이동
                });
                
                const smsButton = document.getElementById('smsButton');
                const id = localStorage.getItem('userId');
                console.log(id)
                try {
                    await fetch(`https://www.guphani.com/emergency/user/report/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.ok) {
                        const message = await response.json();
                        smsButton.addEventListener('click', () => {
                            const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
                            window.location.href = smsLink;
                    })
                    } else {
                        if (response.status !== 200) {
                            alert('로그인 정보가 일치하지 않습니다.');
                        } else {
                            alert('서버에서 오류가 발생했습니다.');
                        }
                        console.log('failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            },
            (error) => {
                console.error('위치 정보를 가져오는 중 에러 발생:', error);
            }
        );
    } else {
        console.log('Geolocation API를 지원하지 않습니다.');
    }
}

window.onload = report119;
