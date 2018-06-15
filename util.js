function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    //var el = GetElementInsideContainer('mySidebar','mylinks');
    //console.log(el);
}

function changeToTeal(idx){
    ref = {0: "aboutme",1:"research",2:"publication"}
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