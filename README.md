somni.log - Monorepo
====================

Repositories
------------
| Path | Description |
| ---- | ----------- |
| [blog](blog/) | Contains blog site configurations and contents, powered by [Hugo](https://gohugo.io/) |
| [theme](theme/) | Contains customized Hugo theme files for the blog site, `PaperMod-somni`, based on [PaperMod](https://github.com/adityatelange/hugo-PaperMod) |

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
- **Blog contents** are licensed under **CC BY-NC-SA 4.0**.  
  The license file can be located at [blog/LICENSE.contents.md](blog/LICENSE.contents.md).
- **`PaperMod-somni` theme** is licensed under **MIT License**.  
  The license file can be located at [theme/LICENSE](theme/LICENSE).
