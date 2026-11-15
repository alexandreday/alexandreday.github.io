// Minimal YAML-ish front-matter parser shared by util.js (homepage, publications)
// and projectnav.js (previous/next navigation on project pages).

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
