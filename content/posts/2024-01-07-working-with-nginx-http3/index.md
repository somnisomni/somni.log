---
title: NGINX + HTTP/3 삽질 기록
slug: working-with-nginx-http3
date: 2024-01-07T00:48:00.000Z
cover:
  image: header.png
  relative: true
draft: false
tags:
  - 웹 개발
  - 리눅스
aliases:
  - /working-with-nginx-http3
---

> [!CONCLUSION] TL;DR
> - **방화벽!!! 방화벽!!!!! 방화벽!!!!!!!!** `443/udp`  
>   <u>HTTP/3는 UDP를 기반으로 하는 QUIC 프로토콜을 사용</u>하므로, 이전 HTTP 버전들은 TCP 프로토콜만 허용해주어도 됐지만 HTTP/3는 방화벽에서 UDP까지 허용해주어야 함!!
> - 여러 브라우저 및 HTTP/3 테스트 사이트에서 테스트해보기.
> - 브라우저 구현에 따라 HTTP/3 연결이 가능함에도 HTTP/2나 HTTP/1.1 연결을 고수하는 경우가 있는 듯...
>   브라우저 탭을 닫았다 열어보거나 캐시를 지워보거나 시크릿 모드에서 사이트를 접속해 HTTP/3로 연결이 되는지 확인해 볼 필요도 있음.

---

약간 쓸데 없는 일이라고 보일 수 있지만 (저도 그렇게 생각함...!) 저는 제가 운영하는 서버들을 돌리는 데에 쓰는 웹 서버인 NGINX를 직접 빌드하여 사용했습니다.

> https://github.com/somnisomni/somnium

최적 설정이나 유용한 스니펫을 아예 패키지 내에 포함시키고, [ngx_brotli](https://github.com/google/ngx_brotli)와 같은 모듈 몇 개 추가하는 정도에 그치는 정도이지만 그럭저럭 잘 빌드하며 사용하고 있죠.

NGINX는 이전부터 별도 브랜치(nginx-quic)로 QUIC 프로토콜 지원을 개발하다가, <u>버전 1.25.0부터 실험적인 HTTP/3 모듈을 추가하여 지원하기 시작</u>했습니다. 이 글에서는 최신 트렌드를 따라 NGINX에서 HTTP/3를 활성화하려고 삽질한 것들에 대한 기록을 적어보려고 합니다. ~~저는 트민남이니까요~~

{{< figure src="before-http3.png" caption="나에게 HTTP/3를 달라!!!!!!" >}}

---

> [!NOTE] 이하 내용은 HTTP/3를 위한 NGINX 설정 파일 수정은 완료한 상태라고 가정하고 작성하였습니다. *(TLSv1.3 활성화, `listen 443 quic` 등...)*

## `Alt-Svc` 헤더 설정

HTTP/3는 기존의 TCP를 기반하지 않고 UDP에 기반하는 QUIC 프로토콜을 사용하기 때문에, 브라우저에서 사이트 접속 시 바로 HTTP/3로 연결하지는 않습니다. <span style="color: gray">(적어도 이 글을 작성하는 시점까지는요.)</span>

그래서 HTTP/1.1이나 HTTP/2로 우선 연결한 후 HTTP/3로 전환하는데, 이 때 서버 측에서 HTTP/3 연결을 지원하는지의 여부로 브라우저가 [`Alt-Svc`라는 HTTP 헤더](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Alt-Svc)를 확인합니다.

NGINX 설정 파일에서 HTTP/3를 위한 `Alt-Svc` 헤더는 다음과 같이 추가하면 됩니다.

```nginx{linenos=false}
server {
  listen 443 quic reuseport;  # HTTP/3
  listen 443 ssl;             # HTTP/2
  
  # HTTP/3 Alt-Svc
  add_header Alt-Svc 'h3=":$server_port"; ma=86400';
  
  # ...
}

# 그 외 VHost 설정들...
```

`add_header` 구문을 `server` 블럭이나 `location` 블럭에 추가하면 됩니다. 경로 별로 HTTP/3 접속 여부를 달리해야 할 이유가 있지 않는 이상 `server` 블럭에 추가하는 것이 깔끔하겠네요. 이렇게 추가하면 대부분의 브라우저에서는 **"서버가 HTTP/3 연결을 지원하긴 하는구나!"** 하고 인식하게 됩니다.

일부 브라우저 또는 테스트 사이트 *([Domsignal HTTP/3 Test](https://domsignal.com/http3-test) 라던가...)* 에서는 HTTP/3 draft 버전까지 지정해줘야 HTTP/3 연결을 진행하는데, 그러기 위해선 다음 헤더값으로 확장할 수 있습니다.

```nginx{linenos=false}
add_header Alt-Svc 'h3=":$server_port"; ma=86400, h3-29=":$server_port"; ma=86400, h3-32=":$server_port"; ma=86400, h3-34=":$server_port"; ma=86400';
```

위 헤더로 서버가 HTTP/3 표준 스펙(RFC 9114)은 물론, draft 버전 29, 32, 34를 지원한다고 브라우저에 말해줄 수 있습니다. 이미 표준화가 되어버린지라 **draft는 버전 34가 최고 버전**입니다.

{{< figure src="http3-test-domsignal.png" caption="모든 삽질을 완료한 후 Domsignal HTTP/3 Test에서 HTTP/3 연결을 테스트한 스크린샷" >}}
{{< figure src="http3-test-litespeed.png" caption="모든 삽질을 완료한 후 LiteSpeed HTTP/3 Check에서 HTTP/3 연결을 테스트한 스크린샷" >}}

사실 `h3`를 사용하는 것이 표준이 될 것이기 때문에, 근미래에는 draft 버전별로 지정해주는 의미가 사라질 거에요.


## OpenSSL 대신 BoringSSL 사용

> [!NOTE] 
> 글 마이그레이션 시점 *(2026-01-26)*, OpenSSL 버전 3.5.1 이상에서 Early Data(0-RTT)를 포함한 QUIC가 공식 지원됩니다.
> > https://nginx.org/en/docs/quic.html
>
> 아래 내용은 아카이빙 목적으로 남겨두니 참고 바랍니다!

이 글을 작성한 시점에서의 [OpenSSL은 아직 QUIC을 직접적으로 지원하지 않습니다.](https://www.nginx.com/blog/quic-http3-support-openssl-nginx/) 대신 NGINX에서는 OpenSSL Compatibility Layer를 두어 QUIC 메시지를 TLS 메시지로 변환하는 등의 처리를 통해 간접적으로 HTTP/3를 지원하고 있죠.  
단, OpenSSL을 그대로 사용할 수 있는 대신, OpenSSL Compatibility Layer를 통해서는 0-RTT가 지원되지 않습니다.

BoringSSL은 0-RTT는 지원되는 대신, [하이브리드 SSL 인증서](https://scotthelme.co.uk/hybrid-rsa-and-ecdsa-certificates-with-nginx/)를 지원하지 않고 오직 1개의 SSL 인증서만 지원합니다. 또, [OCSP Stapling](https://en.wikipedia.org/wiki/OCSP_stapling) 기능도 지원하지 않는다는 단점이 있죠. 기존의 OCSP Must-Staple을 적용한 인증서를 사용하고 있는 상태에서 BoringSSL을 사용하게 되면 일부 브라우저(파이어폭스 등)에서 사이트에 접속조차 되지 않습니다.

저는 OpenSSL로는 도저히 HTTP/3로 연결이 되지 않아 보였기 때문에 BoringSSL을 사용해보자는 모험<sub>(?)</sub>을 시작했습니다. **사실 OpenSSL이나 NGINX에는 문제가 없었을 거고, 다음 섹션에서 다루는 내용으로 인해 HTTP/3로 연결이 안 됐을거에요.**

당연하다면 당연하겠지만, OpenSSL 소스를 그대로 BoringSSL로 대체해서는 NGINX가 빌드되지 않습니다. 소스 구조가 많이 달라졌기 때문인데, 저는 이 문제를 직접 NGINX Makefile을 수정해가며(...) 빌드가 되도록 수정했습니다. ~~굳이 이렇게까지 삽질하진 말아요...😂~~

> https://github.com/somnisomni/somnium/commit/39920c6c2edd0df0734e498cddd2d588b28d48e7

뭐... 어쨌든 성공적으로 BoringSSL을 사용하여 빌드가 되었습니다.

{{< figure src="nginx-with-boringssl-compiled.png" caption="BoringSSL을 사용해 NGINX 빌드한 후 nginx -V 커맨드를 실행한 스크린샷" >}}

이제 HTTP/3로 연결을 해볼까요?! 우선 cURL을 사용해 연결이 되는지 확인해 보았습니다.

```console{linenos=false}
$ podman run --rm docker.io/justdanz/curl-http3 curl -IL -X GET --http3 'https://myserver.com'
...
curl: (55) Failed to connect to myserver.com port 443 after 102 ms: Couldn't connect to server
```

서버에 연결할 수 없다고 하네요! **신난다!!!** 그 이유는 무엇일까요...? 그것은 바로.....


## 방화벽! 방화벽! 방화벽!!!

🧐 방화벽... 열어주셨나요?  
😩 방화벽 뚫려있으니깐 이미 기존 HTTP 서버가 돌아가고 접속도 가능한거겠죠...  
🧐 ... HTTP/3는 무슨 프로토콜 위에서 돌아간다고 했죠?  
😩 ... 아.

기존에 방화벽을 TCP 443 포트만 허용해 두셨다면, HTTP/3 (QUIC)를 위해 **UDP 443 포트도 허용**해주셔야 합니다. *항상 이런 기본적인 것을 간과하여 삽질을 하게 되는 것이죠... 쵸큼 부끄럽네요...*

저는 Oracle Cloud 상에서 서버를 운영하고 있기 때문에, 우선 컴퓨트 인스턴스에 물려진 Oracle Cloud VCN의 보안 목록에 들어가서 해당 프로토콜/포트를 허용해줍시다.

{{< figure src="oracle-cloud-vcn-firewall.png" caption="Oracle Cloud에서 UDP 443 포트의 수신 허용 규칙을 만드는 스크린샷" >}}

**VCN에서만 허용해준다고 끝난게 아닙니다!** 컴퓨트 인스턴스 내의 OS에서도 허용해주어야겠죠.

Oracle Cloud에서 돌아가는 Ubuntu 컴퓨트 인스턴스는 거의 무조건 iptables를 사용하기에, `/etc/iptables/rules.v4` 파일을 수정해줍시다.

```properties{linenos=false}
# ...

# HTTPS
-A INPUT -p tcp -m state --state NEW -m tcp --dport 443 -j ACCEPT
# HTTP/3
-A INPUT -p udp -m udp --dport 443 -j ACCEPT

# ...
```

수정이 완료되었다면 `iptables-apply` 명령어로 변경 사항을 적용합니다.

```console{linenos=false}
$ sudo iptables-apply -t 10 /etc/iptables/rules.v4
Stopping fail2ban (via systemctl): fail2ban.service.
Applying new iptables rules from '/etc/iptables/rules.v4'... done.
Can you establish NEW connections to the machine? (y/N) y
... then my job is done. See you next time.
Starting fail2ban (via systemctl): fail2ban.service.
```

이제 다시 cURL을 활용해 HTTP/3 연결을 테스트 해보자구요!

```console{linenos=false}
$ podman run --rm docker.io/justdanz/curl-http3 curl -sIL -X GET --http3 'https://myserver.com'
HTTP/3 200 
server: somnium
date: Sat, 06 Jan 2024 15:08:43 GMT
content-type: text/html; charset=utf-8
vary: accept-encoding
last-modified: Thu, 07 Sep 2023 15:59:26 GMT
etag: 972cc076e5e18a705ea9f5
cache-control: public, max-age=3600
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
referrer-policy: no-referrer-when-downgrade
strict-transport-security: max-age=31536000; includeSubDomains
x-robots-tag: noindex, nofollow, noarchive, nosnippet, noimageindex
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-32=":443"; ma=86400, h3-34=":443"; ma=86400
```

`HTTP/3 200`이 표시되었다면 cURL을 통해서는 HTTP/3 연결이 잘 되었다는 뜻입니다.


## 브라우저의 캐싱?

하지만 할 수 있는 짓<sup>~~지꺼리~~</sup>을 하고도 브라우저에서는 HTTP/3로 연결하지 않는 것을 목격할 수 있었습니다. 제가 해 볼 수 있는 것은 다 했으니 이제 슬슬 브라우저를 욕하게 됩니다(...)

[Domsignal HTTP/3 Test](https://domsignal.com/http3-test)나 [LiteSpeed HTTP/3 Check](https://http3check.net/) 등 테스트 사이트에서는 HTTP/3로 연결이 된다고 뜨고, cURL에서도 HTTP/3 연결이 되는데 이게 대체 무슨 시추에이션인지...

저는 macOS에서 Microsoft Edge 브라우저로 테스트했는데, 계속 HTTP/2로만 연결하길래 Firefox를 설치해서 테스트해봤습니다.

{{< figure src="http3-test-firefox.png" caption="Firefox에서 HTTP/2와 HTTP/3가 섞여서 연결된 모습" >}}

**...!? HTTP/3로 연결 되잖아...?** *참고로 HTTP/3를 지원하는 사이트(서버)에 처음 접속할 때는 HTTP/3 연결 특성 상 하위 HTTP 버전으로 일부 연결될 수 있습니다.*

아무리 생각해도 우리 모질라 형님이 표준을 지키지 않을 만큼 **허접🩷** 은 아니시니 아무래도 엣지 쪽을 욕하는 편이 맞다고 생각했습니다. 그럼 같은 크로미엄 베이스인 Google Chrome에는 어떨까...? 싶어서 바로 설치하고 테스트해봤는데...

{{< figure src="http3-test-chrome.png" caption="Google Chrome에서 HTTP/2와 HTTP/3가 섞여서 연결된 모습" >}}

**... 아니 얘도 되잖아...?!** 역시 엣지는 <q cite="https://store.steampowered.com/app/70/HalfLife">*장비를 정지합니다*</q> 수준의 허접🩷 브라우저였구나...! 하고 킹<sup>합</sup>리적 갓</sup>의</sup>심을 갖던 와중에 설마 하고 엣지의 InPrivate 모드(시크릿 모드)로 열어봤는데...

{{< figure src="http3-test-edge-inprivate.png" caption="아니 님 잘 되잖아요" >}}

...🤔 저는 `Alt-Svc` 헤더를 `h2`로 설정한 적이 없는데도 무언가 캐싱이 된 것 같은 느낌이 들었습니다. 정확한 원인을 아시는 분이 계시다면 첨언 부탁드립니다..!

---

**아무튼 HTTP/3 연결이 세 개 브라우저에서 정상적으로 연결되었다는 것이 중요합니다!** 아직 QUIC 구현체들이 그렇게 안정적이진 않은 것 같기도 하고, 제 실수도 있었던 것 같지만 어찌되었든 HTTP/3를 활성화할 수 있었습니다.

마찬가지로 QUIC 구현체들이 아직 안정적이진 않아서 그런지 가끔씩 HTTP/2로 연결하기도 합니다.

---

## 추가. Firefox에서 `MOZILLA_PKIX_ERROR_REQUIRED_TLS_FEATURE_MISSING` 오류

{{< figure src="firefox-tls-error.png" caption="Firefox에서 발생한 MOZILLA_PKIX_ERROR_REQUIRED_TLS_FEATURE_MISSING 오류 페이지" >}}

HTTP/3를 파이어폭스에서 테스트해보려고 할 때, 사이트 접속 시 위와 같은 오류가 발생하고 더 이상 접속할 수 없었습니다. <span style="color: gray">*크롬 및 엣지에서는 이런 오류가 발생하지 않았습니다.*</span>
 
위 오류를 구글링해보면 **OCSP Must-Staple이 설정된 인증서를 사용하면서 서버 소프트웨어에서 OCSP Stapling을 활성화하지 않았을 때 발생하는 오류**라고 합니다. 일종의 설정 미스매치같은 느낌이네요.

> https://really-simple-ssl.com/mozilla_pkix_error_required_tls_feature_missing/

오류 해결 방법은 간단합니다. **OCSP Stapling을 활성화하거나, 파이어폭스의 고급 설정을 수정**해주거나, **OCSP Must-Staple이 설정되지 않은 인증서를 사용**하거나.

OCSP Stapling은 제가 OpenSSL 대신 BoringSSL을 사용하기로 결정한 순간부터 포기해야하는 기능이었습니다. 보안 상 이런 기능이 있는 편이 좋긴 하지만 보안성을 크게 결정짓는 기능은 아니라고 판단하여 패스.

파이어폭스의 고급 설정은 특히 보안 부분은 만져주지 않는 것이 좋다고 생각하였기에 패스.

결국 저는 깔끔하게 SSL 인증서들을 OCSP Must-Staple을 설정하지 않은 채로 재발급받아 적용했습니다.
