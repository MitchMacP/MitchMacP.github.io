async function loadPosts() {
    const response = await fetch("assets/BlogPosts/posts.json");
    const posts = await response.json();

    const loadedPosts = await Promise.all(
        posts.map(async (path) => {
            const response = await fetch(`assets/BlogPosts/${path}`);
            const markdown = await response.text();

            const dateMatch = markdown.match(
                /date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/
            );

            const titleMatch = markdown.match(
                /title:\s*["']([^"]+)["']/
            );

            return {
                path,
                markdown,
                date: dateMatch
                    ? new Date(dateMatch[1])
                    : new Date(0),
                title: titleMatch
                    ? titleMatch[1]
                    : path
            };
        })
    );

    // Newest first
    loadedPosts.sort((a, b) => b.date - a.date);

    const postList = document.querySelector("#BlogPostList");

    loadedPosts.forEach((post, index) => {

        const button = document.createElement("button");

        button.textContent = post.title;

        button.addEventListener("click", () => {
            displayPost(post);
        });

        postList.appendChild(button);
    });

    // Show newest post initially
    if (loadedPosts.length > 0) {
        displayPost(loadedPosts[0]);
    }
}

function displayPost(post) {

    const markdownContent = post.markdown.replace(
        /^---[\s\S]*?---\s*/,
        ""
    );

    document.querySelector("#BlogPost").innerHTML =
        marked.parse(markdownContent);
}

loadPosts();