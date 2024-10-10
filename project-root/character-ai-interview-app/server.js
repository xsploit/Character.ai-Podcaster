// Import statements
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { CAINode } from 'cainode';
import fs from 'fs';

// Initialize Express App
const app = express();
const port = 5500;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const CONFIG_FILE = "config.json";
const LOG_FILE = "bot.log";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logging Setup
const logStream = fs.createWriteStream(path.join(__dirname, LOG_FILE), { flags: 'a' });
function log(message) {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${message}\n`);
    console.log(`[${timestamp}] ${message}`);
}

// Configuration Class
class Config {
    constructor() {
        this.data = {
            character1_name: "",
            character1_id: "",
            character1_token: "",
            character1_voice_id: "",
            character1_history_id: "",
            character1_audio_device: "",
            character2_name: "",
            character2_id: "",
            character2_token: "",
            character2_voice_id: "",
            character2_history_id: "",
            character2_audio_device: "",
            web_next_auth: "",
            character_interaction_interval: 60, // seconds
            time_between_topics: 180, // seconds, default to 3 minutes
            topics: []
        };
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf8');
                this.data = JSON.parse(data);
                log("Configuration loaded successfully.");
            } else {
                log("Config file not found. Creating a new one with default configuration.");
                this.save();
            }
        } catch (error) {
            log(`Error loading config: ${error}`);
        }
    }

    save() {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.data, null, 2));
            log("Configuration saved successfully.");
        } catch (error) {
            log(`Error saving config: ${error}`);
        }
    }
}

// CharacterAIClient Class
class CharacterAIClient {
    constructor(token, characterId, historyId, voiceId) {
        this.token = token;
        this.characterId = characterId;
        this.historyId = historyId;
        this.voiceId = voiceId;
        this.client = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (!this.isInitialized) {
            try {
                if (!this.token || !this.characterId) {
                    throw new Error("Token and character ID are required to initialize CharacterAI client");
                }
                this.client = new CAINode();
                await this.client.login(this.token);
                log(`Character.AI client initialized for character ID: ${this.characterId}`);
                await this.client.character.connect(this.characterId);
                log(`Connected to character ID: ${this.characterId}`);

                if (this.historyId) {
                    await this.client.chat.set_conversation_chat(this.historyId);
                    log(`Loaded chat history for character ID: ${this.characterId}`);
                } else {
                    await this.createNewConversation();
                }

                if (!this.voiceId) {
                    const currentVoice = await this.client.character.current_voice(this.characterId);
                    this.voiceId = currentVoice.voice_id;
                    log(`Retrieved voice ID: ${this.voiceId} for character ID: ${this.characterId}`);
                }

                this.isInitialized = true;
            } catch (error) {
                log(`Error initializing CharacterAIClient for character ID: ${this.characterId}: ${error}`);
                throw error;
            }
        }
    }

    async createNewConversation() {
        try {
            await this.client.character.create_new_conversation();
            // Retrieve the new history ID
            this.historyId = this.client.character.current_chat_id;
            if (this.historyId) {
                log(`Created a new conversation for character ID: ${this.characterId}, New History ID: ${this.historyId}`);
                return this.historyId;
            } else {
                throw new Error("Failed to retrieve new conversation ID after creating new conversation");
            }
        } catch (error) {
            log(`Error creating a new conversation for character ID: ${this.characterId}: ${error}`);
            // Attempt to recover by using an existing conversation if available
            try {
                const conversations = await this.client.chat.history_conversation_list(this.characterId);
                if (conversations && conversations.chats && conversations.chats.length > 0) {
                    this.historyId = conversations.chats[0].chat_id;
                    log(`Recovered using existing conversation for character ID: ${this.characterId}, History ID: ${this.historyId}`);
                    return this.historyId;
                }
            } catch (listError) {
                log(`Error retrieving conversation list for character ID: ${this.characterId}: ${listError}`);
            }
            throw error;
        }
    }

    async sendMessage(message) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const response = await this.client.character.send_message(message);
            log(`Message sent to character ID: ${this.characterId}: ${message}`);

            let responseText, turnId, candidateId;
            if (response.turn?.candidates?.length > 0) {
                const primaryCandidate = response.turn.candidates.find(c => c.candidate_id === response.turn.primary_candidate_id);
                if (primaryCandidate) {
                    responseText = primaryCandidate.raw_content;
                    turnId = response.turn.turn_key.turn_id;
                    candidateId = primaryCandidate.candidate_id;
                }
            }

            if (responseText) {
                log(`Received response from character ID: ${this.characterId}: ${responseText}`);

                try {
                    // Add a small delay before TTS request to ensure turn is registered
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const ttsResponse = await this.client.character.replay_tts(turnId, candidateId, this.voiceId);
                    log(`TTS Response: ${JSON.stringify(ttsResponse)}`);

                    if (ttsResponse?.replayUrl) {
                        return { message: responseText, speechUrl: ttsResponse.replayUrl };
                    } else {
                        log(`No replayUrl in TTS response for character ID: ${this.characterId}`);
                        return { message: responseText, speechUrl: null };
                    }
                } catch (ttsError) {
                    log(`Error generating TTS for character ID: ${this.characterId}: ${ttsError}`);
                    return { message: responseText, speechUrl: null };
                }
            } else {
                log(`Unable to parse response from character ID: ${this.characterId}`);
                return { message: "Unable to parse response", speechUrl: null };
            }
        } catch (error) {
            log(`Error sending message to character ID: ${this.characterId}: ${error}`);
            throw error;
        }
    }
}

// Initialize Config
const config = new Config();

let character1Client = null;
let character2Client = null;

function initializeCharacterClients() {
    character1Client = new CharacterAIClient(
        config.data.character1_token,
        config.data.character1_id,
        config.data.character1_history_id,
        config.data.character1_voice_id
    );

    character2Client = new CharacterAIClient(
        config.data.character2_token,
        config.data.character2_id,
        config.data.character2_history_id,
        config.data.character2_voice_id
    );
}

initializeCharacterClients();

// API Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/config', (req, res) => {
    res.json(config.data);
});

app.post('/config', (req, res) => {
    config.data = req.body;
    config.save();
    initializeCharacterClients(); // Reinitialize clients with new config
    res.json({ message: 'Configuration saved successfully.' });
});

// Start new conversations for both characters
app.post('/start-new-conversations', async (req, res) => {
    try {
        // Reset clients
        character1Client.isInitialized = false;
        character2Client.isInitialized = false;

        await character1Client.initialize();
        await character2Client.initialize();

        // Create new conversations for both characters
        await character1Client.createNewConversation();
        await character2Client.createNewConversation();

        // Update config with new history IDs
        config.data.character1_history_id = character1Client.historyId;
        config.data.character2_history_id = character2Client.historyId;
        config.save();

        res.json({ 
            message: 'New conversations started successfully for both characters.',
            character1_history_id: character1Client.historyId,
            character2_history_id: character2Client.historyId
        });
    } catch (error) {
        log(`Error starting new conversations: ${error}`);
        res.status(500).json({ error: 'Failed to start new conversations.' });
    }
});

// Start Conversation
app.post('/start-conversation', async (req, res) => {
    const { initialMessage } = req.body;

    if (!initialMessage) {
        return res.status(400).json({ error: 'Initial message is required.' });
    }

    try {
        await character1Client.initialize();
        await character2Client.initialize();

        const prefixedMessage = `${config.data.character1_name}: ${initialMessage}`;
        const response2 = await character2Client.sendMessage(prefixedMessage);

        res.json({ character2: response2 });
    } catch (error) {
        log(`Error starting conversation: ${error}`);
        res.status(500).json({ error: 'Failed to start conversation.' });
    }
});

// Continue Conversation
app.post('/continue-conversation', async (req, res) => {
    const { lastMessage, character } = req.body;

    if (!character) {
        return res.status(400).json({ error: 'Character is required.' });
    }

    try {
        const client = character === 'character1' ? character1Client : character2Client;
        const otherCharacterName = character === 'character1' ? config.data.character2_name : config.data.character1_name;
        
        if (!lastMessage) {
            return res.status(400).json({ error: 'Last message is required.' });
        }

        const prefixedMessage = `${otherCharacterName}: ${lastMessage}`;
        const response = await client.sendMessage(prefixedMessage);

        res.json(response);
    } catch (error) {
        log(`Error continuing conversation with ${character}: ${error}`);
        res.status(500).json({ error: 'Failed to continue conversation.' });
    }
});

// Start the Server
app.listen(port, () => {
    log(`Server running at http://localhost:${port}`);
});