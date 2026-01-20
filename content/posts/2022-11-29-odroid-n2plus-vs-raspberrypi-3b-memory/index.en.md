---
title: "ODROID N2+ vs Raspberry Pi 3B: Memory Performance Benchmark"
slug: odroid-n2plus-vs-raspberrypi-3b-memory
date: 2022-11-29T18:00:00.000Z
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
- **RAM module and spec** [*(Official spec sheet from Hardkernel)*](https://www.hardkernel.com/shop/odroid-n2-with-4gbyte-ram-2/)
  - <u>DDR4 2640MT/s *(PC4-21333)*</u>
  - 4 [Samsung K4A8G165WC-BCTD](https://semiconductor.samsung.com/kr/dram/ddr/ddr4/k4a8g165wc-bctd/) chips found on my device

## Raspberry Pi 3B
- **Overclock**: ARM @ 1.3GHz <sup>(from default 1.2GHz)</sup>, SDRAM @ 500MHz <sup>(from default 450MHz)</sup>
- **OS**: Ubuntu Server 22.04 Minimal ARM64
- **Linux kernel**: 5.19.0-1006-raspi
- **RAM module and spec** [*(From the engineer of Raspberry Pi)*](https://forums.raspberrypi.com/viewtopic.php?t=245175)
  - <u>LPDDR2</u>
  - 1 [Micron Memory Japan (formerly ELPIDA) B8132B4PB-8D-F](https://datasheetspdf.com/pdf/1202705/MicronTechnology/EDB8132B4PB-8D-F/1) chip found on my device. It's <u>LPDDR2 400MHz *(PC2-6400)*</u> according to the datasheet.

## PTS system information
{{< figure src="pts-system-info.png" >}}

---

<!-- 오드로이드 N2+는 라즈베리파이 3B가 아니라 4B와 비교하는게 맞지만, 제가 당장 가지고 있는 건 RPi 3B 뿐이라서 ~~이 느린 성능으로 얼마나 버텨왔는가 알아보기 위해~~ 심심풀이로 벤치마킹을 진행해보았습니다..! -->

<!-- 원래는 RAMspeed와 더불어 [Stream을 사용한 테스트](https://openbenchmarking.org/test/pts/stream)도 진행하려고 했는데, 라즈베리파이 쪽에서 계속 오류가 발생하여 생략하였습니다. -->

# Benchmark

> [!WARNING] Please note that this is not the benchmark under heavily controlled environment!

## RAMspeed SMP
<!-- CPU 캐시와 메모리의 유효 대역폭을 측정하기 위한 벤치마킹 도구로, 일반 [RAMspeed](http://www.alasir.com/software/ramspeed/)와는 달리 멀티프로세서 환경에서도 지원되는 버전입니다. 꽤 오래된 툴인데, PTS에서는 자주 실행되는 벤치마크 중 하나인 것 같네요. -->

### Integer Add
{{< figure src="pts-ramspeed-integer-add.png" >}}
<p align="center"><strong><span style="color: green">+254.3%</span></strong> on ODROID-N2+</p>

### Integer Copy
{{< figure src="pts-ramspeed-integer-copy.png" >}}
<p align="center"><strong><span style="color: green">+228.3%</span></strong> on ODROID-N2+</p>

### Integer Scale
{{< figure src="pts-ramspeed-integer-scale.png" >}}
<p align="center"><strong><span style="color: green">+226.3%</span></strong> on ODROID-N2+</p>

### Integer Triad
{{< figure src="pts-ramspeed-integer-triad.png" >}}
<p align="center"><strong><span style="color: green">+171.2%</span></strong> on ODROID-N2+</p>

### Integer Average
{{< figure src="pts-ramspeed-integer-average.png" >}}
<p align="center"><strong><span style="color: green">+216.2%</span></strong> on ODROID-N2+</p>

### Floating Point
<p style="color: gray">(I thought I did the benchmark but maybe I lost the result...)</p>

## Total scores
{{< figure src="pts-all-test-score.png" >}}
<p align="center">Arithmetic average for each SBC's score: <strong><span style="color: red">2180.6</span></strong> vs <strong><span style="color: green">6983.2</span></strong><br/>
ODROID-N2+ wins for <strong><span style="color: green">216.2%</span></strong> in average</p>

---

> [!NOTE] Benchmark result data
> Result data of the memory benchmark is uploaded to [OpenBenchmarking.org](https://openbenchmarking.org/)
> > https://openbenchmarking.org/result/2211140-NE-MEMORYRPI39
