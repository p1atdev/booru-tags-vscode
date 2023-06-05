# Booru Tags Completion Extension for VSCode

This extension provides completion of booru tags. 

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.


## Extension Settings

This extension contributes the following settings:

* `booru-tags.useGeneralTags`: Show general tags in completion suggestions. (e.g. `1girl`, `looking at viewer`)
* `booru-tags.useCharacterTags`: Show character tags in completion suggestions. (e.g. `hakurei reimu`, `hatsune miku`)
* `booru-tags.useCopyrightTags`: Show copyright tags in completion suggestions. (e.g. `touhou`, `vocaloid`)
* `booru-tags.useArtistTags`: Show artist tags in completion suggestions. 
* `booru-tags.useMetaTags`: Show meta tags in completion suggestions. (e.g. `highres`, `jpeg artifacts`)
* `booru-tags.withUnderscore`: Use tags with underscores. (e.g. use `looking_at_viewer` instead of `looking at viewer`)
* `booru-tags.trailingComma`: Add trailing comma after tags. (e.g. complete like `solo, ` instead of `solo`)
* `booru-tags.customTags`: Add custom tags to completion suggestions.

Example of `settings.json`:

```json
{
    "booru-tags.customTags": [
        "masterpiece",
        "best quality",
        "exceptional",
        "best aesthetic",
        "newest",
        "anime",
        "worst quality, low quality, bad aesthetic, oldest, bad anatomy"
    ]
}
```

<!-- ## Known Issues

 -->

## Release Notes

### 0.0.1

Initial release.

---

