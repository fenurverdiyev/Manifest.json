// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAE98X1gnvNLaTu-oBJXVBraAY_vij61sY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// DOM Elements
const homeScreen = document.getElementById('homeScreen');
const discoverScreen = document.getElementById('discoverScreen');
const voiceScreen = document.getElementById('voiceScreen');
const chatScreen = document.getElementById('chatScreen');
const chatMessages = document.getElementById('chatMessages');
const searchInput = document.getElementById('searchInput');
const loadingOverlay = document.getElementById('loadingOverlay');

// Navigation elements
const navButtons = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab');

// Input elements
const cameraBtn = document.querySelector('.camera-btn');
const voiceBtn = document.querySelector('.voice-btn');
const micBtn = document.querySelector('.mic-btn');
const cancelBtn = document.querySelector('.cancel-btn');

// Voice elements
const sphereDots = document.querySelector('.sphere-dots');
const statusText = document.querySelector('.status-text');

// Chat State
let conversationHistory = [];
let isGenerating = false;
let currentScreen = 'home';
let isRecording = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    generateSphereDots();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.dataset.screen;
            switchScreen(screen);
        });
    });

    // Tab navigation
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Search input
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // Camera button
    cameraBtn.addEventListener('click', handleCameraInput);

    // Voice button
    voiceBtn.addEventListener('click', () => {
        switchScreen('voice');
    });

    // Microphone button
    micBtn.addEventListener('click', toggleRecording);

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        switchScreen('home');
    });

    // Focus on search input
    searchInput.focus();
}

// Switch between screens
function switchScreen(screen) {
    // Hide all screens
    homeScreen.style.display = 'none';
    discoverScreen.style.display = 'none';
    voiceScreen.style.display = 'none';
    chatScreen.style.display = 'none';

    // Remove active class from all nav buttons
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected screen
    switch(screen) {
        case 'home':
            homeScreen.style.display = 'flex';
            document.querySelector('[data-screen="home"]').classList.add('active');
            break;
        case 'discover':
            discoverScreen.style.display = 'block';
            document.querySelector('[data-screen="discover"]').classList.add('active');
            break;
        case 'explore':
            // For now, show discover screen for explore
            discoverScreen.style.display = 'block';
            document.querySelector('[data-screen="explore"]').classList.add('active');
            break;
        case 'focus':
            // For now, show chat screen for focus
            chatScreen.style.display = 'block';
            document.querySelector('[data-screen="focus"]').classList.add('active');
            break;
        case 'voice':
            voiceScreen.style.display = 'flex';
            break;
        case 'chat':
            chatScreen.style.display = 'block';
            break;
    }

    currentScreen = screen;
}

// Handle search input
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query || isGenerating) return;

    // Switch to chat screen
    switchScreen('chat');
    
    // Add user message
    addMessage(query, 'user');
    
    // Clear input
    searchInput.value = '';
    
    // Generate AI response
    await generateAIResponse(query);
}

// Handle camera input
function handleCameraInput() {
    // Create file input for camera
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'camera';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // For now, just show a message about image processing
            addMessage(`Şəkil yükləndi: ${file.name}`, 'user');
            addMessage('Şəkil analizi funksiyası tezliklə əlavə olunacaq.', 'ai');
        }
    });
    
    fileInput.click();
}

// Toggle voice recording
function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Start voice recording
function startRecording() {
    isRecording = true;
    micBtn.classList.remove('muted');
    micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    statusText.textContent = 'Dinlənir...';
    
    // Animate sphere dots
    animateSphereDots();
    
    // Simulate voice recognition (in real app, use Web Speech API)
    setTimeout(() => {
        const recognizedText = "Salam, necəsən?";
        stopRecording();
        
        // Switch to chat and add message
        switchScreen('chat');
        addMessage(recognizedText, 'user');
        generateAIResponse(recognizedText);
    }, 3000);
}

// Stop voice recording
function stopRecording() {
    isRecording = false;
    micBtn.classList.add('muted');
    micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    statusText.textContent = 'Muted';
    
    // Stop sphere animation
    stopSphereAnimation();
}

// Generate sphere dots for voice screen
function generateSphereDots() {
    const dotCount = 50;
    sphereDots.innerHTML = '';
    
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (Math.random() > 0.7) {
            dot.classList.add('blue');
        }
        
        // Random position on sphere
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 80 + Math.random() * 20;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        dot.style.left = `calc(50% + ${x}px)`;
        dot.style.top = `calc(50% + ${y}px)`;
        dot.style.animationDelay = `${Math.random() * 2}s`;
        
        sphereDots.appendChild(dot);
    }
}

// Animate sphere dots during recording
function animateSphereDots() {
    const dots = sphereDots.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.style.animation = 'pulse 0.5s infinite';
    });
}

// Stop sphere animation
function stopSphereAnimation() {
    const dots = sphereDots.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.style.animation = 'pulse 2s infinite';
    });
}

// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('az-AZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.querySelector('.time').textContent = timeString;
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
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
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
        searchInput.disabled = true;
    } else {
        loadingOverlay.classList.remove('active');
        searchInput.disabled = false;
        searchInput.focus();
    }
}

// Clear conversation
function clearConversation() {
    if (conversationHistory.length === 0) return;
    
    if (confirm('Danışıq tarixçəsini təmizləmək istədiyinizə əminsiniz?')) {
        conversationHistory = [];
        chatMessages.innerHTML = '';
        switchScreen('home');
    }
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
