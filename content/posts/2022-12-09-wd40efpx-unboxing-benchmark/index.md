---
title: WD Red Plus 4TB WD40EFPX 언박싱 & 벤치마크 (vs WD40EFZX)
slug: wd40efpx-unboxing-benchmark
date: 2022-12-09T17:40:00.000Z
cover:
  image: wd40efpx-pc-connect.png
  relative: true
draft: false
tags:
  - 하드웨어
  - 벤치마크
aliases:
  - /wd40efpx-unboxing-benchmark
---

> [!NOTE] 이 글은 Western Digital 또는 홍보 업체 등으로부터 어떠한 스폰서도 받지 않은 **내돈내산 리뷰**입니다. ~~저도 돈 받고 글 써보고 싶네요~~

이번 글에서도 하드웨어와 관련된 내용을 적어봅니다! 전 분명 코드 짜는 놈일텐데 왜 하드웨어 관련 글이 많은 느낌일까요? 뭐, 좋은게 좋은거겠죠.

전에 블랙 프라이데이 기간에 [11번가 아마존](https://www.11st.co.kr/amazon/main?gsreferrer=BBK5197)에서 [오드로이드 N2+]({{< ref "2022-11-12-unboxing-odroid-n2plus" >}})에 NAS용으로 붙여주기 위해 구입했던 [WD40EFPX](https://www.westerndigital.com/ko-kr/products/internal-drives/wd-red-plus-sata-3-5-hdd#WD40EFPX)가 며칠 전에 도착해서, 언박싱을 하고 이미 제 PC에서 사용하고 있는 형제모델인 [WD40EFZX](https://www.westerndigital.com/ko-kr/products/internal-drives/wd-red-plus-sata-3-5-hdd#WD40EFZX)와의 벤치마크도 진행해봤습니다.

---

## DIFFERENCES?

간단하게 말하자면, WD40EFZX와 WD40EFPX는 같은 <u>WD Red Plus 4TB</u> 라인업이지만 크게는 **캐시 크기**가 다른 형제 모델입니다.

WD Red Plus 4TB라고 하면 주로 WD40EFZX<sub>(캐시 128MB)</sub>가 잘 알려져 있는데, WD40EFPX<sub>(캐시 256MB)</sub>는 더 많은 캐시에 비해 이상하리만치 리뷰나 관련 정보가 적어서 호기심이 생겨 구매해봤어요.

모델넘버가 비슷한 걸로는 WD40EFRX와 WD40EFAX가 있는데, 총정리를 하자면...

| 모델명 | **WD40EFPX** | **WD40EFZX** | WD40EFRX | WD40EFAX |
|---|---|---|---|---|
| 라인업 | **Red Plus** | **Red Plus** | Red Plus (이전 세대, 단종) | Red |
| 기록 방식 | **CMR** | **CMR** | **CMR** | SMR |
| 인터페이스 | SATA3 | SATA3 | SATA3 | SATA3 |
| 회전 속도 (RPM) | 5400 | 5400 | 5400 | 5400 |
| 캐시 크기 | **256MB** | 128MB | 64MB | **256MB** |
| 플래터 / 헤드 수[^1] | 2 / 4 | 3 / 5 | 4 / 8 | 2 / 4 |
[^1]: 플래터와 헤드 수 정보는 [이 글](https://rml527.blogspot.com/2010/10/hdd-platter-database-western-digital-35_9883.html)을 참고했습니다.

WD40EFRX는 단종되었으니 제외, WD40EFAX는 기록 방식이 SMR이니 제외하면 가장 쓸만한 놈들은 WD40EFPX와 WD40EFZX로 추려지죠!

둘의 차이는 캐시 크기와 플래터/헤드 수 정도라 둘의 가격이 몇 천원 정도밖에 차이나지 않는다면 이왕이면 캐시 크기가 2배인 WD40EFPX를 고르는 것이 좋아보여요!

물론 대중의 트렌드에 따라(?) 유명 모델인 WD40EFZX를 고르는 것 또한 매우 좋은 선택입니다. 둘 다 제값하는 놈들이에요🤤


## UNBOXING

{{< figure src="hdd-amazon-packaging.png" caption="아마존 프라임 포장 봉투" >}}

11월 24일 주문, 12월 2일 배송 시작<sub>(아마존 물류센터 입고)</sub>, 12월 7일 도착으로 총 13일에 걸쳐 도착했습니다. 비주류 모델이라 그런가 주문하고 나서 배송 시작까지 좀 오래걸렸네요.

언제 봐도 ~~(긍정적으로든 부정적으로든)~~ 가슴을 콩닥콩닥하게 만드는 아마존 프라임 포장 봉투에 담겨져 왔습니다. 왠지 각져있는 내용물이 볼록하게 보이는 것이 박스로 왔다는 기대를 주네요. 

{{< figure src="hdd-amazon-box.png" caption="포장 봉투 안에 들어있는 포장 박스" >}}

포장 봉투 안에 있는 판도라의 상자, 슈뢰딩거의 고양이 상자를 꺼내줍시다.

이 상자를 열기 전에는 안에 있는 둔탁한 벽ㄷ... 아니 하드디스크가 살아있는지 죽어있는지 알 수 없죠. 대신 꽤 센스있게(?) 꽂혀져 있는 아마존 구매 영수증이 있네요.

RMA A/S를 진행할 때 저 구매 영수증이 필요할 수 있지만, 저는 상남자이므로 갈기갈기 찢어 버렸습니다. **A/S를 진행할 여지를 남기고자 한다면 저 영수증을 일단 버리지 마세요.** 사실 저는 상남자라기보다는 그냥 바보입니다(...)

{{< figure src="hdd-amazon-box-cutting.png" caption="판도라의 상자 봉인 테이프 컷-팅" >}}

박스를 봉인한 테이프를 어떻게 떼야 잘 뗐다고 소문이 날까요? 테이프의 끄트머리를 잡아당겨 뗄 수도 있지만, 그건 상남자가 테이프를 뜯는 방식이 아닙니다. 역시 상남자면 힘으로 열어제껴야죠! 그런가요?

... 아니죠. 진정한 상남자는 조용히 집 구석 어디엔가 굴러다니는 가위를 가져와 골을 따라 테이프를 가로질러 잘라줘야죠.

<p style="color: gray"><i>참고로, 테이프에 손을 대는 순간 박스 안의 내용물은 양자역학적으로 생사가 결정되어버리기 때문에 한 번 기도를 한 후에 가위를 갖다대줍시다🧪🧫</i></p>

{{< figure src="hdd-amazon-box-inside.png" caption="판도라의 상자 봉인 테이프 컷-팅" >}}

양자역학적으로 생사가 결정된 박스 안의 내용물은 플라스틱으로 완충을 해주는 식으로 포장되어 있네요. 아마존 포장이 이 정도면 정말 양질의 포장이죠. 박스 밖을 뽁뽁이로 한 두 번 감싸주면 더 좋았겠지만...

[WD40EFZX](http://www.11st.co.kr/products/3585014653/share?gsreferrer=BBK5197)도 똑같이 11번가 아마존에서 샀었는데, 그 때도 이런 식으로 박스+플라스틱 완충 포장으로 "비교적" 안전하게 왔지만 [박스도 없이 쌩짜 비닐(+뽁뽁이)만으로도 오는 등 케이스 바이 케이스](https://quasarzone.com/bbs/qf_storage/views/229830)라는 것 같습니다... 저는 두 번 모두 운이 좋았네요😖


## THE HARD DRIVE

{{< figure src="wd40efpx-in-box.png" caption="글로시한 속살의 WD40EFPX 본체" >}}

이 글의 주인공 **WD Red Plus 4TB WD40EFPX**이 매우 편안해보이는 자태로 주인을 반겨줍니다! 찍힌 곳도 없고 매우 깨끗하네요😊 2022년 10월 11일 제조품으로 글 작성 시점에선 꽤 따끈따끈하네요.

{{< figure src="wd40efpx-pc-connect.png" caption="WD40EFPX를 PC에 임시로 연결한 모습" >}}

이 뉴페이스 친구의 상태와 성능을 확인하기 위해 PC에 임시로 연결합시다. 대충 아무데나 올려놓고 SATA 데이터/전원 케이블을 연결하면 끝이죠.

{{< figure src="wd40efpx-disk-init.png" caption="WD40EFPX 연결 및 디스크 초기화 후 스크린샷 (디스크 0은 기존 사용 중인 WD40EFZX)" >}}
{{< figure src="wd40efpx-crystaldiskinfo.png" caption="WD40EFPX의 CrystalDiskInfo 화면" >}}

Windows에서 문제 없이 인식되었고, CrystalDiskInfo로 디스크 정보를 확인해보면 매우 신품이라는 것을 알 수 있습니다.

배드섹터 검사를 돌려보면 좋겠지만 그런거 귀찮으니 생략했습니다(...) 문제 생기면 뭐 어쩔 수 없지만 문제 없이 계속 잘 쓰고 있던 WD40EFZX와 똑같이 비교적 안전하게 포장되어 배송되었으니 믿어보는거죠!

<p style="color: gray">새 블로그 시스템으로 글을 마이그레이션한 2026-01-21 현재도 이상 없이 잘 굴러지고 있습니다.</p>


## BENCHMARKING

마침 이미 WD40EFZX를 절찬리에 쓰고 있었으니, 비교 벤치마킹을 해볼 가치가 매우 높겠네요! 물론 그 친구는 산지도 좀 됐고 용량도 조금 사용하고 있어서 정확한 성능이 측정되진 않을 수는 있겠지만, 참고 용도로 벤치마킹을 해볼 수는 있겠죠😇😇

> [!WARNING] 벤치마크는 엄격히 통제된 환경 하에서 진행된 것이 아닙니다. 기존 저장 공간 사용량 이외에도 여러 요인으로 인해 벤치마크 결과가 부정확할 수 있으니 참고해주세요!

{{< details summary="벤치마크 시스템 사양" >}}
- **CPU** : AMD Ryzen 9 5900X
- **M/B** : ASUS PRIME X570-PRO/CSM
- **RAM** : Corsair Vengeance PRO SL 4x8GB *(DDR4 3600MHz XMP)*
- **대상 HDD #1** : Western Digital Red Plus 4TB WD40EFPX
- **대상 HDD #2** : Western Digital Red Plus 4TB WD40EFZX  
  저장 공간을 약간(약 6%) 사용한 상태
{{< /details >}}

### CrystalDiskMark
{{< figure src="benchmark-crystaldiskmark-wd40efpx.png" caption="CrystalDiskMark - WD40EFPX 벤치마크 결과" >}}
{{< figure src="benchmark-crystaldiskmark-wd40efzx.png" caption="CrystalDiskMark - WD40EFZX 벤치마크 결과" >}}

캐시 크기의 영향이 큰 건지 **WD40EFPX의 랜덤 4K 읽기 속도가 약 3배 높습니다.** 랜덤 4K 읽기 지연 시간도 눈에 띄게 차이가 나네요. 실성능에 가장 체감이 되는 성능 지표가 4K 성능인데, 이 정도면 꽤 의미있는 차이입니다. 물론 SSD에 비할 바는 아니지만요.

그 외에도 순차 읽기/쓰기 성능과 랜덤 4K 쓰기 성능 모두 WD40EFZX보다 약간 높은 모습이네요. 다시 한 번 리마인드를 드리자면, <u>WD40EFZX는 이미 사용 중이던 하드디스크이기 때문에 벤치마크 결과의 신뢰도를 보장해드리기 어렵습니다.</u>

### ATTO Disk Benchmark
{{< figure src="benchmark-atto-wd40efpx.png" caption="ATTO Disk Benchmark - WD40EFPX 벤치마크 결과" >}}
{{< figure src="benchmark-atto-wd40efzx.png" caption="ATTO Disk Benchmark - WD40EFZX 벤치마크 결과" >}}

ATTO Disk Benchmark에서는 약간 갈리는 결과가 나왔습니다.

512B ~ 4KB에서 WD40EFPX가 눈에 띄게 뒤처지는 모습이 보이지만, 그 이상에서는 쓰기 속도가 대부분 200MB/s 정도는 넘는 모습입니다.

WD40EFZX에서는 쓰기 속도가 정확히 200MB/s가 나온 구간 딱 한 번 빼고는 200MB/s 넘게 나온 구간이 없습니다.

읽기 속도는 오히려 WD40EFZX 쪽이 평균적으로 더 높게 나오는 모습입니다. 거시적(?)으로는 수치의 차이가 그렇게 큰 건 아니지만, 의외라면 의외라고 말할 수 있겠네요.

### Windows 탐색기 파일 복사
{{< figure src="benchmark-filecopy.png" caption="WD40EFZX → WD40EFPX 파일 복사" >}}

WD40EFZX → WD40EFPX 파일 복사에서는 큰 파일 복사<sub>(순차 쓰기)</sub>에서 최대 204MB/s 정도로 잘 유지되는 모습을 확인할 수 있었습니다.

### 벤치마크 그 후...
{{< figure src="wd40efpx-wd40efzx.png" caption="WD40EFPX와 PC에서 꺼낸 WD40EFZX 투샷" >}}

**(ATTO 벤치마크는 좀 갈리지만) 성능이 더 좋고 신품인 놈을 오드로이드 NAS에 물려주기엔 너무 아깝습니다.**

그렇잖아요! 어차피 오드로이드 N2+에 물리면 네이티브 SATA도 아니고 USB to SATA를 쓸텐데 굳이 성능이 더 좋은 친구를 물려줄 필요가 없다구요! 그래서 WD40EFPX를 PC에서, WD40EFZX를 NAS용으로 쓰기로 하고 교체하였습니다🤣🤣

이제 NAS 용도로 쓸 HDD도 있겠다, 오드로이드를 세팅하면서 블로그 글을 써야 할텐데 귀차니즘은 어디 안 가는 법이죠😭😭😭 백수이면서 이것도 하고 저것도 하고 이상하게 할 게 참 많아요... ㅋㅋ 손과 발과 몸뚱이가 마음대로 움직여주지 않을 뿐...
