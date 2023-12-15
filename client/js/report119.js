async function report119() {
    try {
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

                    const ambulanceData = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/ambulance/getRealTime', {
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

                    smsButton.addEventListener('click', async function () {
                        if (id) {
                            try {
                                const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/emergency/user/report/${id}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({})
                                });

                                if (response.ok) {
                                    if (checkbox.checked) {
                                        const message = await response.text();
                                        const cleanedMessage = message.replace(/{|}/g, '');
                                        const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(cleanedMessage)}`;
                                        window.location.href = smsLink;
                                    } else {
                                        const smsLink = `sms:${phoneNumber}`;
                                        window.location.href = smsLink;
                                    }
                                } else {
                                    if (response.status !== 200) {
                                        const smsLink = `sms:${phoneNumber}`;
                                        window.location.href = smsLink;
                                    } else {
                                        makePopup('서버에서 오류가 발생했습니다.');
                                    }
                                    console.log('failed');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        } else {
                            const smsLink = `sms:${phoneNumber}`;
                            window.location.href = smsLink;
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
    } catch (error) {
        console.error('Error in report119 function:', error);
    }
}
window.onload = report119;
