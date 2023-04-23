<p align="center">
  <a href="https://permacast.app">
    <img src="https://raw.githubusercontent.com/Parallel-news/permacast-protocol/main/img/pc-icons/logo192.png" height="124">
  </a>
  <p align="center">Utils API for Permacast Protocol</p>
</p>

## Install & Run

```console
git pull https://github.com/parallel-news/permacast-bloodstone-helper.git

npm install && npm run start

```

## Usage

### Generate RSS Feed For A Channel

```console
GET /feeds/rss/:pid
```

- `pid` : channel ID

### Sort feeds

```console
GET /feed/channels/sort/<criteria>
```

| criteria key  | description |
| ------------- |:-------------:|
| `episodescount`     | sort all created channels by episodes count     |
| `episodescount1`      | sort non-empty channels by episodes count     |
| `channelsactivity`     | sort channels by latest activity (episode uploads)    |
| `channelsactivity1`| sort non-empty channels by latest activity (episode uploads) |


### Get Protocol Stats

```console
GET /protocol/stats
```


Response example: 
```json
{
  "total_byte_size": 72642400730,
  "total_episodes_count": 1437,
  "total_channels_count": 75
}
```

### Get Permacast Users Profiles

```console
/protocol/users/:address?
```

Response example: 

```json
{
  "address": "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
  "followers": [
    "oobECSlCStnYOpqO-x6TsYQGbDxGfci-TiHMr4YxqCQ",
    "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0"
  ],
  "followings": ["vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0"],
  "nickname": "xylophone",
  "bio": "co-founder of permacast.app & permaweb.news",
  "avatar": "jNqKmxyTsp-8DsHDGMb-oLN2y2zLkVMs9ievwZ_165I",
  "banner": "Hr_WP4mf8-SfqpWNDPtR_NpW6zumIvLer3OtPBEc2Qs",
  "extension": {
    "ansDomain": "xy.ar",
    "createdPodcasts": [
      "JYRNm0gvP1cZifS06Io2YK9gsocPr7Z5BOWwNIuQ9oI",
      "zgtTZ64Y6yWEiAmevDaytpD_uA_nxLeufQGmySGFm-k",
      "DLmbmcdnCq6oSU6Ypv6-25jMfMjjf6WZXM-u5uocyNM",
      "kJ0R-P_BzuDOVLDUpU8O3D8U4thLf-fn4BZcU6S0Ndw",
      "h9jjhu8iwIoL7_uHAakqzFL4dzgY4fyPD_q0e90kCb4",
      "3vkRcwA6Bi4U2zUr3T9BIKfzwmztPpwboeX7I92mK38",
      "T7HWHKp-AjIj69TQRvV4EZRVTY1J8J9zSgE668aOmC4",
      "98yo5tvtWM7RLxj1orph-PKS9buqcMX8X-aPweqNysU",
      "4vTYMVWWxZaU2n2OI4cC-EgC86GcOnz-CaVW7iUwPK4",
      "J1kzYZwLpAfLSM6RkXf18i9C-O0GnFxSokNQ2BMdm10",
      "WgMUEXJ_zctERiabTAWz6rEypDW8EAmz7iv7RlreS8s",
      "B_gEvwsREHk-Blax_WKOYz3U5M7ja9jTqrlC64XjDZw",
      "2886425fae84fbc16d9f772487d818b5a99dcd265405021ab59530093bbba47d453a66ce2aaf00f9f92e4219a06deb5b43524d7735f76080439e4bdae98f85a8"
    ],
    "episodesCount": 150
  }
}
```
### Import RSS feeds

```console
GET /import-rss/:encoded_url/:pid
```

- `endoced_url` : the RSS feed URL encoded in base64
- pid: target channel ID

### Get RSS podcast metadata

```console
GET /rss-podcast-metadata/:encoded_url
```

- `endoced_url` : the RSS feed URL encoded in base64

## License 
This project is licensed under the [MIT License](./LICENSE)
