---
title: Ghost에서 Hugo로 블로그 시스템 마이그레이션
slug: blog-migrated-to-hugo
date: 2026-01-27T15:58:18.084Z
lastmod: 2026-01-27T15:58:19.544Z
cover:
  image: header.png
  relative: true
draft: true
tags:
  - 블로그
  - 웹 개발
---

블로그에 글을 정말 오랜만에 작성하는 것 같습니다! 듣던 소문대로 청강대 게임과의 학기작과 [졸업작품](https://ckchronicle.com/chronicle-2025/)은 요구되는 집중력이 장난 아닌 것 같아요. 하지만 성공적으로 개발을 마무리했고, 이제 졸업을 앞두고 있는 이 시점에 저는 ~~취업난 속에 던져진 백수가 되어~~ 블로그에 글 좀 써볼까 들먹거리고 있습니다.

잠깐 홍보 겸 이력 자랑<sub>(?)</sub>을 하자면, 저는 졸업작품 "팔레트" 팀에서 [**컬러팅! 캐치 & 라비**](https://ckchronicle.com/chronicle/project/palette/)의 프로그래머로서 개발을 진행했습니다. 블로그에도 개발 비화 등 올릴만한 내용이 있다면 올려볼까 싶어요. Unity 조아.

**글을 좀 써보기 전에!!!** 시간이 많은 백수가 된 겸, 오랜 숙원 사업이었던 **<abbr title="Static Site Generator, 정적 사이트 생성기">SSG</abbr>로 블로그 시스템 마이그레이션하기**를 진행했습니다.


## [Hugo](https://gohugo.io/)가 뭣이 좋은디
기존 블로그는 [Ghost](https://ghost.org/)로 돌아가고 있었는데, 사실 이걸로 계속 블로깅해도 크게 불편하진 않습니다. 그럼에도 시간을 들여 Hugo로 새로 구축하고 마이그레이션한 이유로는 여러가지가 있습니다.

- **서버리스로 배포할 수 있어 관리 소요 (거의) 제로**  
  사실 이게 가장 큰 이유입니다. Hugo는 SSG이므로 [GitHub Pages](https://docs.github.com/pages)나 [Cloudflare Pages](https://pages.cloudflare.com/), [Vercel](https://vercel.com/)과 같은 **서버리스 호스팅 서비스를 이용하여 블로그를 배포**할 수 있습니다.  
  반면, Ghost는 상시로 구동되는 서버를 필요로 합니다. 저는 Oracle Cloud 프리 티어를 보유하고 있어 괜찮았지만 기본적으로 서버 운영은 금전적 비용을 동반하게 됩니다. ~~그리고 서버 유지보수하는거 생각보다 까다로워요~~
- **빠른 속도**  
  이 빠르다는 것은 저와 방문자 모두에게 해당됩니다. 기본적으로 정적 사이트이므로 서버는 DB 조회나 템플레이팅 등 별도의 시간 걸리는 처리를 할 필요 없이 그냥 정적 파일만 던져주면 됩니다. **모두가 알고 계시다시피 Less is More입니다.**  
  제 입장에서도 Hugo의 Go로 작성된 툴링 자체의 빠른 속도의 덕을 보게 됩니다. 내용 변경 후 프리뷰에 반영되는게 거의 즉각적이에요..! 빌드도 상당히 빠릅니다.
- **Markdown 사용**  
  개발자라면 [Markdown](https://en.wikipedia.org/wiki/Markdown)에 익숙하리라 생각합니다. Hugo로 글을 쓸 때는 **Markdown 문법과 HTML 태그를 직접 사용**할 수 있어 좀 더 효과적인 글 작성이 가능합니다.  
  Ghost도 Markdown 문법을 쓰면 자동으로 포매팅을 변환해주지만, HTML 태그를 <span style="color: var(--accent); text-decoration: wavy overline green">이렇게</span> 인라인으로 사용할 수는 없습니다. 무조건 줄(문단)을 나눠야만 가능합니다.
- 추가로, Ghost에는 여러 업데이트를 거치며 다양한 비즈니스 기능이 탑재되었는데, 블로그에는 딱히 이 기능들이 필요하진 않습니다.  
  Hugo는 사이트 제작에 필요한 기능들만 갖춰져 있어 가볍기에 오히려 좋습니다.

Ghost를 벗어나서 아쉬운건 브라우저 내에서 정돈된 WYSIWYG 에디터로 글을 쓸 수 없고 [URL 북마크](https://ghost.org/help/cards/#bookmark)와 같은 기능은 없다 정도일까요..? 그런데 에디터 문제는 VS Code를 마개조하거나 타 헤드리스 CMS를 사용하면 어느 정도 해소됩니다.


## Hugo 개발 환경 세팅
기본적으로 [공식 문서](https://gohugo.io/getting-started/quick-start/)의 내용을 잘 따라가면 환경 세팅은 문제 없이 마칠 수 있습니다. 되게 심플해요.

### Hugo CLI 설치
저는 [Arch Linux](https://archlinux.org/) 기반의 [EndeavourOS](https://endeavouros.com/)를 사용하고 있기에 다음 커맨드로 Hugo CLI를 설치할 수 있었습니다. `extra` 저장소에 있으므로 AUR를 참조할 필요는 없습니다.

```sh{linenos=false}
# yay 헬퍼 사용
$ yay hugo

# 또는 pacman으로 바로 설치
$ sudo pacman -Syu hugo
```

### Visual Studio Code 세팅
웹 개발할 때 열심히 굴리는 Visual Studio Code를 글 편집하는 데에도 굴리기로 했습니다. ~~마이크로슬ㄹ... 아니 마이크로소프트가 내려준 선물~~  
Hugo에서 [공식적으로 권장하는 에디터 플러그인](https://gohugo.io/tools/editors/#visual-studio-code)을 설치하면 좀 더 최적한 환경에서 글을 쓸 수 있습니다.

{{< figure src="vscode-setting-frontmatter-cms.png" caption="VS Code 확장 중 하나인 Front Matter CMS" >}}

보통의 <abbr title="Content Management System, 자산(콘텐츠) 관리 시스템">CMS</abbr>처럼 글 관리를 하고 싶다면 [Front Matter CMS](https://frontmatter.codes/)라는 확장을 설치해볼 수 있습니다. 개인적으로는 설치는 했는데 생각보다 기능을 잘 사용하지 않게 되더라고요... 아직 어색해서 그런지 자꾸 탐색기에서 직접 파일을 찾고 front matter 메타데이터를 직접 수정하게 됩니다.

{{< figure src="vscode-setting-snippet.png" caption="무수한 스니펫의 향연" >}}
{{< figure src="vscode-setting-snippet-in-use.png" caption="스니펫 사용 예시" >}}

또, 자주 사용하는 코드 조각 *(스니펫)* 들을 따로 선언하여 사용하고 있습니다. 주로 Callout 형식을 빠르게 작성하기 위한 것들이고 이건 아주 잘 써먹고 있습니다.

스니펫을 만드는 방법은 [VS Code 공식 문서](https://code.visualstudio.com/docs/editing/userdefinedsnippets#_create-your-own-snippets)를 참고하시면 됩니다. 블로그 리포지토리 루트에 `.vscode`라는 폴더를 생성한 후, 그 안에 `*.code-snippets` 확장자로 JSONC 포맷으로 스니펫 선언을 만들어 두면 리포지토리 내 일치하는 파일에 대해 스니펫 자동 완성이 활성화됩니다.

제가 선언해둔 스니펫은 [여기](https://github.com/somnisomni/somni.log/blob/main/.vscode/markdown-posts.code-snippets)에서 확인해보실 수 있습니다. 자유롭게 활용해주셔도 돼요!

{{< figure src="vscode-setting-workspace.png" caption="VS Code 워크스페이스 설정" >}}

VS Code를 글 작성에 좀 더 알맞도록 약간의 커스터마이징을 하기 위한 워크스페이스도 세팅해 두었습니다. 워크스페이스 파일 대신 `.vscode/settings.json`으로 설정을 조작해도 동일하게 작동합니다.

특히 Markdown 파일에 대해서는 에디터 폰트를 블로그의 콘텐츠 폰트로 사용하고 있는 [마루 부리](https://hangeul.naver.com/fonts/search?f=maru)로 일치시켜 에디터와 결과물의 위화감을 조금 줄여봤습니다.

워크스페이스 파일도 [여기](https://github.com/somnisomni/somni.log/blob/main/somni-log.code-workspace)에서 확인해보실 수 있어요!


## 글 마이그레이션
### 100% 핸드메이드 마이그레이션
{{< figure src="post-migration-by-hand.png" caption="이런 느낌으로다가 장인의 정신으로 손수 마이그레이션" >}}

블로그 시스템을 이전할 때 가장 중요한 건 **글을 옮기는 일**일 것 같네요. 블로그에 글이 그렇게 많진 않지만, 나름 제 소중한 ~~피땀섞인~~ 기록들이기에 반드시 해야만 하는 일이었습니다.

기능이 많은 Ghost답게 [데이터를 내보내는 기능](https://ghost.org/help/exports/) 또한 존재하는데, 결과적으로 이 기능을 사용하지 않은 이유는 **글 포매팅을 그대로 가져올 수 없고, 이미지 등 미디어 콘텐츠까지 내보내주진 않는다는 것**입니다.

물론 제 서버에 셀프 호스팅중인 블로그라 서버에 접속해 데이터를 빼오면 되지만 생각보다 귀찮은 일입니다. 그래서 글 내용도 간간히 정비할 겸 **손수 마이그레이션**했습니다. <span style="color: gray">기계니 자동화니 뭐니 해도 가끔은 사람이 직접 하는 편이 더 속 편하고 확실한 법이죠.</span>

글을 손수 마이그레이션하는건 별거 없습니다. 무한 Ctrl+C 및 Ctrl+V, 이미지 파일 리네이밍, Markdown 문법으로 글 포매팅, 메타데이터를 front matter 형식에 맞게 재구성 정도만 하면 됩니다.

마찬가지로 글이 그렇게 많지 않아 손수 마이그레이션 할만했지, 그렇지 않다면 [ghost-to-md](https://github.com/hswolff/ghost-to-md)와 같은 변환 도구를 사용해야 할 것 같네요.

### Callout 모듈 도입
{{< figure src="post-migration-callout.png" caption="별도 모듈을 통해 렌더링된 Callout." attr="원본 글" attrlink="/posts/working-with-nginx-http3/" >}}

이왕 Markdown 문법으로 글을 쓰게 된 거, <abbr title="GitHub Flavoured Markdown, GitHub에서 확장한 Markdown 문법">GFM</abbr>의 [Alerts](https://docs.github.com/ko/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)와 같이 일부 내용을 강조하는 영역을 넣을 수 있게 만들고 싶었습니다.

당연히 이는 일반 Markdown 스펙에는 없는 기능이므로, [공식 문서를 참고](https://gohugo.io/render-hooks/blockquotes/#alerts)하여 직접 구현하거나 별도 모듈을 사용해야 합니다.

저는 [hugo-admonitions](https://github.com/KKKZOZ/hugo-admonitions)를 사용했습니다. 한국어 번역이 없길래 후딱 [한국어 번역 추가 PR도 제출](https://github.com/KKKZOZ/hugo-admonitions/pull/47)했습니다.

[README 문서](https://github.com/KKKZOZ/hugo-admonitions?tab=readme-ov-file#installation)를 따라 설치해도 되지만, 저는 git submodule을 사용하여 사이트에 추가했습니다.

```sh{linenos=false}
# 현재 디렉토리가 블로그 리포지토리 루트임을 가정
# themes 폴더 내에 submodule 추가
$ git submodule add -b main --depth 1 https://github.com/KKKZOZ/hugo-admonitions themes/hugo-admonitions
```

```yaml{linenos=false}
# 사이트 설정(hugo.yaml)에 `hugo-admonitions` 폴더 추가
theme:
  - "hugo-admonitions"  # <--
  - "PaperMod-somni"
```

모듈 도입 후 기존 글에도 적절한 위치에 Callout을 집어넣어 주었습니다. 특히 TL;DR 부분은 Callout으로 대체하니 이쁘더라구요!

### ~~버려진~~ 아카이브된 글들
기술은 계속해서 발전하고 있고, 각종 툴링과 프레임워크들은 버전이 오르고 있으며, 그에 따라 이전에는 있었던 이슈가 지금은 사라져 더 이상 관련이 없어진<sup>irrelevant</sup> 경우가 있기 마련입니다. 발전하지 않는 건 오직 제 백수 통장 잔고 뿐이네요. 아이고.

이전에 있었던 이슈를 다루거나 여러 이유로 철이 지난<sub>(?)</sub> 글들의 처분을 어떻게 할까 고민했는데, 새 블로그 시스템으로 **이전하지 않는 대신 아카이브를 떠두기로 결정**했습니다.

- [\[JS\] 드래그 앤 드롭으로 엘리먼트를 특정 위치에 배치하기 #1](https://web.archive.org/web/20260127120009/https://log.somni.one/js-drag-and-drop-in-position-1/) <span style="color: gray">*2022. 11. 19.*</span>
- [\[JS\] 드래그 앤 드롭으로 엘리먼트를 특정 위치에 배치하기 #2](https://web.archive.org/web/20260127120134/https://log.somni.one/js-drag-and-drop-in-position-2/) <span style="color: gray">*2022. 12. 01.*</span>
- [조이트론 네온2 게임패드 간단 리뷰 (with EX M AIR)](https://web.archive.org/web/20260127120236/https://log.somni.one/joytron-neon2-review/) <span style="color: gray">*2023. 01. 20.*</span>
- [(오드로이드 N2+) 최신 Armbian 빌드에서 부팅 불가 문제 해결](https://web.archive.org/web/20260127120317/https://log.somni.one/odroid-n2plus-not-booting-on-latest-armbian/) <span style="color: gray">*2023. 02. 23.*</span>
- [Vue + vue-facing-decorator + Vite 5 사용 시 빌드 오류 해결](https://web.archive.org/web/20260127120658/https://log.somni.one/vite-5-build-issue-workaround/) <span style="color: gray">*2024. 01. 12.*</span>
- [모노레포 프로젝트에서 VSCode TypeScript 서버 크래시 문제 해결](https://web.archive.org/web/20260127120755/https://log.somni.one/tsserver-crash-on-vscode-monorepo/) <span style="color: gray">*2024. 05. 20.*</span>


## 테마 커스터마이징
TO BE FILLED 


## 배포
{{< figure src="distribution-cloudflare-pages.png" caption="Cloudflare Pages가 열일하는 모습" >}}

블로그는 [Cloudflare Pages](https://pages.cloudflare.com/)를 이용해 자동 빌드 및 배포하고 있습니다. SSG이기 때문에 서버에 셀프 호스트를 한다고 하더라도 빌드 및 배포 파이프라인은 간단하게 끝낼 수 있을 것 같네요.

요즘은 서버에 대한 관리를 외주주는 편이 너무 편하네요. 제 [홈페이지](https://somni.one)와 거기에 사용되는 외부 서비스 데이터 수집기도 Cloudflare Pages / Workers로 돌아가고 있습니다. <span style="color: gray">클라우드플레어 만세!</span>
