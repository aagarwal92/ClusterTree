var jsonData = null;
var cluster = null;
var vis = null;
var diagonal = null;
var curNode = null;
var curNodeParent = null;
var count = 0;
var numRents = 0;
var tempRent3 = null;
var array_test = new Array();
var tempList = null;
var w =0,
    h = 0,
    i = 0,
    duration = 0;
    
d3.json("REDDITS3.json", function(json) {
  json.x0 = 800;
  json.y0 = 0;

 jsonData = json;

  getHeight(jsonData);

 diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

 vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(100,0)");


 update(root = jsonData);
 
});

function update(source) {
  
    var nodes = cluster.nodes(source).reverse();
  
  
     var node = vis.selectAll("g.node")
         .data(nodes)
       .enter().append("svg:g")
         .attr("class", "node")
         .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

      node.append("svg:text")
          .attr("dx", function(d) { return d.children ? -8 : 8; })
          .attr("dy", 3)
          .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
          .text(function(d) { return d.name; });
  
  // Update the nodes…
  var node = vis.selectAll("circle.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
 
    node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return source.y0; })
      .attr("cy", function(d) { return source.x0; })
      .text(function (d) {return d.name; })
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
      .on("mouseover", mouseon)
      .on("mouseout", mouseoff)
      .on("click", click)
    .transition()
      .duration(duration)
      .attr("cx", function(d) { return d.y; })
      .attr("cy", function(d) { return d.x; });
    
  
  node.enter().append("svg:text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })

  // Transition nodes to their new position.
  node.transition()
      .duration(duration)
      .attr("cx", function(d) { return d.y; })
      .attr("cy", function(d) { return d.x; })
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("cx", function(d) { return source.y; })
      .attr("cy", function(d) { return source.x; })
      .remove();

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(cluster.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "circle")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
 
 (source);

    if (source.name == "Reddit")
    {
    document.getElementById("subredditinfo").style.display = "none";
    document.getElementById("staticmenu2").style.display = "none";
    document.getElementById("subscribers").style.display = "none";
    document.getElementById("redditlink").style.display = "none";
    }
    else
    {
    document.getElementById("staticmenu2").style.display = "block";

    }
}

function resetNames ()
{
  var nodes = cluster.nodes(jsonData).reverse();
    var node = vis.selectAll("g.node")
       .data(nodes)
       .remove(); 
  
  
  for (i = 0; i< nodes.length ;i++)
  {
    nodes[i] = "";
  }
  if (nodes[i]== "")
  {
    return true;
   console.log("true");
  }
}

function getHeight(x)
{
  w = 960;
  i = 0;
  duration = 500;
  
    h = (x.children.length*40);

  cluster = d3.layout.cluster()
    .size([h + 400, w - 240]);
  window.scrollTo( 0,0) ;
}

var temp = null;

function click (d)
{
  
  if (d == undefined)
  {
    return;
  }
  
  var subsInfo = "";
  subsInfo =  "Subscribers: ";
  d.size;
  subsInfo = subsInfo.bold();
  
  var redName = d.name;
  
  var link = "</br>" +"<a href = http://www.reddit.com/r/" + d.name + "> Click here </a>" + "to view the actual sub-reddit page";;
  
  if (d.children == null)
  {
    document.getElementById("redditinfo").style.display = "none";
    document.getElementById("redditname").style.display = "block";
    document.getElementById("subscribers").style.display = "block";
    document.getElementById("redditlink").style.display = "block";
  
    var subs = document.getElementById('subscribers');
    subs.innerHTML = subsInfo + d.size;

    var name = document.getElementById('redditname');
    name.innerHTML = d.name;

    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = link;
    
    return;
  }
  
  if (d.name != "Reddit")
  {
    resetNames();
  }
  
  if (d.parent == undefined)
    reset();
  else
    console.log(d.parent.parent);
  curNode = d;
  curNodeParent = d.parent;
  root = d;
  temp = root.parent;
  getHeight(d);
  update(root);
    
  showRentList2();
  console.log(d.name);
  count == 0;
  
  if(d.name == "Reddit"){
    document.getElementById("subredditinfo").style.display = "none";
    document.getElementById("staticmenu2").style.display = "none";
    document.getElementById("subscribers").style.display = "none";
    document.getElementById("redditlink").style.display = "none";
    document.getElementById("redditinfo").style.display = "block";

    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = link2;
    //document.getElementById("subscribers").style.display = "block";

  }
  else
  {
    document.getElementById("redditinfo").style.display = "none";
    document.getElementById("subredditinfo").style.display = "block";
    document.getElementById("redditname").style.display = "block";
    document.getElementById("subscribers").style.display = "block";
    document.getElementById("redditlink").style.display = "block";
    showRentList4();
    var rentList2 = document.getElementById('subredditinfo');
    rentList2.innerHTML = showRentList4() + "</br>" + " ↓ " + "</br>" + d.name.bold();
    var subs = document.getElementById('subscribers');
    subs.innerHTML = subsInfo + d.size;
    var name = document.getElementById('redditname');
    name.innerHTML = redName;
    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = link;
    //rentList2.innerHTML = "Parent1<br/>Parent2<br/>Parent3";
  }
}

function back2()
{
  if (curNode==null)
  {
    return;
  }
  if (curNodeParent.name == "Reddit")
  {
    reset();
  }
    resetNames();
    getHeight(curNodeParent);
    update(curNodeParent);
    
  if (curNodeParent.name == "Reddit")
  {

  }
  else
  { 
    
        
    if (curNodeParent.parent != null)
    {
      curNodeParent = curNodeParent.parent;
    }

    //showRentList2();
    document.getElementById("subredditinfo").style.display = "block";
    document.getElementById("subscribers").style.display = "block";
    document.getElementById("redditinfo").style.display = "none";
    document.getElementById("redditname").style.display = "block";
    document.getElementById("redditlink").style.display = "block";

    var subs = document.getElementById('subscribers');
    subs.innerHTML = showSubs();
    var rentList2 = document.getElementById('subredditinfo');
    rentList2.innerHTML = showRentList2();
    var name = document.getElementById('redditname');
    name.innerHTML = showName();
    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = showLink();

  count ++;
  console.log(count);
  
  }
}

function moveUp(nodeName)
{
    var nodes = cluster.nodes(jsonData).reverse();
    nodes.forEach(function(d)
    {
      if (d.name == nodeName)
      {
        click(d);
      }
    })    
}

/*

function search(search_form)
{
    var nodes = cluster.nodes(jsonData).reverse();
    nodes.forEach(function (d)
                  {
                   d.name.toLowerCase();
                   if (d.name.toLowerCase() == text)
                   {
                    "goes in"
                    click(d)
                   }
                  });
}
*/
function showLink()
{
    var curNode2 = curNode;  
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
  var link3 = "</br>" + "<a href = http://www.reddit.com/r/" + curNode2.parent.name + "> Click here </a>" + "to view the actual sub-reddit page";
  return link3;
}

function showName()
{
  var curNode2 = curNode;  
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
   return curNode2.parent.name;
}

function showSubs()
{
  var curNode2 = curNode;
  var subsInfo2 = "";
  
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
    subsInfo2 = "Subscribers: "
    subsInfo2 = subsInfo2.bold();
    return subsInfo2 + curNode2.parent.size;
}

function showRentList2()
  {
    //var tempRent3;
  
    var curNode2 = curNode;
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
     tempRent3 = curNode2;       
      {
      for (x = 0; x < 20; x++)
      {
        if (x == 0)
        {
          rentList = tempRent3.parent.name.bold();
          if (tempRent3.parent != undefined)
        {
          tempRent3 = tempRent3.parent;
          if (tempRent3.name == "Reddit")
          {
            return rentList;
          }
        }
        numRents++;
        }
        else
        {
        tempList = tempRent3.parent + tempList ;
        rentList = "<a onclick='moveUp(\"" + tempRent3.parent.name + "\")'>" + tempRent3.parent.name +  "</a>"+ "</br>" +  " ↓ " + "</br>" + rentList;// +  tempRent3.parent.name; //+ "</br>" +  " ↓ " + "</br>" + curNode2.parent.name ;
        if (tempRent3.parent != undefined)
        {
          tempRent3 = tempRent3.parent;
          if (tempRent3.name == "Reddit")
          {
            return rentList;
          }
          numRents++;
        }
        }
      }
      }
      return rentList;
  }
  
  function showRentList4()
  {
    //var rentList = ""
    var curNode2 = curNode;
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
     var tempRent = curNode2; 

   /*   if (tempRent.name == "Reddit")
      {
        rentList = tempRent.name + "</br>" +  " ↓ " + "</br>" +  curNode.name;
        return rentList;
      }*/
      
      for (x = 0; x < 20; x++)
      {
        if (x == 0)
        {
          rentList = "<a onclick='moveUp(\"" + tempRent.parent.name + "\")'>" + tempRent.parent.name + "</a>";
          if (tempRent.parent != undefined)
        {
          tempRent = tempRent.parent;
          if (tempRent.name == "Reddit")
          {
           // rentList = tempRent.name + "</br>" +  " ↓ " + "</br>" + rentList;
      //     var rentList2 = rentList.substring(0, rentList.length-2);
            return rentList;
          }
        }
        }
        else
        {
          
    
       // rentList = "<a onclick='moveUp(\"" + tempRent.parent.name + "</br>" +  " ↓ " + "</br>" + rentList;// +  tempRent.parent.name; //+ "</br>" +  " ↓ " + "</br>" + curNode2.parent.name ;
        rentList = "<a onclick='moveUp(\"" + tempRent.parent.name + "\")'>" + tempRent.parent.name +  "</a>"+ "</br>" +  " ↓ " + "</br>" + rentList;
        if (tempRent.parent != undefined)
        {
          tempRent = tempRent.parent;
          if (tempRent.name == "Reddit")
          {
            return rentList;
          }
        }
        }
      }
      return rentList;
  }


function mouseon(d)
{
  function kids()
  {
    if (d.children == null)
    {
      return "None";
    }

    if (d.children != null)
    {
    var childs = d.children;
    var finalChilds = "";

    childs.forEach(function(child)
    {
      if (child.name != undefined)
      {
      finalChilds = finalChilds + "{" + child.name + "}  ";
      }
    });

    return finalChilds;
    }    
  }

    var rentList = ""
    var tempRent = d.parent;

   function parentals()
   {
      if (tempRent.name == "Reddit")
      {
        rentList = "{" + tempRent.name  + "}  ";
        return rentList;
      }
      for (x = 0; x < 20; x++)
      {
        
        rentList = rentList + "{" + tempRent.name + "}  ";
        if (tempRent.parent != undefined)
        {
          tempRent = tempRent.parent;
          if (tempRent.name == "Reddit")
          {
            rentList = rentList + "{" + tempRent.name + "}  ";
            return rentList;
          }
        }
      } 
    return rentList;
   }
  
  tooltip.show('<strong> Sub-Reddit Name: </strong>' + d.name +
               '<br /><strong> Subscriber Count: </strong>' + d.size +
               '<br /><strong> Parent List: </stong>' + parentals() + 
               '<br /><strong> Children: </strong>' + kids());
}

function test()
{
  console.log("test");
  console.log(rentList)
} 

function mouseoff(d)
{
  tooltip.hide();
}

function nodeSize()
{ 
  var size = 150;
  return size;
}

function reset()
{
  window.location.reload();
  count == 0;
}

function fillArray()
{
    var nodes = cluster.nodes(jsonData).reverse();
    var nodes2 = new Array();

    for (x=0;x<nodes.length; x++)
    {
      nodes2[x] = nodes[x].name;
         
    }
    return nodes2;
}

function test22()
{
  console.log("fdadf");
}

function findValue(li) {
  
  if( li == null ) return;
  if( !!li.extra ) var sValue = li.extra[0];
  else var sValue = li.selectValue;

  var nodes = cluster.nodes(jsonData).reverse();
  nodes.forEach(function (d)
    {
     d.name.toLowerCase();
      if (d.name.toLowerCase() == sValue)
      {
    if (d.children != null)
     {
       "goes in222"
       click(d);
      }
     }
    });
}
	
        /*
        if( li == null ) return alert("No match!");



	// if coming from an AJAX call, let's use the CityId as the value

	if( !!li.extra ) var sValue = li.extra[0];

	// otherwise, let's just display the value in the text box
	else var sValue = li.selectValue;

	alert("The value you selected was: " + sValue);
        */



function selectItem(li) {

	findValue(li);

}



function formatItem(row) {

	return row[0] + " (id: " + row[1] + ")";

}

function lookupAjax(){

	var oSuggest = $("#CityAjax")[0].autocompleter;
	oSuggest.findValue();
	return false;
}



function lookupLocal(){

	var oSuggest = $("#CityLocal")[0].autocompleter;
	oSuggest.findValue();
	return false;
}


$(document).ready(function() {

	$("#CityAjax").autocomplete(

		"autocomplete_ajax.cfm",

		{

			delay:10,

			minChars:2,

			matchSubset:1,

			matchContains:1,

			cacheLength:10,

			onItemSelect:findValue,

			onFindValue:findValue,

			formatItem:formatItem,

			autoFill:true

		}

	);
        

	$("#CityLocal").autocompleteArray(

		fillArray(),
		{
			delay:10,

			minChars:1,

			matchSubset:1,

			onItemSelect:findValue,

			onFindValue: findValue,

			autoFill:true,

			maxItemsToShow:10

		}

	);

});

