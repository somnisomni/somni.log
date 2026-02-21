---
title: "오드로이드 N2+ vs 라즈베리파이 3B: 프로세서 성능 벤치마크"
slug: odroid-n2plus-vs-raspberrypi-3b-processor
date: 2022-11-29T18:00:00.000+09:00
lastmod: 2026-02-21T08:25:18.396Z
cover:
  image: header.png
  relative: true
draft: false
tags:
  - 벤치마크
  - SBC
  - 하드웨어
aliases:
  - /odroid-n2plus-vs-raspberrypi-3b-processor
---

## 오드로이드 N2+ vs 라즈베리파이 3B 벤치마크 씨리-즈
- [오드로이드 N2+ vs 라즈베리파이 3B: **메모리** 성능 벤치마크]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-memory" >}})
- [오드로이드 N2+ vs 라즈베리파이 3B: **프로세서** 성능 벤치마크]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-processor" >}})

---

## 벤치마크 SW/HW 환경

### 벤치마크 툴 / 공통 사항
- [Phoronix Test Suite](https://www.phoronix-test-suite.com/) v10.8.4
- 두 SBC 모두 헤드리스 모드<sub>(디스플레이 출력 단자 분리)</sub> 상태에서 SSH로 접속하여 벤치마크 진행

### 오드로이드 N2+
- **오버클럭**: 없음 (순정 기본값)
- **OS**: Armbian ARM64 - Debian Sid server *(rolling 2022. 11. 6.)*
- **리눅스 커널**: 6.0.7-meson64

### 라즈베리파이 3B
- **오버클럭**: ARM @ 1.3GHz <sup>(기본값 1.2GHz)</sup>, SDRAM @ 500MHz <sup>(기본값 450MHz)</sup>
- **OS**: Armbian ARM64 - Ubuntu Kinetic server *(rolling 2022. 11. 6.)*
- **리눅스 커널**: 5.19.0-1006-raspi

### PTS 시스템 정보
{{< figure src="pts-system-info.png" >}}

---

## 벤치마크

> [!WARNING] 제가 진행한 벤치마크는 엄격히 통제된 환경 하에서 진행된 것이 아닙니다. 이를 참고해주세요!

### x264 비디오 인코딩
가장 유명하고 널리 쓰이는 비디오 코덱 중 하나인 x264(H264)를 이용하여 인코딩 속도 *(초당 처리 프레임 수)* 를 측정하는 것으로 성능을 가늠할 수 있습니다.  
미디어 트랜스코딩 서버를 구축하고자 할 때 고려할 수 있는 지표 중 하나가 될 수 있겠죠! **하지만...**

#### 4K (2160p)
{{< figure src="pts-x264-4k.png" >}}
<p align="center"><span style="color: red;"><strong>라즈베리파이 3B 측정 불가</strong></span> - 테스트 중 심한 프리징으로 생략</p>

#### FHD (1080p)
{{< figure src="pts-x264-1080p.png" >}}
<p align="center"><span style="color: red;"><strong>라즈베리파이 3B 측정 불가</strong></span> - 테스트 중 심한 프리징으로 생략</p>

**라즈베리파이 3B는 이 테스트를 버티지 못하고 심한 프리징에 걸려 뻗어버립니다.** 경우에 따라 커널 패닉까지 나오기도 했습니다. ~~내가 이런 놈을 학대하고 있었다니...~~


### Apache 컴파일 시간
전통적인 웹 서버 프로그램인 [Apache (httpd)](https://httpd.apache.org/)를 컴파일하는데 걸리는 시간을 측정합니다. 당연하겠지만 여기서는 소요 시간이 "낮을수록" 성능이 더 높다고 말할 수 있습니다.

#### 소요 시간
{{< figure src="pts-apache-compile-time.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">272.4%</span></strong> 우세</p>


### C-Ray 레이트레이싱
서버/헤드리스 용도로 쓸 건데 레이트레이싱 성능이 왜 필요할까? 싶을 수도 있지만, 레이트레이싱은 **부동소수점 연산**을 상당히 필요로 하기 때문에 벤치마크 도구로서 충분히 활용할 수 있습니다.

C-Ray는 C로 작성된 간단한 레이트레이서로, 주로 순수 부동소수점 연산 능력을 벤치마크하기 위해 사용합니다.

#### 소요 시간
{{< figure src="pts-cray-total-time.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">375.7%</span></strong> 우세</p>


### 7-zip
압축률이 높은 압축 프로그램으로 손꼽는 *쎄븐-집* 입니다. 압축 프로그램/알고리즘 벤치마크는 압축을 사용하는 백업을 할 때에 특히 고려하면 좋은 성능 지표입니다.

#### 압축 성능
{{< figure src="pts-7zip-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">317.9%</span></strong> 우세</p>

#### 압축 해제 성능
{{< figure src="pts-7zip-decompression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">157.1%</span></strong> 우세</p>


### 병렬 BZip2

#### 압축 소요 시간
{{< figure src="pts-pbzip2-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.2em">1141.9%</span></strong> 우세</p>


### GZip
압축과 압축 해제 각각 테스트는 서로 다른 테스트([compress-gzip](https://openbenchmarking.org/test/pts/compress-gzip), [system-decompress-gzip](https://openbenchmarking.org/test/pts/system-decompress-gzip))입니다.

#### 압축 소요 시간
{{< figure src="pts-gzip-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">190.9%</span></strong> 우세</p>

#### 압축 해제 소요 시간
{{< figure src="pts-gzip-decompression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">143.7%</span></strong> 우세</p>


### FLAC 인코딩
FLAC 인코딩에는 Xiph.org 공식 [FLAC 인코더](https://github.com/xiph/flac)를 사용합니다.

#### WAV → FLAC 인코딩 소요 시간
{{< figure src="pts-flac-encoding.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">198%</span></strong> 우세</p>


### MP3 인코딩
MP3 인코딩에는 [LAME 인코더](https://lame.sourceforge.io/)를 사용합니다.

#### WAV → MP3 인코딩 소요 시간
{{< figure src="pts-mp3-encoding.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">191.6%</span></strong> 우세</p>


### OpenSSL
사실 라즈베리파이 vs 타 SBC 벤치마크에서 가장 볼만한<sup>(?)</sup> 벤치마크는 역시 [OpenSSL](https://www.openssl.org/)입니다. 라즈베리파이의 브로드컴 SoC는 **크립토(암호) 가속 관련 확장이 탑재되어 있지 않아** 이 쪽에서는 상당히 낮은 성능을 보여주기 때문이죠.

#### SHA-256 해싱
{{< figure src="pts-openssl-sha256.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.5em">2289.9%</span></strong> 우세</p>

#### RSA-4096 사이닝
{{< figure src="pts-openssl-rsa4096-sign.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">200.3%</span></strong> 우세</p>

#### RSA-4096 검증
{{< figure src="pts-openssl-rsa4096-verify.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">200.6%</span></strong> 우세</p>


### NGINX 요청 처리
리눅스 웹 서버 소프트웨어계에서 Apache HTTPd와 양대산맥을 이루고 있는 [NGINX](http://nginx.org/)의 요청 처리량을 측정합니다.

단순히 집에서 SBC를 굴리는거라면 ~~DDoS 공격을 맞고 있는게 아니라면~~ 한 번에 엄청난 요청이 들어오진 않지만, 프로세서가 어디까지 받쳐줄 수 있는지 알 수 있습니다.

#### 동시 연결 20개
{{< figure src="pts-nginx-conn-20.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">1582.2%</span></strong> 우세</p>

#### 동시 연결 100개
{{< figure src="pts-nginx-conn-100.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">1636.5%</span></strong> 우세</p>

#### 동시 연결 1,000개
{{< figure src="pts-nginx-conn-1000.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">2310.4%</span></strong> 우세</p>

#### 동시 연결 4,000개
{{< figure src="pts-nginx-conn-4000.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">2143.2%</span></strong> 우세</p>

라즈베리파이 쪽은 동시 연결 수 100개 → 1,000개에서만 약 40%가 떨어지네요.  
하지만 오드로이드 쪽은 20개 → 4,000개까지 오르는 동안 약 20% 정도 떨어지는 것에 그쳤습니다.


### 전체 벤치마크 점수 표
{{< figure src="pts-all-test-score.png" >}}

---

> [!NOTE] 벤치마크 데이터
> 프로세서 벤치마크 데이터는 Phoronix에서 운영하는 [OpenBenchmarking.org](https://openbenchmarking.org/)에 업로드되어 있습니다.
> > https://openbenchmarking.org/result/2211160-NE-PROCESSOR87
