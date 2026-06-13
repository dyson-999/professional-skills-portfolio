// ==========================================================================
// STANDALONE PROJECT COMPLETION REPORT VIEWER MODULE
// ==========================================================================
let reportCurrentPage = 1;
const reportTotalPages = 14;

window.reportPrevPage = function() {
    if (reportCurrentPage > 1) {
        window.updateReportPage(reportCurrentPage - 1);
    }
};

window.reportNextPage = function() {
    if (reportCurrentPage < reportTotalPages) {
        window.updateReportPage(reportCurrentPage + 1);
    }
};

window.zoomReportPage = function() {
    const pageImg = document.getElementById("report-page-img");
    if (pageImg && window.openLightbox) {
        window.openLightbox(
            pageImg.src,
            `Community Project Completion Report - Page ${reportCurrentPage} of ${reportTotalPages}`,
            true
        );
    }
};

window.updateReportPage = function(pageIndex) {
    const prevBtn = document.getElementById("report-prev-btn");
    const nextBtn = document.getElementById("report-next-btn");
    const pageImg = document.getElementById("report-page-img");
    const pageIndicator = document.getElementById("report-page-indicator");

    if (!prevBtn || !nextBtn || !pageImg || !pageIndicator) {
        return;
    }

    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > reportTotalPages) pageIndex = reportTotalPages;
    reportCurrentPage = pageIndex;

    const twoDigitIndex = reportCurrentPage.toString().padStart(2, "0");
    pageImg.src = `assets/group-project-report/COMMUNITY PROJECT COMPLETION REPORT- Group 13-${twoDigitIndex}.png`;
    pageImg.alt = `Report Page ${reportCurrentPage}`;
    pageIndicator.innerText = `Page ${reportCurrentPage} of ${reportTotalPages}`;

    // Enable/disable navigation indicators
    prevBtn.disabled = reportCurrentPage === 1;
    nextBtn.disabled = reportCurrentPage === reportTotalPages;
    
    prevBtn.style.opacity = reportCurrentPage === 1 ? "0.3" : "1";
    prevBtn.style.cursor = reportCurrentPage === 1 ? "not-allowed" : "pointer";
    nextBtn.style.opacity = reportCurrentPage === reportTotalPages ? "0.3" : "1";
    nextBtn.style.cursor = reportCurrentPage === reportTotalPages ? "not-allowed" : "pointer";
};

// ==========================================================================
// THEME TOGGLE & MANAGEMENT MODULE
// ==========================================================================
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-toggle-icon");
    if (!themeToggle || !themeIcon) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || window.location.search.includes("theme=light")) {
        document.body.classList.add("light-mode");
        themeIcon.setAttribute("data-lucide", "moon");
        if (window.lucide) window.lucide.createIcons();
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        
        themeIcon.setAttribute("data-lucide", isLight ? "moon" : "sun");
        if (window.lucide) window.lucide.createIcons();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize theme first
    initTheme();

    // Initialize report viewer immediately
    if (typeof window.updateReportPage === "function") {
        window.updateReportPage(1);
    }
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Navigation & Sidebar Control
    initNavigation();

    // 3. Canvas Starfield Background
    initStarfield();

    // 4. Render Lecture Cards & Manage Modals
    initLectures();

    // 5. Initialize Interactive Tools
    initJohariWindow();
    initMockInterview();
    initEthicsQuiz();
    initMoMGenerator();
    initContactForm();
    initGalleryLightbox();
});

/* ==========================================================================
   NAVIGATION LOGIC
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    const mobileToggle = document.getElementById("mobile-toggle");
    const sidebar = document.querySelector(".sidebar");

    // Section Switching
    window.switchSection = function(targetId) {
        // Remove active from links
        navLinks.forEach(link => {
            if (link.getAttribute("data-target") === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Toggle sections
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });

        // Scroll main content to top
        document.querySelector(".main-content").scrollTop = 0;

        // Close sidebar on mobile after clicking
        sidebar.classList.remove("active");
        const toggleIcon = mobileToggle.querySelector("i");
        if (toggleIcon) {
            toggleIcon.setAttribute("data-lucide", "menu");
            if (window.lucide) window.lucide.createIcons();
        }
    };

    // Nav Links Click Listeners
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            switchSection(targetId);
            // Update hash without jumping
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Handle initial hash routing
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchSection(hash);
    }

    // Mobile Toggle Menu
    mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        const isOpen = sidebar.classList.contains("active");
        const iconName = isOpen ? "x" : "menu";
        mobileToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (window.lucide) window.lucide.createIcons();
    });
}

/* ==========================================================================
   CANVAS STARFIELD BACKGROUND
   ========================================================================== */
function initStarfield() {
    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d");

    let stars = [];
    const starCount = 100;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse positions for subtle interactive stellar drift
    let mouse = { x: width / 2, y: height / 2, active: false };

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5; // Starlight size
            this.speed = Math.random() * 0.05 + 0.01; // Drift speed
            this.opacity = Math.random() * 0.8 + 0.2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            // Drift stars horizontally (simulating orbital movement)
            this.x -= this.speed;

            // Twinkle effect
            this.opacity += this.twinkleSpeed * this.twinkleDirection;
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.twinkleDirection = -1;
            } else if (this.opacity <= 0.1) {
                this.opacity = 0.1;
                this.twinkleDirection = 1;
            }

            // Interactive response to mouse coordinates
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    // Pull stars slightly towards the mouse
                    this.x += (dx / dist) * 0.2;
                    this.y += (dy / dist) * 0.2;
                }
            }

            // Warp around edges
            if (this.x < 0) {
                this.x = width;
                this.y = Math.random() * height;
            }
        }

        draw() {
            const isLightMode = document.body.classList.contains("light-mode");
            ctx.fillStyle = isLightMode 
                ? `rgba(168, 85, 247, ${this.opacity * 0.4})`
                : `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Render ambient dark cosmic dust
        const isLightMode = document.body.classList.contains("light-mode");
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 10,
            width / 2, height / 2, Math.max(width, height)
        );
        if (isLightMode) {
            gradient.addColorStop(0, "#f8fafc");
            gradient.addColorStop(1, "#cbd5e1");
        } else {
            gradient.addColorStop(0, "#0c0a22");
            gradient.addColorStop(1, "#050409");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    // Window Resize Handler
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });

    // Track cursor movement
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    init();
    animate();
}

/* ==========================================================================
   LECTURE CONTENT DATA & MODALS
   ========================================================================== */
const lecturesData = [
    {
        code: "L01",
        title: "Introduction to Employability Skills",
        desc: "Foundations of workplace readiness, comparing technical competencies with core soft skills.",
        duration: "Week 1 - 2 Hours",
        concepts: `
            <h4>Defining Employability Skills</h4>
            <p>Employability skills are the essential attributes, soft skills, and professional behaviors that enable individuals to secure employment, work collaboratively, and thrive in their careers.</p>
            
            <h4>Hard Skills vs. Soft Skills</h4>
            <ul>
                <li><strong>Hard Skills:</strong> Teachable, measurable abilities (e.g., setting up a Windows OS, writing Python code, configuring networks).</li>
                <li><strong>Soft Skills:</strong> Interpersonal traits and cognitive abilities (e.g., active listening, troubleshooting customer frustration, adaptability).</li>
            </ul>

            <h4>Values, Beliefs, & Character</h4>
            <p>At the core of professional skills are personal values (integrity, reliability) and attitudes that dictate workplace ethics and productivity.</p>
        `,
        worksheets: `
            <h4>Worksheet 1: Categorizing Workplace Skills</h4>
            <p>In this activity, we categorized 20 workplace skills into three distinct categories:</p>
            <ul>
                <li><strong>Technical Skills:</strong> Java programming, SQL database management, data analysis, Excel proficiency.</li>
                <li><strong>Soft Skills:</strong> Time management, communication, conflict resolution, active listening.</li>
                <li><strong>Transferable Skills:</strong> Problem-solving, adaptability, critical thinking, decision making.</li>
            </ul>
            <p><strong>Takeaway:</strong> Problems solving and active listening are highly transferable; they are as essential for an IT technician as they are for a project manager.</p>
        `,
        reflections: `
            <p>As an IT undergraduate, this lecture helped me realize that technical expertise (hard skills) is only half the equation. My work as an IT Support Assistant at Arpico SuperCenter immediately put this into perspective.</p>
            <p>When an office staff member experiences a system crash, they are often stressed. Fixing the hardware requires hard skills, but calming the user, explaining the solution without technical jargon, and managing their expectation requires soft skills. Auditing my skills showed me that I should continuously develop my communication alongside my web programming skills.</p>
        `
    },
    {
        code: "L02",
        title: "CV & Cover Letter Writing",
        desc: "Structuring professional curriculum vitaes and writing persuasive, tailored cover letters.",
        duration: "Week 2 - 2 Hours",
        concepts: `
            <h4>CV vs. Resume</h4>
            <p>A CV (Curriculum Vitae) is a detailed, multi-page overview of academic credentials, work experience, projects, and achievements. A Resume is a concise, one-page summary targeted at a specific job role.</p>
            
            <h4>Structure of a Professional CV</h4>
            <ul>
                <li><strong>Header:</strong> Name, professional title, clean email, phone, LinkedIn, and GitHub links.</li>
                <li><strong>Summary:</strong> High-impact paragraph highlighting value proposition.</li>
                <li><strong>Experience:</strong> Chronological listing of roles, using action verbs to detail achievements.</li>
                <li><strong>Education:</strong> Degrees, diplomas, and relevant academic coursework.</li>
                <li><strong>Skills:</strong> Grouped logically (e.g., Web Dev, Troubleshooting).</li>
                <li><strong>Projects:</strong> Showing off personal builds and individual technical capability.</li>
            </ul>

            <h4>Persuasive Cover Letters</h4>
            <p>Cover letters bridge your CV to a specific job description. They should use a formal register, demonstrate research on the target organization, and show how your skills solve their specific pain points.</p>
        `,
        worksheets: `
            <h4>CV Correction & Job Match Activity</h4>
            <p>We analyzed standard job descriptions (e.g., IT Support Intern) and mapped specific lines of a candidate's CV to the requirements. We also identified errors in sample resumes (such as informal email addresses like "coolgamer123@email.com", missing dates, and lack of structural hierarchy).</p>
        `,
        reflections: `
            <p>Before this lecture, my CV was unstructured and had generic summaries. I applied these guidelines directly to write my professional CV (available in the Profile section).</p>
            <p>I structured my experience at Arpico to showcase not just what I did (e.g., "fixed computers") but the value it added (e.g., "Assisted in setting up new workstations, installing OS, and resetting user credentials to keep business systems operational"). I also made sure to highlight my GitHub projects, GGDy Gaming Store and Proxima Squad Stats Bot, as proof of my technical competence.</p>
        `
    },
    {
        code: "L03",
        title: "Interview Skills",
        desc: "Mastering the interview process, from body language to structuring answers using the STAR method.",
        duration: "Week 3 - 2 Hours",
        concepts: `
            <h4>Interview Phases</h4>
            <p>Preparation is key. Research the company's culture, core products, and review the job specifications.</p>
            
            <h4>The STAR Method</h4>
            <p>A structured framework to answer behavioral interview questions:</p>
            <ul>
                <li><strong>S - Situation:</strong> Set the context of the challenge you faced.</li>
                <li><strong>T - Task:</strong> Describe the objective or challenge you had to solve.</li>
                <li><strong>A - Action:</strong> Detail the specific actions you took (focus on your contribution).</li>
                <li><strong>R - Result:</strong> Share the positive outcome, ideally quantified.</li>
            </ul>

            <h4>First Impressions & Decorum</h4>
            <p>Body language, maintaining eye contact, professional posture, active listening, and speaking at an even speed dictate first impressions.</p>
        `,
        worksheets: `
            <h4>Mock Interview Workbook</h4>
            <p>We practiced responding to common interview questions such as "Tell me about yourself" and "What is your biggest weakness?". We performed peer reviews to rate eye contact, confidence levels, and structure of responses.</p>
        `,
        reflections: `
            <p>Answering open questions under pressure used to make me nervous. Practicing the STAR method gave me a logical anchor. When mock interviewers asked me how I handle tight deadlines, I could structure my answer around my SLIIT project timelines, describing my role in setting up database architectures and completing the code on schedule.</p>
            <p>This lecture taught me that interviews are a two-way conversation. Now, I always prepare thoughtful questions to ask the interviewer about their system architecture and team structure, showing my genuine technical interest.</p>
        `
    },
    {
        code: "L04",
        title: "Negotiation Skills",
        desc: "Understanding distributive vs integrative negotiation, aiming for principled, win-win outcomes.",
        duration: "Week 4 - 2 Hours",
        concepts: `
            <h4>Distributive vs. Integrative Negotiation</h4>
            <ul>
                <li><strong>Distributive:</strong> A win-lose, zero-sum game (e.g., bargaining purely on price).</li>
                <li><strong>Integrative (Principled):</strong> Collaborative problem-solving to expand options so both parties achieve a win-win outcome.</li>
            </ul>

            <h4>The 4 Pillars of Principled Negotiation</h4>
            <p>Derived from the Harvard Negotiation Project:</p>
            <ul>
                <li>Separate the people from the problem.</li>
                <li>Focus on interests, not positions.</li>
                <li>Generate a variety of possibilities before deciding what to do.</li>
                <li>Insist that the result be based on some objective criteria.</li>
            </ul>
        `,
        worksheets: `
            <h4>Case Study: The Orange Conflict & Project Deadlines</h4>
            <p>We ran simulations where two parties claimed a resource. In the classic orange case, we realized that by discussing *why* each party needed the orange (one wanted the juice, the other wanted the peel), we reached a perfect integrative agreement that a distributive compromise (slicing it in half) would have ruined.</p>
        `,
        reflections: `
            <p>In IT, negotiation happens constantly. It might be negotiating code features with a development team, or negotiating support timelines with an office manager. This lecture taught me that compromise isn't always the best solution. Instead, by asking open-ended questions to discover the underlying interests of users, I can find solutions that satisfy everyone.</p>
        `
    },
    {
        code: "L05",
        title: "Introduction to Portfolio Writing",
        desc: "Understanding the role of self-reflection and portfolios in mapping academic and career growth.",
        duration: "Week 5 - 2 Hours",
        concepts: `
            <h4>What is a Learning Portfolio?</h4>
            <p>A portfolio is a curated collection of a student's work, reflections, and achievements. It is a living document demonstrating skills, growth, and academic progress over time.</p>
            
            <h4>Gibbs' Reflective Cycle</h4>
            <p>A structured approach for self-reflective writing:</p>
            <ol>
                <li><strong>Description:</strong> What happened?</li>
                <li><strong>Feelings:</strong> What were you thinking and feeling?</li>
                <li><strong>Evaluation:</strong> What was good and bad about the experience?</li>
                <li><strong>Analysis:</strong> What sense can you make of the situation?</li>
                <li><strong>Conclusion:</strong> What else could you have done?</li>
                <li><strong>Action Plan:</strong> If it arose again, what would you do?</li>
            </ol>
        `,
        worksheets: `
            <h4>Reflective Essay Drafting</h4>
            <p>We read sample student portfolios and evaluated them based on the depth of reflection. We noticed that high-scoring portfolios didn't just summarize lectures, but linked the lecture topics to personal career goals and analyzed areas of personal struggle.</p>
        `,
        reflections: `
            <p>This lecture inspired me to build this custom web-based portfolio. Instead of just writing text documents, I wanted to showcase my technical skills in HTML, CSS, and JS. Reflective writing has helped me slow down and analyze how my university studies tie into my IT support experience, converting day-to-day work into structured learning.</p>
        `
    },
    {
        code: "L06",
        title: "Facilitating & Conducting Meetings",
        desc: "Structuring professional meetings, managing roles, and drafting formal meeting minutes.",
        duration: "Week 6 - 2 Hours",
        concepts: `
            <h4>Roles in a Formal Meeting</h4>
            <ul>
                <li><strong>Chairperson:</strong> Drives the agenda, maintains decorum, and manages time.</li>
                <li><strong>Secretary (Minute Taker):</strong> Records attendance, key decisions, actions, and deadlines.</li>
                <li><strong>Participants:</strong> Contribute opinions, present topics, and execute action items.</li>
            </ul>

            <h4>Agenda vs. Minutes (MoM)</h4>
            <p>An agenda is sent out *before* the meeting to outline the topics to be discussed. Minutes of Meetings are the formal record compiled *after* the meeting, focusing on decisions and assigning actions (Who, What, By When).</p>
        `,
        worksheets: `
            <h4>Meeting Minutes Drafting Exercise</h4>
            <p>We watched a mock board meeting video, took notes, and drafted a formal Minutes of Meeting (MoM) document. We learned how to write concise actions, avoiding vague descriptions.</p>
        `,
        reflections: `
            <p>I realized that meetings in the tech industry can easily lose focus. Learning the proper structure of agendas and MoM documents is a direct way to improve productivity. I implemented a MoM template generator tool in my workbench to demonstrate this structure, ensuring actions and owners are clearly mapped.</p>
        `
    },
    {
        code: "L07",
        title: "Emotional Intelligence",
        desc: "Leveraging EQ to build self-awareness, manage stress, and communicate with empathy.",
        duration: "Week 7 - 2 Hours",
        concepts: `
            <h4>Goleman's 5 Domains of EQ</h4>
            <ol>
                <li><strong>Self-Awareness:</strong> Recognizing your own emotions and their triggers.</li>
                <li><strong>Self-Regulation:</strong> Controlling disruptive impulses and thinking before acting.</li>
                <li><strong>Internal Motivation:</strong> Being driven by values rather than external rewards.</li>
                <li><strong>Empathy:</strong> Understanding the emotional makeup of other people.</li>
                <li><strong>Social Skills:</strong> Managing relationships and building networks.</li>
            </ol>

            <h4>The Johari Window Model</h4>
            <p>A cognitive tool to map self-disclosure and feedback, dividing self-awareness into: Open, Blind, Hidden, and Unknown areas.</p>
        `,
        worksheets: `
            <h4>Johari Window Worksheet</h4>
            <p>We completed self-assessments and gathered peer feedback to plot our strengths in the Johari Window. The goal was to expand our "Open Area" by disclosing information and inviting constructive feedback.</p>
        `,
        reflections: `
            <p>In IT support roles, empathy and self-regulation are essential. When systems go down, emotions can run high. By keeping my emotions in check, I can solve issues logically and maintain professional relationships. Developing my Johari Window (available in the workbench) helped me see that seeking constructive feedback is the only way to uncover blind spots in my technical knowledge.</p>
        `
    },
    {
        code: "L08",
        title: "Personal Development Planning",
        desc: "Formulating a personal SWOT analysis and mapping goals using the SMART framework.",
        duration: "Week 8 - 2 Hours",
        concepts: `
            <h4>Personal SWOT Analysis</h4>
            <ul>
                <li><strong>Strengths:</strong> Internal capabilities, experiences, and soft skills you possess.</li>
                <li><strong>Weaknesses:</strong> Internal areas of struggle or lack of certifications.</li>
                <li><strong>Opportunities:</strong> External situations you can leverage (internships, courses).</li>
                <li><strong>Threats:</strong> External factors like market competition or tech disruptions.</li>
            </ul>

            <h4>SMART Goal Setting</h4>
            <p>Goals must be: <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant, and <strong>T</strong>ime-bound.</p>
        `,
        worksheets: `
            <h4>Drafting Career Action Plans</h4>
            <p>We drafted a 1-year personal development plan. I mapped out a SMART goal to secure an IT support/development internship and learn Docker/Kubernetes container orchestration by the end of my 2nd academic year.</p>
        `,
        reflections: `
            <p>Running a personal SWOT analysis helped me identify gaps in my skillset. While my experience at Arpico and my Python automation projects are solid strengths, I recognized that cloud deployment and public speaking are areas I need to focus on. Framing these as opportunities motivates me to seek presentation roles in university team tasks.</p>
        `
    },
    {
        code: "L09",
        title: "Professional & Email Etiquettes",
        desc: "Practicing netiquette, workplace decorum, and aligning with the IT Code of Ethics.",
        duration: "Week 9 - 2 Hours",
        concepts: `
            <h4>Email Netiquettes</h4>
            <p>Professional emails require descriptive subject lines, formal greetings, structured body text, clear action points, and a professional signature block.</p>
            
            <h4>Telephone Etiquettes</h4>
            <p>Greeting callers professionally, active listening, asking clarifying questions, taking notes, and verifying takeaways before hanging up.</p>

            <h4>IT Code of Ethics</h4>
            <p>Core guidelines for IT practitioners: maintaining user data privacy, avoiding conflicts of interest, reporting security vulnerabilities, and rejecting requests to install pirated software.</p>
        `,
        worksheets: `
            <h4>Email Writing Correction Tasks</h4>
            <p>We rewrote poorly structured, informal emails (e.g., emails containing text abbreviations, missing subject lines, or aggressive tones) into clear, professional communications.</p>
        `,
        reflections: `
            <p>At Arpico SuperCenter, I frequently communicate with different departments via email. This lecture helped me write clean emails with clear action points. The IT Code of Ethics section resonates with my day-to-day support work: keeping user credentials secure and protecting store inventory logs are responsibilities I take very seriously.</p>
        `
    },
    {
        code: "L10",
        title: "Dining & Grooming Etiquettes",
        desc: "Displaying professional decorum, understanding dress codes, and dining etiquette.",
        duration: "Week 10 - 2 Hours",
        concepts: `
            <h4>Professional Grooming & Dress Codes</h4>
            <ul>
                <li><strong>Business Formal:</strong> Suits, dress shirts, ties, polished dress shoes.</li>
                <li><strong>Business Casual:</strong> Chinos, collared shirts, blazers, loafers.</li>
            </ul>

            <h4>Dining Etiquette Standards</h4>
            <p>Rules for formal dinners:</p>
            <ul>
                <li>Cutlery is used from the outside in.</li>
                <li>Napkin goes on the lap immediately upon sitting.</li>
                <li>Bread plate is on your left, drinks are on your right.</li>
                <li>Signal you are finished by placing your fork and knife parallel at the 10:20 clock position.</li>
            </ul>
        `,
        worksheets: `
            <h4>Cutlery Placement & Decorum Quiz</h4>
            <p>We completed matching diagrams mapping complex multi-course table settings (soup spoons, salad forks, dessert utensils) and discussed social decorum guidelines during business lunches.</p>
        `,
        reflections: `
            <p>This final lecture reminded me that professional representation goes beyond code and technical skills. Grooming and dining etiquettes show respect for the setting and the people around you. Understanding these rules gives me confidence in formal settings, like networking events and client meetings, reflecting my attention to detail.</p>
        `
    }
];

function initLectures() {
    const grid = document.getElementById("lectures-grid");
    const modal = document.getElementById("lecture-modal");
    const closeBtn = document.getElementById("modal-close");
    
    const modalCode = document.getElementById("modal-lecture-code");
    const modalTitle = document.getElementById("modal-lecture-title");
    const paneConcepts = document.getElementById("modtab-concepts");
    const paneWorksheets = document.getElementById("modtab-worksheets");
    const paneReflections = document.getElementById("modtab-reflections");

    // Clear grid
    grid.innerHTML = "";

    // Render Lecture Cards
    lecturesData.forEach((lec) => {
        const card = document.createElement("div");
        card.className = "lecture-card glass animate-card";
        card.innerHTML = `
            <div class="lecture-badge">${lec.code}</div>
            <h3>${lec.title}</h3>
            <p>${lec.desc}</p>
            <div class="lecture-footer">
                <span><i data-lucide="clock" style="width:12px;height:12px;"></i> ${lec.duration}</span>
                <span>Read Reflections <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></span>
            </div>
        `;
        
        card.addEventListener("click", () => {
            openLectureModal(lec);
        });

        grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();

    // Modal tabs control
    const modTabs = document.querySelectorAll(".modal-tab");
    const modPanes = document.querySelectorAll(".modal-pane");

    modTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            modTabs.forEach(t => t.classList.remove("active"));
            modPanes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const paneId = `modtab-${tab.getAttribute("data-modtab")}`;
            document.getElementById(paneId).classList.add("active");
        });
    });

    function openLectureModal(lec) {
        modalCode.innerText = lec.code;
        modalTitle.innerText = lec.title;

        paneConcepts.innerHTML = lec.concepts;
        paneWorksheets.innerHTML = lec.worksheets;
        paneReflections.innerHTML = lec.reflections;

        // Reset to first tab
        modTabs.forEach(t => t.classList.remove("active"));
        modPanes.forEach(p => p.classList.remove("active"));
        modTabs[0].classList.add("active");
        modPanes[0].classList.add("active");

        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Disable background scrolling
    }

    function closeLectureModal() {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scrolling
    }

    closeBtn.addEventListener("click", closeLectureModal);
    
    // Close modal on background click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeLectureModal();
        }
    });
}

/* ==========================================================================
   INTERACTIVE TOOLS - JOHARI WINDOW
   ========================================================================== */
function initJohariWindow() {
    const adjectives = [
        "Able", "Accepting", "Adaptable", "Bold", "Brave", "Calm", "Caring", "Cheerful", "Clever",
        "Complex", "Confident", "Dependable", "Dignified", "Energetic", "Extroverted", "Friendly",
        "Giving", "Happy", "Helpful", "Idealistic", "Independent", "Ingenious", "Intelligent",
        "Introverted", "Kind", "Knowledgeable", "Logical", "Loving", "Mature", "Modest", "Nervous",
        "Observant", "Organized", "Patient", "Powerful", "Proud", "Quiet", "Reflective", "Relaxed",
        "Religious", "Responsive", "Searching", "Self-Assertive", "Self-Conscious", "Sensible",
        "Sentimental", "Shy", "Silly", "Spontaneous", "Sympathetic", "Systematic", "Tactful",
        "Tenacious", "Trustworthy", "Warm", "Wise", "Witty"
    ];

    // Dyson's profile setup
    const dysonSelf = ["Adaptable", "Calm", "Introverted", "Knowledgeable", "Logical", "Observant", "Reflective", "Systematic"];
    const dysonOthers = ["Friendly", "Helpful", "Knowledgeable", "Logical", "Observant", "Systematic", "Trustworthy", "Dependable"];

    const adjContainer = document.getElementById("johari-adjectives");
    const loadDysonBtn = document.getElementById("load-dyson-johari");
    const resetBtn = document.getElementById("reset-johari");

    // Populate Adjective Buttons
    adjContainer.innerHTML = "";
    adjectives.forEach(adj => {
        const btn = document.createElement("button");
        btn.className = "adj-btn";
        btn.innerText = adj;
        btn.addEventListener("click", () => {
            btn.classList.toggle("selected");
            updateJohariWindow();
        });
        adjContainer.appendChild(btn);
    });

    // Reset logic
    resetBtn.addEventListener("click", () => {
        document.querySelectorAll(".adj-btn").forEach(btn => btn.classList.remove("selected"));
        updateJohariWindow();
    });

    // Load Dyson's Profile
    loadDysonBtn.addEventListener("click", () => {
        document.querySelectorAll(".adj-btn").forEach(btn => {
            const adj = btn.innerText;
            if (dysonSelf.includes(adj)) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });
        updateJohariWindow(true);
    });

    function updateJohariWindow(isDysonPreset = false) {
        // Collect currently selected adjectives as 'self-selected'
        const selected = [];
        document.querySelectorAll(".adj-btn.selected").forEach(btn => {
            selected.push(btn.innerText);
        });

        // Determine what others say
        // If it is Dyson's preset, we use dysonOthers. Otherwise, we mock it by selecting a subset + random overlap.
        let othersList = [];
        if (isDysonPreset) {
            othersList = dysonOthers;
        } else {
            // Mock others lists: overlaps with some selected, plus a few others
            othersList = selected.filter((_, idx) => idx % 2 === 0);
            othersList.push("Friendly", "Helpful");
        }

        const openArea = [];
        const hiddenArea = [];
        const blindArea = [];
        const unknownArea = [];

        adjectives.forEach(adj => {
            const inSelf = selected.includes(adj);
            const inOthers = othersList.includes(adj);

            if (inSelf && inOthers) {
                openArea.push(adj);
            } else if (inSelf && !inOthers) {
                hiddenArea.push(adj);
            } else if (!inSelf && inOthers) {
                blindArea.push(adj);
            } else {
                // To keep lists clean, only show unknown if they are in a subset of common words
                if (unknownArea.length < 8 && Math.random() > 0.8) {
                    unknownArea.push(adj);
                }
            }
        });

        // Render Lists
        renderJohariList("johari-open", openArea);
        renderJohariList("johari-blind", blindArea);
        renderJohariList("johari-hidden", hiddenArea);
        renderJohariList("johari-unknown", unknownArea);
    }

    function renderJohariList(quadrantId, list) {
        const ul = document.querySelector(`#${quadrantId} .quadrant-list`);
        ul.innerHTML = "";
        list.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            ul.appendChild(li);
        });
    }

    // Run initial update
    updateJohariWindow();
}

/* ==========================================================================
   INTERACTIVE TOOLS - WORKBENCH TAB CONTROLS
   ========================================================================== */
const wTabs = document.querySelectorAll(".workbench-tab");
const wPanes = document.querySelectorAll(".tab-pane");

wTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        wTabs.forEach(t => t.classList.remove("active"));
        wPanes.forEach(p => p.classList.remove("active"));

        tab.classList.add("active");
        const tabId = `${tab.getAttribute("data-tab")}-tab`;
        document.getElementById(tabId).classList.add("active");
    });
});

/* ==========================================================================
   INTERACTIVE TOOLS - MOCK INTERVIEW SIMULATOR
   ========================================================================== */
function initMockInterview() {
    const questions = [
        {
            id: 1,
            q: "Tell me about yourself.",
            strategy: "Keep it to 2 minutes. Present chronologically: your current status (SLIIT undergraduate), your experience (IT support at Arpico), and why you are interested in this specific internship.",
            sample: "I am a second-year Higher Diploma in IT student at SLIIT. Over the past year, I have worked as an IT Support Assistant at Arpico SuperCenter, where I maintained store registers and resolved network errors. I also develop personal software, like a Python-based stats bot. I am looking to apply my troubleshooting and development skills in this systems intern role."
        },
        {
            id: 2,
            q: "What is your greatest strength, and how do you apply it?",
            strategy: "Choose a skill listed in the job description and support it with a concrete example. Focus on self-directed learning or problem-solving.",
            sample: "My greatest strength is self-directed learning and analytical problem solving. When building a Discord bot for a gaming server, I taught myself python.py libraries and integrated SQLite databases. Similarly, in my IT support job, I enjoy tracing hardware failures step-by-step to find the root cause."
        },
        {
            id: 3,
            q: "Describe a time you had to deal with a difficult customer or team member. How did you handle it?",
            strategy: "Use the STAR method. Keep the description professional, focus on empathy and collaboration, and share a positive outcome.",
            sample: "At Arpico, a staff member was angry because their workstation crashed during peak retail hours. I listened empathetically, acknowledged their stress, and worked quickly to restore the system. After resolving the issue, I showed them how to back up files to prevent future data losses, turning a stressful situation into a positive relationship."
        },
        {
            id: 4,
            q: "Why should we hire you for this IT role?",
            strategy: "Explain how your academic credentials combined with actual work experience makes you qualified. Show enthusiasm for their technology stack.",
            sample: "You should hire me because I combine academic training in IT infrastructure from SLIIT with actual, hands-on support experience at Arpico. I am familiar with the issues office staff face and have built projects using HTML, CSS, JS, and Python. I can step into support issues immediately and contribute to automation projects."
        }
    ];

    const qList = document.getElementById("interview-questions-list");
    const activePanel = document.getElementById("interview-active-panel");

    qList.innerHTML = "";
    questions.forEach(item => {
        const li = document.createElement("li");
        li.className = "q-item";
        li.innerText = item.q;
        li.addEventListener("click", () => {
            document.querySelectorAll(".q-item").forEach(qi => qi.classList.remove("active"));
            li.classList.add("active");
            showQuestion(item);
        });
        qList.appendChild(li);
    });

    function showQuestion(item) {
        activePanel.innerHTML = `
            <div class="active-question-card animate-card">
                <h3>${item.q}</h3>
                <div class="strategy-note">
                    <strong>Strategy Tip:</strong> ${item.strategy}
                </div>
                
                <div class="form-group">
                    <label for="user-answer">Draft Your Response:</label>
                    <textarea id="user-answer" rows="4" placeholder="Type your answer here using the STAR method..."></textarea>
                </div>
                
                <div class="actions-row">
                    <button id="show-sample-btn" class="btn btn-primary btn-sm">Compare with Sample Answer</button>
                    <button id="clear-answer-btn" class="btn btn-secondary btn-sm">Clear</button>
                </div>

                <div id="sample-answer-block" class="sample-answer-block" style="display: none;">
                    <h5>Professional Answering Strategy:</h5>
                    <p>${item.sample}</p>
                </div>
            </div>
        `;

        const showSampleBtn = document.getElementById("show-sample-btn");
        const sampleBlock = document.getElementById("sample-answer-block");
        const clearBtn = document.getElementById("clear-answer-btn");
        const textarea = document.getElementById("user-answer");

        showSampleBtn.addEventListener("click", () => {
            sampleBlock.style.display = "block";
            showSampleBtn.scrollIntoView({ behavior: "smooth" });
        });

        clearBtn.addEventListener("click", () => {
            textarea.value = "";
            sampleBlock.style.display = "none";
        });
    }
}

/* ==========================================================================
   INTERACTIVE TOOLS - IT ETHICS QUIZ
   ========================================================================== */
function initEthicsQuiz() {
    const scenarios = [
        {
            title: "Scenario 1: Unlocked HR System",
            desc: "You are resolving a keyboard issue at a workstation. The HR manager leaves for a meeting, leaving their desktop unlocked with a document open displaying employee salaries.",
            options: [
                { text: "Take a quick photo of the document to see if you are paid fairly compared to peers.", correct: false, feedback: "Incorrect. This violates client confidentiality and employee privacy policies." },
                { text: "Minimize the document, lock the screen, and leave a note asking the manager to keep the system locked.", correct: true, feedback: "Correct! Protecting company information and locking exposed terminals is the ethical duty of an IT support professional." },
                { text: "Read the salaries but do not tell anyone, keeping the information to yourself.", correct: false, feedback: "Incorrect. Accessing details you are not authorized to view is an ethical violation." }
            ]
        },
        {
            title: "Scenario 2: Software License Request",
            desc: "A branch manager asks you to install a copy of an expensive CAD program on their machine, using a license key registered to another user to save departmental costs.",
            options: [
                { text: "Install it as requested; the manager is responsible for licensing audits.", correct: false, feedback: "Incorrect. IT personnel should never install pirated or improperly licensed software." },
                { text: "Refuse, explain that this violates intellectual property laws, and offer to request a new license key.", correct: true, feedback: "Correct! Maintaining compliance with software licenses is crucial to protect the company from legal penalties." },
                { text: "Suggest downloading a cracked version of the software from a torrent site instead.", correct: false, feedback: "Incorrect. Torrenting cracked software exposes company networks to malware risks." }
            ]
        },
        {
            title: "Scenario 3: Discovered USB Drive",
            desc: "You find an unmarked USB flash drive on the floor of the office parking lot. You want to identify who owns it.",
            options: [
                { text: "Plug it into your office workstation to inspect files for the owner's name.", correct: false, feedback: "Incorrect. Plugging unknown USBs is a high security risk that can execute payloads/malware." },
                { text: "Hand the USB drive directly to the security team or corporate IT head for safe isolation testing.", correct: true, feedback: "Correct! Safety protocols dictate that unknown USBs should be isolated and never plugged into normal workstations." },
                { text: "Keep the USB drive, format it, and use it for your personal astronomy files.", correct: false, feedback: "Incorrect. Failing to report lost company assets or exposing networks to security risks is unethical." }
            ]
        }
    ];

    let currentIdx = 0;
    let score = 0;
    const container = document.getElementById("ethics-quiz-container");

    function loadScenario(idx) {
        if (idx >= scenarios.length) {
            showScoreCard();
            return;
        }

        const sc = scenarios[idx];
        container.innerHTML = `
            <div class="ethics-card">
                <div class="ethics-meta">
                    <span>IT ETHICS SCENARIOS</span>
                    <span>Scenario ${idx + 1} of ${scenarios.length}</span>
                </div>
                <h4>${sc.title}</h4>
                <p class="ethics-desc">${sc.desc}</p>
                <div class="ethics-options">
                    ${sc.options.map((opt, i) => `<button class="eth-opt" data-opt="${i}">${opt.text}</button>`).join("")}
                </div>
                <div id="ethics-feedback-block" class="ethics-feedback" style="display: none;"></div>
                <button id="ethics-next-btn" class="btn btn-primary btn-sm" style="display: none;">Next Scenario</button>
            </div>
        `;

        const optBtns = container.querySelectorAll(".eth-opt");
        const feedbackBlock = container.getElementById("ethics-feedback-block");
        const nextBtn = container.getElementById("ethics-next-btn");

        optBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const optIdx = parseInt(btn.getAttribute("data-opt"));
                const selectedOpt = sc.options[optIdx];

                // Disable all options
                optBtns.forEach(b => b.disabled = true);

                if (selectedOpt.correct) {
                    btn.classList.add("correct");
                    score++;
                    feedbackBlock.innerHTML = `<strong>Correct:</strong> ${selectedOpt.feedback}`;
                    feedbackBlock.style.borderLeftColor = "#10b981";
                } else {
                    btn.classList.add("wrong");
                    feedbackBlock.innerHTML = `<strong>Ethics Warning:</strong> ${selectedOpt.feedback}`;
                    feedbackBlock.style.borderLeftColor = "#ef4444";
                    
                    // Show which was correct
                    optBtns.forEach((b, i) => {
                        if (sc.options[i].correct) b.classList.add("correct");
                    });
                }

                feedbackBlock.style.display = "block";
                nextBtn.style.display = "inline-flex";
            });
        });

        nextBtn.addEventListener("click", () => {
            currentIdx++;
            loadScenario(currentIdx);
        });
    }

    function showScoreCard() {
        container.innerHTML = `
            <div class="ethics-score-card animate-card">
                <i data-lucide="shield-check" style="width:60px;height:60px;color:var(--accent-cyan);margin-bottom:1rem;"></i>
                <h4>Ethics Quiz Completed!</h4>
                <p>You scored ${score} out of ${scenarios.length} scenarios correctly.</p>
                <button id="restart-ethics-btn" class="btn btn-secondary btn-sm">Retake Quiz</button>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();

        document.getElementById("restart-ethics-btn").addEventListener("click", () => {
            currentIdx = 0;
            score = 0;
            loadScenario(currentIdx);
        });
    }

    loadScenario(currentIdx);
}

/* ==========================================================================
   INTERACTIVE TOOLS - MINUTES OF MEETING GENERATOR
   ========================================================================== */
function initMoMGenerator() {
    const generateBtn = document.getElementById("generate-mom");
    const copyBtn = document.getElementById("copy-mom");
    const preview = document.getElementById("mom-output");

    // Pre-fill current date/time
    const dateInput = document.getElementById("mom-date");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.value = now.toISOString().slice(0, 16);

    generateBtn.addEventListener("click", () => {
        const title = document.getElementById("mom-title").value.trim();
        const datetime = document.getElementById("mom-date").value;
        const attendees = document.getElementById("mom-attendees").value.trim();
        const agenda = document.getElementById("mom-agenda").value.trim();
        const decisions = document.getElementById("mom-decisions").value.trim();

        if (!title || !datetime || !attendees || !agenda || !decisions) {
            alert("Please fill in all details to generate the minutes.");
            return;
        }

        const dateFormatted = new Date(datetime).toLocaleString();

        const momText = `MINUTES OF MEETING (MoM)
===========================
PROJECT: ${title.toUpperCase()}
DATE/TIME: ${dateFormatted}
LOCATION: Virtual Project Room (MS Teams)

ATTENDEES:
---------------------------
${attendees.split(",").map(a => `- ${a.trim()}`).join("\n")}

MEETING AGENDA:
---------------------------
${agenda.split("\n").map(line => line.trim()).join("\n")}

DECISIONS & COMPILATION OF ACTION ITEMS:
---------------------------
${decisions.split("\n").map(line => line.trim()).join("\n")}

---------------------------
MINUTES COMPILED BY: Dilshan Udara (IT Secretary)
STATUS: DRAFT FOR REVIEW
`;

        preview.innerText = momText;
        copyBtn.disabled = false;
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(preview.innerText)
            .then(() => {
                const origText = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i data-lucide="check"></i> Copied!`;
                if (window.lucide) window.lucide.createIcons();
                setTimeout(() => {
                    copyBtn.innerHTML = origText;
                    if (window.lucide) window.lucide.createIcons();
                }, 2000);
            })
            .catch(err => {
                console.error("Clipboard copy failed: ", err);
            });
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION MOCKING
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("c-name").value;
        const email = document.getElementById("c-email").value;
        const msg = document.getElementById("c-msg").value;

        // Show a nice success overlay or alert
        alert(`Thank you, ${name}! Your mock message has been compiled.\nEmail details:\nFrom: ${email}\nMessage: "${msg.substring(0, 60)}..."`);
        form.reset();
    });
}

/* ==========================================================================
   INTERACTIVE GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    if (!lightbox) return;

    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    const galleryItems = document.querySelectorAll(".gallery-item");
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentIndex = index;

        const item = galleryItems[currentIndex];
        const img = item.querySelector("img");
        lightboxImg.src = img.src;
        lightboxCaption.innerText = img.alt;

        // Reset lightbox arrows and custom attributes
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
        lightbox.removeAttribute("data-is-custom");
    }

    // Expose openLightbox globally
    window.openLightbox = function(src, caption, hideArrows = false) {
        lightboxImg.src = src;
        lightboxCaption.innerText = caption;
        if (hideArrows) {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            lightbox.dataset.isCustom = "true";
        } else {
            prevBtn.style.display = "flex";
            nextBtn.style.display = "flex";
            lightbox.removeAttribute("data-is-custom");
        }
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    galleryItems.forEach((item, idx) => {
        item.addEventListener("click", () => {
            showImage(idx);
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden"; // Disable background scrolling
        });
    });

    const bannerGroupPhoto = document.getElementById("group-photo-banner-img");
    if (bannerGroupPhoto) {
        bannerGroupPhoto.addEventListener("click", () => {
            showImage(13); // 13 is the index of img_p13_2.png in galleryItems
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scrolling
    }

    closeBtn.addEventListener("click", closeLightbox);
    
    // Close on background click
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (lightbox.dataset.isCustom !== "true") {
            showImage(currentIndex - 1);
        }
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (lightbox.dataset.isCustom !== "true") {
            showImage(currentIndex + 1);
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (lightbox.dataset.isCustom !== "true") {
            if (e.key === "ArrowLeft") showImage(currentIndex - 1);
            if (e.key === "ArrowRight") showImage(currentIndex + 1);
        }
    });
}


