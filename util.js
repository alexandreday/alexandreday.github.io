function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    //var el = GetElementInsideContainer('mySidebar','mylinks');
    //console.log(el);
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
    var tableContent = '<table class="w3-table w3-striped w3-white">';
    $.get('publication.tsv', function( data ) {
      //alert(data);
      //this will split the string into array line by line
      var lineByline = data.split('\n');

      var title,name,refnumber,date,link,fields,line;

      for(var i=0;i<lineByline.length-1;i++){
          line = lineByline[i];
          fields = line.split('\t');
          title=fields[0];
          name=fields[1];
          refnumber=fields[2];
          date=fields[3];
          link=fields[4];
          console.log(fields);

          tableContent += '<tr class="w3-hover-opacity">';
          tableContent += '<td>&nbsp&nbsp&nbsp<li class="w3-medium w3-right"></li></td>';
          tableContent += '<td> <a href="' + link + '" target="_blank" style="text-decoration:none">';
          tableContent += '<div class="w3-text-teal w3-bold">' + title + '</div>';
          tableContent += name + '<br>';
          tableContent += refnumber;
          tableContent += '</a></td>';
          tableContent += '<td><i>' + date + '</i></td>';
          tableContent += '</tr>'
      }
      tableContent+='</table>'
        //console.log(tableContent);
        //$('#mypubtable').innerHTML(tableContent);
        $('#mypubtable').html(tableContent);
    });
};