# 🎉 Windows 7 Simulation with Svelte 5 🎉

Welcome to the **Windows 7 Simulation** project, crafted for the **Wizzbangery Wizard** track of the Svelte Hackathon. This application emulates some of the Windows 7 operating system's interface and functionalities, utilizing the latest features introduced in Svelte 5 (runes).

## ✨ Features

- 🖥️ **Desktop Interface**: A close recreation of the Windows 7 desktop, complete with draggable icons and a functional taskbar.
- 📂 **Applications**:
  - ➕ **Calculator**: A simple arithmetic calculator.
  - 🎥 **Video Player**: Play videos in a native-like player.
  <!-- - 📷 **Camera**: Access and display webcam feed. -->
  - 📝 **Notepad**: A basic text editor for note-taking.
- 🗄️ **File System Simulation**: Navigate through a mock file system with folders and files.
- 🎮 **Games**: Classic JavaScript games integrated via iframes.

## 🚀 Technologies and Svelte 5 Features Used

This project leverages several new features from Svelte 5:

- **$state**: Manages local component state.
- **$derived**: Creates derived state based on existing state.
- **$effect**: Runs side effects in response to state changes.
- **$effect.pre()**: Executes effects before DOM updates.
- **$derived.by()**: Specifies dependencies for derived state.
- **$bindable**: Enables two-way binding with custom components.
- **$props**: Accesses component props directly.
- **Context API**: Shares data between components without prop drilling.
- **Composable Components**: Utilizes dot notation for nested components, e.g., `<Component.NestedComponent />`.

### 📜 Template Syntax

- **{#snippet}**: Defines reusable snippets of code.
- **{@render}**: Controls conditional rendering.
- **bind:** Binds properties for two-way data binding.
<!-- - **use:** Applies actions to elements. -->

### 🔧 Special Elements

- **`<svelte:window>`**: Interacts with window-level events.
- **`<svelte:boundary>`**: Handles errors gracefully within the component tree.

### 🔍 Runtime Functions

- **onMount**: Executes code when a component is first rendered.
- **onDestroy**: Cleans up resources when a component is destroyed.

## 🛠️ Implementation Links

For detailed implementations of each feature, refer to the following:

- 🖥️ **Desktop Icons with Drag and Drop**: [Desktop.svelte](https://github.com/emee-dev/win7/blob/main/src/lib/components/desktop/desktop_icons.svelte)
- 📌 **Taskbar Component**: [Taskbar.svelte](https://github.com/your-repo/windows7-simulation/blob/main/src/components/Taskbar.svelte)
- ➕ **Calculator Application**: [Calculator.svelte](https://github.com/emee-dev/win7/blob/main/src/lib/apps/Calculator/calculator.svelte)
- 🎥 **Video Player Application**: [VideoPlayer.svelte](https://github.com/emee-dev/win7/blob/main/src/lib/apps/Calculator/calculator.svelte)
<!-- - 📷 **Camera Application**: [Camera.svelte](https://github.com/your-repo/windows7-simulation/blob/main/src/apps/Camera.svelte) -->
- 📝 **Notepad Application**: [Notepad.svelte](https://github.com/emee-dev/win7/blob/main/src/lib/apps/Calculator/calculator.svelte)
- 🗄️ **File Explorer**: [File_Explorer.svelte](https://github.com/emee-dev/win7/tree/main/src/lib/apps/File_Explorer)
<!-- - 🎮 **Game Integration**: [Games.svelte](https://github.com/your-repo/windows7-simulation/blob/main/src/apps/Games.svelte) -->

## 🎬 Demo Video

Check out the demo video to see the project in action!  
📹 [Watch the Demo on YouTube](https://youtu.be/your-demo-video-link)

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/emee-dev/win7.git
   cd win7
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:

   Navigate to `http://localhost:5173` to view the application.

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/emee-dev/win7/blob/main/LICENSE) file for details.

---

_Note: This project is a simulation and is not affiliated with Microsoft Corporation._

For more information on migrating to Svelte 5 and the features used in this project, refer to the [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide).

📚 To further assist with the migration process, you might find the following video helpful:

[![migration video](https://img.youtube.com/vi/_q5FZ3Z9Fz8/0.jpg)](https://www.youtube.com/watch?v=_q5FZ3Z9Fz8)
