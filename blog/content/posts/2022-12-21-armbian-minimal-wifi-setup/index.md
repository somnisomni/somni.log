---
title: Armbian Minimal에서 Wi-Fi 설정
slug: armbian-minimal-wifi-setup
date: 2022-12-21T22:11:00.000+09:00
draft: false
tags:
  - 트러블슈팅
  - 리눅스
  - SBC
aliases:
  - /armbian-minimal-wifi-setup
cover:
  relative: true
lastmod: 2026-04-28T17:20:01.028Z
---

> [!CONCLUSION] TL;DR
> - 이더넷이나 스마트폰 테더링으로 인터넷 연결 후, Wi-Fi 연결에 필요한 패키지 `network-manager` 및 `wpasupplicant` 설치
> - NetworkManager의 TUI 프론트엔드인 `nmtui`를 통해 Wi-Fi AP를 검색하고 연결
> - 숨겨진 AP일 경우, `nmtui`에서 연결 프로파일을 수동으로 만들고 연결

---

## 환경
- **SBC** : 하드커널 오드로이드 N2+
- **Wi-Fi 어댑터** : ipTIME N1USB *(MT7601U)*
- **Armbian 이미지 버전** : Armbian Debian Sid Minimal *(rolling, 2022-12-18 빌드)*

---

Armbian CLI 이미지보다 더 경량화된 Minimal 이미지는 ~~이런 것까지 뺐나 싶을만큼~~ 최대한 패키지 수를 줄이고 꽉꽉 눌러담은 이미지죠.

이 빠진 패키지 중에는 Wi-Fi와 관련된 패키지도 있어 이미지(펌웨어)를 설치한 직후 아무것도 건들지 않은 상태 *(untouched)* 에서는 <u>Wi-Fi를 바로 연결할 수 없습니다.</u> 최소한 제가 쓴 이미지에서는요...🥴

비단 Armbian에만 해당되는 글은 아니고, 어떠한 리눅스 배포판이든 NetworkManager를 사용하는 배포판이라면 이 해결 과정을 적용할 수 있습니다.


## 문제 확인

`nmcli`를 실행시켜 보면 다음과 비슷하게 출력해줍니다.

```text {linenos=false command="nmcli"}
end0: unavailable
       "end0"
       ethernet (meson8b-dwmac), XX:XX:XX:XX:XX:XX, hw, mtu 1500

wlan0: unavailable
       "Ralink MT7601U"
       wifi (mt7601u), XX:XX:XX:XX:XX:XX, hw, mtu 1500

lo: unmanaged
       "lo"
       loopback (unknown), 00:00:00:00:00:00, sw, mtu 65536
```

중간의 wlan0 (또는 wifi로 설명되어 있는 인터페이스)를 보면 **"unavailable"** 상태입니다.

"unavailable" 상태는 이더넷의 경우 물리적으로 연결되어 있지 않은 경우에 표시되는 건 맞지만, Wi-Fi 인터페이스의 경우 <u>Wi-Fi 레이어에 접근조차 불가하거나 사용할 수 없을 때</u>에도 이 상태로 표시됩니다.

Wi-Fi 관련 패키지가 정상적으로 설정되어 있고 인터페이스를 사용할 수 있다면, **"disconnected"** 로 보여집니다. *(= Wi-Fi 하드웨어 제어는 가능하지만 AP 연결이 되어있지 않은 상태)*


## 패키지 설치

어쨌든 빠진 패키지를 설치해줘야 하는데, 임시로 인터넷 연결이 필요합니다. 이더넷을 바로 사용할 수 있는 환경이라면 이더넷을 잠시 연결해줘도 좋고, 그렇지 않다면 USB를 통해 스마트폰을 테더링할 수도 있습니다.

어떤 방법으로든 인터넷과 연결된 것이 확인되었다면 (`ping` 등을 활용할 수 있겠죠!) 다음 명령어를 실행해줍시다.

```sh {linenos=false}
$ sudo apt install network-manager wpasupplicant
```
Wi-Fi를 사용하기 위해 중요한 패키지는 `wpasupplicant`인데, Armbian Minimal 이미지에는 빠져있을거에요. 아마 CLI 이미지에는 포함되어있는 것 같고...

패키지가 정상적으로 설치되고 다시 `nmcli`를 실행시켰을 때, Wi-Fi 인터페이스의 상태가 **"disconnected"** 라고 표시되어야 합니다.


## Wi-Fi AP 연결

이제 Wi-Fi AP에 연결만 하면 됩니다! DHCP 등은 이미 시스템에 잘 설정되어 있으니 문제가 있지 않은 한 따로 신경써 줄 필요는 없어요.

### 공개 AP
`nmtui` 명령어로 NetworkManager TUI를 띄워주고, **"Activate a connection"** 페이지로 넘어가면 목록에서 Wi-Fi 섹션과 검색된 AP가 표시됩니다.
목록에서 연결하고자 하는 AP로 커서를 이동해서 엔터 키 또는 <u>\<Activate\></u> 버튼을 눌러주면 됩니다! 참 쉽죠?

### 숨겨진 AP
숨겨진 AP *(Hidden SSID)* 의 경우 연결 프로파일을 직접 만들어줘야 합니다. nmtui 메인 화면에서 **"Edit a connection"** 페이지로 넘어간 후, <u>\<Add\></u> 버튼을 누르면 뜨는 대화창에서 Wi-Fi를 선택합니다.

여러 입력 영역 중 <u><b>SSID</b></u>에는 연결할 AP의 SSID를 입력하고, 보안이 설정된 AP라면 <u><b>Security</b></u>에서 보안 규격을 선택하고 **Password**에 비밀번호를 입력해줍니다. *글 작성 시점 WPA-Enterprise는 지원되지 않는다네요..!*

<u><b>Device</b></u>에는 필요한 경우가 아니라면 딱히 입력하지 않아도 됩니다. AP에 연결할 때 자동으로 적절한 인터페이스를 선택해서 연결할거에요.

연결에 필요한 정보를 다 입력했다면 <u>\<OK\></u> 버튼으로 프로파일을 생성하고, **"Activate a connection"** 페이지에서 해당 AP가 표시되면 선택하여 연결해줍시다.


## 완료!

모든 과정을 거치고 Wi-Fi 연결까지 잘 된 듯 하면 임시로 연결한 인터넷을 해제하고, `nmcli`에서 연결 상태를 확인해보든 `ping`으로 어떤 서버에 ICMP 패킷 폭탄을 날려주든 `apt update`로 밀린 패키지 업데이트를 확인해보든 해봅시다! 축하합니다! 당신의 SBC는 Wi-Fi로 인터넷에 연결되었습니다👏🎉
