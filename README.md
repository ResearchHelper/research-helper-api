# Research Helper API

To use API, simply do

```bash
npm install research-helper
# or
yarn add research-helper
```

Then build your plugin by inheriting the `Plugin` class

```js
import { Plugin } from "research-helper";

class MyPlugin extends Plugin {
  enable() {
    // add btns, views and settings here
  }
}
```
