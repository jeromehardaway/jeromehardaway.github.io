/**
 * AI Assistant Demo
 * Showcases AI engineering capabilities with a functional chat interface
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeAIAssistant();
});

function initializeAIAssistant() {
  // Create the AI assistant interface
  const assistantContainer = document.createElement('div');
  assistantContainer.id = 'ai-assistant-container';
  assistantContainer.className = 'ai-assistant-container';
  document.body.appendChild(assistantContainer);
  
  // Set up the assistant UI
  assistantContainer.innerHTML = `
    <div class="ai-assistant" id="ai-assistant">
      <div class="assistant-header">
        <div class="assistant-branding">
          <div class="assistant-icon">
            <i class="fas fa-robot"></i>
          </div>
          <div class="assistant-title">
            <h3>Jerome's AI Assistant</h3>
            <span class="assistant-status">Demo of AI engineering skills</span>
          </div>
        </div>
        <button id="minimize-assistant" class="minimize-btn">
          <i class="fas fa-minus"></i>
        </button>
      </div>
      
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages">
          <div class="message assistant-message">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
              <p>Hello! I'm a demo AI assistant that showcases Jerome's AI engineering capabilities. I can answer questions about:</p>
              <ul>
                <li>Jerome's data engineering experience</li>
                <li>AI system design principles</li>
                <li>Data architecture best practices</li>
                <li>ETL pipeline development</li>
              </ul>
              <p>What would you like to know?</p>
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <input type="text" id="chat-input" class="chat-input" placeholder="Ask me about Jerome's AI & data engineering...">
          <button id="send-message" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <div class="assistant-footer">
          <div class="system-info">
            <span>Model: Custom RAG System Demo</span>
            <span class="thinking-indicator" id="thinking-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
          <div class="assistant-actions">
            <button id="clear-chat" class="action-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <button id="toggle-assistant" class="assistant-toggle">
      <i class="fas fa-robot"></i>
    </button>
  `;
  
  // Add event listeners
  document.getElementById('toggle-assistant').addEventListener('click', toggleAssistant);
  document.getElementById('minimize-assistant').addEventListener('click', minimizeAssistant);
  document.getElementById('send-message').addEventListener('click', sendMessage);
  document.getElementById('clear-chat').addEventListener('click', clearChat);
  
  const chatInput = document.getElementById('chat-input');
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Hide the thinking indicator initially
  document.getElementById('thinking-indicator').style.display = 'none';
}

function toggleAssistant() {
  const assistant = document.getElementById('ai-assistant');
  const toggleBtn = document.getElementById('toggle-assistant');
  
  if (assistant.classList.contains('open')) {
    assistant.classList.remove('open');
    toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
  } else {
    assistant.classList.add('open');
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
  }
}

function minimizeAssistant() {
  const assistant = document.getElementById('ai-assistant');
  assistant.classList.remove('open');
  
  const toggleBtn = document.getElementById('toggle-assistant');
  toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
}

function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();
  
  if (message === '') return;
  
  // Add user message to chat
  addMessageToChat('user', message);
  
  // Clear input
  chatInput.value = '';
  
  // Show thinking indicator
  const thinkingIndicator = document.getElementById('thinking-indicator');
  thinkingIndicator.style.display = 'inline-block';
  
  // Process message and get response (simulated)
  setTimeout(() => {
    // Hide thinking indicator
    thinkingIndicator.style.display = 'none';
    
    // Add AI response
    const response = generateAIResponse(message);
    addMessageToChat('assistant', response);
  }, 1500);
}

function addMessageToChat(sender, content) {
  const chatMessages = document.getElementById('chat-messages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  if (sender === 'user') {
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${content}</p>
      </div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        ${content}
      </div>
    `;
  }
  
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Animate message
  anime({
    targets: messageDiv,
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuad'
  });
}

function clearChat() {
  const chatMessages = document.getElementById('chat-messages');
  
  // Keep only the first (welcome) message
  while (chatMessages.children.length > 1) {
    chatMessages.removeChild(chatMessages.lastChild);
  }
}

function generateAIResponse(message) {
  // Simple pattern matching for demo purposes
  const lowerMessage = message.toLowerCase();
  
  // Keywords for different topics
  const dataEngKeywords = ['data engineering', 'etl', 'pipeline', 'data factory', 'databricks', 'data lake', 'warehouse'];
  const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'model', 'openai', 'gpt', 'llm', 'large language model'];
  const architectureKeywords = ['architecture', 'system design', 'infrastructure', 'cloud', 'azure', 'aws', 'scale'];
  const experienceKeywords = ['experience', 'background', 'work', 'project', 'built', 'developed', 'fortune'];
  const resumeKeywords = ['resume', 'cv', 'hire', 'hiring', 'job', 'contact'];
  
  // Check which topic matches best
  if (dataEngKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `
      <p>Jerome has extensive data engineering experience building enterprise-scale ETL pipelines. Here are some highlights:</p>
      <ul>
        <li>Designed and implemented data pipelines processing 2TB+ of data daily with 99.99% uptime</li>
        <li>Built robust ETL systems for 6 Fortune 500 companies across healthcare, finance, and retail sectors</li>
        <li>Expert in Azure Data Factory, Databricks, PySpark, and related technologies</li>
        <li>Specialized in automated, resilient data pipelines with proper error handling and monitoring</li>
      </ul>
      <p>His approach focuses on clean architecture, infrastructure as code, and building maintainable systems that can be handed off to teams.</p>
    `;
  } else if (aiKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `
      <p>Jerome's AI engineering experience includes:</p>
      <ul>
        <li>Developing custom LLM solutions using Azure OpenAI and Google Gemini</li>
        <li>Building Retrieval-Augmented Generation (RAG) systems that combine knowledge bases with AI models</li>
        <li>Creating ML pipelines that handle data preparation, training, evaluation, and deployment</li>
        <li>Implementing NLP solutions for sentiment analysis, classification, and text generation</li>
      </ul>
      <p>He focuses on creating practical, production-ready AI systems that deliver measurable business value while maintaining ethical AI principles.</p>
    `;
  } else if (architectureKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `
      <p>Jerome designs scalable, robust system architectures for data and AI applications:</p>
      <ul>
        <li>Cloud-native architectures on Azure and AWS that leverage managed services</li>
        <li>Multi-stage data processing systems with separate ingestion, processing, storage, and analytics layers</li>
        <li>Event-driven architectures that handle real-time data processing</li>
        <li>Infrastructure-as-code implementations using Terraform and GitHub Actions</li>
      </ul>
      <p>His architectural approach emphasizes scalability, maintainability, security, and cost-effectiveness.</p>
    `;
  } else if (experienceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `
      <p>Jerome has a rich background combining AI and Data Engineering:</p>
      <ul>
        <li>Over a decade of software engineering experience, with deep specialization in data systems</li>
        <li>Worked with 6 Fortune 500 companies building enterprise-scale data solutions</li>
        <li>Founded and leads Vets Who Code, teaching veterans technology skills</li>
        <li>Air Force veteran who brings military discipline and leadership to technical projects</li>
        <li>Instructor for LinkedIn Learning and Frontend Masters</li>
      </ul>
      <p>His unique combination of technical expertise and leadership makes him effective at both building systems and leading teams.</p>
    `;
  } else if (resumeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `
      <p>If you're interested in hiring Jerome or learning more about his background:</p>
      <ul>
        <li>Connect with him on <a href="https://linkedin.com/in/jeromehardaway" target="_blank">LinkedIn</a></li>
        <li>Check out his code on <a href="https://github.com/jeromehardaway" target="_blank">GitHub</a></li>
        <li>For detailed resume information, you can reach out directly through LinkedIn</li>
      </ul>
      <p>Jerome is passionate about projects that combine AI, data engineering, and social impact.</p>
    `;
  } else {
    return `
      <p>I'm a demo AI assistant showcasing Jerome's AI engineering capabilities. While I have limited functionality, I can tell you about:</p>
      <ul>
        <li>Jerome's data engineering experience</li>
        <li>His AI system design and implementation approach</li>
        <li>Data architecture best practices he follows</li>
        <li>ETL pipeline development expertise</li>
      </ul>
      <p>Try asking something like "Tell me about Jerome's data engineering experience" or "What AI systems has Jerome built?"</p>
    `;
  }
}
