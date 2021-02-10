# haiipcm

[HAIIP](https://www.haiip.net/) 의 OpenVPN 서비스를 리눅스에서 동작시킬 수 있도록 도와주는 Connection Manager입니다.

OpenVPN 설정 생성 및 연결 후 동작을 지원합니다.

현재 고정IP 서비스만 테스트 되었습니다.

# 사용 방법

## 패키지 설치

```bash
$ sudo apt-get install openvpn
$ sudo snap install haiipcm --channel=edge
```

## 설정파일 생성 및 수정

`/var/snap/haiipcm/common/default.conf` 파일을 생성해 아래와 같이 작성합니다.
필수로 `/var/snap/haiipcm/common/` 하위에 파일을 생성해야 합니다.

```txt
# 여러 인스턴스를 구분하기 위한 이름입니다.
# 임의로 작성하세요
name=default

# VPN서버 주소
server=hai-ip4.haion.net

# 아이디
# e.g. yourname@1
username=haion아이디@VPN_ID
```

```bash
# OpenVPN 설정파일 생성
$ haiipcm.cm --config /var/snap/haiipcm/common/default.conf --generate-ovpn | sudo tee /etc/openvpn/client/haiip.conf

# 로그인 파일 생성 및 적용
$ cat <<EOF | sudo tee /etc/openvpn/client/haiip-login.txt
haion아이디@VPN_ID (e.g. yourname@1)
haion비밀번호
EOF
$ sudo sed -i -e 's:auth-user-pass <MUST CHANGE IT>:auth-user-pass /etc/openvpn/client/haiip-login.txt:g' /etc/openvpn/client/haiip.conf

# 보안을 위해 퍼미션 변경
$ sudo chmod 400 /etc/openvpn/client/haiip-login.txt
$ sudo chmod 600 /etc/openvpn/client/haiip.conf

# 서비스 시작 및 자동시작 설정
$ sudo systemctl start openvpn-client@haiip
$ sudo systemctl enable openvpn-client@haiip
```

# License

Apache-2.0

