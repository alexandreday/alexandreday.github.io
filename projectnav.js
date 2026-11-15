// Previous / next navigation between project pages.
// Reads the project list from content/index.md (the same source as the homepage
// cards) so the order is defined in exactly one place. Requires frontmatter.js.
(function () {
    function basename(path) {
        return (path || '').split('#')[0].split('?')[0].split('/').pop() || 'index.html';
    }
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function render(projects) {
        var host = document.getElementById('project-nav');
        if (!host) return;
        var here = basename(window.location.pathname);
        var idx = -1;
        for (var i = 0; i < projects.length; i++) {
            if (basename(projects[i].link) === here) { idx = i; break; }
        }
        if (idx === -1) return;
        var newer = idx > 0 ? projects[idx - 1] : null;                     // card above on the homepage
        var older = idx < projects.length - 1 ? projects[idx + 1] : null;   // card below on the homepage
        var html = '<nav class="project-nav" aria-label="Project navigation">';
        html += newer
            ? '<a class="pn pn-prev" href="' + esc(newer.link) + '"><span class="pn-label">&larr; Previous project</span><span class="pn-title">' + esc(newer.title) + '</span></a>'
            : '<span class="pn pn-empty"></span>';
        html += '<a class="pn pn-all" href="/index.html#projects">All projects</a>';
        html += older
            ? '<a class="pn pn-next" href="' + esc(older.link) + '"><span class="pn-label">Next project &rarr;</span><span class="pn-title">' + esc(older.title) + '</span></a>'
            : '<span class="pn pn-empty"></span>';
        html += '</nav>';
        host.innerHTML = html;
    }
    document.addEventListener('DOMContentLoaded', function () {
        fetch('/content/index.md')
            .then(function (r) { return r.text(); })
            .then(function (text) { render(parseFrontmatter(text).attributes.projects || []); })
            .catch(function () { /* navigation is optional; fail quietly */ });
    });
})();
