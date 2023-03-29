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
GET /feeds/channels/sort/<criteria>
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


## License 
This project is licensed under the [MIT License](./LICENSE)
