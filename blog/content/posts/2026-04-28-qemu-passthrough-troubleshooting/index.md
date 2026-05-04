---
title: QEMU GPU 패스스루 문제 해결 기록
slug: qemu-passthrough-troubleshooting
date: 2026-05-04T07:56:22.320Z
lastmod: 2026-05-04T07:57:04.920Z
draft: false
tags:
  - 리눅스
  - 트러블슈팅
---

# 주저리주저리 TMI
Windows가 가면 갈수록 광고 덩어리에, 쓸데도 없는 AI 기능 덩어리에, 심지어 오류 덩어리가 되어가는 것을 못 참고 리눅스를 메인 OS로 삼은 지 벌써 1년은 더 넘었네요. 한창 대학교 졸작 개발하는 기간에 즉흥적으로(...) Windows를 밀고 [EndeavourOS](https://endeavouros.com)를 설치해 사용한 이후로 지금까지도 [CachyOS](https://cachyos.org)로 배포판을 바꿔 [제 입맛대로 ricing](https://github.com/somnisomni/dotfiles)을 하며 열심히 리눅스를 사랑하고 있습니다.

요즘은 아무리 한국이라도 ~~그 악랄한~~ ActiveX가 판을 칠 수가 없는 시대라 리눅스의 사용성이 훨씬 좋아졌지만, 여전히 Windows가 필요한 경우가 다수 있습니다. <span style="color: gray">DRM이나 안티치트가 걸려있는 게임을 해야한다던가... Unity에서 IL2CPP로 Windows 빌드를 뽑아야 한다던가... 특정 프로그램을 문제 없이 원활히 돌려야 한다던가...</span>

Windows가 필요하다면 듀얼 부팅을 해볼 수도 있고, 가상 머신을 활용하는 방법도 있는데, 저는 ~~더 이상 Windows가 제 컴퓨터에 네이티브로 돌아가는걸 허용하고 싶지 않으니~~ [libvirt](https://libvirt.org) + [QEMU/KVM](https://www.qemu.org) 조합에 GPU 등 장치를 패스스루하며 사용합니다. 이렇게 하면 컴퓨터 재부팅 없이도 필요할 때 바로 Windows로 넘어갈 수 있어 편해요. 물론, **아무런 오류 없이 VM이 부팅된다는 조건 하에...**

혹시나 PCI 장치를 패스스루하며 가상 머신을 사용하는 것에 관심이 있다면 [Arch Linux Wiki 문서](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF)를 참고해보셔도 좋습니다. 과할 정도로 설명이 잘 되어 있어요. 다만 저처럼 단일 GPU 시스템인 경우 [이 레포지토리](https://github.com/joeknock90/single-gpu-passthrough)에서 설명하듯 추가적인 설정이 필요합니다.

아무튼... 이번에 CachyOS로 갈아타며 ricing을 시작하고 기존 Windows VM을 마이그레이션하면서 발생한 이슈들을 뿌리뽑는(!) 과정을 기록해 두었습니다.

---

# 시스템 환경

- **OS**: CachyOS <span style="color: gray">(Arch Linux 기반)</span>
- **CPU**: AMD Ryzen 9 5900X
- **GPU**: NVIDIA GeForce RTX 3080 Ti
- **systemd 버전**: 260.1
- **libvirt 버전**: 12.2.0
- **윈도우 매니저**: [Niri](https://github.com/niri-wm/niri)
- **데스크톱 쉘**: [Noctalia Shell](https://github.com/noctalia-dev/noctalia-shell) v4.7.6


# GPU + 사운드 카드 동시 패스스루 시 커널 패닉

저는 어차피 단일 GPU 패스스루라 VM을 사용하는 동안에는 호스트(리눅스)를 사용할 수는 없어서, 다른 장치들도 같이 패스스루합니다. **메인보드 내장 사운드 카드**도 그 중 하나인데, 안정적인 패스스루를 위해 사운드 관련 서비스/커널 모듈을 언로드하도록 훅 스크립트를 수정하면 다음과 같은 커널 패닉이 발생해버립니다.

```log {linenos=false command="journalctl -b"}
...
4월  28 23:54:49 somni-PC systemd[1382]: Stopped target Sound Card.
4월  28 23:54:49 somni-PC kernel: snd_hda_intel 0000:0b:00.1: GPU sound probed, but not operational: please add a quirk to driver_denylist
4월  28 23:54:53 somni-PC kernel: VFIO - User Level meta-driver version: 0.3
4월  28 23:54:56 somni-PC kernel: [drm] [nvidia-drm] [GPU ID 0x00000b00] Removing device
4월  28 23:54:56 somni-PC kernel: [drm] [nvidia-drm] [GPU ID 0x00000b00] Unloading driver
4월  28 23:54:56 somni-PC kernel: BUG: kernel NULL pointer dereference, address: 000000000000041c
4월  28 23:54:56 somni-PC kernel: #PF: supervisor read access in kernel mode
4월  28 23:54:56 somni-PC kernel: #PF: error_code(0x0000) - not-present page
4월  28 23:54:56 somni-PC kernel: PGD 0 P4D 0
4월  28 23:54:56 somni-PC kernel: Oops: Oops: 0000 [#1] SMP NOPTI
4월  28 23:54:56 somni-PC kernel: CPU: 0 UID: 0 PID: 15038 Comm: rpc-virtqemud Tainted: G           O        7.0.1-1-cachyos #1 PREEMPT  064ce857db72d62f7ca6e6781b81b6ace6735267
4월  28 23:54:56 somni-PC kernel: Tainted: [O]=OOT_MODULE
4월  28 23:54:56 somni-PC kernel: Hardware name: System manufacturer System Product Name/PRIME X570-PRO, BIOS 5021 09/29/2024
4월  28 23:54:56 somni-PC kernel: Sched_ext: beerland_1.1.0_gc505008f_x86_64_unknown_linux_gnu (enabled+all), task: runnable_at=-4ms
4월  28 23:54:56 somni-PC kernel: RIP: 0010:nv_audio_dynamic_power+0xc0/0x140 [nvidia]
4월  28 23:54:56 somni-PC kernel: Code: 85 c0 74 95 c7 44 24 04 00 00 00 00 48 8b 88 a8 01 00 00 48 05 a0 01 00 00 48 39 c1 0f 84 77 ff ff ff 0f 1f 84 00 00 00 00 00 <83> 79 1c 03 74 0e 48 8b 49 08 48 39 c1 75 f1 e9 5b ff ff ff 48 8b
4월  28 23:54:56 somni-PC kernel: RSP: 0018:ffffcfd0ac5bec58 EFLAGS: 00010207
4월  28 23:54:56 somni-PC kernel: RAX: ffff8d6213ac09a0 RBX: ffffcfd0ac5bef18 RCX: 0000000000000400
4월  28 23:54:56 somni-PC kernel: RDX: 000000000000000b RSI: 0000000000000001 RDI: ffff8d61c29da0d0
4월  28 23:54:56 somni-PC kernel: RBP: ffffcfd0ac5bec70 R08: 0000000000000000 R09: 0000000000000000
4월  28 23:54:56 somni-PC kernel: R10: 0000000000010002 R11: ffffffffb6947680 R12: ffff8d61d690e820
4월  28 23:54:56 somni-PC kernel: R13: ffffffffc1383e90 R14: ffffffffc0609a10 R15: ffffcfd0ac5bed08
4월  28 23:54:56 somni-PC kernel: FS:  00007f408f1fe6c0(0000) GS:ffff8d6915a91000(0000) knlGS:0000000000000000
4월  28 23:54:56 somni-PC kernel: CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
4월  28 23:54:56 somni-PC kernel: CR2: 000000000000041c CR3: 0000000341924000 CR4: 0000000000f50ef0
4월  28 23:54:56 somni-PC kernel: PKRU: 55555554
4월  28 23:54:56 somni-PC kernel: Call Trace:
4월  28 23:54:56 somni-PC kernel:  <TASK>
4월  28 23:54:56 somni-PC kernel:  subdeviceCtrlCmdOsUnixAudioDynamicPower_IMPL+0x2b/0x30 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  resControl_IMPL+0x171/0x1d0 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  gpuresControl_IMPL+0x53/0x90 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  serverControl+0x294/0x490 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  rmapiControlWithSecInfo+0x46c/0x7a0 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  rmapiControlWithSecInfoTls+0x6f/0xc0 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  _nv04Control+0xf1/0x110 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  nvkms_call_rm+0x4e/0x80 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nvRmApiControl+0x74/0x80 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nvHdmiDpEnableDisableAudio+0x16d/0x530 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  ApplyProposedModeSetStateOneApiHeadShutDown+0x165/0x4f0 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nvSetDispModeEvo+0x2f3a/0x4a10 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nvKmsIoctl+0xe4/0x1c0 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nvkms_ioctl_from_kapi_try_pmlock+0x4b/0x80 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  ApplyModeSetConfig+0xc2b/0xe00 [nvidia_modeset 5ad9eb7f6cdee15cfec4aec4b14f871ae1118aea]
4월  28 23:54:56 somni-PC kernel:  nv_drm_atomic_commit+0x6a0/0xb20 [nvidia_drm e1475562fca24f4515b08ceac14495baa3a5c716]
4월  28 23:54:56 somni-PC kernel:  drm_atomic_commit+0xc3/0xf0
4월  28 23:54:56 somni-PC kernel:  ? __pfx___drm_printfn_info+0x10/0x10
4월  28 23:54:56 somni-PC kernel:  drm_atomic_helper_disable_all+0x159/0x1a0
4월  28 23:54:56 somni-PC kernel:  drm_atomic_helper_shutdown+0xdb/0x170
4월  28 23:54:56 somni-PC kernel:  nv_drm_dev_unload+0x48/0x100 [nvidia_drm e1475562fca24f4515b08ceac14495baa3a5c716]
4월  28 23:54:56 somni-PC kernel:  nv_drm_dev_destroy+0x17/0x40 [nvidia_drm e1475562fca24f4515b08ceac14495baa3a5c716]
4월  28 23:54:56 somni-PC kernel:  nv_pci_remove_helper+0x75/0x4e0 [nvidia d135e78b07a915a0e07038201e240e6a696a49d6]
4월  28 23:54:56 somni-PC kernel:  pci_device_remove.llvm.8171615490581073154+0x45/0xc0
4월  28 23:54:56 somni-PC kernel:  device_release_driver_internal+0x1c2/0x320
4월  28 23:54:56 somni-PC kernel:  unbind_store+0xc9/0xf0
4월  28 23:54:56 somni-PC kernel:  kernfs_fop_write_iter.llvm.2628836725996329812+0x10d/0x190
4월  28 23:54:56 somni-PC kernel:  vfs_write+0x2b6/0x3e0
4월  28 23:54:56 somni-PC kernel:  __x64_sys_write+0x84/0xf0
4월  28 23:54:56 somni-PC kernel:  do_syscall_64+0x111/0xa50
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_file_open+0xd7/0x190
4월  28 23:54:56 somni-PC kernel:  ? __pfx_kfree_link+0x10/0x10
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_sys_openat2+0x95/0xe0
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? __x64_sys_openat+0x80/0xa0
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_syscall_64+0x148/0xa50
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_syscall_64+0x148/0xa50
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_syscall_64+0x148/0xa50
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? do_user_addr_fault+0x23b/0x720
4월  28 23:54:56 somni-PC kernel:  ? srso_alias_return_thunk+0x5/0xfbef5
4월  28 23:54:56 somni-PC kernel:  ? irqentry_exit+0x3b/0x6d0
4월  28 23:54:56 somni-PC kernel:  entry_SYSCALL_64_after_hwframe+0x76/0x7e
4월  28 23:54:56 somni-PC kernel: RIP: 0033:0x7f40944b00e2
4월  28 23:54:56 somni-PC kernel: Code: 08 0f 85 b1 3d ff ff 49 89 fb 48 89 f0 48 89 d7 48 89 ce 4c 89 c2 4d 89 ca 4c 8b 44 24 08 4c 8b 4c 24 10 4c 89 5c 24 08 0f 05 <c3> 66 2e 0f 1f 84 00 00 00 00 00 66 2e 0f 1f 84 00 00 00 00 00 66
4월  28 23:54:56 somni-PC kernel: RSP: 002b:00007f408f1fd5b8 EFLAGS: 00000246 ORIG_RAX: 0000000000000001
4월  28 23:54:56 somni-PC kernel: RAX: ffffffffffffffda RBX: 000000000000001a RCX: 00007f40944b00e2
4월  28 23:54:56 somni-PC kernel: RDX: 000000000000000c RSI: 00007f4080006530 RDI: 000000000000001a
4월  28 23:54:56 somni-PC kernel: RBP: 000000000000000c R08: 0000000000000000 R09: 0000000000000000
4월  28 23:54:56 somni-PC kernel: R10: 0000000000000000 R11: 0000000000000246 R12: 00007f4080006530
4월  28 23:54:56 somni-PC kernel: R13: 000000000000001a R14: 0000000000000000 R15: 00007f4080001320
4월  28 23:54:56 somni-PC kernel:  </TASK>
4월  28 23:54:56 somni-PC kernel: Modules linked in: vfio_pci vfio_pci_core vfio_iommu_type1 vfio iommufd rfcomm nf_conntrack_netbios_ns nf_conntrack_broadcast nft_fib_inet nft_fib_ipv6 nft_fib_ipv4 nft_fib nft_reject_inet nf_reject_ipv6 nf_reject_ipv4 nft_reject nft_ct nft_chain_nat nf_nat nf_conntrack nf_defrag_ipv6 nf_defrag_ipv4 nf_tables cmac algif_hash algif_skcipher af_alg bnep vfat fat amd_atl intel_rapl_msr intel_rapl_common jc42 kvm_amd ee1004 kvm btusb btmtk asus_ec_sensors eeepc_wmi btbcm irqbypass asus_wmi btintel ghash_clmulni_intel platform_profile aesni_intel btrtl i2c_piix4 rapl sparse_keymap wmi_bmof pcspkr mxm_wmi k10temp igb i2c_smbus bluetooth i2c_algo_bit ptp xpad pps_core rfkill ccp mousedev ff_memless dca joydev mac_hid br_netfilter bridge stp ntsync crypto_user pkcs8_key_parser llc nfnetlink zram 842_compress 842_decompress lz4hc_compress lz4_compress hid_uclogic dm_mod nvme nvme_core nvme_keyring nvme_auth hkdf nvidia_drm(O) drm_ttm_helper ttm nvidia_modeset(O) nvidia(O) video wmi
4월  28 23:54:56 somni-PC kernel: Unloaded tainted modules: nvidia_uvm(O):1 [last unloaded: nvidia_uvm(O)]
4월  28 23:54:56 somni-PC kernel: CR2: 000000000000041c
4월  28 23:54:56 somni-PC kernel: ---[ end trace 0000000000000000 ]---
4월  28 23:54:56 somni-PC kernel: RIP: 0010:nv_audio_dynamic_power+0xc0/0x140 [nvidia]
...
```

분명 사운드 서비스와 커널 모듈을 언로드하는 부분만 추가한건데... NVIDIA GPU 커널 모듈을 언로드할 때 커널 패닉이 발생해버립니다. 패닉 지점(RIP)이 `nv_audio_dynamic_power`인 것을 보면 **GPU 내장 사운드 컨트롤러**와 관련되었음을 유추해볼 수 있습니다.

하지만 이것만 봐서는 해결 방법을 알아내기는 어렵죠. 결국에는 다양한 가능성을 시도해보며 문제가 해결되는지 테스트해보는 수밖에 없습니다. 어쩌면 제 능력 밖의 문제일 수도 있죠... 하나씩 커널모듈을 언로드해보며 `journalctl`을 확인해보고, 사운드 관련 서비스를 더 찾아 멈춰보고 확인해보고를 거듭하다가 끝내 문제를 해결했습니다.

바로 **서비스/커널 모듈의 언로드 순서를 바꾸는 것**..!

```diff {linenos=false file="/etc/libvirt/hooks/qemu.d/(VM_name)/prepare/begin/start.sh"}
-### audio ###
-systemctl --user -M $HOME_USER@ stop pipewire.socket \
-                                     pipewire.service \
-                                     pipewire-pulse.service \
-                                     pipewire-pulse.socket \
-                                     wireplumber.service \
-                                     app-com.github.wwmm.easyeffects@autostart.service
-modprobe -r snd_usb_audio snd_hda_intel    # unload them first for safer batch unload
-lsmod | grep snd | awk '{print $1}' | xargs modprobe -r -a --remove-holders
-virsh nodedev-detach "pci_0000_0d_00_4"

### nvidia ###
modprobe -f -r -a --remove-holders nvidia_uvm nvidia_drm nvidia_modeset nvidia
modprobe -f -r -a --remove-holders nouveau
virsh nodedev-detach "pci_0000_0b_00_1"
virsh nodedev-detach "pci_0000_0b_00_0"

+### audio ###
+systemctl --user -M $HOME_USER@ stop pipewire.socket \
+                                     pipewire.service \
+                                     pipewire-pulse.service \
+                                     pipewire-pulse.socket \
+                                     wireplumber.service \
+                                     app-com.github.wwmm.easyeffects@autostart.service
+modprobe -r snd_usb_audio snd_hda_intel    # unload them first for safer batch unload
+lsmod | grep snd | awk '{print $1}' | xargs modprobe -r -a --remove-holders
+virsh nodedev-detach "pci_0000_0d_00_4"
```

너무나도 단순하게도 훅 스크립트 내 언로드 순서를 기존 `사운드 → GPU`에서 `GPU → 사운드`로 바꾸는 것만으로도 커널 패닉 없이 두 장치를 언로드할 수 있었습니다.

제 나름대로 논리적으로 생각해봤을 때, *사운드 서브시스템을 먼저 다운시켜놔야 장치를 분리할 수 있는게 아닌가...?* 싶어 순서를 저렇게 해놨던건데 아니였나보네요...


# NVIDIA 커널 모듈 언로드 불가

VM을 부팅할 때, 가끔 NVIDIA 커널 모듈이 '사용 중'이라는 메시지와 함께 언로드되지 않는 문제가 있습니다. 훅 스크립트에서 GUI 관련 서비스를 모두 중지시켜도 말이죠.

```sh {linenos=false}
$ sudo modprobe -r nvidia_drm
modprobe: WARNING: Module nvidia_drm is in use.
```

이전 셋업(EndeavourOS + KDE Plasma 조합)에서는 가끔씩 발생하던 문제가 이번 셋업에서는 상시로 발생하길래 확실히 해결해야 할 문제였습니다.

## DBus 서비스 중지 *(실패)*

수도 없이 구글링을 한 결과, [한 레딧 글](https://www.reddit.com/r/VFIO/comments/bxpk3n/unable_to_unload_kernel_module_nvidia_drm/)에서 **[DBus](https://www.freedesktop.org/wiki/Software/dbus/) 서비스를 중지**시켰을 때 언로드에 성공했다는 사례를 발견해 훅 스크립트를 수정하고 테스트해보았습니다.

```log {linenos=false command="journalctl -b"}
...
4월  28 23:44:34 somni-PC systemd[1]: Starting libvirt QEMU daemon...
4월  28 23:44:34 somni-PC systemd[1]: Started libvirt QEMU daemon.
4월  28 23:44:34 somni-PC systemd[1]: Starting libvirt nodedev daemon...
4월  28 23:44:34 somni-PC systemd[1]: Started libvirt nodedev daemon.
4월  28 23:44:35 somni-PC kernel: vfio-pci 0000:0b:00.0: vgaarb: deactivate vga console
4월  28 23:44:35 somni-PC kernel: vfio-pci 0000:0b:00.0: vgaarb: VGA decodes changed: olddecodes=none,decodes=io+mem:owns=none
4월  28 23:44:35 somni-PC virtqemud[12697]: libvirt version: 12.2.0
4월  28 23:44:35 somni-PC virtqemud[12697]: hostname: somni-PC
4월  28 23:44:35 somni-PC virtqemud[12697]: 데이터를 읽는 동안 파일 끝: 입력/출력 오류
...
```

... 그렇게 VM을 부팅해보면 확실히 NVIDIA 모듈은 정상적으로 언로드되는건 확인이 되나, virtqemud 데몬에서 `입력/출력 오류 (Input/output error)`를 뱉고 VM이 부팅되기는커녕 아예 뻗어버립니다.

처음에는 이게 DBus 서비스 중지로 인한 오류인지도 모르고 이것저것 삽질했었네요... 정확한 로그는 없지만 <u>DBus를 통해 프로세스간 통신을 해야하는데 DBus에 접근할 수가 없으니 발생하는 오류</u>라고 유추해볼 수 있겠습니다.

**시스템에 중요한 서비스인 만큼 함부로 중지해선 안 되는 서비스**인데다 잘 작동하지도 않으니 이 방법은 적절하지 않다고 판단해 훅 스크립트를 원복했습니다.

## 모듈을 사용 중인 "진짜 범인" 찾기

편법은 통하지 않는 듯하니 GPU 모듈을 찾는 녀석을 확실히 찾아야만 했습니다. 아무래도 수사 범위를 좁혀가는 방식을 써야겠네요. 그러기 위해선 훅 스크립트의 과정과 유사하게 먼저 GUI와 잠시 작별하도록 합시다.

```sh {linenos=false}
# GUI 모드 종료, 텍스트 전용(콘솔) 모드로 진입
$ sudo systemctl isolate multi-user.target

# 텍스트 전용 모드에서 로그인 후, NVIDIA 모듈 사용 여부 체크
$ lsmod | grep nvidia
nvidia_drm            155648  69
drm_ttm_helper         20480  2 nvidia_drm
nvidia_uvm           2428928  0
nvidia_modeset       2048000  14 nvidia_drm
nvidia              15548416  278 nvidia_uvm,nvidia_modeset
video                  81920  2 asus_wmi,nvidia_modeset
```

`systemctl isolate` 명령어는 다른 세션 모드로 진입하면서 해당 세션 모드와 관련이 없는 서비스(유닛)를 중지시킵니다. 즉, 현재 GUI 모드(=`graphical.target`)에 있었다면 다른 명령어 없이도 GUI 모드에서 실행된 서비스들이 종료됩니다.

텍스트 전용 모드에서 `lsmod`를 해보면 여전히 NVIDIA 커널 모듈이 사용되고 있는 걸 확인해볼 수 있습니다. 출력에서 세 번째 열이 해당 모듈의 사용량을 나타냅니다. GUI를 사용하고 있지 않는데 `nvidia_drm` 모듈만 해도 69개의 '무언가'가 모듈을 사용하고 있네요.

```sh {linenos=false}
# `nvidia-drm` 모듈 언로드 시도
$ sudo modprobe -r nvidia_drm
modprobe: WARNING: Module nvidia_drm is in use.
```

이 상태에서 모듈을 언로드하려고 해봤자 사용 중이라며 언로드가 되지 않습니다.

그럼 본격적으로 수사 범위를 더욱 좁혀보도록 합시다!

```sh {linenos=false}
# isolate 후에도 남아있을 수 있는 GUI 프로그램 종료
$ sudo systemctl stop display-manager   # 디스플레이 매니저 (SDDM 등)
$ killall niri   # Niri 윈도우 매니저 

# NVIDIA 모듈 사용 여부 다시 체크
$ lsmod | grep nvidia
nvidia_drm            155648  10
drm_ttm_helper         20480  2 nvidia_drm
nvidia_uvm           2428928  0
nvidia_modeset       2048000  3 nvidia_drm
nvidia              15548416  44 nvidia_uvm,nvidia_modeset
video                  81920  2 asus_wmi,nvidia_modeset

# `nvidia-drm` 모듈 언로드 재시도
$ sudo modprobe -r nvidia_drm
modprobe: WARNING: Module nvidia_drm is in use.
```

저는 윈도우 매니저로 Niri를 사용하는데, `systemctl isolate`를 하더라도 프로세스가 계속 돌아가고 있는 듯해 따로 프로세스를 종료했습니다.

(이미 종료되었을) 디스플레이 매니저와 Niri를 명시적으로 종료하고 나니 모듈 사용량이 10으로 줄었습니다. 이 정도면 항복할 법도 한데, 뭔진 몰라도 끈질기군요.

이쯤에서 비기를 꺼내보도록 합시다! 바로 `lsof`입니다.

```sh {linenos=false command="lsof /dev"}
COMMAND    PID  USER FD   TYPE  DEVICE SIZE/OFF NODE NAME
...
nmcli     1951 somni 23u   CHR 226,128      0t0  809 /dev/dri/renderD128
...
```

[`lsof`](https://lsof.readthedocs.io/en/latest/)는 **L**i**s**t **O**pen **F**ile의 약자로, 말 그대로 **열려있는 파일의 정보를 조회**해주는 명령어입니다. 경로로 `/dev`를 지정해주면 하위 디렉토리 내 장치 파일들의 정보까지 전부 조회해줍니다.

> [!INFO] `lsof`는 표준 유틸리티가 아니기에 별도로 설치가 필요할 수 있습니다.

리눅스에서 GPU으로의 접근은 관련 커널 모듈로부터 노출되는 `/dev/dri` 내 `card*` 및 `renderD*` 장치 파일을 통해 이루어집니다. 즉, 이 장치 파일을 사용한다면 `lsmod`에서도 사용 중인 것으로 카운트됩니다.

그렇게 GPU를 사용(?)하고 있는 프로세스가 뭐가 있는가 보면... 단 하나 있네요. `nmcli`. **[NetworkManager](https://gitlab.freedesktop.org/NetworkManager/NetworkManager)의 CLI 인터페이스**입니다. 잡았다 요놈.

그런데 엥..? 네트워크를 관장하는, 그것도 CLI 프로그램이 대체 왜 GPU를 사용하나..??? 전혀 이해할 수가 없기에 이 범인이 어디서 온 놈인지 알아볼 필요가 있을 것 같네요.

```sh {linenos=false command="sudo systemctl status 1951"}
● user@1000.service - User Manager for UID 1000
     Loaded: loaded (/usr/lib/systemd/system/user@.service; static)
     ...
     CGroup: /user.slice/user-1000.slice/user@1000.service
             ├─app.slice
             │ ├─ ...
             │ └─app-niri-sh-1511.scope
             │   └─1951 /usr/bin/nmcli -t monitor
     ...

# systemctl을 통해 지정한 PID가 어떤 서비스에서 실행되고 있는지 조회
```

```sh {linenos=false command="systemctl --user status 1951"}
● app-niri-sh-1511.scope
     Loaded: loaded (/run/user/1000/systemd/transient/app-niri-sh-1511.scope; transient)
     ...
     CGroup: /user.slice/user-1000.slice/user@1000.service/app.slice/app-niri-sh-1511.scope
             └─1951 /usr/bin/nmcli -t monitor

4월 29 00:08:01 somni-PC systemd[1383]: Started app-niri-sh-1511.scope.

# 유저 scope으로 다시 조회
# ... 그저 윈도우 매니저일 뿐일 Niri에서...?
```

```sh{linenos=false command="pstree -p | grep nmcli"}
           |               |-qs(4536)-+-nmcli(4949)-+-{nmcli}(4960)
           |               |          |             |-{nmcli}(4961)
           |               |          |             `-{nmcli}(4973)
           |               |          |-nmcli(24411)-+-{nmcli}(24412)
           |               |          |              |-{nmcli}(24413)
           |               |          |              |-{nmcli}(24414)
           |               |          |              `-{nmcli}(24415)

# 이 출력에 한해, 컴퓨터 재부팅 후 다시 실험하느라 PID가 달라졌음을 참고
# (아마 이 출력에서 PID 4949의 자리가 글에서 설명하는 PID 1951의 자리와 동일할 것)
```

`nmcli`의 PID인 1951을 가지고 `systemctl`과 `pstree`를 통해 어떤 프로세스로부터 스폰되었는지 실마리를 찾을 수 있습니다.

`nmcli`의 부모 프로세스인 `qs`... 바로 쉘 툴킷 중 하나인 [Quickshell](https://quickshell.org/)의 프로세스입니다. Niri가 직접 `nmcli`를 스폰한 게 아니라, Niri가 스폰한 Quickshell 프로세스에서 스폰되었음을 알 수 있겠네요.

저는 쉘로 [Noctalia Shell](https://github.com/noctalia-dev/noctalia-shell)을 사용 중이라, 이 쉘에서 네트워크 관리도 관장해준다는 걸 생각해보았을 때 소스 코드를 찾아보면 확증을 찾아볼 수 있겠네요.

```qml {linenostart=1126, file="NetworkService.qml"}
  // Listen to NetworkManager events in real-time (roaming, auto-connect)  -- ~9mb Memory usage.
  Process {
    id: networkMonitorProcess
    running: ProgramCheckerService.nmcliAvailable
    command: ["nmcli", "-t", "monitor"]
  ...
```
> [Services/Networking/NetworkService.qml#L1130](https://github.com/noctalia-dev/noctalia-shell/blob/6773c4750a12c9e9af9c4ce2365e083f1d0d0ad8/Services/Networking/NetworkService.qml#L1130)

**범인을 확실히 찾아버렸습니다!** Niri가 종료되면서 쉘을 포함한 하위 프로세스들도 모두 종료되었어야 하는데 어떤 이유인지 이 프로세스만 살아남아 버린 것 같네요.

아무튼 범인을 검거했으니 본 목적으로 돌아가서 VM 부팅 시에 할 수 있는 조치를 해줍시다.

`systemctl --user status (PID)`를 했을 때 유닛 이름이 `app-niri-sh-0000.scope`의 형태로 표시되었던걸 기억하시나요? `.scope` 유닛은 [man 페이지](https://www.freedesktop.org/software/systemd/man/latest/systemd.scope.html)에서 설명하는 것처럼, systemd에서 직접 스폰한 것이 아닌 외부 프로그램으로부터 systemd 버스 인터페이스를 통해 생성한 프로세스들을 관리하기 편하게 묶어둔 형태입니다.

묶어두었다니 오히려 좋은 일입니다! 멀리 돌아갈 필요 없이 `app-niri`로 시작하는 모든 유닛을 죽...종료시키면 자연스레 하위 프로세스들도 종료되지 않을까요? 마침 `systemctl`은 대상 유닛 지정에 와일드카드 처리가 가능하기 때문에 훅 스크립트에서 싸그리 날려버려줍시다.

```diff {linenos=false file="/etc/libvirt/hooks/qemu.d/(VM_name)/prepare/begin/start.sh"}
### display manager & wm ###
systemctl stop display-manager.service
systemctl isolate multi-user.target
killall niri
+systemctl --user -M $HOME_USER@ stop "app-niri-*"
```

`$HOME_USER`는 일반 사용자 이름으로 대체하면 됩니다.

이 모든 과정을 겪고 훅 스크립트를 고쳐주어 다시 VM 부팅을 해보면... 깔끔하게 부팅이 됩니다!!!
