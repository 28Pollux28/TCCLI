[![Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)]("http://creativecommons.org/licenses/by-nc-sa/4.0/" "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License")  
This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

---

# TCCLI
TeleCommunication CLI is a Node.js CLI made as part of a project for the course "Programming Languages Ecosystems" at the INSA Lyon.  

## Installation
To install the tool, you need to have Node.js installed on your computer. You can download it [here](https://nodejs.org/en/download/).

First, clone the repository, then install the dependencies with the following command:
```
npm install
```

---

## Usage
To use the CLI, run the following command:
```
node main.js
```
The CLI will exit when `Ctrl+P` is pressed.  
Adding a `!` at the end of a command will make it run in the background.

---

## Commands
The CLI has the following commands:
- `help`: displays the help message
- `exit`: exits the CLI
- `start <program|command|path>`: starts a command or a program
- `cd <path>`: changes the current directory
- `lp`: lists the different processes running
- `bing [-k|-p|-c] <processId>`: kills, pauses or continues a process
- `keep <processId>`: keeps a process running even after the CLI is closed

---

## Examples
Here are some examples of commands you can run:
```
start notepad
start "C:\Program Files\Google\Chrome\Application\chrome.exe" https://www.google.com
cd C:\Users\user\Documents
```

---

## License

This project is licensed under the terms of the CC BY-NC-SA 4.0 license.

---

## Authors

- [**Valentin Lemaire**](https://github.com/28Pollux28)
