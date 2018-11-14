var year=2014; 
var metric="inetPenetration";

function handleRadio(value){
  metric=value;
  updateMap();
}

function sliderUp() {
    document.getElementById("slider").stepUp(1);
    displaySliderValue();
}

function sliderDown() {
    document.getElementById("slider").stepDown(1);
    displaySliderValue();
}

function displaySliderValue()
{
  var value=document.getElementById("slider").value;
  document.getElementById("sliderVal").innerHTML="Year: "+value;
  year=value;
  updateMap();
}

var width = 960,
    height = 700;

var penColor = d3.scale.linear()
    .domain([0, 100])
    .range(["#002", "#fff"]);

var denColor = d3.scale.linear()
    .domain([0, 1000])
    .range(["#003", "#fff"]);

var projection = d3.geo.ginzburg9()
    .scale(175)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

var inet = {},
    pop  = {},
    area  = {},
    i2a = {},
    a2i = {};

d3.json("data/internet.json", function(data) { inet=data; });
d3.json("data/population.json", function(data) { pop=data; });
d3.json("data/area.json", function(data) { area=data; });
d3.json("data/id2alfa.json", function(data) { i2a=data; });
d3.json("data/alfa2id.json", function(data) { a2i=data; });

svg.append("defs").append("path")
     .datum({type: "Sphere"})
     .attr("id", "sphere")
     .attr("d", path);

svg.append("use")
     .attr("class", "stroke")
     .attr("xlink:href", "#sphere");

svg.append("use")
     .attr("class", "fill")
     .attr("xlink:href", "#sphere");

svg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", path);

d3.json("data/world-50m.json", function(error, world) {
    if (error) throw error;

svg.selectAll(".countries")
   .data(topojson.feature(world, world.objects.countries).features)
   .enter().append("path")
   .attr("id", function(d) { return "country_" + d.id; })
   .attr("class", "country")
   .style("fill", function(d) { return getColor(d.id) } )
   .attr("onmouseover", "tipOn(evt)")
   .attr("onmouseout", "tipOff(evt)")
   .attr("d", path);

svg.insert("path", ".graticule")
   .datum(topojson.feature(world, world.objects.land))
   .attr("class", "land")
   .attr("d", path);

svg.insert("path", ".graticule")
   .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
   .attr("class", "boundary")
   .attr("d", path);
});

function getColor(d) {
  if( d > 0 ) {
    var alfa=i2a[d.toString()].alfa3;
    if ( metric == "inetPenetration" ) {
      if (inet[alfa] != null){ 
        return(penColor(inet[alfa][year.toString()]));
      } else {
       return penColor(0);
      }
    } else if ( metric == "inetDensity" ) { 
      if (inet[alfa] != null){ 
        return(denColor((inet[alfa][year.toString()]/100)*pop[alfa][year.toString()]/area[alfa][year.toString()]));
      } else {
       return penColor(0);
      }
    } else if ( metric == "popDensity" ) { 
      if (pop[alfa] != null && area[alfa]){ 
        return(denColor(pop[alfa][year.toString()]/area[alfa][year.toString()]));
      } else {
       return denColor(0);
      }
      return "#000";
    }
  } else {
    return "#000";
  }
}

function updateMap(){
  svg.selectAll(".country")
    .style("fill", function(d) { return getColor(d.id) });
  tipOff(null);
}

function tipOn(evt){
    var id=evt.target.id.replace("country_","");
    var alfa=i2a[id.toString()].alfa3;
    if (inet[alfa] != null){
      d3.select(".data_name").text(inet[alfa].name);
      d3.select(".data_size").text(area[alfa][year.toString()]);
      d3.select(".data_pop").text(pop[alfa][year.toString()]);
      d3.select(".data_pen").text(inet[alfa][year.toString()].toFixed(2));
      d3.select(".data_users").text((pop[alfa][year.toString()]*inet[alfa][year.toString()]/100).toFixed(0));
    }
}

function tipOff(evt){
  d3.select(".data_name").text("World");
  d3.select(".data_size").text(area["WLD"][year.toString()]);
  d3.select(".data_pop").text(pop["WLD"][year.toString()]);
  d3.select(".data_pen").text(inet["WLD"][year.toString()].toFixed(2));
  d3.select(".data_users").text((pop["WLD"][year.toString()]*inet["WLD"][year.toString()]/100).toFixed(0));
}
