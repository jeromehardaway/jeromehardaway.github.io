/**
 * AI Projects Animation and Interactions
 * Displays Jerome's AI and ML projects with interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set up intersection observer to trigger animation when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initializeAIProjectsDisplay();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  
  const section = document.getElementById('ai-projects');
  if (section) {
    observer.observe(section);
  }
});

function initializeAIProjectsDisplay() {
  const container = document.getElementById('ai-projects-container');
  if (!container) return;
  
  // Project data
  const projects = [
    {
      title: "LLM-Based Veterans Support System",
      description: "Developed a custom RAG-based system to help veterans navigate benefits and resources using natural language queries.",
      technologies: ["Azure OpenAI", "Python", "Vector Database", "LangChain"],
      metrics: "Reduced query resolution time by 78% and improved satisfaction scores by 45%",
      category: "Generative AI"
    },
    {
      title: "ETL Pipeline for Healthcare Analytics",
      description: "Built scalable data pipelines for processing and analyzing healthcare data from multiple sources.",
      technologies: ["Azure Data Factory", "PySpark", "Databricks", "Power BI"],
      metrics: "Processed 2TB+ of healthcare data daily with 99.99% uptime",
      category: "Data Engineering"
    },
    {
      title: "Predictive Maintenance ML System",
      description: "Designed and implemented a machine learning system to predict equipment failures before they occur.",
      technologies: ["Python", "TensorFlow", "Azure ML", "Time Series Analysis"],
      metrics: "Reduced unplanned downtime by 62% and maintenance costs by $1.2M annually",
      category: "Machine Learning"
    },
    {
      title: "Sentiment Analysis for Veteran Feedback",
      description: "Created a custom NLP model to analyze sentiment in veteran feedback across multiple channels.",
      technologies: ["HuggingFace", "BERT", "Python", "Flask API"],
      metrics: "Achieved 91% accuracy in sentiment classification, 30% better than off-the-shelf solutions",
      category: "NLP"
    }
  ];
  
  // Clear and populate the container
  container.innerHTML = '';
  
  // Create filter buttons
  const filterContainer = document.createElement('div');
  filterContainer.className = 'project-filters';
  
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = category;
    if (category === 'All') button.classList.add('active');
    
    button.addEventListener('click', () => {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects
      displayProjects(category === 'All' ? projects : projects.filter(p => p.category === category));
    });
    
    filterContainer.appendChild(button);
  });
  
  container.appendChild(filterContainer);
  
  // Create projects container
  const projectsGrid = document.createElement('div');
  projectsGrid.className = 'projects-grid';
  container.appendChild(projectsGrid);
  
  // Initial display
  displayProjects(projects);
  
  // Add animation to the entire section
  anime({
    targets: container,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });
}

function displayProjects(projects) {
  const projectsGrid = document.querySelector('.projects-grid');
  projectsGrid.innerHTML = '';
  
  projects.forEach((project, index) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.dataset.category = project.category;
    
    // Create the project card content
    projectCard.innerHTML = `
      <div class="project-content">
        <span class="project-category">${project.category}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        
        <div class="project-tech-stack">
          ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
        </div>
        
        <div class="project-metrics">
          <i class="fas fa-chart-line"></i>
          <span>${project.metrics}</span>
        </div>
      </div>
    `;
    
    // Add to grid with animation
    projectsGrid.appendChild(projectCard);
    
    // Animate the card entry
    anime({
      targets: projectCard,
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.9, 1],
      delay: index * 100,
      duration: 800,
      easing: 'easeOutElastic(1, .5)'
    });
  });
}
