/**
 * Prerna - Support for Competitive Exam Students
 * Main JavaScript File
 */

// Global variables
let anonymousChatSystem = null;
let careerRecommendationSystem = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('Prerna website initialized');

    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links with navbar offset
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Modal handling for login/register
    const loginLinks = document.querySelectorAll('a[href="#login"]');
    loginLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        });
    });

    // Counseling modal handling
    const counselingButtons = document.querySelectorAll('[data-bs-target="#counselingModal"]');
    counselingButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Reset form when modal opens
            const form = document.querySelector('#counselingModal form');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
        });
    });

    // Mood Tracker Functionality
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodTextarea = document.querySelector('.mood-check-in textarea');
    const moodSubmitButton = document.querySelector('.mood-check-in button');

    if (moodButtons.length > 0 && moodSubmitButton) {
        let selectedMood = '';

        moodButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                moodButtons.forEach(btn => {
                    btn.classList.remove('active', 'btn-primary');
                    btn.classList.add('btn-light');
                });

                // Add active class to clicked button
                this.classList.add('active', 'btn-primary');
                this.classList.remove('btn-light');

                // Get the mood from the icon class
                const iconElement = this.querySelector('i');
                selectedMood = '';

                if (iconElement.classList.contains('fa-sad-cry')) selectedMood = 'very sad';
                else if (iconElement.classList.contains('fa-frown')) selectedMood = 'sad';
                else if (iconElement.classList.contains('fa-meh')) selectedMood = 'neutral';
                else if (iconElement.classList.contains('fa-smile')) selectedMood = 'happy';
                else if (iconElement.classList.contains('fa-grin-stars')) selectedMood = 'very happy';

                console.log('Selected mood:', selectedMood);
            });
        });

        moodSubmitButton.addEventListener('click', function () {
            const moodDescription = moodTextarea.value.trim();

            if (!selectedMood) {
                showNotification('Please select a mood first', 'warning');
                return;
            }

            // Process mood data
            const moodData = {
                mood: selectedMood,
                description: moodDescription,
                timestamp: new Date().toISOString()
            };

            console.log('Mood submitted:', moodData);

            // Analyze mood with AI (simulated)
            const analysis = analyzeMood(moodDescription || selectedMood);

            // Show success message with insights
            showNotification(`Mood recorded: ${selectedMood}. ${analysis.suggestions[0]}`, 'success');

            // Reset mood tracker
            moodButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-light');
            });
            moodTextarea.value = '';
            selectedMood = '';

            // Store in local storage (simulated)
            storeMoodData(moodData);
        });
    }

    // Career Explorer Search Functionality
    const careerSearchButton = document.querySelector('.career-search button');
    const careerSearchInput = document.querySelector('.career-search input');

    if (careerSearchButton && careerSearchInput) {
        careerSearchButton.addEventListener('click', handleCareerSearch);
        careerSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleCareerSearch();
            }
        });
    }

    // Scholarship Search Functionality
    const scholarshipSearchButton = document.querySelector('.scholarship-search button');
    if (scholarshipSearchButton) {
        scholarshipSearchButton.addEventListener('click', handleScholarshipSearch);
    }

    // Form Validation for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Counseling form submission
    const counselingForm = document.querySelector('#counselingModal form');
    if (counselingForm) {
        counselingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                // Simulate form submission
                showNotification('Counseling session scheduled successfully! You will receive a confirmation email shortly.', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('counselingModal'));
                modal.hide();
            }
        });
    }

    // Login/Register form handling
    const loginForm = document.querySelector('#login-tab-pane form');
    const registerForm = document.querySelector('#register-tab-pane form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                showNotification('Login successful!', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                showNotification('Registration successful! Welcome to Prerna.', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
            }
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim()) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            }
        });
    }

    // Initialize AI systems
    initializeAIChat();
    careerRecommendationSystem = new CareerRecommendationSystem();

    // Initialize Focus Mode
    initializeFocusMode();
});

// Focus Mode Implementation
function initializeFocusMode() {
    // Create focus mode button in the resources section
    const resourcesSection = document.querySelector('#resources');
    if (resourcesSection) {
        const focusCard = document.createElement('div');
        focusCard.className = 'col-md-6 col-lg-3';
        focusCard.innerHTML = `
            <div class="resource-card h-100 rounded shadow-sm overflow-hidden">
                <div class="p-3 text-center">
                    <i class="fas fa-hourglass-half text-primary fa-3x mb-3"></i>
                    <h3 class="h6 fw-bold">Focus Mode</h3>
                    <p class="small">Pomodoro timer for productive study sessions</p>
                    <button class="btn btn-sm btn-primary" id="focusModeBtn">Start Focus Mode</button>
                </div>
            </div>
        `;

        const resourcesGrid = resourcesSection.querySelector('.row');
        if (resourcesGrid) {
            resourcesGrid.appendChild(focusCard);

            // Add event listener
            setTimeout(() => {
                const focusBtn = document.getElementById('focusModeBtn');
                if (focusBtn) {
                    focusBtn.addEventListener('click', startFocusMode);
                }
            }, 100);
        }
    }
}

function startFocusMode() {
    // Create focus mode overlay
    const overlay = document.createElement('div');
    overlay.id = 'focusOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
    `;

    overlay.innerHTML = `
        <div class="text-center">
            <h2 class="mb-4">Focus Mode</h2>
            <div id="focusTimer" class="display-1 mb-4">25:00</div>
            <div class="mb-4">
                <button class="btn btn-success me-2" id="pauseBtn">Pause</button>
                <button class="btn btn-danger" id="stopBtn">Stop</button>
            </div>
            <p class="text-muted">Stay focused! Blocking distractions...</p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Timer functionality
    let focusTime = 25 * 60; // 25 minutes
    let isPaused = false;
    let timerInterval;

    function updateTimer() {
        if (!isPaused) {
            const minutes = Math.floor(focusTime / 60);
            const seconds = focusTime % 60;
            document.getElementById('focusTimer').textContent =
                `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (focusTime <= 0) {
                clearInterval(timerInterval);
                showNotification('Focus session completed! Time for a break.', 'success');
                stopFocusMode();
            }
            focusTime--;
        }
    }

    timerInterval = setInterval(updateTimer, 1000);

    // Button event listeners
    document.getElementById('pauseBtn').addEventListener('click', function () {
        isPaused = !isPaused;
        this.textContent = isPaused ? 'Resume' : 'Pause';
        this.className = isPaused ? 'btn btn-warning me-2' : 'btn btn-success me-2';
    });

    document.getElementById('stopBtn').addEventListener('click', stopFocusMode);

    function stopFocusMode() {
        clearInterval(timerInterval);
        overlay.remove();
        document.body.style.overflow = '';
        showNotification('Focus mode ended', 'info');
    }
}

// AI Video Counselor Implementation
function initializeAIVideoCounselor() {
    // This would integrate with webcam and AI emotion detection
    console.log('AI Video Counselor initialized');

    // Simulated emotion detection
    const videoCounselorBtn = document.createElement('button');
    videoCounselorBtn.textContent = 'Start Video Session';
    videoCounselorBtn.className = 'btn btn-primary mt-3';
    videoCounselorBtn.onclick = startVideoSession;

    // Add to counseling section
    const counselingSection = document.querySelector('#counseling');
    if (counselingSection) {
        counselingSection.querySelector('.container').appendChild(videoCounselorBtn);
    }
}

function startVideoSession() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                showNotification('Video session started. AI is analyzing your expressions...', 'info');

                // Simulate emotion detection
                setInterval(() => {
                    const emotions = ['neutral', 'sad', 'happy', 'anxious', 'focused'];
                    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];

                    // Provide feedback based on detected emotion
                    const feedback = {
                        'neutral': 'You seem calm and focused. How are you feeling today?',
                        'sad': 'I notice you might be feeling down. Would you like to talk about it?',
                        'happy': 'You seem positive today! That\'s great to see.',
                        'anxious': 'I sense some anxiety. Let\'s practice some breathing exercises.',
                        'focused': 'You appear very focused. Keep up the good work!'
                    };

                    console.log(`Detected emotion: ${detectedEmotion} - ${feedback[detectedEmotion]}`);

                }, 5000); // Simulate analysis every 5 seconds
            })
            .catch(function (error) {
                console.error('Error accessing webcam:', error);
                showNotification('Could not access webcam. Please check permissions.', 'error');
            });
    } else {
        showNotification('Webcam not available on this device', 'warning');
    }
}

// Handle Career Search
function handleCareerSearch() {
    const searchInput = document.querySelector('.career-search input').value.trim();
    if (searchInput) {
        // Show loading state
        const button = document.querySelector('.career-search button');
        const originalText = button.textContent;
        button.textContent = 'Searching...';
        button.disabled = true;

        setTimeout(() => {
            const results = simulateCareerSearch(searchInput);
            displayCareerResults(results);

            // Restore button state
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    } else {
        showNotification('Please enter some skills or interests to search', 'warning');
    }
}

// Handle Scholarship Search
function handleScholarshipSearch() {
    const educationLevel = document.querySelector('.scholarship-search select:nth-of-type(1)').value;
    const fieldOfInterest = document.querySelector('.scholarship-search select:nth-of-type(2)').value;

    if (educationLevel && fieldOfInterest && educationLevel !== 'Education Level' && fieldOfInterest !== 'Field of Interest') {
        // Show loading state
        const button = document.querySelector('.scholarship-search button');
        const originalText = button.textContent;
        button.textContent = 'Searching...';
        button.disabled = true;

        setTimeout(() => {
            const results = simulateScholarshipSearch(educationLevel, fieldOfInterest);
            displayScholarshipResults(results);

            // Restore button state
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    } else {
        showNotification('Please select both education level and field of interest', 'warning');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function storeMoodData(moodData) {
    // Simulate storing mood data (in real implementation, this would use localStorage or API)
    console.log('Storing mood data:', moodData);
    // localStorage.setItem('prernaMoodData', JSON.stringify(moodData));
}

function displayCareerResults(careers) {
    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'career-results mt-4';
    resultsContainer.innerHTML = `
        <h4 class="mb-3">Career Suggestions</h4>
        <div class="row g-3">
            ${careers.map((career, index) => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${career.title}</h5>
                            <p class="card-text small">${career.description}</p>
                            <div class="mb-2">
                                <strong>Skills:</strong> ${career.skills.join(', ')}
                            </div>
                            <div class="mb-2">
                                <strong>Education:</strong> ${career.education}
                            </div>
                            <div class="mb-2">
                                <strong>Salary:</strong> ${career.salary}
                            </div>
                            <div class="mb-3">
                                <strong>Growth:</strong> ${career.growth}
                            </div>
                            <button class="btn btn-sm btn-outline-primary" onclick="showCareerDetails(${index})">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Remove existing results if any
    const existingResults = document.querySelector('.career-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Add results after search box
    const searchContainer = document.querySelector('.career-search');
    searchContainer.parentNode.insertBefore(resultsContainer, searchContainer.nextSibling);
}

function displayScholarshipResults(scholarships) {
    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'scholarship-results mt-4';
    resultsContainer.innerHTML = `
        <h4 class="mb-3">Scholarship Opportunities</h4>
        <div class="row g-3">
            ${scholarships.map((scholarship, index) => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100'>
                        <div class="card-body">
                            <span class="badge bg-primary mb-2">${scholarship.type || 'Scholarship'}</span>
                            <h5 class="card-title">${scholarship.name}</h5>
                            <p class="card-text small">Provided by: ${scholarship.provider}</p>
                            <div class="mb-2">
                                <strong>Amount:</strong> ${scholarship.amount}
                            </div>
                            <div class="mb-2">
                                <strong>Deadline:</strong> ${scholarship.deadline}
                            </div>
                            <div class="mb-3">
                                <strong>Eligibility:</strong> ${scholarship.eligibility}
                            </div>
                            <a href="${scholarship.link}" class="btn btn-sm btn-primary">Apply Now</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Remove existing results if any
    const existingResults = document.querySelector('.scholarship-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Add results after search box
    const searchContainer = document.querySelector('.scholarship-search');
    searchContainer.parentNode.insertBefore(resultsContainer, searchContainer.nextSibling);
}

function showCareerDetails(index) {
    const careers = simulateCareerSearch('');
    const career = careers[index];

    // Create modal dynamically
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'careerDetailsModal';
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${career.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Description:</strong> ${career.description}</p>
                            <p><strong>Required Skills:</strong> ${career.skills.join(', ')}</p>
                            <p><strong>Education:</strong> ${career.education}</p>
                            <p><strong>Salary Range:</strong> ${career.salary}</p>
                            <p><strong>Growth Potential:</strong> ${career.growth}</p>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">Career Path Insights</h6>
                                    <p><strong>Demand:</strong> ${career.demand || 'High'}</p>
                                    <p><strong>Work-Life Balance:</strong> ${career.workLifeBalance || 'Good'}</p>
                                    <p><strong>Entry Level:</strong> ${career.entryLevel || 'Moderate'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <h6>Next Steps:</h6>
                        <ul>
                            <li>Research educational programs in this field</li>
                            <li>Connect with professionals in this career on LinkedIn</li>
                            <li>Look for internships or entry-level positions</li>
                            <li>Join relevant professional associations</li>
                            <li>Consider certification programs if applicable</li>
                        </ul>
                    </div>
                    <div class="mt-3">
                        <h6>Recommended Resources:</h6>
                        <div class="d-flex flex-wrap gap-2">
                            <a href="#" class="btn btn-sm btn-outline-primary">Online Courses</a>
                            <a href="#" class="btn btn-sm btn-outline-primary">Books</a>
                            <a href="#" class="btn btn-sm btn-outline-primary">Websites</a>
                            <a href="#" class="btn btn-sm btn-outline-primary">Communities</a>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveCareerInterest('${career.title}')">Save Interest</button>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('careerDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to document and show it
    document.body.appendChild(modalDiv);
    const modal = new bootstrap.Modal(document.getElementById('careerDetailsModal'));
    modal.show();

    // Remove modal from DOM when hidden
    modalDiv.addEventListener('hidden.bs.modal', function () {
        modalDiv.remove();
    });
}

// AI Mood Analysis
function analyzeMood(moodText) {
    const moodAnalysis = {
        sentiment: 'neutral',
        confidence: 0.7,
        keywords: [],
        suggestions: []
    };

    // Simple sentiment analysis
    const positiveWords = ['happy', 'good', 'great', 'excited', 'wonderful', 'amazing', 'fantastic', 'excellent'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'horrible', 'depressed', 'anxious', 'stressed'];
    const neutralWords = ['okay', 'fine', 'normal', 'neutral', 'average', 'regular'];

    const text = moodText.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
    });

    neutralWords.forEach(word => {
        if (text.includes(word)) neutralCount++;
    });

    // Determine sentiment
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
        moodAnalysis.sentiment = 'positive';
        moodAnalysis.confidence = positiveCount / (positiveCount + negativeCount + neutralCount);
        moodAnalysis.suggestions = [
            'Great to hear you\'re feeling positive! Keep that energy going.',
            'Consider journaling about what\'s making you feel good today.',
            'Share your positive mood with someone who might need encouragement.'
        ];
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        moodAnalysis.sentiment = 'negative';
        moodAnalysis.confidence = negativeCount / (positiveCount + negativeCount + neutralCount);
        moodAnalysis.suggestions = [
            'It\'s okay to not feel okay. Remember that setbacks are temporary.',
            'Try some deep breathing exercises or a short walk outside.',
            'Consider talking to a counselor if these feelings persist.'
        ];
    } else {
        moodAnalysis.sentiment = 'neutral';
        moodAnalysis.confidence = neutralCount / (positiveCount + negativeCount + neutralCount);
        moodAnalysis.suggestions = [
            'A neutral day is still a good day. Sometimes stability is what we need.',
            'Consider trying something new to add some excitement to your day.',
            'Practice mindfulness to stay present in the moment.'
        ];
    }

    // Extract keywords
    const words = text.split(/\s+/);
    moodAnalysis.keywords = words.filter(word =>
        word.length > 3 &&
        !['the', 'and', 'but', 'for', 'with', 'about', 'this', 'that'].includes(word)
    ).slice(0, 5);

    return moodAnalysis;
}

// Simulate Career Search
function simulateCareerSearch(query) {
    const allCareers = [
        {
            title: 'Data Scientist',
            description: 'Analyze and interpret complex data to help organizations make better decisions.',
            skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
            education: 'Bachelor\'s in Computer Science/Statistics',
            salary: '₹8-15 LPA',
            growth: 'Very High',
            demand: 'Extremely High',
            workLifeBalance: 'Good',
            entryLevel: 'Moderate'
        },
        {
            title: 'Digital Marketer',
            description: 'Promote products and services through digital channels like social media, SEO, and email.',
            skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics', 'Google Ads'],
            education: 'Bachelor\'s in Marketing/Business',
            salary: '₹4-9 LPA',
            growth: 'High',
            demand: 'High',
            workLifeBalance: 'Moderate',
            entryLevel: 'Easy'
        },
        {
            title: 'UI/UX Designer',
            description: 'Create user-friendly and visually appealing interfaces for websites and applications.',
            skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping'],
            education: 'Bachelor\'s in Design/Computer Science',
            salary: '₹6-12 LPA',
            growth: 'High',
            demand: 'High',
            workLifeBalance: 'Good',
            entryLevel: 'Moderate'
        },
        {
            title: 'Content Creator',
            description: 'Create engaging content for various platforms including YouTube, blogs, and social media.',
            skills: ['Writing', 'Video Editing', 'SEO', 'Social Media', 'Storytelling'],
            education: 'Any Bachelor\'s Degree',
            salary: '₹3-10 LPA (variable)',
            growth: 'High',
            demand: 'High',
            workLifeBalance: 'Flexible',
            entryLevel: 'Easy'
        },
        {
            title: 'Web Developer',
            description: 'Build and maintain websites and web applications using various programming languages.',
            skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
            education: 'Bachelor\'s in Computer Science',
            salary: '₹5-12 LPA',
            growth: 'High',
            demand: 'Very High',
            workLifeBalance: 'Good',
            entryLevel: 'Moderate'
        },
        {
            title: 'Graphic Designer',
            description: 'Create visual concepts to communicate ideas that inspire, inform, and captivate consumers.',
            skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Branding'],
            education: 'Bachelor\'s in Design/Arts',
            salary: '₹4-8 LPA',
            growth: 'Moderate',
            demand: 'High',
            workLifeBalance: 'Good',
            entryLevel: 'Moderate'
        }
    ];

    if (!query) return allCareers;

    const searchTerm = query.toLowerCase();
    return allCareers.filter(career =>
        career.title.toLowerCase().includes(searchTerm) ||
        career.description.toLowerCase().includes(searchTerm) ||
        career.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        career.education.toLowerCase().includes(searchTerm)
    );
}

// Simulate Scholarship Search
function simulateScholarshipSearch(educationLevel, fieldOfInterest) {
    const allScholarships = [
        {
            name: 'Second Chance Scholarship',
            type: 'Scholarship',
            provider: 'Prerna Foundation',
            amount: '₹50,000',
            deadline: 'September 30, 2023',
            eligibility: 'Students who appeared for NEET/JEE in 2023',
            link: '#',
            educationLevel: 'Undergraduate',
            field: 'Any'
        },
        {
            name: 'Tech Innovation Grant',
            type: 'Scholarship',
            provider: 'Indian Tech Council',
            amount: '₹75,000',
            deadline: 'October 15, 2023',
            eligibility: 'Students pursuing technology-related courses',
            link: '#',
            educationLevel: 'Undergraduate',
            field: 'Science & Technology'
        },
        {
            name: 'Creative Arts Fellowship',
            type: 'Scholarship',
            provider: 'National Arts Foundation',
            amount: '₹40,000',
            deadline: 'November 1, 2023',
            eligibility: 'Students in arts and design programs',
            link: '#',
            educationLevel: 'Undergraduate',
            field: 'Arts & Humanities'
        },
        {
            name: 'Healthcare Future Leaders',
            type: 'Scholarship',
            provider: 'Health Ministry of India',
            amount: '₹1,00,000',
            deadline: 'December 15, 2023',
            eligibility: 'Students in healthcare-related fields',
            link: '#',
            educationLevel: 'Undergraduate',
            field: 'Healthcare & Medicine'
        },
        {
            name: 'Business Leadership Award',
            type: 'Scholarship',
            provider: 'Indian Business Association',
            amount: '₹60,000',
            deadline: 'January 10, 2024',
            eligibility: 'Business and management students',
            link: '#',
            educationLevel: 'Undergraduate',
            field: 'Business & Management'
        },
        {
            name: 'Vocational Excellence Grant',
            type: 'Scholarship',
            provider: 'Skill Development Ministry',
            amount: '₹25,000',
            deadline: 'Ongoing',
            eligibility: 'Students in vocational training programs',
            link: '#',
            educationLevel: 'Diploma/Certificate',
            field: 'Vocational Training'
        }
    ];

    return allScholarships.filter(scholarship => {
        const matchesEducation = educationLevel === 'Any' ||
            scholarship.educationLevel.toLowerCase().includes(educationLevel.toLowerCase());
        const matchesField = fieldOfInterest === 'Any' ||
            scholarship.field.toLowerCase().includes(fieldOfInterest.toLowerCase());
        return matchesEducation && matchesField;
    });
}

// AI Chat System
function initializeAIChat() {
    console.log('AI Chat system initialized');
    anonymousChatSystem = new AnonymousChatSystem();

    // Create chat widget in the footer
    const chatWidget = document.createElement('div');
    chatWidget.id = 'aiChatWidget';
    chatWidget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: white;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: transform 0.2s;
    `;
    chatWidget.innerHTML = '<i class="fas fa-comment-dots text-primary fa-2x"></i>';
    chatWidget.title = 'Chat with AI Counselor';

    chatWidget.addEventListener('click', function () {
        anonymousChatSystem.openChat();
    });

    chatWidget.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    chatWidget.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });

    document.body.appendChild(chatWidget);
}

// Career Recommendation System Class
class CareerRecommendationSystem {
    constructor() {
        this.userProfile = {
            skills: [],
            interests: [],
            educationLevel: '',
            preferredIndustries: []
        };
        console.log('Career Recommendation System initialized');
    }

    analyzeProfile(userData) {
        this.userProfile = { ...this.userProfile, ...userData };
        return this.generateRecommendations();
    }

    generateRecommendations() {
        const allCareers = simulateCareerSearch('');
        const scoredCareers = allCareers.map(career => {
            let score = 0;

            // Score based on skills match
            const skillMatch = career.skills.filter(skill =>
                this.userProfile.skills.includes(skill)
            ).length;
            score += skillMatch * 2;

            // Score based on education level
            if (this.userProfile.educationLevel &&
                career.education.toLowerCase().includes(this.userProfile.educationLevel.toLowerCase())) {
                score += 3;
            }

            // Score based on industry preference
            if (this.userProfile.preferredIndustries.length > 0) {
                const industryMatch = this.userProfile.preferredIndustries.some(industry =>
                    career.description.toLowerCase().includes(industry.toLowerCase())
                );
                if (industryMatch) score += 2;
            }

            return { career, score };
        });

        // Sort by score and return top 3
        return scoredCareers
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.career);
    }

    saveUserInterest(careerTitle) {
        console.log(`User interested in: ${careerTitle}`);
        // In real implementation, this would save to database
        showNotification(`Interest in ${careerTitle} saved!`, 'success');
    }
}

// Anonymous Chat System Class
class AnonymousChatSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentSessionId = this.generateSessionId();
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    openChat() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.createChatInterface();
        this.addMessage('AI Counselor', 'Hello! I\'m here to help. How are you feeling today?', 'received');
    }

    createChatInterface() {
        const chatOverlay = document.createElement('div');
        chatOverlay.id = 'chatOverlay';
        chatOverlay.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 450px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        chatOverlay.innerHTML = `
            <div class="chat-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">AI Counselor</h6>
                    <small>Online - Anonymous</small>
                </div>
                <button class="btn btn-sm btn-light" onclick="anonymousChatSystem.closeChat()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages flex-grow-1 p-3" style="overflow-y: auto;">
                <div class="message received">
                    <div class="message-content">Hello! I'm here to help. How are you feeling today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
            <div class="chat-input p-3 border-top">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Type your message..." id="chatInput">
                    <button class="btn btn-primary" onclick="anonymousChatSystem.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatOverlay);

        // Add event listener for Enter key
        const chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        chatInput.focus();
    }

    addMessage(sender, text, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ sender, text, timestamp: new Date(), type });
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (message) {
            this.addMessage('You', message, 'sent');
            input.value = '';

            // Simulate AI response
            setTimeout(() => {
                this.generateAIResponse(message);
            }, 1000);
        }
    }

    generateAIResponse(userMessage) {
        const responses = {
            'hello': 'Hello! How can I help you today?',
            'hi': 'Hi there! What\'s on your mind?',
            'sad': 'I\'m sorry to hear you\'re feeling sad. Would you like to talk about what\'s bothering you?',
            'anxious': 'It sounds like you might be feeling anxious. Try taking some deep breaths - inhale for 4 counts, hold for 4, exhale for 4.',
            'stressed': 'Stress can be overwhelming. Remember to take breaks and practice self-care. What specifically is causing you stress?',
            'failed': 'Failing an exam doesn\'t define your worth. Many successful people faced setbacks before finding their path. What are you interested in exploring now?',
            'career': 'I can help you explore alternative career paths. What skills or interests do you have?',
            'study': 'Studying can be challenging. Have you tried different learning techniques like the Pomodoro method or spaced repetition?',
            'future': 'The future can seem uncertain, but every step forward is progress. What are your main concerns about the future?',
            'default': 'I understand. Could you tell me more about how you\'re feeling? I\'m here to listen and help.'
        };

        const lowerMessage = userMessage.toLowerCase();
        let response = responses.default;

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        this.addMessage('AI Counselor', response, 'received');
    }

    closeChat() {
        const chatOverlay = document.getElementById('chatOverlay');
        if (chatOverlay) {
            chatOverlay.remove();
        }
        this.isOpen = false;
        console.log('Chat session ended. Messages:', this.messages);
    }
}

// Utility function to save career interest
function saveCareerInterest(careerTitle) {
    if (careerRecommendationSystem) {
        careerRecommendationSystem.saveUserInterest(careerTitle);
    } else {
        showNotification('Interest saved! We\'ll help you explore ' + careerTitle, 'success');
    }
}

// Additional utility functions
function trackUserEngagement(action, data = {}) {
    console.log('User action:', action, data);
    // In real implementation, this would send data to analytics
}

function provideStudyTips() {
    const tips = [
        'Use the Pomodoro technique: 25 minutes study, 5 minutes break',
        'Create a dedicated study space free from distractions',
        'Break large topics into smaller, manageable chunks',
        'Use active recall instead of passive reading',
        'Teach what you\'ve learned to someone else',
        'Get enough sleep - it\'s crucial for memory consolidation',
        'Stay hydrated and take regular movement breaks'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Initialize video counselor if not already done
if (typeof initializeAIVideoCounselor === 'function') {
    // Wait for DOM to be fully loaded before initializing video counselor
    setTimeout(() => {
        initializeAIVideoCounselor();
    }, 2000);
}

// Export functions for global access (if needed)
window.saveCareerInterest = saveCareerInterest;
window.trackUserEngagement = trackUserEngagement;
window.provideStudyTips = provideStudyTips;

