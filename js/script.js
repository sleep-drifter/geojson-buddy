// show and hide logger
// manage edits and feature types
///// easy for edits
///// harder for new items or mergered items
///// 


// redo and undo: https://macwright.org/2015/05/18/practical-undo.html



var iconProps;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA';
// ***********************************************

var satelliteStyle  = 'mapbox://styles/mapbox/satellite-v9';
var satelliteStreetStyle  = 'mapbox://styles/mapbox/satellite-streets-v9';
var streetStyle  = 'mapbox://styles/mapbox/streets-v9';
var darkStyle  = 'mapbox://styles/scoottech/cjvjtjxxu1kj41cqkzf5g6ppn';
var lightStyle  = 'mapbox://styles/scoottech/cjvjsnesw1jrd1co7dcrtakw1';
var copyArea = $('.copier textarea');
var logger = $('#log');
var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/scoottech/cjhu4q6fx0gb62rlend411mly', 
  style: lightStyle,
  // center: [-122.419416,37.774929], 
  //center: [ -122.42271869842615,37.77645740426891], // sfo
  center: [-70.596168,-33.4225424], // scl
  zoom: 11,
  bearing: 0
});

// var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken })
// map.addControl(geocoder);
var geocoder = new MapboxGeocoder({
  accessToken:'pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA',
  trackProximity: true,
  flyTo: {speed: 5},
  placeholder: 'Search for a place or address'
});

map.addControl(geocoder,'top-left');


var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        //polygon: true,
        //combine_features: true,
        //uncombine_features: true,

    },
    userProperties: true,
     styles: [
              {
                  "id": "gl-draw-line",
                  "type": "line",
                  "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                  "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                  },
                  "paint": {
                    "line-color": "#1f80ff",
                    "line-dasharray": [0.2, 2],
                    "line-width": {"stops":[
                                      // zoom is 5 -> circle radius will be 1px
                                      [12, 2],
                                      // zoom is 10 -> circle radius will be 2px
                                      [16, 4]
                                  ]}
                  }
              },

              // polygon fill
              // FeatureType NOT defined
              {
                "id": "gl-draw-polygon-fill",
                "type": "fill",
                "filter": ["all", ["==", "$type", "Polygon"], ["!has","user_featureType"], ["!=", "active", "true"]],
                "paint": {
                  "fill-color": "#000",
                  "fill-outline-color": "#41D98D",
                  "fill-opacity": 0.25
                }
              },



              {
                "id": "gl-draw-polygon-fill-active",
                "type": "fill",
                "filter": ["all", ["==", "$type", "Polygon"], ["==", "active", "true"]],
                "paint": {
                  "fill-color": "#fc0",
                  "fill-outline-color": "#41D98D",
                  "fill-opacity": 0.3
                }
              },
              // polygon outline stroke
              // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
              {
                "id": "gl-draw-polygon-stroke-active",
                "type": "line",
                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                "layout": {
                  "line-cap": "round",
                  "line-join": "round"
                },
                "paint": {
                  "line-color": "#333",
                  //"line-dasharray": [0.2, 2],
                  "line-width": 1
                }
              },
              // vertex point halos
              {
                "id": "gl-draw-polygon-and-line-vertex-halo-active",
                "type": "circle",
                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "active", "true"]],
                "paint": {
                  "circle-radius": 7,
                  "circle-color": "#FFF"
                }
              },

              // vertex point halos active
              {
                "id": "gl-draw-polygon-and-line-vertex-halo-active-2",
                "type": "circle",
                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["==", "active", "true"]],
                "paint": {
                  "circle-radius": 9,
                  "circle-color": "#FFF"
                }
              },
              // vertex points
              {
                "id": "gl-draw-polygon-and-line-vertex-active",
                "type": "circle",
                "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                "paint": {
                  "circle-radius": 5,
                  "circle-color": "#333",
                }
              },

              // vertex midpoints
              {
                "id": "gl-draw-polygon-and-line-midpoint",
                "type": "circle",
                "filter": ["all", ["!=", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                "paint": {
                  "circle-radius": 3,
                  "circle-color": "#333"
                }
              },

              // INACTIVE (static, already drawn)
              // line stroke
              {
                  "id": "gl-draw-line-static",
                  "type": "line",
                  "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
                  "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                  },
                  "paint": {
                    "line-color": "#41D98D",
                    "line-width": 3
                  }
              },
              
              
              // polygon outline
              {
                "id": "gl-draw-polygon-stroke-static",
                "type": "line",
                "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                "layout": {
                  "line-cap": "round",
                  "line-join": "round"
                },
                "paint": {
                  "line-color": "#1E9359",
                  "line-width": 3
                }
              },


              // points
              {
                'id': 'highlight-active-points',
                'type': 'circle',
                'filter': ['all',
                  ['==', '$type', 'Point'],
                  ['==', 'meta', 'feature'],
                  ['==', 'active', 'true']],
                'paint': {
                  'circle-radius': 7,
                  'circle-color': '#ffffff'
                }
              },
              {
                'id': 'highlight-active-points-stroke',
                'type': 'circle',
                'filter': ['all',
                  ['==', '$type', 'Point'],
                  ['==', 'meta', 'feature'],
                  ['==', 'active', 'true']],
                'paint': {
                  'circle-radius': 5,
                  'circle-color': '#000000'
                }
              },
              {
                'id': 'points-are-blue-2',
                'type': 'circle',
                'filter': ['all',
                  ['==', '$type', 'Point'],
                  ['==', 'meta', 'feature'],
                  ['==', 'active', 'false']],
                'paint': {
                  'circle-radius': 5,
                  'circle-color': '#fff'
                }
              },
              {
                'id': 'points-are-blue',
                'type': 'circle',
                'filter': ['all',
                  ['==', '$type', 'Point'],
                  ['==', 'meta', 'feature'],
                  ['==', 'active', 'false']],
                'paint': {
                  'circle-radius': 3,
                  'circle-color': '#000000'
                }
              }
              ]
    //displayControlsDefault: false,
});

map.addControl(draw);


var selectSidebarLayer = function(layers){
  //console.log(layers);
  if(layers === 'none'){
    $('.layers-container').find("article.layer-item").removeClass('active');
    return;
  }

  // remove previous active states
  $('.layers-container').find("article.layer-item").removeClass('active');


  var  selectorArray = [];
  for (var i = layers.length - 1; i >= 0; i--) {
    //console.log(layers[i])
    var el = $('.layers-container').find("article[name='"+layers[i]+"']");
    el.addClass('active');
  }
  
  
  
  

  // el.addClass('activxe');
 
}

var deleteBtn = $('.action-btn-list li[action="delete"]');
var combineBtn = $('.action-btn-list li[action="combine"]');
var holeBtn = $('.action-btn-list li[action="hole"]');
var expandBtn = $('.action-btn-list li[action="expand"]');
var snapBtn = $('.action-btn-list li[action="snap"]');
var cutBtn = $('.action-btn-list li[action="cut"]');
var dupBtn = $('.action-btn-list li[action="duplicate"]');

var toggleControls = function (num){
  if(num.length === 1){
    deleteBtn.addClass('disabled');
    combineBtn.addClass('disabled');
    holeBtn.addClass('disabled');
    expandBtn.addClass('disabled');
    cutBtn.addClass('disabled');
    dupBtn.addClass('disabled');
    

  } else if (num.length === 2){
    deleteBtn.removeClass('disabled');
    combineBtn.addClass('disabled');
    holeBtn.addClass('disabled');
    expandBtn.removeClass('disabled');
    cutBtn.addClass('disabled');
    dupBtn.removeClass('disabled');
  } else {
    deleteBtn.removeClass('disabled');
    combineBtn.removeClass('disabled');
    holeBtn.removeClass('disabled');
    expandBtn.addClass('disabled');
    cutBtn.removeClass('disabled');
    dupBtn.addClass('disabled');
  }
}

var  updateFeatureTypeIndicator = function(reset){
  if(reset === 'na'){
    $('.current-feature-item select').val('na');
    return;
  }
  var thisFeatureType = draw.getSelected().features[0].properties.featureType;
  console.log(thisFeatureType);
  //$('.current-feature-item option[value="'+thisFeatureType+'"]').remove();
  $('.current-feature-item select').val(thisFeatureType);
  //i[type="lock"]
}
$('.current-feature-item select').change(function(){
  var attr = $(this).val();
  var thisFeature = draw.getSelected().features[0]
  console.log(thisFeature);
  thisFeature.properties.featureType = attr;
  var c = turf.featureCollection([thisFeature]);
  var thisFeatureID = draw.getSelected().features[0].id;
  console.log(attr);

  //draw.setFeatureProperty({"featureId":thisFeatureID, "property": "featureType", "value": attr})
  draw.delete(thisFeatureID)
  draw.add(c)
  


});

var removeLayerFromList = function(el,idOnly){
  var id;
  if(idOnly){
    id = el;
  } else {
    id = el.id
  }
  
  var match = $('#map-layers').find('.list-item[layerId='+id+']');
  console.log(match);
  console.log('here');
  match.remove();
}
var updateLayerList= function(){
  var all = draw.getAll();
  for (var i = 0; i < all.features.length; i++) {
    var el = all.features[i];
    var type = el.geometry.type;
    var id = el.id
    var name = el.properties.name;
    //console.log(id)
    var match = $('#map-layers').find('.list-item[layerId='+id+']');
    console.log(match)
    if(match.length > 0){
      console.log('exists')
    } else {
      console.log('does not exist')
    }
  }
}


var addLayerToList = function(obj,id, getName){
  console.log(obj)
  if(id === undefined){
    id = obj.id;
    console.log('undefined')
  } else {
    id = id[0]
    obj = obj.features[0]
    console.log('else')
  }
  console.log(obj);
  var type = obj.geometry.type;
  var name;
  if(getName !== undefined){
    //name = $('#map-layers').find('.list-item[layerId='+id+'] p');
    console.log(getName)
    var ads = $('#map-layers').find('.list-item[layerid='+getName+'] p')
    console.log(ads)
    name = ads.text()
    console.log(id,getName,name)
  } else {
    name = 'Untitled';
    console.log('false')
  }

  // dropfiles`
  if(obj.properties.layerName !== undefined){
    name = obj.properties.layerName
  }
  
  var o1 = '<div class="list-item icon-w-actions" '+type+' type="'+type+'" layerId="'+id+'"> <i class="fa fa-map-marker-alt"></i> <i class="fa fa-minus"></i> <i class="fa fa-draw-polygon"></i> <p>'
  var o2 = '</p> <ul> <li><i class="fa fa-pencil-alt"></i></li> <li><i class="fa fa-search-plus"></i></li><li><i class="fa fa-trash"></i></li> </ul> </div>'        
  var element = o1 + name + o2;
  $('#map-layers').append(element)
}
var updateGeo = function(){
  //updateLayerList()
  console.log('CHECK GEO');


  var selectedPoints = draw.getSelectedPoints();
  //console.log(selectedPoints);
  if(selectedPoints.features.length === 1){
    //console.log('show');
    snapBtn.removeClass('disabled');
  } else {
    //console.log('hide');
    snapBtn.addClass('disabled');
  }
  var selectedFeatures = draw.getSelected()
  //console.log(selectedFeatures);
  if(selectedFeatures.features.length === 0){
    $('#map-layers').find('.list-item').removeClass('active');
    selectSidebarLayer('none');
    toggleControls(['new']);
    updateFeatureTypeIndicator('na')
    return;
  } else if (selectedFeatures.features.length === 1){
    toggleControls(['new','delete']);
    updateFeatureTypeIndicator()
  } else {
    toggleControls(['new','delete','all']);
    updateFeatureTypeIndicator('na')
  }


  if(selectedFeatures.features.length > 0){

    var layerArray = []
    for (var i = selectedFeatures.features.length - 1; i >= 0; i--) {
      //console.log(selectedFeatures.features[i])
      var layerName = selectedFeatures.features[i].properties.name;

      layerArray.push(layerName);
    }
    // var feature = selectedFeatures.features[0]
    // var name = [feature.properties.name];
    selectSidebarLayer(layerArray);

    //console.log(feature.properties);
    //delete feature.id;
    var output = JSON.stringify(selectedFeatures.features[0],undefined,1);
    //logger.find('pre').remove();
    //logger.append('<pre>'+output+'</pre>')
    copyArea.val('')
    copyArea.val(output)
    // copyArea.select();
    // document.execCommand('copy');
    //console.log(output);
    checkActiveLayers(selectedFeatures.features)
  }
}

var checkActiveLayers = function(features){
  $('#map-layers').find('.list-item').removeClass('active');
  for (var i = 0; i < features.length; i++) {
    var id = features[i].id;
    var match = $('#map-layers').find('.list-item[layerId='+id+']');
      match.addClass('active');
  }
}

map.on('draw.selectionchange', updateGeo);
map.on('draw.update', function(e,i){
	console.log(e,i);
  console.log('draw update')
  updateLayerList()
});

map.on('draw.create', function(e,i){
  console.log()
  addLayerToList(e.features[0])
});



numUntitled = 0;
var addNewSidebarLayer = function(e,i){
  //console.log(e,i);
  numUntitled += 1;
  //layersContainer.append('<article name="Untitled Layer '+numUntitled+'" class="layer-item"><h2>Untitled Layer '+numUntitled+'</h2></article>')

  // geojson
  var newPoly = e.features[0];
  //console.log(JSON.stringify(newPoly.geometry))
  
  newPoly.properties['name'] = "Untitled Layer " + numUntitled;
  

  draw.delete(newPoly.id)
  var LayerID = draw.add(newPoly);
  layersContainer.append('<article name="Untitled Layer '+numUntitled+'" layer-id="'+LayerID+'" class="layer-item"><h2>Untitled Layer '+numUntitled+'</h2></article>')
  

}
// map.on('draw.create', function(e,i){
//   addNewSidebarLayer(e,i);
// });



var bikeZone = {"coordinates":[[[-122.45421669942822,37.771176607233386],[-122.45299490469219,37.76650206575235],[-122.4444423415523,37.76746790432773],[-122.44331829039713,37.768974587309074],[-122.44019049588367,37.77051987131894],[-122.43813788072276,37.76912911716515],[-122.4376980346212,37.767004303376524],[-122.42909659969092,37.767854236233646],[-122.42841239464948,37.76453171594471],[-122.42631090769818,37.76460898555504],[-122.42456484192377,37.74334412878741],[-122.4244208923447,37.740782916839066],[-122.41859093415297,37.73890463842059],[-122.4153520684929,37.73896155664997],[-122.4153520684929,37.74135208270698],[-122.41779921143646,37.741807412247425],[-122.41923870728138,37.742945723865915],[-122.41743933747523,37.74596216495864],[-122.41463232056145,37.74658820336545],[-122.41002593385052,37.74675894019754],[-122.40757879089799,37.748580108521594],[-122.40318832856018,37.74960449600442],[-122.3975742947506,37.74966140600593],[-122.39642269806387,37.74738497186439],[-122.38843349610477,37.74266114759888],[-122.39161650365659,37.733705801466314],[-122.38341674697804,37.72957893861167],[-122.380320335362,37.73923815782551],[-122.38599708998782,37.742684334768185],[-122.38473558896146,37.74522352035916],[-122.38751784998493,37.77672987403679],[-122.38969680630254,37.77663922895211],[-122.39038489777278,37.77740970862921],[-122.387632531899,37.778860001486024],[-122.38751784998493,37.78878467961728],[-122.39181985363956,37.79374521322168],[-122.40231324854983,37.8045740066253],[-122.40764595744052,37.80797183627895],[-122.4141254854435,37.808968503325715],[-122.42077703631762,37.8081983527032],[-122.42049033153955,37.80498175442652],[-122.44784196745614,37.80181032319399],[-122.4468098302508,37.792974903851956],[-122.44508960157523,37.782733557331326],[-122.45632842891277,37.78150993871736],[-122.45421669942822,37.771176607233386]]],"type":"Polygon"}
bikeZone = turf.feature(bikeZone,{"name":"bike zone perimeter"})
bikeZone = turf.featureCollection([bikeZone])
var kickZone = {"coordinates":[[[-122.44683260962229,37.793220805560935],[-122.42307847239525,37.79597924185937],[-122.42171622796846,37.7893857351886],[-122.39106572831827,37.79295168430383],[-122.38791553807141,37.7885110421377],[-122.38766011724603,37.778619561831036],[-122.39029946582092,37.77734097455952],[-122.38961834361282,37.77666802501575],[-122.38731955613137,37.77660072972279],[-122.3846802075565,37.7451671350651],[-122.38612759226191,37.742339476181755],[-122.38910750195146,37.73230714826367],[-122.40307050734447,37.741396899209164],[-122.4074126614608,37.739444380154026],[-122.41890659883626,37.738905745152124],[-122.42461099737933,37.74072362259918],[-122.42554754042341,37.75438993814208],[-122.43508325142145,37.75398604383601],[-122.43550895281477,37.76273659364348],[-122.43670091668423,37.77034199985657],[-122.4402768083138,37.7706112034483],[-122.44810971378101,37.76953438321773],[-122.45083420263455,37.78218603045741],[-122.44512980409147,37.782791640111114],[-122.44683260962229,37.793220805560935]]],"type":"Polygon"}
kickZone = turf.feature(kickZone,{"name":"kick zone perimeter"})
kickZone = turf.featureCollection([kickZone])
//draw.add(kickZone)
// draw.add(bikeZone)




var layersContainer = $('.layers-container');


var addStartingFeatures = function(){
  
  map.on('load', function() {

    // draw.add(zone);    

  });

  

}
addStartingFeatures();


var expandFeaturePerimeter  = function(){
  var bufferAmount;
  var answer = prompt("Enter number of METERS to expand this zone", "500");
  if (answer != null) {
    bufferAmount =  answer;
  }

  var selectedPoly = draw.getSelected();
  selectedPoly = selectedPoly.features[0];
  var newExpandedFeature = turf.buffer(selectedPoly, bufferAmount, {units: 'meters'});
  //draw.delete(selectedPoly.id)
  var c = turf.featureCollection([newExpandedFeature]);
  var newLayer = draw.add(c);
  addLayerToList(c, newLayer)

}

var combineSelectedFeatures = function(){
	var selectedPolys = draw.getSelected();
	console.log(selectedPolys);
	// if more than one selected
	if(selectedPolys.features.length === 2 ){
		var poly1 = selectedPolys.features[0]
		var poly2 = selectedPolys.features[1]
		var intersection = turf.intersect(poly1, poly2);
		console.log(intersection);
		if(intersection === null){
			return;
		}

		var combinedFeature = turf.union(poly1,poly2);
		var c = turf.featureCollection([combinedFeature]);
		// remove both old features
    removeLayerFromList(poly1)
    removeLayerFromList(poly2)
		draw.delete(poly1.id)
		draw.delete(poly2.id)
		var newLayer = draw.add(c);
    addLayerToList(c, newLayer)
	}
}

var createIsland = function(){
	var selectedPolys = draw.getSelected();
	console.log(selectedPolys);

	// check area
	// check intersection
	// if more than one selected

	if(selectedPolys.features.length === 2 ){

		var poly1 = selectedPolys.features[0]
		var poly2 = selectedPolys.features[1]
		var intersection = turf.intersect(poly1, poly2);
		console.log(intersection);
		if(intersection !== null){
			
		

		var area1 = turf.area(poly1);
		var area2 = turf.area(poly2);
		var d1;
		var d2;
		if(area1 < area2){
			console.log('switch');
			d1 = poly2;
			d2 = poly1;
		} else {
			d1 = poly1;
			d2 = poly2;
		}


		var combinedFeature = turf.difference(d1,d2);
		var c = turf.featureCollection([combinedFeature]);
		// remove both old features
		draw.delete(poly1.id)
		draw.delete(poly2.id)
		draw.add(c);
		}
	}
}

var subtractFromPerimeter = function(){
	var selectedPoly = draw.getSelected();
	if(selectedPoly.features.length === 1 ){

		var polyFeature = selectedPoly.features[0];
		var difference = turf.difference(polyFeature,zone);
		var id = selectedPoly.features[0].id;  
		 var newPoly = turf.featureCollection([difference]);
    //var newPoly = turf.polygon([newPolyCoords]);


    draw.delete(id)
    draw.add(difference);
    // map.addLayer({
    //         "id": "fill-test",
    //         "type": "fill",
    //         "source": {
    //             "type": "geojson",
    //             "data": newPoly
    //         }
    //     });


	} else {
		return;
	}


};
var snapToNearestPoint = function(){
  console.log('snapper!');
  var allFeatures = draw.getAll();
  var selectedPoint = draw.getSelectedPoints();
  var selectedPoly = draw.getSelected();
  
  

  
  // compare selected point against allPoints
  // skip if no selected points
  if(selectedPoint.features.length === 1 ){
    
    // get the ID for the selected Polygon
    var selectedPolyID = selectedPoly.features[0].id;  


    // get all the features that ARE NOT SELECTED
    var otherFeatures = [];
    turf.featureEach(allFeatures, function (currentFeature) {
 
      if(currentFeature.id !== selectedPolyID){
        otherFeatures.push(currentFeature);
      }

    });
    // exlode all points that ARE NOT SELECTED
    var otherFeatures = turf.featureCollection(otherFeatures);
    var allPoints = turf.explode(otherFeatures);
    

    // get nearest point among all features
    var nearestOutside = turf.nearestPoint(selectedPoint.features[0], allPoints); 

    // make coordinates for the new polygon    
    var newPolyCoords = []
    turf.coordEach(selectedPoly, function (currentCoord) {
      if(currentCoord[1] === selectedPoint.features[0].geometry.coordinates[1]){
        newPolyCoords.push(nearestOutside.geometry.coordinates);
      } else {
        newPolyCoords.push(currentCoord)
      }
      
    });

    // FeatureCollection of the new polygon
    var newPoly = turf.featureCollection([turf.polygon([newPolyCoords])]);
    draw.delete(selectedPolyID)
    
    var newID = draw.add(newPoly);
    addLayerToList(newPoly, newID, selectedPolyID)
    removeLayerFromList(selectedPolyID,true)
    //draw.changeMode('direct_select', {featureId: newID})
    draw.changeMode('simple_select',{featureIds: newID});




  } // end of if


  
};


var getLatestData = function(x){

};


var hidePresentationLayer = function(layerName,triggerEl){
	var rules = JSON.parse(map.queryRenderedFeatures({layers:[layerName]})[0].properties.defaultOpacity);
	map.setPaintProperty(layerName, rules[0], 0);
	triggerEl.parent().find('i[type="lock"]').removeClass('ion-md-unlock').addClass('ion-md-lock')
};
var showPresentationLayer = function(layerName,triggerEl){
	var rules = JSON.parse(map.queryRenderedFeatures({layers:[layerName]})[0].properties.defaultOpacity);
	map.setPaintProperty(layerName, rules[0], rules[1]);
	//triggerEl.parent().find('i[type="lock"]').removeClass('ion-md-lock').addClass('ion-md-unlock')
};

var unlockDrawLayer = function(layerName,triggerEl){
	// Grab most recent data
	getLatestData(layerName)


	// remove presentation layer
	var rules = JSON.parse(map.queryRenderedFeatures({layers:[layerName]})[0].properties.defaultOpacity);
	map.setPaintProperty(layerName, rules[0], 0);

	// show the draw layer
	draw.add(zone);


	// change the visibility icon
	//triggerEl.parent().find('i[type="viz"]').removeClass('ion-md-eye-off').addClass('ion-md-eye')
}
var lockDrawLayer = function(layerName,triggerEl){

	//triggerEl.parent().find('i[type="viz"]').removeClass('ion-md-eye-off').addClass('ion-md-eye')
	var rules = JSON.parse(map.queryRenderedFeatures({layers:[layerName]})[0].properties.defaultOpacity);
	//map.setPaintProperty(layerName, rules[0], rules[1]);
	

}

var toggleLayer = function(layer,type,action,layerName,triggerEl){
	console.log(type,action);

	if(type === "viz"){
		if(action === 'show'){
			showPresentationLayer(layerName,triggerEl);
		} else {
			hidePresentationLayer(layerName,triggerEl);
		}
		
	} else if(type === 'lock') {
		if(action === 'unlock'){
			unlockDrawLayer(layerName,triggerEl);
		} else{
			lockDrawLayer(layerName,triggerEl);
		}
		
	} else {
	}
}
var toggleScooterExclusions = function(type, action){

}
var toggleNeighborhoods = function(type, action){

}

var updateLayerProps = function(layer, type,action,layerName){
	console.log(layer,type,action);
	if(layer === "perimeter"){
		togglePerimeter(type, action);
	} else if(layer === "scooter-exclusion"){
		toggleScooterExclusions(type, action);
	} else if(layer === "service-area"){
		toggleNeighborhoods(type, action);
	} else {

	}
}
$('.controls').on('click','i.icon',function() {
		var eye = $(this).hasClass('ion-md-eye');
		var eyeOff = $(this).hasClass('ion-md-eye-off');
		var unlocked = $(this).hasClass('ion-md-unlock');
		var locked = $(this).hasClass('ion-md-lock');
		var layer = $(this).attr('layer');
		var type = $(this).attr('type');
		var action;
		var layerName
		
		if(layer ==='perimeter'){
			layerName = 'zone-perimeter-layer'
		}

		if(layer ==='scooter-exclusion'){
			layerName = 'scooter-exclusion-layer'			
		}

		if(layer ==='service-area'){
			layerName = 'neighborhoods-layer'			
		}

		if(locked){
			$( this ).removeClass('ion-md-lock').addClass('ion-md-unlock');
			action = 'unlock';
		} else if(unlocked){
			$( this ).removeClass('ion-md-unlock').addClass('ion-md-lock');
			action = 'lock';
		} else if (eye){
			$( this ).removeClass('ion-md-eye').addClass('ion-md-eye-off');
			action = 'hide';
		} else if(eyeOff){
			$( this ).removeClass('ion-md-eye-off').addClass('ion-md-eye');
			action = 'show';
		}

		toggleLayer(layer,type,action,layerName,$(this));
    
});
var deleteLayers = function(){
  var s = draw.getSelected();
  
  selectedPolys = s.features;
  console.log(selectedPolys)
  if(selectedPolys.length === 0){
    console.log('none!')
    return;
  }
  for (var i = selectedPolys.length - 1; i >= 0; i--) {
      var id = selectedPolys[i].id;
      removeLayerFromList(selectedPolys[i])
      var layerName = selectedPolys[i].properties.name;
      var el = $('.layers-container').find("article[name='"+layerName+"']");
      el.remove();
      draw.delete(id)
  }
}


var newPolygonLayer = function(){
  console.log('start drawing');
  draw.changeMode('draw_polygon');  
}

var newLineLayer = function(){
  console.log('start drawing');
  draw.changeMode('draw_line_string');  
}

var newPointLayer = function(){
  console.log('start drawing');
  draw.changeMode('draw_point');  
}



// var cutFeature = function(){
//     console.log('CUT');
//     var selectedPolys = draw.getSelected();
//     var poly1 = selectedPolys.features[0]
//     var poly2 = selectedPolys.features[1]
//     var intersection = turf.intersect(poly1, poly2);
//     console.log(intersection);
//     if(intersection !== null){
      
    

//     var area1 = turf.area(poly1);
//     var area2 = turf.area(poly2);
//     var d1;
//     var d2;
//     if(area1 < area2){
//       console.log('switch');
//       d1 = poly2;
//       d2 = poly1;
//     } else {
//       d1 = poly1;
//       d2 = poly2;
//     }


//     var combinedFeature = turf.difference(d1,d2);
//     var combinedFeature2 = turf.intersect(d2,d1);
//     var c = turf.featureCollection([combinedFeature]);
//     var d = turf.featureCollection([combinedFeature2]);

//     // remove both old features
//     draw.delete(poly1.id)
//     draw.delete(poly2.id)
//     draw.add(c);
//     draw.add(d);
//     } // end of intersectio condition

// };

// wujie

var cutFeature = function(){
    // console.log('CUT');
    var selectedPolys = draw.getSelected();
    var poly1 = selectedPolys.features[0]
    var poly2 = selectedPolys.features[1]
    var intersection = turf.intersect(poly1, poly2);
    console.log(intersection);
    if(intersection !== null){
      
    

    var area1 = turf.area(poly1);
    var area2 = turf.area(poly2);
    var d1;
    var d2;
    if(area1 < area2){
      console.log('switch');
      d1 = poly2;
      d2 = poly1;
    } else {
      d1 = poly1;
      d2 = poly2;
    }


    var combinedFeature = turf.difference(d1,d2);
    var combinedFeature2 = turf.intersect(d2,d1);
    var c = turf.featureCollection([combinedFeature]);
    var d = turf.featureCollection([combinedFeature2]);

    // remove both old features
    draw.delete(poly1.id)
    draw.delete(poly2.id)

    removeLayerFromList(poly1.id, true)
    removeLayerFromList(poly2.id, true)

    var add1 = draw.add(c);
    var add2 = draw.add(d);

    addLayerToList(c,add1);
    addLayerToList(d,add2);
    } // end of intersectio condition

};

var duplicateFeature = function(){
    var uniqueID = 'new' + Math.random();
    
    var selectedPolys = draw.getSelected();
    var poly = selectedPolys.features[0]
    delete poly.id;
    console.log(uniqueID.toString())
    var c = turf.featureCollection([poly]);
    var id = draw.add(c);
    console.log(id);
    
    //console.log(draw.getSelected().features[0]);
    addLayerToList(c,id)
    
};

var createCenteroid = function(){
    
    
    var selectedPolys = draw.getSelected();
    var poly = selectedPolys.features[0]
    var centerpoint = turf.centerOfMass(poly)
    var c = turf.featureCollection([centerpoint]);
    var id = draw.add(c);
    console.log(id);
    
    //console.log(draw.getSelected().features[0]);
    addLayerToList(c,id)
    
};

var combineGeometry = function(){
  console.log('combine');
  draw.combineFeatures();
  // change layer list
}

var seperateGeometry = function(){
  console.log('uncombine');
  draw.uncombineFeatures();
  // change layer list
}


var createRandomPoints = function(){
  var answer = prompt("Enter number of random Points", 'asd');
  var numPoints;
  if (answer != null) {
    numPoints =  parseInt(answer);
  } else { return; }

  if(numPoints === NaN){ return; }
  var selectedPolys = draw.getSelected();
  var poly = selectedPolys.features[0]
  var zoneBox = turf.bbox(poly);
  console.log(zoneBox);
  var points = turf.randomPoint(numPoints, {bbox: zoneBox});

  //draw until complete
  var n = 0;

  //while (n < numPoints) {
    var points = turf.randomPoint(numPoints*4, {bbox: zoneBox});
    var ptsWithin = turf.pointsWithinPolygon(points, poly);
    console.log(ptsWithin)
    console.log(ptsWithin.features.length)
    var featureList = ptsWithin.features.slice(0,numPoints);
    console.log(featureList)
    var c = turf.featureCollection(featureList);
    console.log(c)

  //   n++;
  // }
  //console.log(points);
  var newPoints = draw.add(c);

  console.log(newPoints);
  draw.changeMode('simple_select',{featureIds: newPoints});
  combineGeometry()


}

$('.action-btn-list li, *[map-action]').on('click',function(){
  
  var actionType = $(this).attr('action');
  console.log(actionType);
  if(actionType === 'delete'){
    deleteLayers();
  }

  if(actionType === 'new-polygon-layer'){
    newPolygonLayer();
  }

  if(actionType === 'new-line-layer'){
    newLineLayer();
  }

  if(actionType === 'centeroid'){
    createCenteroid();
  }
  if(actionType === 'rand-points'){
    createRandomPoints();
  }

  if(actionType === 'combine-geometry'){
    combineGeometry();
  }

  if(actionType === 'seperate-geometry'){
    seperateGeometry();
  }

  

  


  if(actionType === 'new-point-layer'){
    newPointLayer();
  }

  if(actionType === 'duplicate'){
    duplicateFeature();
  }

  if(actionType === 'combine'){
    combineSelectedFeatures();
  }

  if(actionType === 'hole'){
    createIsland();
  }

  if(actionType === 'expand'){
    expandFeaturePerimeter();
  }

  if(actionType === 'snap'){
    snapToNearestPoint();
  }

  if(actionType === 'cut'){
    cutFeature();
  }


});



//document.keydown = function (e) {
document.addEventListener("keydown", function(e) {

    e = e || window.event;
    // use e.keyCode
    console.log(e.keyCode);
    if(e.keyCode === 8){ deleteLayers(); } // backspace
    if(e.keyCode === 49){ newPointLayer(); } // 1
    if(e.keyCode === 50){ newLineLayer(); } // 2
    if(e.keyCode === 51){ newPolygonLayer(); } // 3
    if(e.keyCode === 52){ snapToNearestPoint(); } // 4
    if(e.keyCode === 68){ duplicateFeature(); } // D
    //if(e.keyCode === 68){ duplicateFeature(); } // D

});




$('.layers-container').on('click', 'article', function(){
  var layerID = $(this).attr('layer-id');
  console.log(layerID);
  draw.changeMode('simple_select',{featureId: layerID});
  var feature =  draw.get(layerID)
  console.log(feature);
  var centerCoords = turf.centerOfMass(feature.geometry);
  centerCoords = centerCoords.geometry.coordinates;
  map.easeTo({
    center: centerCoords,
    
  });

});


$('.context-list').on('click', 'li:not(".active")', function(){
  $('.context-list li').removeClass('active');
  $(this).addClass('active');
  var context = $(this).attr('context');
  console.log(context);

  
  var newZones;
  // pick which zones to pull up
  if(context === 'bike'){
    newZones = bikeZone;
  } else if (context === 'genze'){
    newZones = zones
  } else if (context === 'kick'){
    newZones = kickZone
  } else {
    return;
  }

  // remove all layers
  draw.deleteAll()
  $('.layers-container').find('article').remove();

  //add new layers
  addZones(newZones);






 
});

var panMap = function(place){
  var panCoords;

  if(place === 'sfo'){
    panCoords = [ -122.42271869842615,37.77645740426891]
    map.setBearing(0);
  } else if (place === 'scl'){
    panCoords = [-70.596168,-33.4225424];
    map.setBearing(0);

  } else {
    panCoords = [2.1734,41.3851];
    map.setBearing(-44.7);

  }
  map.setZoom(13)
  map.setCenter(panCoords);
}

 $('#region-picker input').on('change', function() {
    var val= $(this).val();
    console.log(val);
    panMap(val);
  })


 $('#map-tools input').on('change', function() {
    var val= $(this).val();
    var newStyle;
    if(val === 'dark'){
      newStyle = darkStyle;
    } else if (val === 'light'){
      newStyle = lightStyle;
    } else if (val === 'satellite-labels'){
      newStyle = satelliteStreetStyle;
    } else if (val === 'street'){
      newStyle = streetStyle;
    } else {
      newStyle = satelliteStyle;
    }
    map.setStyle(newStyle);
  })


 $('.paster textarea').on('change', function() {
    var val = $('.paster textarea').val();
    console.log(val);
  })


 $('#submit-paster').click(function(){
  var value= $('.paster textarea').val();
  var featureObj = JSON.parse(value);
  
  //var pastedZone = turf.featureCollection([featureObj])
  draw.add(featureObj);
  var bbox = turf.bbox(featureObj);
  console.log(bbox);
  map.fitBounds(bbox,{'linear':true, 'padding': 50});
  var value= $('.paster textarea').val('');
  // if(GJV.valid(pastedZone)){
  //   console.log("this is valid GeoJSON!");
  // }
 });

 // var processGeoDropFile = function(result,formatted){
 //  var jsonObj;
 //  console.log(result)
 //  if(!formatted){
 //    jsonObj = JSON.parse(result);
 //  } else {
 //    jsonObj = result;
 //  }
  
 //  console.log(jsonObj);
 //  draw.add(jsonObj);
 //  for (var i = 0; i < jsonObj.features.length; i++) {
 //    //jsonObj.features[i]
 //    //console.log('ads')
 //    addLayerToList(jsonObj.features[i]);
 //  }
 //  var bbox = turf.bbox(jsonObj);
 //  map.fitBounds(bbox,{'linear':true, 'padding': 50});
  
 // }

  var processGeoDropFile = function(result,formatted, kml){
  var jsonObj;
  if(kml){
    var dom = (new DOMParser()).parseFromString(result, 'text/xml');
    var jsonObj = toGeoJSON.kml(dom);
    console.log("KML");
    draw.add(jsonObj);
    for (var i = 0; i < jsonObj.features.length; i++) {
     addLayerToList(jsonObj.features[i]);
    }
    var bbox = turf.bbox(jsonObj);
    map.fitBounds(bbox,{'linear':true, 'padding': 50});
    return;
  }
  if(!formatted){
    jsonObj = JSON.parse(result);
  } else {
    jsonObj = result;
  }
  
  console.log(jsonObj);
  draw.add(jsonObj);

  for (var i = 0; i < jsonObj.features.length; i++) {
    addLayerToList(jsonObj.features[i]);
  }

  var bbox = turf.bbox(jsonObj);
  map.fitBounds(bbox,{'linear':true, 'padding': 50});
  
 }



 var copyShit = function(){
  /* Get the text field */
  console.log('asdasdasdasd');
  var copyText = $('#log').find('pre');
  /* Select the text field */
  console.log(copyText);
  copyText.select();
  console.log(copyText);
  /* Copy the text inside the text field */
  //document.execCommand("copy");
 }

 var cc = $('#copier');
cc.click(copyShit);


  var dragged;
  var theDropZone = $('.drop_zone');

  /* events fired on the draggable target */
  document.addEventListener("drag", function( event ) {

  }, false);

  document.addEventListener("dragstart", function( event ) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = .5;
  }, false);

  document.addEventListener("dragend", function( event ) {
      // reset the transparency
      event.target.style.opacity = "";
  }, false);

  /* events fired on the drop targets */
  document.addEventListener("dragover", function( event ) {
      // prevent default to allow drop

      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
        
      // highlight potential drop target when the draggable element enters it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "purple";
      }

  }, false);

  document.addEventListener("dragleave", function( event ) {
    theDropZone.removeClass('active');
      // reset background of potential drop target when the draggable element leaves it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";

      }

  }, false);

  document.addEventListener("drop", function( event ) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";
          dragged.parentNode.removeChild( dragged );
          event.target.appendChild( dragged );
      }
    
  }, false);



function previewFile(file) {
  var reader = new FileReader()
  reader.readAsText(file)
  var extension = file.name.split('.')[1];
  console.log(extension);

  if(extension === "geojson" || extension === "kml" )
  reader.onloadend = function() {
    if(extension === "kml"){
      
      processGeoDropFile(reader.result, false, true);
    }  else{
      processGeoDropFile(reader.result);
    }
    

  }
}
  function dropHandler(ev) {
  theDropZone.removeClass('active');
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  console.log(ev)
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)// Use DataTransfer interface to access the file(s)

    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        previewFile(file)
        //console.log(file);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(ev.dataTransfer.files[i]);
    }
  }
}

var dragOverHandler = function(ev){
  theDropZone.addClass('active');
}


var linkEl  = $('#save-file')
linkEl.click(function(){
  var filename = 'Untitled';
  var answer = prompt("Please enter a filename", "e.g. scoot-kick-layers");
  if (answer != null) {
    filename =  answer;
    var theFeatures = draw.getAll();
    theFeatures = JSON.stringify(theFeatures);
    console.log(theFeatures);
    var blob = new Blob([theFeatures], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename+".geojson");
  }
  
  

});









//earch results
var updateSearchResults = function(data){
  
 
  var searchString = data;
  var bbox = '-122.540817,37.725422,-122.344780,37.818506';
  var token = 'pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA'
  // var types = 'address,poi'
  var types = 'address'

  $.getJSON("https://api.mapbox.com/geocoding/v5/mapbox.places/"+searchString+".json?bbox="+bbox+"&types="+types+"&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA&limit=5", function(result, textStatus, xhr) {
      if (xhr && xhr.status) {
    generateSearchItems(result.features)
    // console.log('features', result.features)
        

      } else {
       // needs error handling
      }
    });
}

$('.dataset-list li').click(function(){
  var val = $(this).attr('dataset');
  var data;
  if(val === 'sfo-kick'){
    data = 'cjj8smoub015kton00psuk61m';
  } else if (val === 'sfo-moto'){
    data = 'cjkbsjots02uzkimrr4r94yky';
  } else if (val === 'scl-all'){
    data = 'cjmnr3kid06ep32o6wp3pj6nj';
  } else {
    data = 'cjg890y8o024tvmp6x0cxck8r'; // bcn
  }
  getDatasetFromMapbox(data);
});
var getDatasetFromMapbox = function(id){
  var token = 'pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA';
  var datasetID = id
  var url ='https://api.mapbox.com/datasets/v1/scoottech/'+datasetID+'/features?access_token=' + token;
  $.getJSON(url, function(result, textStatus, xhr) {

      if (xhr && xhr.status) {
        console.log(result)
        processGeoDropFile(result, true);
      } else {
       // needs error handling
      }
  });
}

$('#map-layers').on('click','.fa-search-plus', function(){
  //console.log($(this).parent().parent().parent())
  var id = $(this).parent().parent().parent().attr('layerid');
  var type = $(this).parent().parent().parent().attr('type');

  //console.log(id);
  var feature = draw.get(id);
  //feature.geometry
  console.log(type)
  //console.log(feature)
  if(type === 'Point'){
    var centerCoords = feature.geometry.coordinates;
    map.easeTo({
      center: centerCoords,
      zoom:14
    });
  } else {
    var bbox = turf.bbox(feature);
    map.fitBounds(bbox,{'linear':true, 'padding': 150});
  }
  
  //draw.changeMode('direct_select', {featureId: id})
})

$('#map-layers').on('click','.fa-trash', function(){
  
  var id = $(this).parent().parent().parent().attr('layerid');

  draw.delete(id);
  removeLayerFromList(id,true)
})

$('#map-layers').on('click','.fa-pencil-alt', function(){
  //console.log($(this).parent().parent().parent())
  var currentName = $(this).parent().parent().parent().find('p').text();
  var answer = prompt("Enter a name for this layer", currentName);
  if (answer != null) {
    name =  answer;
  }
  $(this).parent().parent().parent().find('p').text(name);


  var layerID = $(this).parent().parent().parent().attr('layerid');
  console.log(layerID)
  // // add data to name
  var selected = draw.get(layerID);
  draw.delete(layerID);
  console.log(selected);
  selected.properties.layerName = name;
  draw.add(selected);
  // var newPoly = turf.featureCollection([turf.polygon([newPolyCoords])]);
  // draw.delete(selectedPolyID)
    
  //   var newID = draw.add(newPoly);
  //   addLayerToList(newPoly, newID, selectedPolyID)
  //   removeLayerFromList(selectedPolyID,true)
  
})

$('#map-layers').on('click','.list-item', function(){
  var id = $(this).attr('layerid');
  var type = $(this).attr('type');
  //console.log(id);
  if(type === 'Point'){
    var feature = draw.get(id);
    var centerCoords = feature.geometry.coordinates;
    map.easeTo({
      center: centerCoords,
      zoom:14
    });
  } else {
    draw.changeMode('direct_select', {featureId: id})
  }
  
})

$('#hints').on('change',function(){
  var val= $(this).prop('checked');
  console.log(val);
  if(val){
    $('.right-sidebar .list-item div:nth-child(2)').slideDown(250)
  } else {
    $('.right-sidebar .list-item div:nth-child(2)').slideUp(250)
  }
});

