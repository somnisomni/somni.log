---
title: "ODROID N2+ vs Raspberry Pi 3B: Processor Performance Benchmark"
slug: odroid-n2plus-vs-raspberrypi-3b-processor
date: 2022-11-29T18:00:00.000+09:00
cover:
  image: header.png
  relative: true
draft: false
tags:
  - Benchmark
  - SBC
  - Hardware
---

# ODROID N2+ vs Raspberry Pi 3B benchmark series
- [ODROID N2+ vs Raspberry Pi 3B: **Memory** Performance Benchmark]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-memory" >}})
- [ODROID N2+ vs Raspberry Pi 3B: **Processor** Performance Benchmark]({{< ref "2022-11-29-odroid-n2plus-vs-raspberrypi-3b-processor" >}})

---

# Software and hardware

## Benchmark software and setup
- [Phoronix Test Suite](https://www.phoronix-test-suite.com/) v10.8.4
- Headless mode<sub>(display output unplugged)</sub> and run the benchmark through SSH

## ODROID N2+
- **Overclock**: None (Stock)
- **OS**: Armbian ARM64 - Debian Sid server *(rolling 2022. 11. 6.)*
- **Linux kernel**: 6.0.7-meson64

## Raspberry Pi 3B
- **Overclock**: ARM @ 1.3GHz <sup>(from default 1.2GHz)</sup>, SDRAM @ 500MHz <sup>(from default 450MHz)</sup>
- **OS**: Armbian ARM64 - Ubuntu Kinetic server *(rolling 2022. 11. 6.)*
- **Linux kernel**: 5.19.0-1006-raspi

## PTS system information
{{< figure src="pts-system-info.png" >}}

---

# Benchmark

> [!WARNING] Please note that this is not the benchmark under heavily controlled environment!

## x264 Video Encoding
가장 유명하고 널리 쓰이는 비디오 코덱 중 하나인 x264(H264)를 이용하여 인코딩 속도 *(초당 처리 프레임 수)* 를 측정하는 것으로 성능을 가늠할 수 있습니다.  
미디어 트랜스코딩 서버를 구축하고자 할 때 고려할 수 있는 지표 중 하나가 될 수 있겠죠! **하지만...**

### 4K (2160p)
{{< figure src="pts-x264-4k.png" >}}
<p align="center"><span style="color: red;"><strong>라즈베리파이 3B 측정 불가</strong></span> - 테스트 중 심한 프리징으로 생략</p>

### FHD (1080p)
{{< figure src="pts-x264-1080p.png" >}}
<p align="center"><span style="color: red;"><strong>라즈베리파이 3B 측정 불가</strong></span> - 테스트 중 심한 프리징으로 생략</p>

**라즈베리파이 3B는 이 테스트를 버티지 못하고 심한 프리징에 걸려 뻗어버립니다.** 경우에 따라 커널 패닉까지 나오기도 했습니다. ~~내가 이런 놈을 학대하고 있었다니...~~


## Apache Compile Time
전통적인 웹 서버 프로그램인 [Apache (httpd)](https://httpd.apache.org/)를 컴파일하는데 걸리는 시간을 측정합니다. 당연하겠지만 여기서는 소요 시간이 "낮을수록" 성능이 더 높다고 말할 수 있습니다.

### 소요 시간
{{< figure src="pts-apache-compile-time.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">272.4%</span></strong> 우세</p>


## C-Ray Raytracing
서버/헤드리스 용도로 쓸 건데 레이트레이싱 성능이 왜 필요할까? 싶을 수도 있지만, 레이트레이싱은 **부동소수점 연산**을 상당히 필요로 하기 때문에 벤치마크 도구로서 충분히 활용할 수 있습니다.

C-Ray는 C로 작성된 간단한 레이트레이서로, 주로 순수 부동소수점 연산 능력을 벤치마크하기 위해 사용합니다.

### 소요 시간
{{< figure src="pts-cray-total-time.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">375.7%</span></strong> 우세</p>


## 7-zip
압축률이 높은 압축 프로그램으로 손꼽는 *쎄븐-집* 입니다. 압축 프로그램/알고리즘 벤치마크는 압축을 사용하는 백업을 할 때에 특히 고려하면 좋은 성능 지표입니다.

### Compression Performance
{{< figure src="pts-7zip-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">317.9%</span></strong> 우세</p>

### Decompression Performance
{{< figure src="pts-7zip-decompression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">157.1%</span></strong> 우세</p>


## Parallel BZip2

### Compression Time
{{< figure src="pts-pbzip2-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.2em">1141.9%</span></strong> 우세</p>


## GZip
압축과 압축 해제 각각 테스트는 서로 다른 테스트([compress-gzip](https://openbenchmarking.org/test/pts/compress-gzip), [system-decompress-gzip](https://openbenchmarking.org/test/pts/system-decompress-gzip))입니다.

### Compression Time
{{< figure src="pts-gzip-compression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">190.9%</span></strong> 우세</p>

### Decompression Time
{{< figure src="pts-gzip-decompression.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">143.7%</span></strong> 우세</p>


## FLAC Encoding
FLAC 인코딩에는 Xiph.org 공식 [FLAC 인코더](https://github.com/xiph/flac)를 사용합니다.

### WAV → FLAC Encoding Time
{{< figure src="pts-flac-encoding.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">198%</span></strong> 우세</p>


## MP3 Encoding
MP3 인코딩에는 [LAME 인코더](https://lame.sourceforge.io/)를 사용합니다.

### WAV → MP3 Encoding Time
{{< figure src="pts-mp3-encoding.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">191.6%</span></strong> 우세</p>


## OpenSSL
사실 라즈베리파이 vs 타 SBC 벤치마크에서 가장 볼만한<sup>(?)</sup> 벤치마크는 역시 [OpenSSL](https://www.openssl.org/)입니다. 라즈베리파이의 브로드컴 SoC는 **크립토(암호) 가속 관련 확장이 탑재되어 있지 않아** 이 쪽에서는 상당히 낮은 성능을 보여주기 때문이죠.

### SHA-256 Hashing
{{< figure src="pts-openssl-sha256.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.5em">2289.9%</span></strong> 우세</p>

### RSA-4096 Signing
{{< figure src="pts-openssl-rsa4096-sign.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">200.3%</span></strong> 우세</p>

### RSA-4096 Verification
{{< figure src="pts-openssl-rsa4096-verify.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green">200.6%</span></strong> 우세</p>


## NGINX Request Handling
리눅스 웹 서버 소프트웨어계에서 Apache HTTPd와 양대산맥을 이루고 있는 [NGINX](http://nginx.org/)의 요청 처리량을 측정합니다.

단순히 집에서 SBC를 굴리는거라면 ~~DDoS 공격을 맞고 있는게 아니라면~~ 한 번에 엄청난 요청이 들어오진 않지만, 프로세서가 어디까지 받쳐줄 수 있는지 알 수 있습니다.

### 20 Connections
{{< figure src="pts-nginx-conn-20.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">1582.2%</span></strong> 우세</p>

### 100 Connections
{{< figure src="pts-nginx-conn-100.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">1636.5%</span></strong> 우세</p>

### 1,000 Connections
{{< figure src="pts-nginx-conn-1000.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">2310.4%</span></strong> 우세</p>

### 4,000 Connections
{{< figure src="pts-nginx-conn-4000.png" >}}
<p align="center">ODROID-N2+가 약 <strong><span style="color: green; font-size: 1.25em">2143.2%</span></strong> 우세</p>

라즈베리파이 쪽은 동시 연결 수 100개 → 1,000개에서만 약 40%가 떨어지네요.  
하지만 오드로이드 쪽은 20개 → 4,000개까지 오르는 동안 약 20% 정도 떨어지는 것에 그쳤습니다.


## Total scores
{{< figure src="pts-all-test-score.png" >}}

---

> [!NOTE] Benchmark result data
> Result data of the processor benchmark is uploaded to [OpenBenchmarking.org](https://openbenchmarking.org/)
> > https://openbenchmarking.org/result/2211160-NE-PROCESSOR87
