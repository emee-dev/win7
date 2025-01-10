# 🎉 Windows 7 Simulator with Svelte 5 🎉

Welcome to the **Windows 7 Simulator** project, crafted for the **Wizzbangery Wizard** track of the Svelte Hackathon. This application emulates some of the Windows 7 operating system's interface and functionalities, utilizing the latest features introduced in Svelte 5 (runes).

## ✨ Features

- 🖥️ **Desktop Interface**: A close recreation of the Windows 7 desktop, complete with draggable icons and a functional taskbar.
  - Drag and drop single files into the desktop, currently supporting .mp4 and .txt files, with more to come.
  - Icons layout, grouping, and drag functionality with context menu.
- 📂 **Applications**:
  - ➕ **Calculator (WIP)**: A simple arithmetic calculator.
- 🎥 **Video Player**: Play videos in a native-like player.
  - Successfully plays video (.mp4) files in the system.
- 📝 **Notepad**: A basic text editor for note-taking.
  - Successfully reads uploaded .txt files.
- 🗄️ **File System Simulation**: Navigate through a mock file system with folders and files.
  - History implementation with rewind, forward, undo, and redo logic.
  - Folders/files navigation via the address bar.
  - File search (WIP).
- 🎮 **Games**: Classic JavaScript games integrated via iframes, time permitting.

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
- **Composable Components**: Utilizes dot notation for nested components, e.g., `<Component.NestedComponent />` and snippets.

### 📜 Template Syntax

- **{#snippet}**: Defines reusable snippets of code.
- **{@render}**: Controls conditional rendering.
- **bind:** Binds properties for two-way data binding.
- **use:** Applies actions to elements.

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
- 📝 **Notepad Application**: [Notepad.svelte](https://github.com/emee-dev/win7/blob/main/src/lib/apps/Calculator/calculator.svelte)
- 🗄️ **File Explorer**: [File_Explorer.svelte](https://github.com/emee-dev/win7/tree/main/src/lib/apps/File_Explorer)

## 🎬 Demo

Check out the demo to see the project in action!  
📹 [Vercel](https://windows7-lovat.vercel.app/)
📹 [Watch the Demo on YouTube](https://youtu.be/IjeMHRzM7mA)

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

Your **Credits / Acknowledgement** section is concise, but it could benefit from a little more detail to give proper recognition to the projects that inspired your work. Here's a revised version with some added substance:

## 😆 Credits / Acknowledgement

This project draws significant inspiration from the following remarkable projects:

- [**7.css**](https://khang-nd.github.io/7.css/): A CSS framework that beautifully replicates the look and feel of Windows 7, providing the foundational styles for the classic Windows UI in web applications.
- [**daedalOS**](https://github.com/DustinBrett/daedalOS): An impressive browser-based operating system simulation, offering a comprehensive approach to replicating desktop environments within a web browser.
- [**win7simu**](https://win7simu.visnalize.com/): An online simulation of Windows 7 that showcases the nostalgic interface and interactions, serving as a reference for UI and user experience design in this project.

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/emee-dev/win7/blob/main/LICENSE) file for details.

---

_Note: This project is a simulation and is not affiliated with Microsoft Corporation._

For more information on migrating to Svelte 5 and the features used in this project, refer to the [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide).

📚 To further assist with the migration process, you might find the following video helpful:

[![migration video](https://img.youtube.com/vi/_q5FZ3Z9Fz8/0.jpg)](https://www.youtube.com/watch?v=_q5FZ3Z9Fz8)
