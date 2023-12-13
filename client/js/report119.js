async function report119() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLatitude = position.coords.latitude; // 현재 위도
                const userLongitude = position.coords.longitude; // 현재 경도
                const id = localStorage.getItem('userId'); // 사용자 id
                const checkbox = document.getElementById('checkbox1'); // 체크박스
                const smsButton = document.getElementById('smsButton'); // 문자버튼
                const callButton = document.getElementById('callButton'); // 전화버튼
                // 사용자의 위치, 아이디
                console.log(`사용자의 위치 - 위도: ${userLatitude}, 경도: ${userLongitude}`);
                console.log(id)

                const ambulanceData = await fetch('http://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/ambulance/getRealTime', {
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
                
                // 전화 버튼 누르면 가장 가까운 전화로 전화
                callButton.addEventListener('click', () => {
                    const telLink = `tel:${phoneNumber}`; // 전화번호를 tel 링크로 만들기
                    window.location.href = telLink; // 전화 연결 링크로 이동
                });
                
                // 체크박스가 체크되면 사용자 정보를 가져와서 문자를 보냄
                // 체크가 해제되면 문자X
                checkbox.addEventListener('change', async () => {
                    if (checkbox.checked) {
                        try {
                            const response = await fetch(`http://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/emergency/user/report/${id}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({})
                            });
                            if (response.ok) {
                                const message = await response.text(); // 텍스트로 변환
                                const cleanedMessage = message.replace(/{|}/g, '');
                                smsButton.addEventListener('click', () => {
                                    const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(cleanedMessage)}`;
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
                    } else {
                        // 체크가 되지 않은 경우의 동작
                        smsButton.addEventListener('click', () => {
                            const smsLink = `sms:${phoneNumber}`;
                            window.location.href = smsLink;
                        })
                    }
                });
                
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