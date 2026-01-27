---
title: "오드로이드 N2+ vs 라즈베리파이 3B: 메모리 성능 벤치마크"
slug: odroid-n2plus-vs-raspberrypi-3b-memory
date: 2022-11-29T18:00:00.000+09:00
cover:
  image: header.png
  relative: true
draft: false
tags:
  - 벤치마크
  - SBC
  - 하드웨어
aliases:
  - /odroid-n2plus-vs-raspberrypi-3b-memory
---

# 오드로이드 N2+ vs 라즈베리파이 3B 벤치마크 씨리-즈
- [오드로이드 N2+ vs 라즈베리파이 3B: **메모리** 성능 벤치마크]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-memory" >}})
- [오드로이드 N2+ vs 라즈베리파이 3B: **프로세서** 성능 벤치마크]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-processor" >}})

---

# 벤치마크 SW/HW 환경

## 벤치마크 툴 / 공통 사항
- [Phoronix Test Suite](https://www.phoronix-test-suite.com/) v10.8.4
- 두 SBC 모두 헤드리스 모드<sub>(디스플레이 출력 단자 분리)</sub> 상태에서 SSH로 접속하여 벤치마크 진행

## 오드로이드 N2+
- **오버클럭**: 없음 (순정 기본값)
- **OS**: Armbian ARM64 - Debian Sid server *(rolling 2022. 11. 6.)*
- **리눅스 커널**: 6.0.7-meson64
- **RAM 모듈 및 규격** [*(하드커널 공식 스펙 시트 참조)*](https://www.hardkernel.com/ko/shop/odroid-n2-with-4gbyte-ram-2/)
  - <u>DDR4 2640MT/s *(PC4-21333급)*</u>
  - 제가 보유한 제품에선 [삼성 K4A8G165WC-BCTD](https://semiconductor.samsung.com/kr/dram/ddr/ddr4/k4a8g165wc-bctd/) 칩이 4개 달려있습니다.

## 라즈베리파이 3B
- **오버클럭**: ARM @ 1.3GHz <sup>(기본값 1.2GHz)</sup>, SDRAM @ 500MHz <sup>(기본값 450MHz)</sup>
- **OS**: Ubuntu Server 22.04 Minimal ARM64
- **리눅스 커널**: 5.19.0-1006-raspi
- **RAM 모듈 및 규격** [*(라즈베리파이 엔지니어 언급 참조)*](https://forums.raspberrypi.com/viewtopic.php?t=245175)
  - <u>LPDDR2</u>
  - 제가 보유한 제품에선 [엘피다 (현 마이크론 메모리 재팬) B8132B4PB-8D-F](https://datasheetspdf.com/pdf/1202705/MicronTechnology/EDB8132B4PB-8D-F/1) 칩이 1개 달려있습니다. 데이터시트 상으로는 <u>LPDDR2 400MHz *(PC2-6400급)*</u>입니다.

## PTS 시스템 정보
{{< figure src="pts-system-info.png" >}}

---

오드로이드 N2+는 라즈베리파이 3B가 아니라 4B와 비교하는게 맞지만, 제가 당장 가지고 있는 건 RPi 3B 뿐이라서 ~~이 느린 성능으로 얼마나 버텨왔는가 알아보기 위해~~ 심심풀이로 벤치마킹을 진행해보았습니다..!

원래는 RAMspeed와 더불어 [Stream을 사용한 테스트](https://openbenchmarking.org/test/pts/stream)도 진행하려고 했는데, 라즈베리파이 쪽에서 계속 오류가 발생하여 생략하였습니다.

# 벤치마크

> [!WARNING] 제가 진행한 벤치마크는 엄격히 통제된 환경 하에서 진행된 것이 아닙니다. 이를 참고해주세요!

## RAMspeed SMP
CPU 캐시와 메모리의 유효 대역폭을 측정하기 위한 벤치마킹 도구로, 일반 [RAMspeed](http://www.alasir.com/software/ramspeed/)와는 달리 멀티프로세서 환경에서도 지원되는 버전입니다. 꽤 오래된 툴인데, PTS에서는 자주 실행되는 벤치마크 중 하나인 것 같네요.

### Integer Add
{{< figure src="pts-ramspeed-integer-add.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">254.3%</span></strong> 우세</p>

### Integer Copy
{{< figure src="pts-ramspeed-integer-copy.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">228.3%</span></strong> 우세</p>

### Integer Scale
{{< figure src="pts-ramspeed-integer-scale.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">226.3%</span></strong> 우세</p>

### Integer Triad
{{< figure src="pts-ramspeed-integer-triad.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">171.2%</span></strong> 우세</p>

### Integer Average
{{< figure src="pts-ramspeed-integer-average.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">216.2%</span></strong> 우세</p>

### Floating Point
<p style="color: gray">(테스트를 진행한 듯 하나 결과가 유실되었습니다...)</p>

## 전체 벤치마크 점수 표
{{< figure src="pts-all-test-score.png" >}}
<p align="center">각 SBC 테스트 수치의 산술 평균: <strong><span style="color: red">2180.6</span></strong> vs <strong><span style="color: green">6983.2</span></strong><br/>
ODROID-N2+가 평균 약 <strong><span style="color: green">216.2%</span></strong> 우세</p>

---

> [!NOTE] 벤치마크 데이터
> 메모리 벤치마크 데이터는 Phoronix에서 운영하는 [OpenBenchmarking.org](https://openbenchmarking.org/)에 업로드되어 있습니다.
> > https://openbenchmarking.org/result/2211140-NE-MEMORYRPI39
