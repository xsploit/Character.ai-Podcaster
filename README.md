

# Character.ai Podcaster
Your going to have to manually update the index.js in  cainode modules
https://github.com/KevinAdhaikal/CAINode/blob/main/index.js
Character.ai Podcaster is a dynamic application designed to simulate podcast-style conversations between two characters using the Character.AI API. With the ability to route audio output to different devices and manage topics in real-time, it provides a unique and engaging experience for virtual podcasting.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [File Structure](#file-structure)
6. [Contributing](#contributing)
7. [License](#license)

## Features

- **Dual Character Conversations**: Simulates conversations between two characters using Character.AI.
- **Topic Management**: Define and manage topics for the podcast to keep the conversation flowing.
- **Audio Routing**: Route audio to two different devices, ideal for integrating with VTube Studio.
- **Dark Mode Support**: Toggle between light and dark mode for a visually appealing interface.
- **Customizable Configuration**: Easily modify character settings, interaction intervals, and topics.

## Installation

### Prerequisites
- Node.js installed on your system. [Download here](https://nodejs.org/).

### Steps
1. Clone the Repository:
    ```bash
    git clone https://github.com/xsploit/Character.ai-Podcaster.git
    cd Character.ai-Podcaster
    ```

2. Install Dependencies:
    ```bash
    npm install
    ```

3. Start the Server:
    ```bash
    npm start
    ```

The server will start at `http://localhost:5500` by default.

## Configuration

The configuration settings for the characters and topics are stored in the `config.json` file located in the project root. This file allows you to customize the characters' names, IDs, voice IDs, and interaction settings.
![image](https://github.com/user-attachments/assets/0481479c-c5f3-4937-ac9f-9d5e585fcd7f)
![image](https://github.com/user-attachments/assets/b8b142fe-2b8b-4b05-94a7-b2319c4c24be)

### ⚠️ WARNING: DO NOT share your session token to anyone you do not trust or if you do not know what you're doing. 
#### _Anyone with your session token could have access to your account without your consent. Do this at your own risk._
---

### On PC:
1. Open the Character.AI website in your browser (https://beta.character.ai)
2. Open the developer tools (<kbd>F12</kbd>, <kbd>Ctrl+Shift+I</kbd>, or <kbd>Cmd+J</kbd>)
3. Go to the `Application` tab
4. Go to the `Storage` section and click on `Local Storage`
5. Look for the `char_token` key
6. Open the object, right click on value and copy your session token.

![Session_Token](https://github.com/realcoloride/node_characterai/assets/108619637/1d46db04-0744-42d2-a6d7-35152b967a82)

### On Mobile:

1. Open the Character.AI website in your browser on the OLD interface (https://old.character.ai/)
2. Open the URL bar, write `javascript:` (case sensitive) and paste the following:
```javascript
(function(){let e=window.localStorage["char_token"];if(!e){alert("You need to log in first!");return;}let t=JSON.parse(e).value;document.documentElement.innerHTML=`<div><i><p>provided by node_characterai - <a href="https://github.com/realcoloride/node_characterai?tab=readme-ov-file#using-an-access-token">click here for more information</a></p></i><p>Here is your session token:</p><input value="${t}" readonly><p><strong>Do not share this with anyone unless you know what you are doing! This is your personal session token. If stolen or requested by someone you don't trust, they could access your account without your consent; if so, please close the page immediately.</strong></p><button id="copy" onclick="navigator.clipboard.writeText('${t}'); alert('Copied to clipboard!')">Copy session token to clipboard</button><button onclick="window.location.reload();">Refresh the page</button></div>`;localStorageKey=null;storageInformation=null;t=null;})();
```
3. The following page should appear:
![Access_Token_Mobile](https://github.com/realcoloride/node_characterai/assets/108619637/2954586c-5dab-4e1c-820c-4e8528653d14)

4. Click the respective buttons to copy your access token or id token to your clipboard.
---

When using the package, you can:
* Login as guest using `authenticateAsGuest()` - *for mass usage or testing purposes*
* Login with your account or a token using `authenticateWithToken()` - *for full features and unlimited messaging*

## Finding your character's ID

You can find your character ID in the URL of a Character's chat page.

For example, if you go to the chat page of the character `Discord Moderator` you will see the URL `https://beta.character.ai/chat?char=8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw`.

The last part of the URL is the character ID:
![Character_ID](https://i.imgur.com/nd86fN4.png)

### Example `config.json`:
```json
{
  "character1_name": "Hikari-Chan",
  "character1_id": "5OuLvYTbVCInEi4umCfq7KzzuSqmhvWyvc4uxJv6PkI",
  "character1_token": "",
  "character1_voice_id": "63a10331-8cea-4ae8-8d03-dea76c31175a",
  "character1_history_id": "",
  "character2_name": "Jim Lahey",
  "character2_id": "1qsT4KKddWuA9w1DAITDVgSHjwxdIZUHMstB9-oRL7o",
  "character2_token": "",
  "character2_voice_id": "05704941-cbfd-4df6-aca2-8786edd77968",
  "character2_history_id": "",
  "web_next_auth": "",
  "character_interaction_interval": 60,
  "time_between_topics": 180,
  "topics": [
    "What do you think made Ricky and Julian ‘shit magnets’ from day one? Were they born that way?",
    "Tell us more about ‘shithawks’—do you see them even as a ghost, or have they gone digital too?"
  ],
  "character1_audio_device": "d12b4b47699812677565c5ae60bc97305ba73173a60c506a7bcca2f4ffada255",
  "character2_audio_device": "6a659ffaa193ae06c23fee0379e49243f021752cfec2625cf12926ff713559ba"
}
```

### Key Configuration Options:
- **`character1_name`**: Display name of Character 1.
- **`character1_id`**: Character 1's unique ID from Character.AI.
- **`character1_token`**: Token for Character 1's API interactions.
- **`character1_voice_id`**: Voice ID for Text-to-Speech (TTS) for Character 1.
- **`topics`**: An array of topics for guiding the conversation.
- **`character1_audio_device`**: Audio device ID for routing Character 1's audio.
- **`character2_audio_device`**: Audio device ID for routing Character 2's audio.

## Usage

1. **Configure Characters and Topics**: Use the web interface to update character information and add or edit topics.
2. **Start a New Conversation**: Click on "Start New Conversation" to initiate a fresh podcast session.
3. **Manage Topics**: Use the "Topics" tab to add or remove topics dynamically.
4. **Start and Stop Conversations**: Utilize the Start and Stop buttons in the interface to control the flow of the conversation.

## File Structure

```plaintext
Character.ai-Podcaster/
├── config.json         # Configuration file for character and conversation settings
├── package.json        # Node.js dependencies and scripts
├── server.js           # Main server file handling API requests and character interactions
├── public/
│   ├── index.html      # Main HTML file for the UI
│   ├── app.js          # JavaScript for handling UI interactions and API calls
│   └── styles.css      # Styling for the web interface
```

### Key Files:

- **`server.js`**: The main server file that handles API interactions, character initialization, and conversation management.
- **`index.html`**: The HTML structure of the application.
- **`app.js`**: JavaScript file for managing UI events, updating configurations, and handling conversations.
- **`styles.css`**: Contains custom styling and dark mode settings for the UI.

## Contributing

Contributions are welcome! If you'd like to improve the project, feel free to fork the repository, make your changes, and submit a pull request.

### Guidelines:
1. Ensure your code follows the existing style and structure.
2. Document your changes in the `README.md` if they involve significant modifications.
3. Test your changes thoroughly before submitting.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
