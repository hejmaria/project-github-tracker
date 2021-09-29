const USER = ''; // !!! Place your user over here !!!
const REPOS_URL = `https://api.github.com/users/${USER}/repos`;

const projectsContainer = document.getElementById('projects');

const fetchRepositories = () => {
	fetch(REPOS_URL)
		.then((res) => res.json())
		.then((data) => {
			const technigoRepositories = data.filter(
				(repo) => repo.name.includes('project-') && repo.fork
			);

			technigoRepositories.forEach((repo) => {
				projectsContainer.innerHTML += `
          <div>
            <a href="${repo.html_url}">${repo.name} with default branch ${
					repo.default_branch
				}</a>
            <p>Recent push: ${new Date(repo.pushed_at).toDateString()}</p>
            <p id="commit-${repo.name}">Commits amount: </p>
          </div>
        `;

				// // Approach number 1
				// fetchPullRequestsSingle(repo);
			});

			// Approach number 2
			fetchPullRequestsArray(technigoRepositories);

			// Draw chart with technigoRepos data
			drawBarChart(technigoRepos);
		});
};

// // Approach number 1
// const fetchPullRequestsSingle = (singleRepository) => {
// 	fetch(singleRepository);
// };

// Approach number 2
const fetchPullRequestsArray = (allRepositories) => {
	allRepositories.forEach((repo) => {
		const PULL_URL = `https://api.github.com/repos/Technigo/${repo.name}/pulls?per_page=100`;

		fetch(PULL_URL)
			.then((res) => res.json())
			.then((data) => {
				const myPullRequest = data.find(
					(pull) => pull.user.login === repo.owner.login
				);

				// Detect if we have pull request or not.
				// If yes - call fetchCommits function
				// If no - inform user that no pull request was yet done
				if (myPullRequest) {
					fetchCommits(myPullRequest.commits_url, repo.name);
				} else {
					document.getElementById(`commit-${repo.name}`).innerHTML =
						'No pull request yet done :(';
				}
			});
	});
};

const fetchCommits = (myCommitsUrl, myRepoName) => {
	fetch(myCommitsUrl)
		.then((res) => res.json())
		.then((data) => {
			document.getElementById(`commit-${myRepoName}`).innerHTML += data.length;
		});
};

fetchRepositories();