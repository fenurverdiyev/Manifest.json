// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAE98X1gnvNLaTu-oBJXVBraAY_vij61sY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// DOM Elements
const welcomeSection = document.getElementById('welcomeSection');
const chatContainer = document.getElementById('chatContainer');
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const loadingOverlay = document.getElementById('loadingOverlay');

// Chat State
let conversationHistory = [];
let isGenerating = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    adjustTextareaHeight();
});

// Setup Event Listeners
function setupEventListeners() {
    // Send button click
    sendButton.addEventListener('click', handleSendMessage);
    
    // Enter key press (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', adjustTextareaHeight);
    
    // Clear conversation
    clearButton.addEventListener('click', clearConversation);
    
    // Focus on input
    userInput.focus();
}

// Handle sending a message
async function handleSendMessage() {
    const message = userInput.value.trim();
    
    if (!message || isGenerating) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input and hide welcome section
    userInput.value = '';
    adjustTextareaHeight();
    hideWelcomeSection();
    
    // Generate AI response
    await generateAIResponse(message);
}

// Add message to chat
function addMessage(content, type = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (type === 'ai') {
        // Format AI responses with basic markdown support
        messageContent.innerHTML = formatMessage(content);
    } else {
        messageContent.textContent = content;
    }
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString('az-AZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({
        role: type === 'user' ? 'user' : 'model',
        parts: [{ text: content }]
    });
}

// Generate AI response using Gemini API
async function generateAIResponse(userMessage) {
    setGenerating(true);
    
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: userMessage }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API sorğusu uğursuz oldu: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage(aiResponse, 'ai');
        } else {
            throw new Error('Gözlənilməz API cavab formatı');
        }
        
    } catch (error) {
        console.error('Gemini API xətası:', error);
        addMessage('Üzr istəyirik, bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.', 'ai');
    } finally {
        setGenerating(false);
    }
}

// Format message with basic markdown support
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Set generating state
function setGenerating(generating) {
    isGenerating = generating;
    
    if (generating) {
        loadingOverlay.classList.add('active');
        sendButton.disabled = true;
        userInput.disabled = true;
    } else {
        loadingOverlay.classList.remove('active');
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// Hide welcome section and show chat
function hideWelcomeSection() {
    welcomeSection.style.display = 'none';
    chatContainer.classList.add('active');
}

// Show welcome section and hide chat
function showWelcomeSection() {
    welcomeSection.style.display = 'flex';
    chatContainer.classList.remove('active');
}

// Clear conversation
function clearConversation() {
    if (conversationHistory.length === 0) return;
    
    if (confirm('Danışıq tarixçəsini təmizləmək istədiyinizə əminsiniz?')) {
        conversationHistory = [];
        messagesContainer.innerHTML = '';
        showWelcomeSection();
        userInput.focus();
    }
}

// Auto-resize textarea based on content
function adjustTextareaHeight() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
}

// Utility function to get current time
function getCurrentTime() {
    return new Date().toLocaleTimeString('az-AZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Error handling for network issues
window.addEventListener('online', function() {
    console.log('İnternet bağlantısı bərpa olundu');
});

window.addEventListener('offline', function() {
    console.log('İnternet bağlantısı kəsildi');
    if (isGenerating) {
        setGenerating(false);
        addMessage('İnternet bağlantısı kəsildi. Zəhmət olmasa bağlantınızı yoxlayın.', 'ai');
    }
});

// Initialize app
console.log('Perplexity AI tətbiqi yükləndi');
