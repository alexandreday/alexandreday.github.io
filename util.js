// --- Dark mode ---

function initDarkMode() {
    if (localStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('dark-mode');
    }
    var btn = document.createElement('button');
    btn.id = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = localStorage.getItem('darkMode') === 'on' ? '☀ Light' : '☾ Dark';
    btn.onclick = function() {
        var isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'on' : 'off');
        btn.textContent = isDark ? '☀ Light' : '☾ Dark';
    };
    document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', initDarkMode);

function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}

function changeToTeal(idx){
    ref = {0: "aboutme",1:"research",2:"publication",3:"resume"}
    var tmp = GetElementInsideContainer("mySidebar",ref[idx]);
    tmp.classList.add("w3-text-teal");
}

function GetElementInsideContainer(containerID, childID) {
    var elm = {};
    var elms = document.getElementById(containerID).getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
        if (elms[i].id === childID) {
            elm = elms[i];
            break;
        }
    }
    return elm;
}

function populateTable() {
    // Inject search box before the table container
    $('#mypubtable').before(
        '<input id="pub-search" type="text" placeholder="Search publications..." ' +
        'class="w3-input w3-border w3-round" style="margin-bottom:16px;max-width:400px;" ' +
        'aria-label="Search publications">'
    );

    $.get('publication.tsv', function( data ) {
      var lineByline = data.split('\n');
      var tableContent = '<table class="w3-table w3-striped w3-white" id="pub-table">';

      var title,name,refnumber,date,link,fields,line;

      for(var i=0;i<lineByline.length-1;i++){
          line = lineByline[i];
          fields = line.split('\t');
          if (fields.length < 4) continue;
          title=fields[0];
          name=fields[1];
          refnumber=fields[2];
          date=fields[3];
          link=fields[4] || '';
          tableContent += '<tr class="w3-hover-opacity" data-search="' + (title + ' ' + name + ' ' + refnumber + ' ' + date).toLowerCase() + '">';
          tableContent += '<td> <a href="' + link + '" target="_blank" style="text-decoration:none">';
          tableContent += '<div class="w3-text-teal w3-bold">' + title + '</div>';
          tableContent += name + '<br>';
          tableContent += refnumber;
          tableContent += '</a></td>';
          tableContent += '<td><i>' + date + '</i></td>';
          tableContent += '</tr>'
      }
      tableContent+='</table>'
      $('#mypubtable').html(tableContent);

      // Live search filtering
      $('#pub-search').on('input', function() {
          var query = this.value.toLowerCase().trim();
          $('#pub-table tr').each(function() {
              var match = !query || $(this).data('search').indexOf(query) !== -1;
              $(this).toggle(match);
          });
      });
    }).fail(function() {
        $('#mypubtable').html('<p class="w3-text-red">Failed to load publications. Please try refreshing the page.</p>');
    });
};

// --- Content loading utilities ---

function parseFrontmatter(text) {
    var result = { attributes: {}, body: '' };
    if (!text.startsWith('---')) {
        result.body = text;
        return result;
    }
    var end = text.indexOf('\n---', 3);
    if (end === -1) {
        result.body = text;
        return result;
    }
    var yamlBlock = text.substring(4, end);
    result.body = text.substring(end + 4).trim();

    var lines = yamlBlock.split('\n');
    var currentKey = null;
    var currentArray = null;
    var currentObj = null;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        // Top-level key: value
        var topMatch = line.match(/^(\w[\w]*)\s*:\s*(.*)$/);
        if (topMatch) {
            // Save previous array if any
            if (currentKey && currentArray) {
                if (currentObj) { currentArray.push(currentObj); currentObj = null; }
                result.attributes[currentKey] = currentArray;
                currentArray = null;
            }
            var key = topMatch[1];
            var val = topMatch[2].trim();
            if (val === '') {
                // Could be start of an array or nested block
                currentKey = key;
                currentArray = null;
            } else {
                // Remove surrounding quotes
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                result.attributes[key] = val;
                currentKey = key;
                currentArray = null;
                currentObj = null;
            }
            continue;
        }
        // Array item start: "  - key: value" or "  - value"
        var arrayItemMatch = line.match(/^\s+-\s+(\w[\w]*)\s*:\s*(.*)$/);
        if (arrayItemMatch) {
            if (!currentArray) { currentArray = []; }
            if (currentObj) { currentArray.push(currentObj); }
            currentObj = {};
            var k = arrayItemMatch[1];
            var v = arrayItemMatch[2].trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                v = v.substring(1, v.length - 1);
            }
            currentObj[k] = v;
            continue;
        }
        // Continuation of object in array: "    key: value"
        var contMatch = line.match(/^\s{4,}(\w[\w]*)\s*:\s*(.*)$/);
        if (contMatch && currentObj) {
            var ck = contMatch[1];
            var cv = contMatch[2].trim();
            if ((cv.startsWith('"') && cv.endsWith('"')) || (cv.startsWith("'") && cv.endsWith("'"))) {
                cv = cv.substring(1, cv.length - 1);
            }
            currentObj[ck] = cv;
            continue;
        }
    }
    // Flush last array
    if (currentKey && currentArray !== null) {
        if (currentObj) { currentArray.push(currentObj); }
        result.attributes[currentKey] = currentArray;
    } else if (currentKey && currentArray === null && !(currentKey in result.attributes)) {
        result.attributes[currentKey] = [];
    }
    return result;
}

function loadContent(file, callback) {
    $.get(file, function(data) {
        var parsed = parseFrontmatter(data);
        parsed.bodyHtml = marked.parse(parsed.body);
        callback(parsed);
    });
}

function renderIndexContent(parsed) {
    var attrs = parsed.attributes;

    // About me section
    var aboutHtml = '<h3><b>' + (attrs.title || 'About Me') + '</b></h3>';
    aboutHtml += '<p>' + parsed.bodyHtml;
    aboutHtml += '<br><a class="acv" href="https://github.com/alexandreday" target="_blank"><button class="btn w3-hover-opacity"><i class="fa fa-search"></i> <i class="fa fa-github"></i>&nbspGitHub</button></a>';
    aboutHtml += ' <a class="acv" href="https://scholar.google.com/citations?user=OQK_iFEAAAAJ&hl=en" target="_blank"><button class="btn w3-hover-opacity"><i class="fa fa-search"></i> <i class="ai ai-google-scholar"></i>&nbspGoogle Scholar</button></a>';
    aboutHtml += '</p>';
    $('#about-content').html(aboutHtml);

    // Projects
    var projects = attrs.projects || [];
    var projectsHtml = '';
    for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        var target = p.target ? ' target="' + p.target + '"' : '';
        projectsHtml += '<div class="w3-container w3-third">';
        projectsHtml += '<div class="w3-card w3-white w3-margin-bottom">';
        projectsHtml += '<a href="' + p.link + '"' + target + '><div class="image-test w3-hover-opacity" role="img" aria-label="' + p.title + '" style="background-image: url(\'' + p.image + '\');"></div></a>';
        projectsHtml += '<div class="w3-container w3-white">';
        projectsHtml += '<p><h5><b> ' + p.title + '</b></h5></p>';
        projectsHtml += '<p> ' + p.description + '</p>';
        projectsHtml += '</div></div></div>';
    }
    $('#projects-grid').html(projectsHtml);
}

function renderResearchContent(parsed) {
    var attrs = parsed.attributes;
    var html = '<h3><b>' + attrs.title + '</b></h3>';
    html += '<h4><b>' + attrs.date + '</b></h4>';

    // Publications list
    html += '<b>Our work on this project is published here:</b><br>';
    var pubs = attrs.publications || [];
    for (var i = 0; i < pubs.length; i++) {
        var pub = pubs[i];
        html += '<a href="' + pub.link + '" target="_blank"> ' + pub.title + '</a>. ';
        html += '(Published in ' + pub.journal + ')<br>';
    }

    // Body text
    html += parsed.bodyHtml;
    html += '<br><br>';

    // Figure
    html += '<div class="w3-container">';
    html += '<div class="w3-card w3-white w3-margin-bottom">';
    html += '<div class="image-test" style="background-image: url(\'' + attrs.figureImage + '\');"></div>';
    html += '</div>';
    html += '<div class="w3-container"> ' + attrs.figureCaption + '</div>';
    html += '</div>';

    $('#research-content').html(html);
}

function renderNavigation(parsed, activeIdx) {
    var attrs = parsed.attributes;
    var html = '<nav class="w3-sidebar w3-bar-block w3-collapse w3-white w3-card w3-animate-left" style="z-index:3;width:200px;" id="mySidebar"><br>';
    html += '<button class="w3-bar-item w3-button w3-hide-large w3-xxxlarge" onclick="w3_close()">&times;</button>';
    html += '<div class="w3-container">';
    html += '<img src="' + attrs.profileImage + '" class="w3-alex w3-center" style="width: 65%; right: 0px;"><br><br>';
    html += '<p> <t><div class="k1 w3-center" style="font-size:20px;"> ' + attrs.name + ' </div></t>';
    html += '<i><div class="k1 w3-center" style="font-size:14px;text-align:left;"> ' + attrs.role + ' </div></i></p>';
    html += '</div>';
    html += '<hr class="myline">';

    // Nav links
    html += '<div class="w3-bar-block">';
    var navLinks = attrs.navLinks || [];
    for (var i = 0; i < navLinks.length; i++) {
        var nl = navLinks[i];
        html += '<a href="' + nl.href + '" class="w3-bar-item w3-button w3-padding" id="' + nl.id + '"><i class="fa ' + nl.icon + ' fa-fw w3-margin-right" aria-hidden="true"></i>' + nl.label + '</a> ';
    }
    html += '</div>';
    html += '<hr class="myline">';

    // Social links
    html += '<div class="w3-xxlarge w3-container w3-center" style="margin-top: -20px"><p>';
    var socialLinks = attrs.socialLinks || [];
    for (var i = 0; i < socialLinks.length; i++) {
        var sl = socialLinks[i];
        var target = sl.href.startsWith('mailto:') ? '' : ' target="_blank"';
        var slLabel = sl.href.startsWith('mailto:') ? 'Email' : sl.icon.split(' ').pop().replace('fa-', '').replace('ai-', '').replace(/-/g, ' ');
        html += '<a href="' + sl.href + '"' + target + ' aria-label="' + slLabel + '"><i class="' + sl.icon + ' w3-hover-opacity" aria-hidden="true"></i></a>&nbsp;';
    }
    html += '</p></div>';
    html += '</nav>';

    $('#mySidebar').replaceWith(html);
    changeToTeal(activeIdx);
}

function renderNavigation2(parsed, activeIdx) {
    var attrs = parsed.attributes;
    var html = '<nav class="w3-sidebar w3-bar-block w3-collapse w3-dark-grey w3-center w3-animate-left" style="z-index:3;width:80px;" id="mySidebar"><br>';
    html += '<button class="w3-bar-item w3-hide-large w3-xxxlarge" onclick="w3_close()">&times;</button>';
    html += '<div class="w3-container">';
    html += '<div class="w3-bar-block">';

    var navLinks = attrs.navLinks || [];
    for (var i = 0; i < navLinks.length; i++) {
        var nl = navLinks[i];
        html += '<a href="' + nl.href + '" class="w3-bar-item" id="' + nl.id + '" aria-label="' + nl.label + '" title="' + nl.label + '"><i class="w3-xlarge fa ' + nl.icon + ' fa-fw w3-margin-right w3-hover-opacity" aria-hidden="true"></i></a> ';
    }
    html += '</div>';
    html += '<hr class="myline">';

    html += '<div class="w3-xxlarge w3-container w3-center w3-bar-block w3-bar-item" style="margin-top: -20px"><p>';
    var socialLinks = attrs.socialLinks || [];
    for (var i = 0; i < socialLinks.length; i++) {
        var sl = socialLinks[i];
        var target = sl.href.startsWith('mailto:') ? '' : ' target="_blank"';
        var sl2Label = sl.href.startsWith('mailto:') ? 'Email' : sl.icon.split(' ').pop().replace('fa-', '').replace('ai-', '').replace(/-/g, ' ');
        html += '<a href="' + sl.href + '"' + target + ' aria-label="' + sl2Label + '" title="' + sl2Label + '"><i class="' + sl.icon + ' w3-hover-opacity" aria-hidden="true"></i></a>';
        if (i < socialLinks.length - 1) html += '\n';
    }
    html += '</p></div>';
    html += '</nav>';

    $('#mySidebar').replaceWith(html);
    changeToTeal(activeIdx);
}
