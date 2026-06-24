// console.log(window.document.body)
// window.console.log("HI")
// document.body.style.background='green'
// document.body.childNodes[1].innerText='hi'
// console.log(document.body.childNodes[1].innerText)
// let heading = document.getElementById("name");
// console.log(heading)
// let heading2 = document.querySelector("#name");
// console.log(heading2)
// const rep=document.body.style.background='green'
// console.log(window.document.body)
// console.dir(window.document.body)
// let firstPara = document.querySelector("p");  
// let paras = document.getElementsByTagName("p");
// console.dir(paras);
// console.log(paras);
// console.dir(firstPara);
// console.log(firstPara);

const curatedProjects = [
    {
        id: "curated-1",
        title: "Personal Developer Hub",
        overview: "A live-deployed, fully responsive portfolio page integrated with asynchronous third-party widget platforms.",
        tech: ["HTML/CSS", "JavaScript ES6", "Fetch API"],
        details: "W1 Project: Designed and deployed a live portfolio baseline structure, upgraded with asynchronous dynamic DOM assembly components on Day 2.",
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: "curated-2",
        title: "Full-Stack Task Manager REST API",
        overview: "A production-grade web app featuring decoupled client-server architecture, database indexing, and secure token access profiles.",
        tech: ["React", "Node.js", "Express", "MongoDB Atlas"],
        details: "W2 Project: Built an end-to-end microservice architecture application. Connected live MongoDB drivers to Express routers.",
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: "curated-3",
        title: "Demo",
        overview: "A production-grade web app featuring decoupled client-server architecture, database indexing, and secure token access profiles.",
        tech: [],
        details: "W2 Project: Built an end-to-end microservice architecture application. Connected live MongoDB drivers to Express routers.",
        demoLink: "#",
        githubLink: "#"
    }
];

/**
 * 
 *         <div class="grid-container projects-grid" id="projects-grid">
            Hi , i am div
        </div>
 */

let  allProjects=[...curatedProjects]
function renderProjects() {
    const container = document.getElementById("projects-grid");
    if (!container) return;

    container.innerHTML = "";

    

    allProjects.forEach(project => {
        const card = document.createElement("div");
        card.className = "card project-card";
        // <div class="card project-card"></div>

        const techBadges = project.tech && project.tech.length > 0
            ? project.tech.map(t => `<span>${t}</span>`).join("")
            : `<span>NA</span>`;

        card.innerHTML = `
            <h3>${project.title}</h3>
            <p class="overview">${project.overview || "Public project code repository."}</p>
            <div class="tech-stack">
                ${techBadges}
            </div>
            <div class="card-actions">
                <button class="btn info-btn" data-id="${project.id}">View Details</button>
                <div class="links">
                    <a href="${project.demoLink || '#'}" target="_blank" ${project.demoLink ? '' : 'style="display:none;"'}>Live Demo</a>
                    <a href="${project.githubLink || '#'}" target="_blank">GitHub</a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

async function fetchRealGithubRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/1rn19cs003/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error("Failed to stream repositories");
        
        const repos = await response.json();
        
        const fetchedRepos = repos
            .filter(repo => !repo.fork)
            .map(repo => ({
                id: repo.id,
                title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
                overview: repo.description || "Public source code repository hosted on GitHub.",
                tech: repo.language ? [repo.language] : [],
                details: `Created on ${new Date(repo.created_at).toLocaleDateString()}. Last update pushed on ${new Date(repo.updated_at).toLocaleDateString()}. Open issues: ${repo.open_issues_count}.`,
                demoLink: repo.homepage || null,
                githubLink: repo.html_url
            }));
            
        allProjects = [...curatedProjects, ...fetchedRepos];

        console.log({allProjects})
        renderProjects();
    } catch (error) {
        console.error("Error updating dynamic projects layout grid:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    renderProjects();
    await fetchRealGithubRepos();
});
