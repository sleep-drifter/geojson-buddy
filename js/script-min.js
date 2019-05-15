var iconProps;mapboxgl.accessToken="pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA";var satelliteStyle="mapbox://styles/mapbox/satellite-v9",satelliteStreetStyle="mapbox://styles/mapbox/satellite-streets-v9",streetStyle="mapbox://styles/mapbox/streets-v9",darkStyle="mapbox://styles/scoottech/cjvjtjxxu1kj41cqkzf5g6ppn",lightStyle="mapbox://styles/scoottech/cjvjsnesw1jrd1co7dcrtakw1",copyArea=$(".copier textarea"),logger=$("#log"),map=new mapboxgl.Map({container:"map",style:lightStyle,center:[-70.596168,-33.4225424],zoom:11,bearing:0}),geocoder=new MapboxGeocoder({accessToken:"pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA",trackProximity:!0,flyTo:{speed:5},placeholder:"Search for a place or address"});map.addControl(geocoder,"top-left");var draw=new MapboxDraw({displayControlsDefault:!1,controls:{},userProperties:!0,styles:[{id:"gl-draw-line",type:"line",filter:["all",["==","$type","LineString"],["!=","mode","static"]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#1f80ff","line-dasharray":[.2,2],"line-width":{stops:[[12,2],[16,4]]}}},{id:"gl-draw-polygon-fill",type:"fill",filter:["all",["==","$type","Polygon"],["!has","user_featureType"],["!=","active","true"]],paint:{"fill-color":"#000","fill-outline-color":"#41D98D","fill-opacity":.25}},{id:"gl-draw-polygon-fill-active",type:"fill",filter:["all",["==","$type","Polygon"],["==","active","true"]],paint:{"fill-color":"#fc0","fill-outline-color":"#41D98D","fill-opacity":.3}},{id:"gl-draw-polygon-stroke-active",type:"line",filter:["all",["==","$type","Polygon"],["!=","mode","static"]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#333","line-width":1}},{id:"gl-draw-polygon-and-line-vertex-halo-active",type:"circle",filter:["all",["==","meta","vertex"],["==","$type","Point"],["!=","active","true"]],paint:{"circle-radius":7,"circle-color":"#FFF"}},{id:"gl-draw-polygon-and-line-vertex-halo-active-2",type:"circle",filter:["all",["==","meta","vertex"],["==","$type","Point"],["==","active","true"]],paint:{"circle-radius":9,"circle-color":"#FFF"}},{id:"gl-draw-polygon-and-line-vertex-active",type:"circle",filter:["all",["==","meta","vertex"],["==","$type","Point"],["!=","mode","static"]],paint:{"circle-radius":5,"circle-color":"#333"}},{id:"gl-draw-polygon-and-line-midpoint",type:"circle",filter:["all",["!=","meta","vertex"],["==","$type","Point"],["!=","mode","static"]],paint:{"circle-radius":3,"circle-color":"#333"}},{id:"gl-draw-line-static",type:"line",filter:["all",["==","$type","LineString"],["==","mode","static"]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#41D98D","line-width":3}},{id:"gl-draw-polygon-stroke-static",type:"line",filter:["all",["==","$type","Polygon"],["==","mode","static"]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#1E9359","line-width":3}},{id:"highlight-active-points",type:"circle",filter:["all",["==","$type","Point"],["==","meta","feature"],["==","active","true"]],paint:{"circle-radius":7,"circle-color":"#ffffff"}},{id:"highlight-active-points-stroke",type:"circle",filter:["all",["==","$type","Point"],["==","meta","feature"],["==","active","true"]],paint:{"circle-radius":5,"circle-color":"#000000"}},{id:"points-are-blue-2",type:"circle",filter:["all",["==","$type","Point"],["==","meta","feature"],["==","active","false"]],paint:{"circle-radius":5,"circle-color":"#fff"}},{id:"points-are-blue",type:"circle",filter:["all",["==","$type","Point"],["==","meta","feature"],["==","active","false"]],paint:{"circle-radius":3,"circle-color":"#000000"}}]});map.addControl(draw);var selectSidebarLayer=function(e){if("none"!==e){$(".layers-container").find("article.layer-item").removeClass("active");for(var t=e.length-1;t>=0;t--){$(".layers-container").find("article[name='"+e[t]+"']").addClass("active")}}else $(".layers-container").find("article.layer-item").removeClass("active")},deleteBtn=$('.action-btn-list li[action="delete"]'),combineBtn=$('.action-btn-list li[action="combine"]'),holeBtn=$('.action-btn-list li[action="hole"]'),expandBtn=$('.action-btn-list li[action="expand"]'),snapBtn=$('.action-btn-list li[action="snap"]'),cutBtn=$('.action-btn-list li[action="cut"]'),dupBtn=$('.action-btn-list li[action="duplicate"]'),toggleControls=function(e){1===e.length?(deleteBtn.addClass("disabled"),combineBtn.addClass("disabled"),holeBtn.addClass("disabled"),expandBtn.addClass("disabled"),cutBtn.addClass("disabled"),dupBtn.addClass("disabled")):2===e.length?(deleteBtn.removeClass("disabled"),combineBtn.addClass("disabled"),holeBtn.addClass("disabled"),expandBtn.removeClass("disabled"),cutBtn.addClass("disabled"),dupBtn.removeClass("disabled")):(deleteBtn.removeClass("disabled"),combineBtn.removeClass("disabled"),holeBtn.removeClass("disabled"),expandBtn.addClass("disabled"),cutBtn.removeClass("disabled"),dupBtn.addClass("disabled"))},updateFeatureTypeIndicator=function(e){if("na"!==e){var t=draw.getSelected().features[0].properties.featureType;console.log(t),$(".current-feature-item select").val(t)}else $(".current-feature-item select").val("na")};$(".current-feature-item select").change(function(){var e=$(this).val(),t=draw.getSelected().features[0];console.log(t),t.properties.featureType=e;var a=turf.featureCollection([t]),r=draw.getSelected().features[0].id;console.log(e),draw.delete(r),draw.add(a)});var removeLayerFromList=function(e,t){var a;a=t?e:e.id;var r=$("#map-layers").find(".list-item[layerId="+a+"]");console.log(r),console.log("here"),r.remove()},updateLayerList=function(){for(var e=draw.getAll(),t=0;t<e.features.length;t++){var a=e.features[t],r=(a.geometry.type,a.id),o=(a.properties.name,$("#map-layers").find(".list-item[layerId="+r+"]"));console.log(o),o.length>0?console.log("exists"):console.log("does not exist")}},addLayerToList=function(e,t,a){console.log(e),void 0===t?(t=e.id,console.log("undefined")):(t=t[0],e=e.features[0],console.log("else")),console.log(e);var r,o=e.geometry.type;if(void 0!==a){console.log(a);var n=$("#map-layers").find(".list-item[layerid="+a+"] p");console.log(n),r=n.text(),console.log(t,a,r)}else r="Untitled",console.log("false");void 0!==e.properties.layerName&&(r=e.properties.layerName);var l='<div class="list-item icon-w-actions" '+o+' type="'+o+'" layerId="'+t+'"> <i class="fa fa-map-marker-alt"></i> <i class="fa fa-minus"></i> <i class="fa fa-draw-polygon"></i> <p>'+r+'</p> <ul> <li><i class="fa fa-pencil-alt"></i></li> <li><i class="fa fa-search-plus"></i></li><li><i class="fa fa-trash"></i></li> </ul> </div>';$("#map-layers").append(l)},updateGeo=function(){console.log("CHECK GEO"),1===draw.getSelectedPoints().features.length?snapBtn.removeClass("disabled"):snapBtn.addClass("disabled");var e=draw.getSelected();if(0===e.features.length)return $("#map-layers").find(".list-item").removeClass("active"),selectSidebarLayer("none"),toggleControls(["new"]),void updateFeatureTypeIndicator("na");if(1===e.features.length?(toggleControls(["new","delete"]),updateFeatureTypeIndicator()):(toggleControls(["new","delete","all"]),updateFeatureTypeIndicator("na")),e.features.length>0){for(var t=[],a=e.features.length-1;a>=0;a--){var r=e.features[a].properties.name;t.push(r)}selectSidebarLayer(t);var o=JSON.stringify(e.features[0],void 0,1);copyArea.val(""),copyArea.val(o),checkActiveLayers(e.features)}},checkActiveLayers=function(e){$("#map-layers").find(".list-item").removeClass("active");for(var t=0;t<e.length;t++){var a=e[t].id;$("#map-layers").find(".list-item[layerId="+a+"]").addClass("active")}};map.on("draw.selectionchange",updateGeo),map.on("draw.update",function(e,t){console.log(e,t),console.log("draw update"),updateLayerList()}),map.on("draw.create",function(e,t){console.log(),addLayerToList(e.features[0])}),numUntitled=0;var addNewSidebarLayer=function(e,t){numUntitled+=1;var a=e.features[0];a.properties.name="Untitled Layer "+numUntitled,draw.delete(a.id);var r=draw.add(a);layersContainer.append('<article name="Untitled Layer '+numUntitled+'" layer-id="'+r+'" class="layer-item"><h2>Untitled Layer '+numUntitled+"</h2></article>")},bikeZone={coordinates:[[[-122.45421669942822,37.771176607233386],[-122.45299490469219,37.76650206575235],[-122.4444423415523,37.76746790432773],[-122.44331829039713,37.768974587309074],[-122.44019049588367,37.77051987131894],[-122.43813788072276,37.76912911716515],[-122.4376980346212,37.767004303376524],[-122.42909659969092,37.767854236233646],[-122.42841239464948,37.76453171594471],[-122.42631090769818,37.76460898555504],[-122.42456484192377,37.74334412878741],[-122.4244208923447,37.740782916839066],[-122.41859093415297,37.73890463842059],[-122.4153520684929,37.73896155664997],[-122.4153520684929,37.74135208270698],[-122.41779921143646,37.741807412247425],[-122.41923870728138,37.742945723865915],[-122.41743933747523,37.74596216495864],[-122.41463232056145,37.74658820336545],[-122.41002593385052,37.74675894019754],[-122.40757879089799,37.748580108521594],[-122.40318832856018,37.74960449600442],[-122.3975742947506,37.74966140600593],[-122.39642269806387,37.74738497186439],[-122.38843349610477,37.74266114759888],[-122.39161650365659,37.733705801466314],[-122.38341674697804,37.72957893861167],[-122.380320335362,37.73923815782551],[-122.38599708998782,37.742684334768185],[-122.38473558896146,37.74522352035916],[-122.38751784998493,37.77672987403679],[-122.38969680630254,37.77663922895211],[-122.39038489777278,37.77740970862921],[-122.387632531899,37.778860001486024],[-122.38751784998493,37.78878467961728],[-122.39181985363956,37.79374521322168],[-122.40231324854983,37.8045740066253],[-122.40764595744052,37.80797183627895],[-122.4141254854435,37.808968503325715],[-122.42077703631762,37.8081983527032],[-122.42049033153955,37.80498175442652],[-122.44784196745614,37.80181032319399],[-122.4468098302508,37.792974903851956],[-122.44508960157523,37.782733557331326],[-122.45632842891277,37.78150993871736],[-122.45421669942822,37.771176607233386]]],type:"Polygon"};bikeZone=turf.feature(bikeZone,{name:"bike zone perimeter"}),bikeZone=turf.featureCollection([bikeZone]);var kickZone={coordinates:[[[-122.44683260962229,37.793220805560935],[-122.42307847239525,37.79597924185937],[-122.42171622796846,37.7893857351886],[-122.39106572831827,37.79295168430383],[-122.38791553807141,37.7885110421377],[-122.38766011724603,37.778619561831036],[-122.39029946582092,37.77734097455952],[-122.38961834361282,37.77666802501575],[-122.38731955613137,37.77660072972279],[-122.3846802075565,37.7451671350651],[-122.38612759226191,37.742339476181755],[-122.38910750195146,37.73230714826367],[-122.40307050734447,37.741396899209164],[-122.4074126614608,37.739444380154026],[-122.41890659883626,37.738905745152124],[-122.42461099737933,37.74072362259918],[-122.42554754042341,37.75438993814208],[-122.43508325142145,37.75398604383601],[-122.43550895281477,37.76273659364348],[-122.43670091668423,37.77034199985657],[-122.4402768083138,37.7706112034483],[-122.44810971378101,37.76953438321773],[-122.45083420263455,37.78218603045741],[-122.44512980409147,37.782791640111114],[-122.44683260962229,37.793220805560935]]],type:"Polygon"};kickZone=turf.feature(kickZone,{name:"kick zone perimeter"}),kickZone=turf.featureCollection([kickZone]);var layersContainer=$(".layers-container"),addStartingFeatures=function(){map.on("load",function(){})};addStartingFeatures();var expandFeaturePerimeter=function(){var e,t=prompt("Enter number of METERS to expand this zone","500");null!=t&&(e=t);var a=draw.getSelected();a=a.features[0];var r=turf.buffer(a,e,{units:"meters"}),o=turf.featureCollection([r]),n=draw.add(o);addLayerToList(o,n)},combineSelectedFeatures=function(){var e=draw.getSelected();if(console.log(e),2===e.features.length){var t=e.features[0],a=e.features[1],r=turf.intersect(t,a);if(console.log(r),null===r)return;var o=turf.union(t,a),n=turf.featureCollection([o]);removeLayerFromList(t),removeLayerFromList(a),draw.delete(t.id),draw.delete(a.id);var l=draw.add(n);addLayerToList(n,l)}},createIsland=function(){var e=draw.getSelected();if(console.log(e),2===e.features.length){var t=e.features[0],a=e.features[1],r=turf.intersect(t,a);if(console.log(r),null!==r){var o,n;turf.area(t)<turf.area(a)?(console.log("switch"),o=a,n=t):(o=t,n=a);var l=turf.difference(o,n),i=turf.featureCollection([l]);draw.delete(t.id),draw.delete(a.id),draw.add(i)}}},subtractFromPerimeter=function(){var e=draw.getSelected();if(1===e.features.length){var t=e.features[0],a=turf.difference(t,zone),r=e.features[0].id;turf.featureCollection([a]);draw.delete(r),draw.add(a)}},snapToNearestPoint=function(){console.log("snapper!");var e=draw.getAll(),t=draw.getSelectedPoints(),a=draw.getSelected();if(1===t.features.length){var r=a.features[0].id,o=[];turf.featureEach(e,function(e){e.id!==r&&o.push(e)});o=turf.featureCollection(o);var n=turf.explode(o),l=turf.nearestPoint(t.features[0],n),i=[];turf.coordEach(a,function(e){e[1]===t.features[0].geometry.coordinates[1]?i.push(l.geometry.coordinates):i.push(e)});var s=turf.featureCollection([turf.polygon([i])]);draw.delete(r);var d=draw.add(s);addLayerToList(s,d,r),removeLayerFromList(r,!0),draw.changeMode("simple_select",{featureIds:d})}},getLatestData=function(e){},hidePresentationLayer=function(e,t){var a=JSON.parse(map.queryRenderedFeatures({layers:[e]})[0].properties.defaultOpacity);map.setPaintProperty(e,a[0],0),t.parent().find('i[type="lock"]').removeClass("ion-md-unlock").addClass("ion-md-lock")},showPresentationLayer=function(e,t){var a=JSON.parse(map.queryRenderedFeatures({layers:[e]})[0].properties.defaultOpacity);map.setPaintProperty(e,a[0],a[1])},unlockDrawLayer=function(e,t){getLatestData(e);var a=JSON.parse(map.queryRenderedFeatures({layers:[e]})[0].properties.defaultOpacity);map.setPaintProperty(e,a[0],0),draw.add(zone)},lockDrawLayer=function(e,t){JSON.parse(map.queryRenderedFeatures({layers:[e]})[0].properties.defaultOpacity)},toggleLayer=function(e,t,a,r,o){console.log(t,a),"viz"===t?"show"===a?showPresentationLayer(r,o):hidePresentationLayer(r,o):"lock"===t&&("unlock"===a?unlockDrawLayer(r,o):lockDrawLayer(r,o))},toggleScooterExclusions=function(e,t){},toggleNeighborhoods=function(e,t){},updateLayerProps=function(e,t,a,r){console.log(e,t,a),"perimeter"===e?togglePerimeter(t,a):"scooter-exclusion"===e?toggleScooterExclusions(t,a):"service-area"===e&&toggleNeighborhoods(t,a)};$(".controls").on("click","i.icon",function(){var e,t,a=$(this).hasClass("ion-md-eye"),r=$(this).hasClass("ion-md-eye-off"),o=$(this).hasClass("ion-md-unlock"),n=$(this).hasClass("ion-md-lock"),l=$(this).attr("layer"),i=$(this).attr("type");"perimeter"===l&&(t="zone-perimeter-layer"),"scooter-exclusion"===l&&(t="scooter-exclusion-layer"),"service-area"===l&&(t="neighborhoods-layer"),n?($(this).removeClass("ion-md-lock").addClass("ion-md-unlock"),e="unlock"):o?($(this).removeClass("ion-md-unlock").addClass("ion-md-lock"),e="lock"):a?($(this).removeClass("ion-md-eye").addClass("ion-md-eye-off"),e="hide"):r&&($(this).removeClass("ion-md-eye-off").addClass("ion-md-eye"),e="show"),toggleLayer(l,i,e,t,$(this))});var deleteLayers=function(){var e=draw.getSelected();if(selectedPolys=e.features,console.log(selectedPolys),0!==selectedPolys.length)for(var t=selectedPolys.length-1;t>=0;t--){var a=selectedPolys[t].id;removeLayerFromList(selectedPolys[t]);var r=selectedPolys[t].properties.name;$(".layers-container").find("article[name='"+r+"']").remove(),draw.delete(a)}else console.log("none!")},newPolygonLayer=function(){console.log("start drawing"),draw.changeMode("draw_polygon")},newLineLayer=function(){console.log("start drawing"),draw.changeMode("draw_line_string")},newPointLayer=function(){console.log("start drawing"),draw.changeMode("draw_point")},cutFeature=function(){var e=draw.getSelected(),t=e.features[0],a=e.features[1],r=turf.intersect(t,a);if(console.log(r),null!==r){var o,n;turf.area(t)<turf.area(a)?(console.log("switch"),o=a,n=t):(o=t,n=a);var l=turf.difference(o,n),i=turf.intersect(n,o),s=turf.featureCollection([l]),d=turf.featureCollection([i]);draw.delete(t.id),draw.delete(a.id),removeLayerFromList(t.id,!0),removeLayerFromList(a.id,!0);var c=draw.add(s),p=draw.add(d);addLayerToList(s,c),addLayerToList(d,p)}},duplicateFeature=function(){var e="new"+Math.random(),t=draw.getSelected().features[0];delete t.id,console.log(e.toString());var a=turf.featureCollection([t]),r=draw.add(a);console.log(r),addLayerToList(a,r)},createCenteroid=function(){var e=draw.getSelected().features[0],t=turf.centerOfMass(e),a=turf.featureCollection([t]),r=draw.add(a);console.log(r),addLayerToList(a,r)},combineGeometry=function(){console.log("combine"),draw.combineFeatures()},seperateGeometry=function(){console.log("uncombine"),draw.uncombineFeatures()},createRandomPoints=function(){var e,t=prompt("Enter number of random Points","asd");if(null!=t&&NaN!==(e=parseInt(t))){var a=draw.getSelected().features[0],r=turf.bbox(a);console.log(r);var o=turf.randomPoint(e,{bbox:r}),n=(o=turf.randomPoint(4*e,{bbox:r}),turf.pointsWithinPolygon(o,a));console.log(n),console.log(n.features.length);var l=n.features.slice(0,e);console.log(l);var i=turf.featureCollection(l);console.log(i);var s=draw.add(i);console.log(s),draw.changeMode("simple_select",{featureIds:s}),combineGeometry()}};$(".action-btn-list li, *[map-action]").on("click",function(){var e=$(this).attr("action");console.log(e),"delete"===e&&deleteLayers(),"new-polygon-layer"===e&&newPolygonLayer(),"new-line-layer"===e&&newLineLayer(),"centeroid"===e&&createCenteroid(),"rand-points"===e&&createRandomPoints(),"combine-geometry"===e&&combineGeometry(),"seperate-geometry"===e&&seperateGeometry(),"new-point-layer"===e&&newPointLayer(),"duplicate"===e&&duplicateFeature(),"combine"===e&&combineSelectedFeatures(),"hole"===e&&createIsland(),"expand"===e&&expandFeaturePerimeter(),"snap"===e&&snapToNearestPoint(),"cut"===e&&cutFeature()}),document.addEventListener("keydown",function(e){e=e||window.event,console.log(e.keyCode),8===e.keyCode&&deleteLayers(),49===e.keyCode&&newPointLayer(),50===e.keyCode&&newLineLayer(),51===e.keyCode&&newPolygonLayer(),52===e.keyCode&&snapToNearestPoint(),68===e.keyCode&&duplicateFeature()}),$(".layers-container").on("click","article",function(){var e=$(this).attr("layer-id");console.log(e),draw.changeMode("simple_select",{featureId:e});var t=draw.get(e);console.log(t);var a=turf.centerOfMass(t.geometry);a=a.geometry.coordinates,map.easeTo({center:a})}),$(".context-list").on("click",'li:not(".active")',function(){$(".context-list li").removeClass("active"),$(this).addClass("active");var e,t=$(this).attr("context");if(console.log(t),"bike"===t)e=bikeZone;else if("genze"===t)e=zones;else{if("kick"!==t)return;e=kickZone}draw.deleteAll(),$(".layers-container").find("article").remove(),addZones(e)});var panMap=function(e){var t;"sfo"===e?(t=[-122.42271869842615,37.77645740426891],map.setBearing(0)):"scl"===e?(t=[-70.596168,-33.4225424],map.setBearing(0)):(t=[2.1734,41.3851],map.setBearing(-44.7)),map.setZoom(13),map.setCenter(t)};$("#region-picker input").on("change",function(){var e=$(this).val();console.log(e),panMap(e)}),$("#map-tools input").on("change",function(){var e,t=$(this).val();e="dark"===t?darkStyle:"light"===t?lightStyle:"satellite-labels"===t?satelliteStreetStyle:"street"===t?streetStyle:satelliteStyle,map.setStyle(e)}),$(".paster textarea").on("change",function(){var e=$(".paster textarea").val();console.log(e)}),$("#submit-paster").click(function(){var e=$(".paster textarea").val(),t=JSON.parse(e);draw.add(t);var a=turf.bbox(t);console.log(a),map.fitBounds(a,{linear:!0,padding:50});e=$(".paster textarea").val("")});var dragged,processGeoDropFile=function(e,t,a){if(a){var r=(new DOMParser).parseFromString(e,"text/xml"),o=toGeoJSON.kml(r);console.log("KML"),draw.add(o);for(var n=0;n<o.features.length;n++)addLayerToList(o.features[n]);var l=turf.bbox(o);map.fitBounds(l,{linear:!0,padding:50})}else{o=t?e:JSON.parse(e),console.log(o),draw.add(o);for(n=0;n<o.features.length;n++)addLayerToList(o.features[n]);l=turf.bbox(o);map.fitBounds(l,{linear:!0,padding:50})}},copyShit=function(){console.log("asdasdasdasd");var e=$("#log").find("pre");console.log(e),e.select(),console.log(e)},cc=$("#copier");cc.click(copyShit);var theDropZone=$(".drop_zone");function previewFile(e){var t=new FileReader;t.readAsText(e);var a=e.name.split(".")[1];console.log(a),"geojson"!==a&&"kml"!==a||(t.onloadend=function(){"kml"===a?processGeoDropFile(t.result,!1,!0):processGeoDropFile(t.result)})}function dropHandler(e){if(theDropZone.removeClass("active"),console.log("File(s) dropped"),e.preventDefault(),console.log(e),e.dataTransfer.items)for(var t=0;t<e.dataTransfer.items.length;t++){if("file"===e.dataTransfer.items[t].kind)previewFile(e.dataTransfer.items[t].getAsFile())}else for(t=0;t<e.dataTransfer.files.length;t++)console.log(e.dataTransfer.files[t])}document.addEventListener("drag",function(e){},!1),document.addEventListener("dragstart",function(e){dragged=e.target,e.target.style.opacity=.5},!1),document.addEventListener("dragend",function(e){e.target.style.opacity=""},!1),document.addEventListener("dragover",function(e){e.preventDefault()},!1),document.addEventListener("dragenter",function(e){"dropzone"==e.target.className&&(e.target.style.background="purple")},!1),document.addEventListener("dragleave",function(e){theDropZone.removeClass("active"),"dropzone"==e.target.className&&(e.target.style.background="")},!1),document.addEventListener("drop",function(e){e.preventDefault(),"dropzone"==e.target.className&&(e.target.style.background="",dragged.parentNode.removeChild(dragged),e.target.appendChild(dragged))},!1);var dragOverHandler=function(e){theDropZone.addClass("active")},linkEl=$("#save-file");linkEl.click(function(){var e="Untitled",t=prompt("Please enter a filename","e.g. scoot-kick-layers");if(null!=t){e=t;var a=draw.getAll();a=JSON.stringify(a),console.log(a);var r=new Blob([a],{type:"text/plain;charset=utf-8"});saveAs(r,e+".geojson")}});var updateSearchResults=function(e){var t=e;$.getJSON("https://api.mapbox.com/geocoding/v5/mapbox.places/"+t+".json?bbox=-122.540817,37.725422,-122.344780,37.818506&types=address&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA&limit=5",function(e,t,a){a&&a.status&&generateSearchItems(e.features)})};$(".dataset-list li").click(function(){var e=$(this).attr("dataset");getDatasetFromMapbox("sfo-kick"===e?"cjj8smoub015kton00psuk61m":"sfo-moto"===e?"cjkbsjots02uzkimrr4r94yky":"scl-all"===e?"cjmnr3kid06ep32o6wp3pj6nj":"cjg890y8o024tvmp6x0cxck8r")});var getDatasetFromMapbox=function(e){var t="https://api.mapbox.com/datasets/v1/scoottech/"+e+"/features?access_token=pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA";$.getJSON(t,function(e,t,a){a&&a.status&&(console.log(e),processGeoDropFile(e,!0))})};$("#map-layers").on("click",".fa-search-plus",function(){var e=$(this).parent().parent().parent().attr("layerid"),t=$(this).parent().parent().parent().attr("type"),a=draw.get(e);if(console.log(t),"Point"===t){var r=a.geometry.coordinates;map.easeTo({center:r,zoom:14})}else{var o=turf.bbox(a);map.fitBounds(o,{linear:!0,padding:150})}}),$("#map-layers").on("click",".fa-trash",function(){var e=$(this).parent().parent().parent().attr("layerid");draw.delete(e),removeLayerFromList(e,!0)}),$("#map-layers").on("click",".fa-pencil-alt",function(){var e=$(this).parent().parent().parent().find("p").text(),t=prompt("Enter a name for this layer",e);null!=t&&(name=t),$(this).parent().parent().parent().find("p").text(name);var a=$(this).parent().parent().parent().attr("layerid");console.log(a);var r=draw.get(a);draw.delete(a),console.log(r),r.properties.layerName=name,draw.add(r)}),$("#map-layers").on("click",".list-item",function(){var e=$(this).attr("layerid");if("Point"===$(this).attr("type")){var t=draw.get(e).geometry.coordinates;map.easeTo({center:t,zoom:14})}else draw.changeMode("direct_select",{featureId:e})}),$("#hints").on("change",function(){var e=$(this).prop("checked");console.log(e),e?$(".right-sidebar .list-item div:nth-child(2)").slideDown(250):$(".right-sidebar .list-item div:nth-child(2)").slideUp(250)});