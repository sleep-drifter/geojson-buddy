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
  center: [ -122.42271869842615,37.77645740426891], // sfo
  //center: [-70.596168,-33.4225424], // scl
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
//var kickZone = {"coordinates":[[[-122.44683260962229,37.793220805560935],[-122.42307847239525,37.79597924185937],[-122.42171622796846,37.7893857351886],[-122.39106572831827,37.79295168430383],[-122.38791553807141,37.7885110421377],[-122.38766011724603,37.778619561831036],[-122.39029946582092,37.77734097455952],[-122.38961834361282,37.77666802501575],[-122.38731955613137,37.77660072972279],[-122.3846802075565,37.7451671350651],[-122.38612759226191,37.742339476181755],[-122.38910750195146,37.73230714826367],[-122.40307050734447,37.741396899209164],[-122.4074126614608,37.739444380154026],[-122.41890659883626,37.738905745152124],[-122.42461099737933,37.74072362259918],[-122.42554754042341,37.75438993814208],[-122.43508325142145,37.75398604383601],[-122.43550895281477,37.76273659364348],[-122.43670091668423,37.77034199985657],[-122.4402768083138,37.7706112034483],[-122.44810971378101,37.76953438321773],[-122.45083420263455,37.78218603045741],[-122.44512980409147,37.782791640111114],[-122.44683260962229,37.793220805560935]]],"type":"Polygon"}
var kickZone = {
    "coordinates": [
      [
        [
          -122.472023,
          37.780816
        ],
        [
          -122.481422,
          37.780384
        ],
        [
          -122.481391,
          37.780068
        ],
        [
          -122.472688,
          37.780503
        ],
        [
          -122.472687,
          37.780498
        ],
        [
          -122.471863,
          37.780528
        ],
        [
          -122.459106,
          37.781043
        ],
        [
          -122.458591,
          37.774429
        ],
        [
          -122.460136,
          37.774225
        ],
        [
          -122.4602,
          37.775684
        ],
        [
          -122.471551,
          37.775141
        ],
        [
          -122.471692,
          37.776913
        ],
        [
          -122.472548,
          37.776916
        ],
        [
          -122.48375,
          37.776388
        ],
        [
          -122.483847,
          37.777846
        ],
        [
          -122.484415,
          37.777829
        ],
        [
          -122.484458,
          37.778525
        ],
        [
          -122.483868,
          37.77855
        ],
        [
          -122.483957,
          37.779942
        ],
        [
          -122.483981,
          37.780266
        ],
        [
          -122.483986,
          37.780266
        ],
        [
          -122.484127,
          37.782004
        ],
        [
          -122.472157,
          37.78253
        ],
        [
          -122.472345,
          37.784935
        ],
        [
          -122.466745,
          37.785156
        ],
        [
          -122.459288,
          37.786199
        ],
        [
          -122.459253,
          37.785761
        ],
        [
          -122.459143,
          37.785774
        ],
        [
          -122.459267,
          37.78742
        ],
        [
          -122.445979,
          37.789116
        ],
        [
          -122.446789,
          37.793032
        ],
        [
          -122.441477,
          37.793682
        ],
        [
          -122.442111,
          37.796805
        ],
        [
          -122.447175,
          37.796161
        ],
        [
          -122.44753,
          37.798356
        ],
        [
          -122.437955,
          37.799518
        ],
        [
          -122.438126,
          37.799646
        ],
        [
          -122.444751,
          37.798831
        ],
        [
          -122.447733,
          37.800798
        ],
        [
          -122.448356,
          37.80502
        ],
        [
          -122.441972,
          37.805825
        ],
        [
          -122.439392,
          37.80449
        ],
        [
          -122.437141,
          37.804716
        ],
        [
          -122.437144,
          37.804731
        ],
        [
          -122.434011,
          37.80513
        ],
        [
          -122.431983,
          37.804231
        ],
        [
          -122.431855,
          37.803553
        ],
        [
          -122.425564,
          37.804356
        ],
        [
          -122.425804,
          37.805664
        ],
        [
          -122.423379,
          37.805977
        ],
        [
          -122.421619,
          37.803646
        ],
        [
          -122.421158,
          37.80307
        ],
        [
          -122.419935,
          37.803214
        ],
        [
          -122.419302,
          37.800044
        ],
        [
          -122.412814,
          37.800895
        ],
        [
          -122.411513,
          37.802892
        ],
        [
          -122.413197,
          37.802697
        ],
        [
          -122.413755,
          37.805511
        ],
        [
          -122.409249,
          37.806062
        ],
        [
          -122.408294,
          37.805579
        ],
        [
          -122.408037,
          37.803935
        ],
        [
          -122.407382,
          37.800806
        ],
        [
          -122.405945,
          37.80101
        ],
        [
          -122.404743,
          37.799984
        ],
        [
          -122.402958,
          37.800304
        ],
        [
          -122.403745,
          37.80368
        ],
        [
          -122.405301,
          37.803502
        ],
        [
          -122.405644,
          37.805426
        ],
        [
          -122.406857,
          37.805308
        ],
        [
          -122.406985,
          37.805833
        ],
        [
          -122.405194,
          37.806054
        ],
        [
          -122.404968,
          37.805003
        ],
        [
          -122.403477,
          37.805104
        ],
        [
          -122.403177,
          37.804833
        ],
        [
          -122.402865,
          37.803434
        ],
        [
          -122.401868,
          37.803536
        ],
        [
          -122.401417,
          37.801552
        ],
        [
          -122.400505,
          37.801663
        ],
        [
          -122.400323,
          37.800739
        ],
        [
          -122.399969,
          37.800798
        ],
        [
          -122.399861,
          37.800035
        ],
        [
          -122.398831,
          37.800086
        ],
        [
          -122.398166,
          37.799086
        ],
        [
          -122.39867,
          37.798916
        ],
        [
          -122.400811,
          37.798655
        ],
        [
          -122.400484,
          37.797034
        ],
        [
          -122.39866,
          37.797254
        ],
        [
          -122.398155,
          37.797314
        ],
        [
          -122.396965,
          37.797483
        ],
        [
          -122.396782,
          37.796627
        ],
        [
          -122.395795,
          37.79678
        ],
        [
          -122.395452,
          37.796364
        ],
        [
          -122.396686,
          37.796178
        ],
        [
          -122.396525,
          37.795406
        ],
        [
          -122.40308,
          37.794516
        ],
        [
          -122.403311,
          37.795584
        ],
        [
          -122.403498,
          37.795724
        ],
        [
          -122.403632,
          37.796292
        ],
        [
          -122.404249,
          37.796233
        ],
        [
          -122.404507,
          37.796441
        ],
        [
          -122.403799,
          37.796551
        ],
        [
          -122.404121,
          37.798128
        ],
        [
          -122.403638,
          37.798195
        ],
        [
          -122.403295,
          37.796644
        ],
        [
          -122.40205,
          37.796805
        ],
        [
          -122.401793,
          37.796847
        ],
        [
          -122.400999,
          37.796949
        ],
        [
          -122.401398,
          37.798584
        ],
        [
          -122.402576,
          37.798441
        ],
        [
          -122.402707,
          37.79909
        ],
        [
          -122.407157,
          37.79856
        ],
        [
          -122.407264,
          37.799103
        ],
        [
          -122.405998,
          37.799272
        ],
        [
          -122.406256,
          37.800628
        ],
        [
          -122.410862,
          37.800075
        ],
        [
          -122.410354,
          37.797441
        ],
        [
          -122.416655,
          37.796655
        ],
        [
          -122.416382,
          37.795242
        ],
        [
          -122.408423,
          37.796288
        ],
        [
          -122.407768,
          37.793117
        ],
        [
          -122.407414,
          37.79316
        ],
        [
          -122.407028,
          37.791421
        ],
        [
          -122.40779,
          37.791303
        ],
        [
          -122.40794,
          37.792006
        ],
        [
          -122.415364,
          37.791065
        ],
        [
          -122.415204,
          37.790353
        ],
        [
          -122.415955,
          37.790243
        ],
        [
          -122.416105,
          37.790947
        ],
        [
          -122.418529,
          37.790675
        ],
        [
          -122.418422,
          37.78998
        ],
        [
          -122.42192,
          37.789471
        ],
        [
          -122.422928,
          37.794508
        ],
        [
          -122.420107,
          37.794859
        ],
        [
          -122.4204,
          37.796188
        ],
        [
          -122.423272,
          37.79583
        ],
        [
          -122.424774,
          37.803146
        ],
        [
          -122.425008,
          37.803146
        ],
        [
          -122.424595,
          37.801312
        ],
        [
          -122.432456,
          37.800344
        ],
        [
          -122.432458,
          37.800209
        ],
        [
          -122.426962,
          37.8009
        ],
        [
          -122.425889,
          37.796017
        ],
        [
          -122.434966,
          37.794931
        ],
        [
          -122.434714,
          37.7937
        ],
        [
          -122.432734,
          37.793956
        ],
        [
          -122.432354,
          37.79229
        ],
        [
          -122.424741,
          37.793278
        ],
        [
          -122.424083,
          37.789757
        ],
        [
          -122.424066,
          37.78976
        ],
        [
          -122.423497,
          37.78703
        ],
        [
          -122.433294,
          37.78581
        ],
        [
          -122.433024,
          37.784545
        ],
        [
          -122.438792,
          37.78378
        ],
        [
          -122.438855,
          37.783702
        ],
        [
          -122.444537,
          37.78288
        ],
        [
          -122.444536,
          37.782875
        ],
        [
          -122.445877,
          37.782688
        ],
        [
          -122.447605,
          37.782612
        ],
        [
          -122.448113,
          37.782542
        ],
        [
          -122.447755,
          37.780992
        ],
        [
          -122.453409,
          37.780263
        ],
        [
          -122.452894,
          37.777778
        ],
        [
          -122.446938,
          37.778616
        ],
        [
          -122.446939,
          37.778621
        ],
        [
          -122.440717,
          37.779398
        ],
        [
          -122.441318,
          37.782451
        ],
        [
          -122.439606,
          37.782678
        ],
        [
          -122.439607,
          37.782688
        ],
        [
          -122.427586,
          37.784293
        ],
        [
          -122.426705,
          37.779975
        ],
        [
          -122.427037,
          37.779935
        ],
        [
          -122.426535,
          37.777478
        ],
        [
          -122.424867,
          37.777689
        ],
        [
          -122.424849,
          37.777558
        ],
        [
          -122.423164,
          37.77777
        ],
        [
          -122.42118,
          37.776659
        ],
        [
          -122.421006,
          37.775351
        ],
        [
          -122.420997,
          37.775353
        ],
        [
          -122.42075,
          37.774166
        ],
        [
          -122.424028,
          37.771567
        ],
        [
          -122.423801,
          37.77141
        ],
        [
          -122.4231,
          37.771427
        ],
        [
          -122.422049,
          37.770562
        ],
        [
          -122.420547,
          37.768492
        ],
        [
          -122.416001,
          37.768715
        ],
        [
          -122.416019,
          37.769773
        ],
        [
          -122.41574,
          37.770833
        ],
        [
          -122.418133,
          37.771935
        ],
        [
          -122.418476,
          37.772928
        ],
        [
          -122.410612,
          37.779195
        ],
        [
          -122.409968,
          37.778677
        ],
        [
          -122.399034,
          37.786783
        ],
        [
          -122.395391,
          37.784346
        ],
        [
          -122.40853,
          37.77353
        ],
        [
          -122.406899,
          37.772207
        ],
        [
          -122.410225,
          37.769527
        ],
        [
          -122.413341,
          37.769671
        ],
        [
          -122.413332,
          37.768847
        ],
        [
          -122.413315,
          37.768848
        ],
        [
          -122.412987,
          37.76554
        ],
        [
          -122.403103,
          37.766097
        ],
        [
          -122.403187,
          37.767059
        ],
        [
          -122.404807,
          37.766949
        ],
        [
          -122.404915,
          37.76767
        ],
        [
          -122.403327,
          37.767763
        ],
        [
          -122.403541,
          37.770121
        ],
        [
          -122.402737,
          37.770188
        ],
        [
          -122.401355,
          37.77124
        ],
        [
          -122.401873,
          37.771684
        ],
        [
          -122.401878,
          37.771681
        ],
        [
          -122.403509,
          37.772936
        ],
        [
          -122.404003,
          37.772538
        ],
        [
          -122.405312,
          37.773538
        ],
        [
          -122.406116,
          37.772894
        ],
        [
          -122.406417,
          37.773191
        ],
        [
          -122.404958,
          37.774344
        ],
        [
          -122.404797,
          37.774157
        ],
        [
          -122.395935,
          37.781153
        ],
        [
          -122.394573,
          37.780176
        ],
        [
          -122.393454,
          37.781096
        ],
        [
          -122.39383,
          37.781406
        ],
        [
          -122.394194,
          37.78111
        ],
        [
          -122.394343,
          37.781006
        ],
        [
          -122.394441,
          37.780973
        ],
        [
          -122.394556,
          37.780969
        ],
        [
          -122.394687,
          37.781024
        ],
        [
          -122.394769,
          37.781111
        ],
        [
          -122.394766,
          37.78121
        ],
        [
          -122.394747,
          37.781263
        ],
        [
          -122.394711,
          37.781311
        ],
        [
          -122.394233,
          37.781695
        ],
        [
          -122.394706,
          37.78208
        ],
        [
          -122.395666,
          37.781289
        ],
        [
          -122.39646,
          37.781917
        ],
        [
          -122.394214,
          37.783712
        ],
        [
          -122.393315,
          37.782973
        ],
        [
          -122.394601,
          37.782163
        ],
        [
          -122.394118,
          37.781784
        ],
        [
          -122.393617,
          37.782171
        ],
        [
          -122.393568,
          37.782197
        ],
        [
          -122.393513,
          37.782216
        ],
        [
          -122.393459,
          37.782227
        ],
        [
          -122.393351,
          37.78223
        ],
        [
          -122.393231,
          37.782196
        ],
        [
          -122.393187,
          37.78213
        ],
        [
          -122.393171,
          37.782078
        ],
        [
          -122.39318,
          37.782017
        ],
        [
          -122.393199,
          37.781945
        ],
        [
          -122.393228,
          37.781882
        ],
        [
          -122.393743,
          37.781485
        ],
        [
          -122.393244,
          37.78109
        ],
        [
          -122.390175,
          37.783567
        ],
        [
          -122.391657,
          37.784762
        ],
        [
          -122.390109,
          37.786048
        ],
        [
          -122.391579,
          37.787199
        ],
        [
          -122.393113,
          37.788373
        ],
        [
          -122.391182,
          37.789878
        ],
        [
          -122.392555,
          37.790938
        ],
        [
          -122.392877,
          37.790684
        ],
        [
          -122.392555,
          37.790421
        ],
        [
          -122.392845,
          37.790175
        ],
        [
          -122.393553,
          37.790769
        ],
        [
          -122.392705,
          37.791455
        ],
        [
          -122.392319,
          37.791167
        ],
        [
          -122.391868,
          37.791574
        ],
        [
          -122.392169,
          37.791811
        ],
        [
          -122.391375,
          37.792507
        ],
        [
          -122.391117,
          37.791642
        ],
        [
          -122.391171,
          37.791498
        ],
        [
          -122.388671,
          37.789421
        ],
        [
          -122.388403,
          37.7887
        ],
        [
          -122.389004,
          37.788208
        ],
        [
          -122.389401,
          37.78853
        ],
        [
          -122.389894,
          37.788157
        ],
        [
          -122.38866,
          37.78708
        ],
        [
          -122.389637,
          37.786364
        ],
        [
          -122.389519,
          37.786063
        ],
        [
          -122.390913,
          37.784774
        ],
        [
          -122.389706,
          37.783905
        ],
        [
          -122.390015,
          37.783672
        ],
        [
          -122.389647,
          37.783375
        ],
        [
          -122.390763,
          37.782493
        ],
        [
          -122.389487,
          37.781399
        ],
        [
          -122.390334,
          37.780789
        ],
        [
          -122.38954,
          37.78017
        ],
        [
          -122.389937,
          37.779856
        ],
        [
          -122.390929,
          37.780584
        ],
        [
          -122.391953,
          37.7798
        ],
        [
          -122.3918,
          37.779676
        ],
        [
          -122.394986,
          37.777133
        ],
        [
          -122.396587,
          37.778364
        ],
        [
          -122.403241,
          37.77314
        ],
        [
          -122.401664,
          37.771859
        ],
        [
          -122.401706,
          37.771823
        ],
        [
          -122.400827,
          37.771096
        ],
        [
          -122.399132,
          37.769739
        ],
        [
          -122.39905,
          37.769673
        ],
        [
          -122.397443,
          37.77046
        ],
        [
          -122.395066,
          37.771138
        ],
        [
          -122.393703,
          37.772724
        ],
        [
          -122.391471,
          37.77409
        ],
        [
          -122.391064,
          37.769951
        ],
        [
          -122.395098,
          37.769747
        ],
        [
          -122.395876,
          37.770201
        ],
        [
          -122.398431,
          37.769175
        ],
        [
          -122.397941,
          37.768781
        ],
        [
          -122.399926,
          37.767305
        ],
        [
          -122.399529,
          37.766881
        ],
        [
          -122.400276,
          37.766272
        ],
        [
          -122.396248,
          37.766523
        ],
        [
          -122.396112,
          37.765606
        ],
        [
          -122.395409,
          37.76566
        ],
        [
          -122.394787,
          37.762326
        ],
        [
          -122.408628,
          37.761504
        ],
        [
          -122.407736,
          37.752796
        ],
        [
          -122.406953,
          37.752843
        ],
        [
          -122.406814,
          37.751172
        ],
        [
          -122.406685,
          37.749942
        ],
        [
          -122.407575,
          37.749908
        ],
        [
          -122.407457,
          37.748635
        ],
        [
          -122.407929,
          37.748491
        ],
        [
          -122.409616,
          37.74845
        ],
        [
          -122.409596,
          37.748284
        ],
        [
          -122.409464,
          37.748288
        ],
        [
          -122.409431,
          37.747499
        ],
        [
          -122.410601,
          37.746828
        ],
        [
          -122.415086,
          37.746616
        ],
        [
          -122.416212,
          37.746981
        ],
        [
          -122.417725,
          37.746387
        ],
        [
          -122.417842,
          37.74593
        ],
        [
          -122.417607,
          37.745745
        ],
        [
          -122.417613,
          37.745746
        ],
        [
          -122.417607,
          37.745743
        ],
        [
          -122.420096,
          37.741976
        ],
        [
          -122.418465,
          37.741297
        ],
        [
          -122.416986,
          37.7409
        ],
        [
          -122.415311,
          37.740835
        ],
        [
          -122.41551,
          37.738912
        ],
        [
          -122.418599,
          37.739095
        ],
        [
          -122.422896,
          37.740809
        ],
        [
          -122.419168,
          37.746539
        ],
        [
          -122.419112,
          37.746618
        ],
        [
          -122.418928,
          37.746926
        ],
        [
          -122.418326,
          37.746998
        ],
        [
          -122.415139,
          37.748135
        ],
        [
          -122.411037,
          37.748245
        ],
        [
          -122.411116,
          37.749178
        ],
        [
          -122.42269,
          37.748664
        ],
        [
          -122.422596,
          37.747974
        ],
        [
          -122.429881,
          37.747609
        ],
        [
          -122.430031,
          37.749577
        ],
        [
          -122.434451,
          37.749306
        ],
        [
          -122.434816,
          37.754065
        ],
        [
          -122.42798,
          37.754455
        ],
        [
          -122.428468,
          37.759525
        ],
        [
          -122.430438,
          37.759417
        ],
        [
          -122.432477,
          37.759281
        ],
        [
          -122.43237,
          37.757627
        ],
        [
          -122.438228,
          37.757279
        ],
        [
          -122.438668,
          37.761554
        ],
        [
          -122.43767,
          37.761758
        ],
        [
          -122.436211,
          37.762114
        ],
        [
          -122.435202,
          37.762521
        ],
        [
          -122.431018,
          37.765727
        ],
        [
          -122.431017,
          37.765726
        ],
        [
          -122.428271,
          37.767797
        ],
        [
          -122.426598,
          37.769239
        ],
        [
          -122.424743,
          37.769284
        ],
        [
          -122.424862,
          37.770518
        ],
        [
          -122.425353,
          37.770502
        ],
        [
          -122.425675,
          37.771656
        ],
        [
          -122.42672,
          37.771525
        ],
        [
          -122.426576,
          37.770731
        ],
        [
          -122.427842,
          37.769646
        ],
        [
          -122.429366,
          37.769561
        ],
        [
          -122.429151,
          37.767559
        ],
        [
          -122.435224,
          37.762742
        ],
        [
          -122.436652,
          37.770256
        ],
        [
          -122.43679,
          37.770239
        ],
        [
          -122.439286,
          37.769924
        ],
        [
          -122.440298,
          37.770604
        ],
        [
          -122.443619,
          37.770158
        ],
        [
          -122.443431,
          37.76923
        ],
        [
          -122.444751,
          37.769044
        ],
        [
          -122.444311,
          37.766584
        ],
        [
          -122.443946,
          37.765702
        ],
        [
          -122.44504,
          37.765057
        ],
        [
          -122.447584,
          37.764753
        ],
        [
          -122.447583,
          37.764744
        ],
        [
          -122.45239,
          37.76417
        ],
        [
          -122.45239,
          37.764167
        ],
        [
          -122.455297,
          37.763887
        ],
        [
          -122.45667,
          37.763539
        ],
        [
          -122.456794,
          37.764939
        ],
        [
          -122.45769,
          37.764828
        ],
        [
          -122.457915,
          37.764442
        ],
        [
          -122.459664,
          37.764353
        ],
        [
          -122.459621,
          37.763878
        ],
        [
          -122.461102,
          37.763844
        ],
        [
          -122.461016,
          37.762165
        ],
        [
          -122.461863,
          37.761995
        ],
        [
          -122.46299,
          37.761902
        ],
        [
          -122.483511,
          37.760982
        ],
        [
          -122.483822,
          37.765271
        ],
        [
          -122.459567,
          37.766406
        ],
        [
          -122.458716,
          37.766438
        ],
        [
          -122.458006,
          37.766327
        ],
        [
          -122.458051,
          37.766593
        ],
        [
          -122.458365,
          37.767125
        ],
        [
          -122.458092,
          37.767221
        ],
        [
          -122.457757,
          37.766657
        ],
        [
          -122.457665,
          37.766273
        ],
        [
          -122.456874,
          37.766202
        ],
        [
          -122.452984,
          37.766703
        ],
        [
          -122.453505,
          37.769077
        ],
        [
          -122.448699,
          37.76973
        ],
        [
          -122.444387,
          37.770285
        ],
        [
          -122.444504,
          37.770867
        ],
        [
          -122.445398,
          37.770768
        ],
        [
          -122.445298,
          37.770273
        ],
        [
          -122.453666,
          37.769213
        ],
        [
          -122.454036,
          37.771065
        ],
        [
          -122.440963,
          37.772792
        ],
        [
          -122.44077,
          37.771868
        ],
        [
          -122.44032,
          37.771927
        ],
        [
          -122.440502,
          37.772817
        ],
        [
          -122.437412,
          37.773215
        ],
        [
          -122.437434,
          37.773318
        ],
        [
          -122.437323,
          37.773331
        ],
        [
          -122.437791,
          37.774047
        ],
        [
          -122.441001,
          37.773657
        ],
        [
          -122.440958,
          37.773466
        ],
        [
          -122.44572,
          37.772867
        ],
        [
          -122.445725,
          37.772894
        ],
        [
          -122.453012,
          37.77202
        ],
        [
          -122.453639,
          37.77496
        ],
        [
          -122.454686,
          37.774836
        ],
        [
          -122.45814,
          37.774853
        ],
        [
          -122.458722,
          37.781407
        ],
        [
          -122.458915,
          37.7814
        ],
        [
          -122.458913,
          37.781374
        ],
        [
          -122.472023,
          37.780814
        ],
        [
          -122.472023,
          37.780816
        ]
      ]],
    "type": "Polygon"
  };
kickZone = turf.feature(kickZone,{"name":"kick zone perimeter"})
kickZone = turf.featureCollection([kickZone])
draw.add(kickZone)
//draw.add(bikeZone)




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

