---
title: "오드로이드 N2+: 삽질의 서막"
slug: bought-odroid-n2plus
date: 2022-11-05T19:42:00.000Z
draft: false
tags:
  - SBC
  - 하드웨어
cover:
  image: odroidn2p-purchased.png
  relative: true
---

{{< figure src="odroidn2p-purchased.png" caption="오드로이드 N2+ 결제 완료 페이지 스크린샷" >}}

하드커널 웹사이트 장바구니에 [오드로이드 N2+](https://www.hardkernel.com/ko/shop/odroid-n2-with-4gbyte-ram-2/)를 넣었다 뺐다 한 지 어언 2주 째 *(맞나? 몰?루)*... 눈 딱 감고 "결제하기" 버튼을 눌러버렸습니다.


## 갑자기 이걸 왜 샀는가??

지금 이 글을 쓰고 있는 시점의 현재, 제 컴퓨터 책상 위에는 민트색 PC 본체, 가냘픈(?) 손가락에 자판이 눌려지고 있는 광적축 키보드, 쉘에 새겨진 [트리퀘트라](https://arca.live/b/archeology4games/45588971) 문양을 보기만 해도 머릿속에서 '앞쪽은 다음에 탐색하러 오자'라는 대사가 자동 재생되는 인상적인 마우스, 그 아래에는 그 대사의 주인공이 마우스를 집어삼킬 듯 두 팔을 벌리는 포즈를 한 채로 큼지막하게 인쇄되어 있는 마우스패드~~의 오른쪽 위에는 마우스의 비싼 몸값의 원인인 세 마리 뱀이 꼬여있는 로고~~, 묵묵히 맡은 일을 수행하고 있는 두 대의 모니터, 스포티 *(삐-)* 의 영원한 노예인 사운드바까지 하나같이 자기 주장이 강한 친구들이 각자 자리를 차지하고 있는데요!

<p style="color: gray"><i>(작문 아이디어 고갈로 인해 게임패드, 사운드바 리모컨, 키보드 팜레스트, 스마트폰 무선 충전기, 마우스 충전독, 게임패드, 라즈베리파이 피코, 모니터암 등등은 생략했습니다. 미안!)</i></p>

그렇게 자기 주장이 강한 친구들 사이에서도 작지만 유독 그 존재감이 큰 친구가 있는데 바로바로...

{{< figure src="rpi3b-and-parts.png" caption="라즈베리파이 3B와 잡다한 부품들" >}}

약 4~5년의 세월을 거쳐 노동<sup>~~혹사~~</sup>을 하고 있는 우리 [**라즈베리파이 3B**](https://www.raspberrypi.com/products/raspberry-pi-3-model-b/) 되시겠습니다~~ 일 하고 있는 당신을 위해 박수~~ 짝짝

이 조그마한 친구는 고등학교 동아리에서 저의 둘도 없는 파트너로서 활약했고, 고등학교를 졸업할 무렵에 최고의 파트너쉽을 보고 감동한 동아리 선생님께서 선물<sup>(?)</sup>로 주셔서 받아온 친구입니다. <span style="color: gray">절대 훔쳐온 것이 아닙니다.</span>

요즘 이 라즈베리파이를 가지고 심심풀이로 진행 중인 프로젝트가 있는데, 프로젝트라고 하기까지는 좀 그렇고 이 쪽에 좀 조예가 있는 너드다 하면 다들 하시는 [Home Assistant](https://www.home-assistant.io/) 구축을 하고 절찬리에 사용 중에 있습니다. 구축하면서 시스템 설정 등을 정리하기 위해 만든 [GitHub 리포지토리](https://github.com/somniLegacy/RPi-SenseStation)가 있으니 확인해보셔도 좋습니다 :D

그냥 지금 구축해 놓은 그대로 써도 그런대로 쓸 수는 있습니다. 하지만 위 프로젝트를 진행하면서 몇 가지 애로사항이 있었는데,

- 라즈베리파이 3B의 성능(CPU, RAM 등...)이 체감이 될 만큼 느리다.
- OS가 설치된 SD카드를 삽입하여 쓰는 족족 SD카드가 망가졌다.  
  <span style="color: gray"><i>(과도한 쓰기 작업이 발생해서 망가지나? 싶어서 다양한 방법(Log2RAM, F2FS 등...)을 동원하였지만 결과는 좋지 못했다죠... 그래서 사진과 같이 HDD에 OS를 설치하고 USB 부팅하는 방식으로 쓰고 있습니다.)</i></span>
- USB to SATA에 HDD를 물리고 쓰기는 하는데, 문제는 시스템 자체의 느린 성능 + 느린 HDD + USB 2.0의 대환장 콜라보로 한 번 부팅할 때 라면 하나 끓여먹고 와도 될 정도로 느리고 Home Assistant에서 센서 기록을 불러오는 사이에도 잠깐 졸았던 적이 있었다.  
  <span style="color: gray"><i>(과장이지만 느리기는 정말 느렸어요.)</i></span>
- 설명하기 힘든 부분에서 연로한 티가 난다. 라즈베리파이 할배...

이 정도가 있었다고 할까요? 결국에는 가장 큰 문제는 **성능**이라고 말할 수 있을 것 같네요. 한국인으로선 이런 느림의 미학은 용납할 수 없습니다. 암요.


## 대체품을 찾아 삼만리

그래서 라즈베리파이 3B를 대체할 목적으로 [라즈베리파이 4B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)를 찾아봤는데, 반도체 공급 대란으로 인해 가격이 싯가가 되어버린 느낌입니다.

<p style="color: gray;"><i>(x86 기반 SBC는 선택지에서 예외였습니다. x86 기반은 매우 범용적이고 일반 PC와 구조가 거의 동일하여 삽질할 것도 없어 편하지만, 셀러론이라고 해도 소비 전력 대비 필요 이상의 성능을 가지고 있기도 하고, 보드 자체만 해도 가격이 ARM SBC에 비하면 확실히 비쌉니다. 심지어 RAM도 따로 사서 달아줘야하다니! 말도 안돼요!)</i></p>

{{< figure src="devicemart-rpi4b.png" caption="디바이스마트에 리스팅된 라즈베리파이 4B" >}}

가격은 전에 봤을 때보단 조금 내려간 것 같네요. 그럼 뭐하나요? **다 품절인데.**

그래서 저는 어쩔 수 없이 라즈베리파이 시리즈를 벗어나서 다른 SBC를 찾는 모험에 나서게 됩니다. 국내에서 구하기가 비교적 쉬운 것으로 한 때 라즈베리파이와 같은 폼팩터로 정면 승부를 했던 [ASUS TinkerBoard 시리즈](https://tinker-board.asus.com/product/tinker-board.html), 국내에서 거의 유일무이한 SBC 제조사인 하드커널의 [오드로이드 시리즈](https://www.hardkernel.com/)로 추려볼 수 있었습니다. 다른 SBC로는 [Radxa의 ROCK 시리즈](https://wiki.radxa.com/Home), [PINE64의 ROCKPro64](https://www.pine64.org/rockpro64/), 우리가 너무 잘 아는 [NVIDIA의 Jetson 시리즈](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/) 등등 수도 없이 많은 ARM 기반 SBC가 있지만, 국내에서 구하기도 힘들거니와 특히 NVIDIA Jetson 시리즈는 가격도 가격이고 GPU를 쓰지 않는 용도에서는 돈값을 전혀 할 수가 없다고 판단했습니다.

ASUS TinkerBoard 시리즈는 디바이스마트에서도 판매하기에 한 번 찾아봤는데, 역시나 **가격도 비정상적이였고 대부분 품절**이였습니다. 품절이 아니더라도 가격대가 성능 대비 너무 마음에 들지 않아서 손을 대지도 않았습니다.

{{< figure src="devicemart-tinkerboard.png" caption="디바이스마트에 리스팅된 TinkerBoard 시리즈. 가격과 재고 상태가 이게 맞나...?" >}}


## 오드로이드, 너로 정했다!

그럼 선택지는 하나로 줄었습니다. 바로 **하드커널 오드로이드 시리즈**! 고등학교 동아리에서 라즈베리파이를 들들 볶고 삶는 와중에도 들어본 SBC 라인업이라, 거부감없이 [하드커널 홈페이지](https://www.hardkernel.com/)에 접속하여 제품 목록을 살펴봤습니다.

{{< figure src="hardkernel-listings.png" caption="글 작성 시점 하드커널에서 판매 중인 SBC 제품들" >}}

생각보다 꽤 많은 제품군을 보유하고 있네요. 하지만 게임 에뮬레이팅 용도의 ODROID-GO 시리즈와 x86 SBC인 ODROID-H 시리즈, 검증되었지만 너무 오래된 ODROID-XU4 시리즈를 제외하면 [ODROID-HC4](https://www.hardkernel.com/ko/shop/odroid-hc4-oled/), [ODROID-C4](https://www.hardkernel.com/ko/shop/odroid-c4/), [ODROID-N2+](https://www.hardkernel.com/ko/shop/odroid-n2-with-4gbyte-ram-2/), [ODROID-M1](https://www.hardkernel.com/ko/shop/odroid-m1-with-8gbyte-ram/)만 남게 됩니다.

이 중 **ODROID-HC4**는 HDD를 위한 SATA+전원포트가 보드에 달려있고 2베이 케이스가 미리 설치되어 있어 완전히 NAS 구축을 위한 제품입니다. with OLED는 시스템 상태 확인을 위한 조그마한 OLED 디스플레이가 케이스에 설치되어 있습니다.  
AmLogic S905X3라는 SoC를 사용하는데, ARM Cortex-A55 쿼드코어로 구성되어 있고 후술할 ODROID-N2+의 SoC보다 아래급인 제품입니다. 마찬가지로 후술할 ODROID-M1과 비슷하지만 조금 뒤쳐지는 성능일 것 같네요.  
NAS만을 위해 만들어진 제품이기에 희생된 기능이 매우 많습니다. GPIO는 OLED 디스플레이와 연결하기 위한 핀 5개를 제외하곤 다 빠져있고, USB 포트는 딱 하나, 그마저도 USB 2.0이라 마우스나 키보드를 연결하는 용도 그 이상 그 이하도 아닙니다. 그 외에도 나머지 세 보드에서 볼 수 있는 다양한 핀들과 기능들이 이 보드에선 찾아볼 수 없습니다.  
Home Assistant를 위해 물려둔 센서 모듈들을 GPIO로 연결해야하는데 이 부분에서부터 막히므로 제외.

**ODROID-C4**는 ODROID-HC4의 기반 모델입니다. 이 쪽은 달려있을 핀/포트/기능들은 어느 정도 다 달려있고, GPIO도 40핀이 온전하게 탑재되어 있으며, USB 3.0이 무려 4포트 모두 탑재되어 있습니다.  
하지만 HC4와 마찬가지로 선택지 중 가장 성능이 떨어지는 SoC를 가지고 있으므로 바로 탈락. 오랫동안 열심히 일해줘야 할텐데 처음부터 약한 놈을 기용할 수는 없는 법입니다<sup>(?)</sup>.

**ODROID-N2+** 와 **ODROID-M1**은 둘 다 범용적으로 사용할 수 있는 SBC 모델입니다. 범용적으로 쓸 수 있기에 둘의 구성 차이는 그렇게 크지 않은 편이에요. M1쪽이 주변 기기를 위한 자잘한 인터페이스가 더 많이 있다는 정도? 큰 차이점은...  
<span style="color: gray;">(왼쪽 ODROID-N2+ vs 오른쪽 ODROID-M1)</span>

- **SoC**: AmLogic S922X vs Rockchip RK3568B2
- **최대 RAM**: 4GB vs 8GB
- **M.2 NVMe: 없음 vs 있음 (PCIe 3.0 2레인)**
- **MIPI**: 없음 vs CSI 2레인 + DSI 4레인
- **SPI 플래시**: 8MiB vs 16MiB
- **SATA 포트**: 없음 vs SATA3 1포트 + SATA 전원포트 (5V 전용)
- **USB 포트**: USB 3.0 4포트 vs USB 3.0 2포트 + USB 2.0 2포트

정도가 될텐데, 제가 이 둘 사이에서 크게 망설인 이유로는 M.2 NVMe의 유무와 SATA 포트의 유무였습니다.

ODROID-N2+는 M.2 NVMe도 SATA도 없습니다. 대신에 M1에 비해 훨씬 성능이 좋은 SoC를 장착하고 있습니다. ODROID-M1은 SoC의 성능이 비교적 떨어지더라도 뛰어난 확장성을 가지고 있습니다. SD카드에 데일대로 데인 저의 선택은 과연 어느 쪽이였을까요?


## 빠른 놈이 이긴다

글 최상단의 스크린샷을 보셨다면 이미 아시는 분이 계시겠지만, 저는 **ODROID-N2+**를 선택했습니다. 물론 SSD를 달아서 겁나 날라다니는 속도로 쓸 수 있다면 얼마나 좋겠어요? 하지만 처음부터 플래시메모리에 Home Assistant 데이터같은걸 넣지 않기로 생각하고 있었기 때문에, 즉 플래시메모리는 OS 전용으로만 쓸 생각이였기 때문에 eMMC로 만족하기로 하고 넘겼습니다. 최소한 SD카드보단 낫겠죠.

<p style="color: gray"><i>(요즘 256GB NVMe SSD가 4~5만원 정도 하는데 32GB짜리 eMMC 모듈이 3만원쯤 하고 있는거 보면 얼마나 슬픈지 아시나요... 그럼에도 eMMC를 쓰기로 했습니다.😭)</i></p>

RAM 용량 또한 8GB까지는 필요할 것 같지 않기 때문에 4GB로 한정하였고, MIPI는 쓸 일이 전혀 없을 것 같았고, SPI 플래시메모리는 부트로더 전용이라고 생각하면 되기에 크게 문제되진 않을거라 생각했습니다. SATA 포트 유무에서 또 망설였는데, 지금 라즈베리파이에 물린 HDD를 그대로 또 쓸거라 SATA 포트가 있으면 네이티브하니 훨씬 안정적이겠지만 그냥 지금처럼 USB로 물리기로 했습니다.

**이게 다 SoC 성능이 훨씬 더 좋은 탓입니다.**

M.2 NVMe나 SATA나 있으면 좋겠지만 없다고 크게 불편하지는 않을 거에요. 하지만 <u>SoC(CPU)는 한 번 사면 교체를 못하잖아요</u>. 이게 제 결정의 큰 요인이였습니다. 성능이 좋은 만큼 소비 전력도 M1에 비해 약간 높았지만, 큰 차이는 아니기도 하구요. 또, 해당 SoC의 [리눅스 커널 메인라인 지원](https://linux-meson.com/)이 어느 정도 되어있는 것 같아 제조사 제공 구 버전 커널에만 묶여있지 않아도 됩니다. 아마두요!

> 참고로, ODROID-M1의 RK3568은 라즈베리파이 4의 BCM2711와 성능이 비슷하거나 살짝 뒤처지고, ODROID-N2+의 S922X는 확실히 우세입니다. 세 SoC의 벤치마크 자료를 한데 모은 사이트가 없는 것 같기에 자세한 데이터가 궁금하시면 구글에 몇 차례 검색해보셔야 합니다!


## 그래서 이걸로 뭘 할거에요?

ODROID-N2+가 도착한다면, 당장 급한 ~~SW마에스트로 프로젝트 개발을 마무리하고~~ 먼저 Ubuntu Server "공식" 버전(하드커널에서 제공하는 것 말고 [진짜 공식 버전](https://ubuntu.com/download/server/arm))을 설치해보고, 메인라인 리눅스 커널이 지원이 잘 되는 듯 하면 그대로 쓰고 뭔가 허술하다 싶으면 하드커널 제공 OS 이미지를 써야할지도 모르겠네요.

OS를 설치한 다음에는 지금 라즈베리파이에 구축해놓은 것처럼 바로 Home Assistant를 구축할 예정입니다. 그렇게 돌려놓다가 기회가 된다면 NAS용 HDD를 하나 사서 [OpenMediaVault](https://www.openmediavault.org/)로 자작NAS를 구축해볼까 합니다.

또, 시간과 실력이 허락해준다면, ODROID-N2+ + HDD + 센서 모듈 등등이 다 들어갈 수 있는 케이스를 설계해서 3D 프린팅을 해보려고 합니다. 이미 ODROID-N2+ 기반 [자작 케이스 설계](https://www.printables.com/model/276932-modern-look-odroid-n2-nas-housing-with-2-hdds)가 업로드된 것이 있어 이걸 기반으로 조물딱조물딱 해보면 괜찮지 않을까 싶네요.


## 아, 맞다!

DC 전원 어댑터를 사야해요! 하드커널에서 추가 구성으로 12V/2A DC 전원 어댑터를 구매할 수 있었지만, 추후 HDD를 연결할 것을 대비해 보다 고용량의 어댑터를 사려고 일부러 같이 구매하지는 않았습니다.

[벽플러그형(벽걸이형) 어댑터](https://smartstore.naver.com/mhtech/products/5665766325)는 12V에선 최대 3.5A가 한계인 것 같습니다. 그 이상은 노트북 어댑터같은 형태인데, 보기 흉하므로(...) 일단 3.5A로 구매하고 써봐야겠네요. 이미 권장 용량인 12V 2A를 상회하는 용량이라 HDD 한 두개 달아도 괜찮을 것 같네요.

여유가 된다면 이후 삽질하는 내용들을 블로그에 올릴게요!
