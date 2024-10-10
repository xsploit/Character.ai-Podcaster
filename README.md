

# Character.ai Podcaster

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
