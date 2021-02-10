import {
  ApplicationOptions
} from './config';

function makeConfigFile(applicationOptions: ApplicationOptions): void {
  const hostInfo = applicationOptions.server.split(':');
  const serverHost = hostInfo[0];
  const serverPort = (hostInfo.length >= 2) ? hostInfo[1] : 80;

  const content = `client
dev tun
proto tcp
remote ${serverHost} ${serverPort}
resolv-retry infinite
nobind
;persist-key
;persist-tun
<ca>
-----BEGIN CERTIFICATE-----
MIIDaTCCAtKgAwIBAgIJALqZ2kjg7gZoMA0GCSqGSIb3DQEBBQUAMIGAMQswCQYD
VQQGEwJLUjEOMAwGA1UECBMFU2VvdWwxDTALBgNVBAcTBEt1cm8xETAPBgNVBAoT
CEhhaW9ubmV0MQwwCgYDVQQLEwNEZXYxETAPBgNVBAMTCEhBSUlQU1ZSMR4wHAYJ
KoZIhvcNAQkBFg9oYWlpcEBoYWlvbi5uZXQwHhcNMTMwNjI1MDYzODEzWhcNMjMw
NjIzMDYzODEzWjCBgDELMAkGA1UEBhMCS1IxDjAMBgNVBAgTBVNlb3VsMQ0wCwYD
VQQHEwRLdXJvMREwDwYDVQQKEwhIYWlvbm5ldDEMMAoGA1UECxMDRGV2MREwDwYD
VQQDEwhIQUlJUFNWUjEeMBwGCSqGSIb3DQEJARYPaGFpaXBAaGFpb24ubmV0MIGf
MA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmE/LfDn06P1CfAsc0I4WVCrTSEaLD
tq8HDEvgaaKzA6vpxZRSuKqGblRXnsfbGpmiQQk25PYLwsBC4Hw6n4uaEA/Mb+57
lCMKdaJ1Ioas0LqMeAhz1MRRJ0tabs9yAbdVd2+mkIvfq6CHWqk9GOcXBIVsdvfd
z9a+DnURe1s7GQIDAQABo4HoMIHlMB0GA1UdDgQWBBRmWAp84VBUYNbmKZMoz2f8
9ihhhjCBtQYDVR0jBIGtMIGqgBRmWAp84VBUYNbmKZMoz2f89ihhhqGBhqSBgzCB
gDELMAkGA1UEBhMCS1IxDjAMBgNVBAgTBVNlb3VsMQ0wCwYDVQQHEwRLdXJvMREw
DwYDVQQKEwhIYWlvbm5ldDEMMAoGA1UECxMDRGV2MREwDwYDVQQDEwhIQUlJUFNW
UjEeMBwGCSqGSIb3DQEJARYPaGFpaXBAaGFpb24ubmV0ggkAupnaSODuBmgwDAYD
VR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQAaau6S1Hpy3Fjb68aW4iY9taD+
AwXspKtFt1lOL8Vk/zCVBW2nCY9m8jzfvr73T+JPQZshMjH7PQJeWzAz9X7nszin
RbAO621Tj+2EecbHnbpuXwO0fyoVbsqG3aef8WaA/Z4/X5CadkHjfJHKlYXgZv7b
nMg9urG6l99NpGkHoQ==
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
MIIDrzCCAxigAwIBAgIBAjANBgkqhkiG9w0BAQUFADCBgDELMAkGA1UEBhMCS1Ix
DjAMBgNVBAgTBVNlb3VsMQ0wCwYDVQQHEwRLdXJvMREwDwYDVQQKEwhIYWlvbm5l
dDEMMAoGA1UECxMDRGV2MREwDwYDVQQDEwhIQUlJUFNWUjEeMBwGCSqGSIb3DQEJ
ARYPaGFpaXBAaGFpb24ubmV0MB4XDTEzMDYyNTA2NDE1MFoXDTIzMDYyMzA2NDE1
MFowfzELMAkGA1UEBhMCS1IxDjAMBgNVBAgTBVNlb3VsMQ0wCwYDVQQHEwRLdXJv
MREwDwYDVQQKEwhIYWlvbm5ldDEMMAoGA1UECxMDRGV2MRAwDgYDVQQDEwdIQUlJ
UENMMR4wHAYJKoZIhvcNAQkBFg9oYWlpcEBoYWlvbi5uZXQwgZ8wDQYJKoZIhvcN
AQEBBQADgY0AMIGJAoGBAL1/0NguR/AHY73Bg/lFY0wthXvKoHTzw8+ZrtTn1+Vm
pPum4N/Rm6hlO9oi0RtxqD8N4cJSTbm7axBVy8oXZLWyugjjyfx/cKpV6xpN5S+U
Y7a/ny/7c/hQlFaYJGqxxEwSqboyB8n48CLcZdXjK2nlmyesE4mOe80iVTr/fU5v
AgMBAAGjggE3MIIBMzAJBgNVHRMEAjAAMC0GCWCGSAGG+EIBDQQgFh5FYXN5LVJT
QSBHZW5lcmF0ZWQgQ2VydGlmaWNhdGUwHQYDVR0OBBYEFFOS25yXSbiB/x+5ZzMM
DHFUzZOzMIG1BgNVHSMEga0wgaqAFGZYCnzhUFRg1uYpkyjPZ/z2KGGGoYGGpIGD
MIGAMQswCQYDVQQGEwJLUjEOMAwGA1UECBMFU2VvdWwxDTALBgNVBAcTBEt1cm8x
ETAPBgNVBAoTCEhhaW9ubmV0MQwwCgYDVQQLEwNEZXYxETAPBgNVBAMTCEhBSUlQ
U1ZSMR4wHAYJKoZIhvcNAQkBFg9oYWlpcEBoYWlvbi5uZXSCCQC6mdpI4O4GaDAT
BgNVHSUEDDAKBggrBgEFBQcDAjALBgNVHQ8EBAMCB4AwDQYJKoZIhvcNAQEFBQAD
gYEAKst//Vs/H+glnQlr3vUcxxt5U8KEPnhBDqfj/3NB6R0aYyIvuFHRrV4ykSfm
8ieYkx8ocUafdElrVahkWpNJFd7fz1luTXTc8/Qc0njVCcncKf6gdMYTsOWxKbDZ
Sl7Un4KWPhV+C2PMjCA7akotw8A5jXbaj80RAeR/Lhnmyjw=
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC9f9DYLkfwB2O9wYP5RWNMLYV7yqB088PPma7U59flZqT7puDf
0ZuoZTvaItEbcag/DeHCUk25u2sQVcvKF2S1sroI48n8f3CqVesaTeUvlGO2v58v
+3P4UJRWmCRqscRMEqm6MgfJ+PAi3GXV4ytp5ZsnrBOJjnvNIlU6/31ObwIDAQAB
AoGAV62zAMNxL4MLyDmoiYZsakvJrjxTv6kmGYD/Hq1i/FZg0bsl4wlF30Vvyv8/
B1awRPR0V4fjRKON5xH7Z7cpNgjj8WdjTzOouGzGwKjvJTXp/camsCFu2PNVbsj4
d5xbA5lK7U1J561R3EcshBxlPvGGBC9bKwr/2ALdE7oExLECQQDioNTI+Yu5nrA8
FeBolIXbPBs9wmR1A2is15nidY6P7rDUI5yLzTolL40ViyCqaVpNei9P83VBdH/W
2e5FcqrHAkEA1g8amOvbSGQ/+YoCQRpX1u3yvvkuKmIwVwAuyffU1uK3yRf2Wz3F
LnQKd8RvMUQ/tatRnlyXYHJ0B/33fbdXGQJADGL5/loVVvnjbAVOFKk5f7gTTRbY
4sRi7j+Ce6wtNJS5OX8QyVtYODwXG/xUtru3YdCx0U7fM8qoShfzO/x+dQJBALDN
FNjNpfaq5rRDKw1+pqKdMmxN/7V+GBMj0YF7s04xQD9WDWLbKCvwKF033+c/SafR
cr5sF5PPtMqNF4e8kLECQQDTbVIbvWsNZV/nJyYGGdkaUjgYaPhFfovC+P/L+7sW
AcKwQqtitDmKKWyhTY2H46B71eh2tYUAPp3xqRoGXoRT
-----END RSA PRIVATE KEY-----
</key>
auth-user-pass <MUST CHANGE IT>
remote-cert-tls server
comp-lzo
;remap-usr1 SIGTERM
connect-retry-max 1
verb 4
;mute 20

reneg-sec 0
reneg-bytes 0
reneg-pkts 0

script-security 2
up "${applicationOptions.cmCommand} --config ${applicationOptions.configFile} --ovpn-up"
`;
  console.log(content);
}

export function generateOvpnConfig(applicationOptions: ApplicationOptions) {
  makeConfigFile(applicationOptions);
  return Promise.resolve();
}
