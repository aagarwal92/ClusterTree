var jsonData = null;
var cluster = null;
var vis = null;
var diagonal = null;
var curNode = null;
var curNodeParent = null;
var count = 0;
var counter = 0;
var numRents = 0;
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

/* draws out the visualization based on inputs provided by the json data above */
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

/* what to display through the DOM on the start page */
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

/* called when node is clicked on to reset diagram and the names */
function resetNames()
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

/* Gets the height of a function based on the nodes */
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

/* Controls what happens when a node is clicked on, with d being the reference to the node */
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
 
 // changes static menu only if the sub-reddit has no children
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
  
  //resets the names after
  if (d.name != "Reddit")
  {
    resetNames();
  }
  
  // if the current node is reddit, then reset
  if (d.parent == undefined)
    reset();
  else
    console.log(d.parent.parent);
    
  // sets global variable to the current node
  curNode = d;
  curNodeParent = d.parent;

 // resets the visualization once a node is clicked upon 
  root = d;
  getHeight(d);
  update(root);
    
  showParentListClick();
  
  // Changes the DOM elements for the static menu based on if the node is Reddit or not.
  if(d.name == "Reddit"){
    document.getElementById("subredditinfo").style.display = "none";
    document.getElementById("staticmenu2").style.display = "none";
    document.getElementById("subscribers").style.display = "none";
    document.getElementById("redditlink").style.display = "none";
    document.getElementById("redditinfo").style.display = "block";

    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = link2;

  }
  else
  {
    document.getElementById("redditinfo").style.display = "none";
    document.getElementById("subredditinfo").style.display = "block";
    document.getElementById("redditname").style.display = "block";
    document.getElementById("subscribers").style.display = "block";
    document.getElementById("redditlink").style.display = "block";
    
    showParentListBackButton();
    var rentList2 = document.getElementById('subredditinfo');
    rentList2.innerHTML = showParentListBackButton() + "</br>" + " ↓ " + "</br>" + d.name.bold();
    
    var subs = document.getElementById('subscribers');
    subs.innerHTML = subsInfo + d.size;
    
    var name = document.getElementById('redditname');
    name.innerHTML = redName;
    
    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = link;

  }
}

/* Controls the change in the visualiztion when the Move up Tree button is called */
function moveUpTreeButton()
{
  if (curNode==null)
  {
    return;
  }
  
  // reset the whole page if the node is Reddit
  if (curNodeParent.name == "Reddit")
  {
    reset();
  }
    resetNames();
    getHeight(curNodeParent);
    update(curNodeParent);
    
  if (curNodeParent.name != "Reddit")
  {
    if (curNodeParent.parent != null)
    {
      curNodeParent = curNodeParent.parent;
    }

    // controls the DOM elements based what reddit is the set to the current node
    document.getElementById("subredditinfo").style.display = "block";
    document.getElementById("subscribers").style.display = "block";
    document.getElementById("redditinfo").style.display = "none";
    document.getElementById("redditname").style.display = "block";
    document.getElementById("redditlink").style.display = "block";

    var subs = document.getElementById('subscribers');
    subs.innerHTML = showSubs();
    
    var rentList2 = document.getElementById('subredditinfo');
    rentList2.innerHTML = showParentListClick();
    
    var name = document.getElementById('redditname');
    name.innerHTML = showName();
    
    var redLink = document.getElementById('redditlink');
    redLink.innerHTML = showLink();

  // sets count for the amount of times tree has moved up.
  count ++;
  }
}

/* Controls what happend when a parent is clicked on within the Parent List on the right static menu */
function moveUpWithinParentList(nodeName)
{
    var nodes = cluster.nodes(jsonData).reverse();
    nodes.forEach(function(d)
    {
      //resets the visualization to that node
      if (d.name == nodeName)
      {
        click(d);
      }
    })    
}

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

/* Controls what is shown on the parent list on the right static menu when a node is clicked. */
function showParentListClick()
  {
    // counter to see if the function is called after the move up button has been clicked.
    counter = counter + 1;

    var rentList;
  
    var curNode2 = curNode;
    
    // sets the current node and its parent based on what the count is from the back button
    for (i = 0; i < count; i++)
    {
      if (curNode2.parent != undefined)
        curNode2 = curNode2.parent;
      else
        curNode2 = curNode2;
    }
    
      // while it is not undefined, build the parent list
      if (curNode2.parent != undefined)
      {
      for (x = 0; x < 20; x++)
      {
        if (x == 0)
        {
          rentList = curNode2.parent.name.bold();
          if (curNode2.parent != undefined)
        {
          curNode2 = curNode2.parent;
          if (curNode2.name == "Reddit")
          {
            return rentList;
          }
        }
        numRents++;
        }
        else
        {
          
        // builds the parent list with anchor elements
        tempList = curNode2.parent + tempList ;
        rentList = "<a onclick='moveUpWithinParentList(\"" + curNode2.parent.name + "\")'>" + curNode2.parent.name +  "</a>"+ "</br>" +  " ↓ " + "</br>" + rentList;
        if (curNode2.parent != undefined)
        {
          curNode2 = curNode2.parent;
          
          // once it reaches reddit, the list is finished and the function returns the list.
          if (curNode2.name == "Reddit")
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
  
  /* controls the parent list changing when the back button is clicked on */
  function showParentListBackButton()
  {
    var rentList;

    if (counter > 0)
    {
      count = 0;
    }

    var curNode2 = curNode;
    for (i = 0; i < count; i++)
    {
      curNode2 = curNode2.parent;
    }
     var tempRent = curNode2; 
      
      for (x = 0; x < 20; x++)
      {
        if (x == 0)
        {
          // if there is only one parent, it will build the list with that parent and return it.
          rentList = "<a onclick='moveUpWithinParentList(\"" + curNode2.parent.name + "\")'>" + curNode2.parent.name + "</a>";
          if (curNode2.parent != undefined)
        {
          curNode2 = curNode2.parent;
          if (curNode2.name == "Reddit")
          {
            return rentList;
          }
        }
        }
        else
        {
        //builds the list with anchor elements 
        rentList = "<a onclick='moveUpWithinParentList(\"" + curNode2.parent.name + "\")'>" + curNode2.parent.name +  "</a>"+ "</br>" +  " ↓ " + "</br>" + rentList;
        if (curNode2.parent != undefined)
        {
          curNode2 = curNode2.parent;
          
          // once it reaches reddit, the list is finished and the function returns the list.
          if (curNode2.name == "Reddit")
          {
            return rentList;
          }
        }
        }
      }
      return rentList;
  }

/* what happens if a node is moused on upon */
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

/* controls what is shown on the tooltip*/
   function tooltipShow()
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
               '<br /><strong> Parent List: </stong>' + tooltipShow() + 
               '<br /><strong> Children: </strong>' + kids());
}

function mouseoff(d)
{
  tooltip.hide();
}

function reset()
{
  window.location.reload();
  count == 0;
}


/* Code that controls the autocomplete function*/
function fillAutoCompleteArray()
{
    var nodes = cluster.nodes(jsonData).reverse();
    var nodes2 = new Array();

    for (x=0;x<nodes.length; x++)
    {
      nodes2[x] = nodes[x].name;
         
    }
    return nodes2;
}


function findAutoCompleteValue(li) {
  
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
       click(d);
      }
     }
    });
}

function selectItem(li) {

	findAutoCompleteValue(li);

}


function formatItem(row) {

	return row[0] + " (id: " + row[1] + ")";

}

function lookupLocal(){

	var oSuggest = $("#search")[0].autocompleter;
	oSuggest.findAutoCompleteValue();
	return false;
}


$(document).ready(function() {

	$("#search").autocompleteArray(

		fillAutoCompleteArray(),
		{
			delay:10,

			minChars:1,

			matchSubset:1,

			onItemSelect:findAutoCompleteValue,

			onFindValue: findAutoCompleteValue,

			autoFill:true,

			maxItemsToShow:10

		}

	);

});