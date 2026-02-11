somni.log - Monorepo
====================
[@somnisomni](https://github.com/somnisomni)'s whole tree of personal blog site and customized theme. The blog is powered by [Hugo](https://gohugo.io/), and is live at [log.somni.one](https://log.somni.one/).  
[@somnisomni](https://github.com/somnisomni)의 개인 블로그 사이트와 커스텀 테마를 모두 포함하는 저장소입니다. 정적 블로그 사이트 생성에 [Hugo](https://gohugo.io/)를 사용하며, [log.somni.one](https://log.somni.one/)에 자동 배포되고 있습니다.

Repositories
------------
| Path | Description |
| ---- | ----------- |
| [blog](blog/) | Contains blog site configurations and contents, powered by [Hugo](https://gohugo.io/) |
| [theme](theme/) | Contains customized Hugo theme files for the blog site, `PaperMod-somni`, based on [PaperMod](https://github.com/adityatelange/hugo-PaperMod) |

Why did you symlink theme files? You can just put them into the site tree directly
----------------------------------------------------------------------------------
It's just my preference.

Tips
----
- When cloning this repository, use `--recurse-submodules` parameter to make sure submodules are cloned too.
  ```sh
  git clone --recurse-submodules https://github.com/somnisomni/somni.log
  ```
- Theme is symlinked into blog site, so no need to update it manually anymore after altering theme files.
- On the configurations of static site builder/server *(e.g. Cloudflare Pages)*, make sure the "root directory" is set to [`blog/`](blog/).

Licenses
--------
- **Blog contents** are licensed under **CC BY-NC-SA 4.0**, unless otherwise specified.  
  The license file can be located at [blog/LICENSE.contents.md](blog/LICENSE.contents.md).
- **블로그에 작성된 모든 글 및 콘텐츠**에는 별도로 명시되지 않는 한 **CC BY-NC-SA 4.0** 라이선스가 적용됩니다.  
  전체 라이선스 내용은 [blog/LICENSE.contents.md](blog/LICENSE.contents.md)에서 확인할 수 있습니다.

- **`PaperMod-somni` theme** is licensed under **MIT License**.  
  The license file can be located at [theme/LICENSE](theme/LICENSE).
- **`PaperMod-somni` 테마**에는 **MIT License**가 적용됩니다.  
  전체 라이선스 내용은 [theme/LICENSE](theme/LICENSE)에서 확인할 수 있습니다.
