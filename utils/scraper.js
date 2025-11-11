export async function get_all_editorial_link(editorial_list_url = "https://atcoder.jp/contests/arc209/tasks/arc209_a/editorial") {
    const parser = new DOMParser();
    const editorial_list_html = await fetch(editorial_list_url).then(response => response.text());
    const editorial_list_dom = parser.parseFromString(editorial_list_html, "text/html");
    const editorial_links = Array.from(editorial_list_dom.getElementsByTagName("a"))
        .map(anchor => anchor.href)
        .filter(href => href.match(/\/contests\/.+\/editorial\//));
    return editorial_links;
}

export async function get_editorial_content(url) {
    const parser = new DOMParser();
    const editorial_html = await fetch(url).then(response => response.text());
    console.log(editorial_html);
    const editorial_dom = parser.parseFromString(editorial_html, "text/html");
    return editorial_dom.querySelector("h2.mt-1").parentElement.innerHTML;
}

export async function get_problem_statement(url) {
    const parser = new DOMParser();
    const problem_html = await fetch(url).then(response => response.text());
    const problem_dom = parser.parseFromString(problem_html, "text/html");
    return problem_dom.getElementById("task-statement").querySelector(".lang-ja").innerHTML;
}