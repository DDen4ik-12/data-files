<hr>

# Scratch Follow Viewports Fix
### [📄 File in GitHub](scratchFollowViewportsFix.user.js) | [🟩 Download userscript](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/scratchFollowViewportsFix.user.js)[^1]

<hr>

"Scratch Follow Viewports Fix" is a userscript for the Scratch[^2] website that returns the old sorting (from the last to the first) of Scratchers in profiles in the "Following" and "Followers" sections

### Before:
![Before](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/readmeAssets/scratchFollowViewportsFixBefore.png)
* "Following" section is sorted by registration date
* "Followers" section is sorted from the first followers to the last

### After:
![After](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/readmeAssets/scratchFollowViewportsFixAfter.png)

<br>

<hr>

# Stage Size Changer
### [📄 File in GitHub](stageSizeChanger.user.js) | [🟩 Download userscript](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/stageSizeChanger.user.js)[^1]

<hr>

"Stage Size Changer" is a userscript for the Scratch[^2] website that allows you to change the stage size from 480×360 to something else

The userscript adds:
* VM patches related to adding the ability to resize the stage
* A button in the stage controls to resize the stage
* A label in the stage controls that shows the position of the mouse cursor on the stage
* New category "StageSC" ![StageSC category](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/readmeAssets/stageSizeChangerCategory.png) and blocks:

![StageSC blocks](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/readmeAssets/stageSizeChangerBlocks.png)

`have "Stage Size Changer"?`, `stage width`, `stage height`, `set stage size width: () height: ()`

### Example with 360×640 stage size:
![Example with 360×640 stage size](https://raw.githubusercontent.com/DDen4ik-12/data-files/refs/heads/main/readmeAssets/stageSizeChangerExample.png)

> [!WARNING]
> Userscript is currently in alpha release and may be unstable!

[^1]: Before installing userscript, do not forget to install the script manager (for example [Tampermonkey](https://www.tampermonkey.net/))
[^2]: Scratch is a project of the Scratch Foundation. It is available for free at https://scratch.org/
