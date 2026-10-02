# Math Rain gameplay SFX transfer manifest

Status: verified private binary ingress completed.

All selected clips originate from **Universal UI SFX** by Pedro Hertz SFX in the private shared asset repository. The Unity Asset Store listing identifies the asset under the Standard Unity Asset Store EULA. Only game-specific OGG derivatives are intended for this private development repository.

## Source artifacts

- Bubble family artifact: `fiverocks-dev/assets` Actions artifact `11091814973`
  - name: `math-rain-bubbles-family-preview`
  - source head: `f29d13efb146615d2acdb0cd83f96875251345d8`
  - artifact digest: `sha256:93991cc6e74d364bf30c693ab3f561dac5574f8eb50a357bca3b8a289f0c36f8`
- Semantic SFX artifact: `fiverocks-dev/assets` Actions artifact `11084146905`
  - name: `math-rain-sfx-audition-v2`
  - source head: `b64e0673b4ac293a5ce308807a8c11ed9ca6076f`
  - artifact digest: `sha256:9bbbe2434a58b76aa861f6cd024c8b2318718ee85a0d801158de7d0ea27365e5`

Both artifacts were produced by private CI using `ffmpeg -c:a libopus -b:a 64k`.

## Selected files

| Destination | Game use | Original shared clip | Artifact file | Expected SHA-256 |
| --- | --- | --- | --- | --- |
| `public/audio/sfx/correct-1.ogg` | first correct | `UIClick_Bubbles Splash 01.wav` | `bubble01.ogg` | `41bce5a6a169ba846055c239387c7c3aef54ee58e1b2fa3e2931d82481e4ef00` |
| `public/audio/sfx/correct-2.ogg` | second consecutive correct | `UIClick_Bubbles Splash 02.wav` | `bubble02.ogg` | `1f297246c66b20ab3f5cefe383e47b66cc77d3ae1bdc3f1084c6e79d5dc6e0c3` |
| `public/audio/sfx/correct-3.ogg` | third consecutive correct | `UIClick_Bubbles Splash Twisted Vegetables 01.wav` | `bubble05.ogg` | `eae2d89bcb7c4c69272649059d8ee7ed14ced85a02acb35124afe2652c82717b` |
| `public/audio/sfx/correct-4.ogg` | fourth+ consecutive correct | `UIClick_Bubbles Splash Twisted Vegetables 02.wav` | `bubble06.ogg` | `93723d0710b8a8b8b451f742789ad6d7718f7382c46c566be9701507a04a4cad` |
| `public/audio/sfx/wrong.ogg` | wrong answer | `UIBeep_Access Denied Negative.wav` | `sfx05.ogg` | `66ec8aa107d564b1e245e7cf314767fbca78ff8b3328a8cdbd7c01f214036f3f` |
| `public/audio/sfx/life-lost.ogg` | life lost while lives remain | `UIMvmt_Power Down Denied 01.wav` | `sfx09.ogg` | `1afec94198a7bae389484ab75f1302bedce660f9a8a1e6ac0b3ad531763cb448` |
| `public/audio/sfx/stage-start.ogg` | stage start | `Menu_Navigation01_Open.wav` | `sfx11.ogg` | `2418b9718290f9892ace75b1f389d7b997e024d24cdfe5183a505213145c4550` |
| `public/audio/sfx/level-clear.ogg` | level clear | `UIMvmt_Slide Power Up Achievement 02.wav` | `sfx14.ogg` | `4262810ba6c4f899d7d9c3e73bec2242cef1813527230590479014b58e7b87b9` |
| `public/audio/sfx/game-over.ogg` | game over | `UIMvmt_Game Over Ghostly Haunted 01.wav` | `sfx16.ogg` | `59dc60230fd20db8732043fc270143c7e6e3f38919fd3d580222afe4d9aab53e` |
| `public/audio/sfx/item-use.ogg` | future item use | `UIMvmt_Futuristic Power PickUp 03.wav` | `sfx21.ogg` | `d94232678ea9835348122293a5a887f1822391c41b1edc5bac549b628dca1070` |

## Runtime mapping

The correct-answer progression is:

`correct-1 → correct-2 → correct-3 → correct-4 → correct-4 …`

Any wrong answer or lost life resets the engine combo, so the next correct answer returns to `correct-1`.

When lives reach zero, `life-lost` is intentionally suppressed and `game-over` owns the terminal feedback to avoid two SFX playing at once.


## Transfer evidence

- combo ingress verification run: `36871472295`
  - verified source size: `28788` bytes
  - verified source SHA-256: `93991cc6e74d364bf30c693ab3f561dac5574f8eb50a357bca3b8a289f0c36f8`
  - bounded handoff artifact: `11166249731`
- semantic ingress verification run: `36872138582`
  - verified source size: `243735` bytes
  - verified source SHA-256: `9bbbe2434a58b76aa861f6cd024c8b2318718ee85a0d801158de7d0ea27365e5`
  - bounded handoff artifact: `11167466324`
- destination writer run: `36873063889`
  - re-verified both handoff archives
  - re-verified all 10 selected OGG SHA-256 values
  - bounded mutation guard passed
  - committed only the selected OGG files while removing one-time ingress controls
- resulting asset commit: `0df58d876b9f5fca74c024d9f4fe9af4b87eb4d5`

## Main synchronization evidence

- synchronized base commit: `791d43b9b00c475ea16e78f9fa41e906f15dec20`
- final PR branch preserves the wrong-answer card shuffle changes from main together with the SFX integration.


## Temporary UI click audition

- purpose: compare general UI button click candidates before product selection
- source repository: `fiverocks-dev/assets`
- source branch head: `23878da897c712f3d4dff164c26b0c697b56b6c1`
- source artifact: `math-rain-ui-click-audition-v1` / artifact `11203108611`
- source artifact SHA-256: `d6dc74f69c068ac4c89207cea85c0e18d10423fc5bd88a9542f8fd41f7e822a2`
- verified ingress run: `36949752822`
- destination: `public/auditions/ui-clicks/`
- contents: audition HTML + 12 OGG derivatives only; no original WAV files
- lifecycle: temporary; remove after the UI click sound is selected and integrated
