<h1>Welcome to About Page</h1>

<div class="win7">
  <button>A Win7-styled button</button>
</div>

<button class="focused">I am focused</button>

<!-- <div role="tooltip">
  A balloon is better known as tooltip in web development.
</div> -->

<input
  type="text"
  placeholder="Press Enter"
  aria-describedby="balloon-password"
/>
<div role="tooltip" id="balloon-password" style="top: 2433px; z-index: 1;">
  Press Backspace to dismiss
</div>

<ul role="menu" style="width: 200px">
  <li role="menuitem" tabindex="0" aria-haspopup="true">View</li>
  <li role="menuitem" tabindex="0" aria-haspopup="true">
    Sort by
    <ul role="menu">
      <li role="menuitem"><a href="#menu">Name</a></li>
      <li role="menuitem"><a href="#menu">Size</a></li>
      <li role="menuitem"><a href="#menu">Item type</a></li>
      <li role="menuitem"><a href="#menu">Date modified</a></li>
    </ul>
  </li>
  <li role="menuitem"><a href="#menu">Refresh</a></li>
  <li role="menuitem"><a href="#menu">Paste</a></li>
  <li role="menuitem"><a href="#menu">Paste shortcut</a></li>
  <li role="menuitem"><a href="#menu">Screen resolution</a></li>
  <li role="menuitem"><a href="#menu">Gadgets</a></li>
  <li role="menuitem"><a href="#menu">Personalize</a></li>
</ul>

<ul role="menu" class="can-hover" style="width: 200px">
  <li role="menuitem" tabindex="0" aria-haspopup="true">View</li>
  <li role="menuitem" tabindex="0" aria-haspopup="true">
    Sort by
    <ul role="menu">
      <li role="menuitem"><a href="#menu">Name</a></li>
      <li role="menuitem"><a href="#menu">Size</a></li>
      <li role="menuitem"><a href="#menu">Item type</a></li>
      <li role="menuitem"><a href="#menu">Date modified</a></li>
    </ul>
  </li>
  <li role="menuitem" class="has-divider"><a href="#menu">Refresh</a></li>
  <li role="menuitem" aria-disabled="true"><a href="#menu">Paste</a></li>
  <li role="menuitem" aria-disabled="true" class="has-divider">
    <a href="#menu">Paste shortcut</a>
  </li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/monitor--v1.png" />
    <a href="#menu">Screen resolution</a>
  </li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/virtual-machine2.png" />
    <a href="#menu">Gadgets</a>
  </li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/remote-desktop.png" />
    <a href="#menu">Personalize</a>
  </li>
</ul>

<div class="title-bar">
  <div class="title-bar-text">A Title Bar</div>
  <div class="title-bar-controls">
    <button aria-label="Minimize"></button>
    <button aria-label="Maximize"></button>
    <button aria-label="Close"></button>
  </div>
</div>

<br />

<div class="title-bar">
  <div class="title-bar-text">A maximized Title Bar</div>
  <div class="title-bar-controls">
    <button aria-label="Minimize"></button>
    <button aria-label="Restore"></button>
    <button aria-label="Close"></button>
  </div>
</div>

<br />

<div class="title-bar">
  <div class="title-bar-text">A help Title Bar</div>
  <div class="title-bar-controls">
    <button aria-label="Help"></button>
    <button aria-label="Close"></button>
  </div>
</div>

<div class="window active" style="max-width: 300px">
  <div class="title-bar">
    <div class="title-bar-text">A complete window</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize" disabled></button>
      <button aria-label="Close"></button>
    </div>
  </div>
</div>

<div class="window active" style="max-width: 300px">
  <div class="title-bar">
    <div class="title-bar-text">A window with contents</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close"></button>
    </div>
  </div>
  <div class="window-body has-space">
    <p>There's so much room for activities!</p>
  </div>
</div>
