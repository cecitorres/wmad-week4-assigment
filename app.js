// Token value
const TOKEN = 'token_value';

// Get the ul with id of of userRepos
const cardContainer = document.getElementById('cardList');

// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {
    // Prevent default form submission action
    e.preventDefault();

    // Clean up the card container
    cardContainer.innerHTML = '';

    // Get the value of the GitHub username input field
    const gitHubRepoName = document.getElementById('usernameInput').value;

    // Run GitHub API function, passing in the GitHub username
    requestReposIssues(gitHubRepoName);

});

// Filter by title
const filterForm = document.getElementById('filterInput');
filterForm.onkeyup = () => {
    const matcher = new RegExp(filterForm.value, 'gi');
    const cardList = document.getElementsByClassName('list-group-item');
    for (let i = 0; i < cardList.length; i++) {
        const card = cardList[i];
        card.style.display = matcher.test(card.innerText) ? 'block' : 'none';
    }
}


const requestReposIssues = async (name) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${name}/issues`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${TOKEN}`
            }
        });
        const data = await response.json();
        // Do div visible
        document.getElementsByClassName('filter-container')[0].style.display = 'block';
        formatResults(data);

    } catch (error) {
        document.getElementsByClassName('filter-container')[0].style.visibility = 'hidden';
        console.log(error);
    }
}

const formatResults = (data) => {
    // Loop over each object in data array
    for (let i in data) {
        // Create variable that will create li's to be added to ul
        let card = document.createElement('a');

        card.href = data[i].html_url;
        card.target = '_blank';
        card.classList.add('list-group-item')

        // Create labels to be added to li
        const labelsHTML = data[i].labels.map(label => {
            return `<span class='badge' style='background-color:#${label.color}'>
                ${label.name}
            </span>`
        }).join('');

        // Create the html markup for each li
        card.innerHTML = (`
            <div class='card'>
                <div class='issue-info'>
                    <a href='${data[i].user.html_url}' target='_blank'>
                        <img class='user-avatar' src='${data[i].user.avatar_url}' />
                    </a>
                    <p class='title'><strong>#${data[i].number}</strong> ${data[i].title}</p>
                </div>
                <div class='issue-labels'>
                    ${labelsHTML}
                </div>
            </div>
        `);

        // Append each li to the ul
        cardContainer.appendChild(card);
    }
}