---
title: Git GPG 서명 설정 후 커밋 시 개인 키 없음 오류 해결
slug: git-no-secret-key-after-setup-gpg
date: 2022-11-27T03:14:00.000Z
cover:
  image: gpg-key-registered.png
  relative: true
draft: false
tags:
  - 트러블슈팅
  - 개발 / 프로그래밍
aliases:
  - /git-no-secret-key-after-setup-gpg
---

> [!CONCLUSION] TL;DR
> - Git 커밋 서명 시 **"No secret key"** 오류와 함께 커밋 작성 실패
> - 이는 Windows 상에서 Gpg4win으로 설치한 gpg의 홈 디렉터리 경로와 git 내장 gpg의 홈 디렉터리 경로가 상이해서 생긴 오류일 가능성이 높음
> - 따라서 서로의 홈 디렉터리를 일치시켜야 하고, 이 때 **`GNUPGHOME` 환경 변수**를 설정하는 것으로 해결할 수 있음

---

## 환경
- **OS**: Windows 11 22H2
- **PGP 소프트웨어 버전**: GnuPG v2.3.8 *(Gpg4win v4.0.4)*
- **Git 버전**: git-scm v2.37.3.windows.1

---

## 오류 발생 & 해결 과정

Git으로 커밋할 때 커밋 작성자가 본인인 것을 확인하기 위해 ~~사실은 커밋이 Verified로 보이는게 까리해서~~ [커밋 서명](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)을 설정한 후 테스트하는 도중에, 뜻밖의 오류<sup>또는 버그</sup>를 발견했습니다.

```none caption="Git 커밋 작성 시 서명 오류 (개인 키(비밀 키) 없음)"
D:\...\project> git commit -a -m "Some awesome commit"

gpg: directory '/c/Users/somni/.gnupg' created
gpg: keybox '/c/Users/somni/.gnupg/pubring.kbx' created
gpg: skipped "782CAE24A5B51DE9": No secret key
gpg: signing failed: No secret key
error: gpg failed to sign the data
fatal: failed to write commit object
```

gpg는 이미 생성되어있을 키스토어를 두고 `%UserProfile%\.gnupg` 디렉터리를 만들고, 그 안에 `pubring.kbx` 라는 키스토어를 생성합니다. 그러고선 **"No secret key"** 라며 개인 키<sub>(비밀 키)</sub>가 없다고 커밋을 못하겠다네요.

엥? 분명히 공개 키나 개인 키는 이미 gpg로 가져왔을텐데...?

{{< figure src="gpg-key-registered.png" caption="공개 키와 개인 키가 정상적으로 등록되어 있는 모습" >}}

왠지 억울하네요. 이미 쥐어준 걸 순순히 떠먹지 못할망정.

여기서 눈여겨봐야 할 것은, **이미 gpg의 홈<sup>Home</sup> 디렉터리가 `%AppData%\gnupg`로 설정되어 있다는 것입니다.** 아래 가져온 공개 키와 개인 키는 이 홈 디렉터리 안에 있는 키스토어에 저장되어 있다고 하네요.

그럼 Git 커밋 과정에서 실행된 gpg는 모종의 이유로 홈 디렉터리를 `%UserProfile%\.gnupg`로 잡고 있다고 추측할 수 있을 것 같군요!

홈 디렉터리를 제대로 잡아주기 위해 *(= `gpg --version` 에서 출력된 홈 디렉터리로 맞추기 위해)* 어떻게 해야할지 구글링을 해봤습니다. 역시 이런 경우는 한 두 번 발생한게 아니였나봅니다. StackOverflow에 참고할만한 문답이 있네요!

> https://superuser.com/questions/1705999/the-windows-command-line-shows-my-gpg-keys-but-git-bash-does-not

답변의 내용을 대충 해석하자면, CMD에서 실행할 때의 gpg *(Gpg4win으로 설치)* 와 git에서 실행할 때의 gpg *(Git 내장)* 의 홈 디렉터리가 다른 것이니 <u>**이를 하나로 통일하기 위해 `GNUPGHOME` 이라는 환경 변수를 설정하라**</u> 정도가 되겠네요.


환경 변수 이름에서 감이 오시나요? `GNUPGHOME`로 gpg가 데이터 저장에 사용하는 홈 디렉터리를 설정할 수 있고, 정상적인 경로라면 **아무데나 지정**이 가능합니다.  
하지만 우리는 이미 키가 가져와진 키스토어 *(= Gpg4win의 gpg로 가져온 키)* 를 활용해야 하기 때문에 그 쪽으로 홈 디렉토리 경로를 맞춰줍시다.

보통의 경우 `C:\Users\<username>\AppData\Roaming\gnupg` 로 되어있을 거에요. 정확하게는 `gpg --version` 명령어에서 표시되는 Home 경로를 사용하면 됩니다.

> [!TIP] 경로는 절대 경로로 입력해주세요.

<br />

{{< figure src="envvar-gnupghome.png" caption="사용자 환경 변수에 GNUPGHOME을 설정한 모습" >}}

환경 변수 추가가 완료되었으면 **환경 변수 설정 창, 모든 터미널 창, 모든 IDE<sup>(Visual Studio Code)</sup> 창을 닫고 다시 열어주시면** 설정한 환경 변수가 적용이 됩니다. 깔끔히 재부팅하셔도 좋습니다.

이 상태에서 아까 커밋을 시도할 때처럼 다시 커밋을 해봅시다.

```none
D:\...\project> git commit -a -m "Some awesome commit"

[main 4b001fe] Some awesome commit
 1 file changed, 1 insertion(+), 1 deletion(-)
```

잘 되네요!! 개인 키에 암호<sup>Passphrase</sup>를 설정한 경우, 암호를 묻는 창에 암호를 정확히 입력하면 커밋이 정상적으로 생성이 됩니다.

> [!TIP]
> GNUPGHOME 환경 변수 설정 후 커밋 생성 중에 Invalid value passed to IPC 오류가 난다면, `git config --global gpg.program <gpg 실행 파일 절대 경로>` 를 시도해보세요.
> 
> 해당 오류는 Git 내장 gpg 에이전트와 외부 gpg 에이전트 간의 버전 차이로 인한 충돌이 발생할 때 나타나는 듯 합니다.
>
> <span style="color: gray">*\[2026-01-27 업데이트\]*</span> 또는, Windows와 git이 실제로 실행되는 MINGW64 환경 간 경로 구분자의 차이로 인한 문제일 수 있습니다. 이 경우, 아래 댓글 내용과 [StackOverflow 답변](https://stackoverflow.com/questions/68721294/ipc-error-on-gpg-agent-with-git-on-windows/68721408#68721408)을 참고해주세요.
> {{< figure src="path-separator-comment-raonsol.png" >}}
> <span style="color:gray">블로그 시스템 이전으로 Disqus 댓글을 가져올 수 없어 스크린샷 첨부로 대체합니다. 댓글로 경험을 공유해주신 **raonsol님**께 감사드립니다!</span>
