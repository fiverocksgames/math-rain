# Math Rain BGM provenance

Status: BGM integration complete on the feature branch. The Human Project Lead states that both compositions are their original works and authorizes their use in Math Rain, including the project's public PR preview and public web game.

## User-provided source files

The Human Project Lead supplied both MP3 files directly in the project conversation and selected their runtime roles:

- lobby: `Tea and Painted Tiles`
  - source file: `tea_and_painted_tiles.mp3`
  - source SHA-256: `f9a84eaa61b77bd3691c3fd2c55f1e71472a9feb98a597ff75a8b5fb38235c59`
  - source size: `3711284` bytes
  - observed duration: approximately `154.383625` seconds
- game: `Tiptoe Across the Table`
  - source file: `tiptoe_across_the_table.mp3`
  - source SHA-256: `ca2c530e5169724823e391e2c25ba873ceb231669fbcdd11988c57684d395d94`
  - source size: `2946418` bytes
  - observed duration: approximately `122.514208` seconds

The Human Project Lead explicitly stated that they created both compositions. This project record treats that statement as the copyright/provenance authority for use and public distribution within Math Rain. It is not an independent legal verification beyond that project-owner assertion.

## Web transform

The local execution environment converted the two source MP3 files with:

`ffmpeg -c:a libopus -b:a 96k`

Expected private runtime outputs:

| Destination | Role | Expected size | Expected SHA-256 |
| --- | --- | ---: | --- |
| `public/audio/bgm/lobby.ogg` | lobby/result BGM | `2195772` bytes | `03cfdc5356c4fc7ec113f31f827759db19b3af660de7de3c3610fea62e441dd9` |
| `public/audio/bgm/game.ogg` | gameplay BGM | `1726353` bytes | `d2dc40ab6d9ab344c062e3aca980d08892acb949da070c409183b915c20e2ee0` |

## Binary handoff

- handoff archive: `math-rain-bgm-handoff.zip`
- archive size: `3923089` bytes
- archive SHA-256: `ed07fadea3e1db7a45b326579adfd490b09e5831d797c94a5c2a6a65c8234308`
- Drive file ID: `1G-XWw8ZewmtyfgoKDvJzIambTl0fdTih`
- contents: `lobby.ogg`, `game.ogg`, `manifest.json`

The repository writer must independently verify the handoff archive and both OGG output hashes before mutation.


## Private transfer evidence

- verified ingress run: `37005461145`
  - source size: `3923089` bytes
  - source SHA-256: `ed07fadea3e1db7a45b326579adfd490b09e5831d797c94a5c2a6a65c8234308`
  - bounded handoff artifact: `11225168006`
- destination writer run: `37005546565` → success
  - re-verified handoff archive size/SHA-256
  - re-verified both OGG size/SHA-256 values
  - bounded mutation guard passed
  - removed one-time ingress request/workflows
- resulting binary commit: `66d0a74faa5c7a1951a1d80e34a4db50386cf060`
- repository readback:
  - `public/audio/bgm/lobby.ogg`: 2195772 bytes
  - `public/audio/bgm/game.ogg`: 1726353 bytes

Public preview/public web-game use is authorized by the Human Project Lead for these two original compositions. Merge, release, and production deployment remain separate authorization boundaries.

## Private validation

- run: `37005696963` → success
- Node.js 24 setup: success
- locked dependency install: success
- typecheck: success
- unit tests: success
- production build: success
- one-shot validation workflow removed after the successful run.
