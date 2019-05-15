// show and hide logger
// manage edits and feature types
///// easy for edits
///// harder for new items or mergered items
///// 

import { n } as zones from '/modules/zones';



var iconProps;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Nvb3R0ZWNoIiwiYSI6IlBMTjNqVTgifQ.r8a_cZRmGF_GIOKIKaK1dA';
// ***********************************************


var logger = $('#log');
var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/scoottech/cjhu4q6fx0gb62rlend411mly', 
  style: 'mapbox://styles/mapbox/light-v9',
  // center: [-122.419416,37.774929], 
  center: [ -122.42271869842615,37.77645740426891],
  zoom: 13,
  bearing: 0
});


var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        combine_features: true,
        uncombine_features: true,
        trash: true,
    }
});
map.addControl(draw);

// map.on('draw.create', updateArea);
// map.on('draw.delete', updateArea);
// map.on('draw.update', updateArea);

var updateGeo = function(){
  
  var selectedFeatures = draw.getSelected()
  //console.log(selectedFeatures);
  if(selectedFeatures.features.length === 1){
    var feature = selectedFeatures.features[0]
    feature.properties = {
      'class':'exclusion-zone',
      'type':'scooter-exclusion',
      'region':'sf',
    };
    //delete feature.id;
    var output = JSON.stringify(feature,undefined,1);
    logger.find('pre').remove();
    logger.append('<pre>'+output+'</pre>')
    //console.log(output);
  }
}


map.on('draw.selectionchange', updateGeo);
map.on('draw.update', function(e,i){
	console.log(e,i);
});

var zone = {
  "type": "Feature",
  "properties": {
    "class": "devZone",
		'defaultOpacity': ["fill-opacity", 0.2]
            
  },
  "geometry": {
    "coordinates": [
      [
        [
          -122.89601,
          38.048924
        ],
        [
          -122.164139,
          38.111562
        ],
        [
          -122.045336,
          37.491668
        ],
        [
          -122.851178,
          37.492557
        ],
        [
          -122.89601,
          38.048924
        ]
      ],
      [
        [
          -122.445838,
          37.78931
        ],
        [
          -122.459311,
          37.787202
        ],
        [
          -122.459044,
          37.786253
        ],
        [
          -122.466648,
          37.784988
        ],
        [
          -122.472385,
          37.784566
        ],
        [
          -122.472244,
          37.782533
        ],
        [
          -122.484006,
          37.781934
        ],
        [
          -122.483772,
          37.776316
        ],
        [
          -122.47166,
          37.77687
        ],
        [
          -122.471473,
          37.775133
        ],
        [
          -122.460203,
          37.775687
        ],
        [
          -122.460156,
          37.774172
        ],
        [
          -122.454732,
          37.774726
        ],
        [
          -122.452955,
          37.76652
        ],
        [
          -122.457163,
          37.765929
        ],
        [
          -122.457584,
          37.766261
        ],
        [
          -122.458052,
          37.767186
        ],
        [
          -122.458426,
          37.767038
        ],
        [
          -122.458099,
          37.766261
        ],
        [
          -122.4588,
          37.766409
        ],
        [
          -122.481855,
          37.765189
        ],
        [
          -122.481252,
          37.759339
        ],
        [
          -122.476762,
          37.759746
        ],
        [
          -122.476996,
          37.761114
        ],
        [
          -122.461891,
          37.76189
        ],
        [
          -122.461003,
          37.762075
        ],
        [
          -122.461143,
          37.763813
        ],
        [
          -122.459553,
          37.763813
        ],
        [
          -122.4596,
          37.764256
        ],
        [
          -122.457776,
          37.764478
        ],
        [
          -122.457776,
          37.764811
        ],
        [
          -122.456794,
          37.764848
        ],
        [
          -122.456607,
          37.763554
        ],
        [
          -122.454877,
          37.764034
        ],
        [
          -122.444776,
          37.765217
        ],
        [
          -122.443981,
          37.765772
        ],
        [
          -122.444636,
          37.769025
        ],
        [
          -122.443233,
          37.769358
        ],
        [
          -122.443513,
          37.770245
        ],
        [
          -122.440474,
          37.770577
        ],
        [
          -122.439344,
          37.769839
        ],
        [
          -122.436725,
          37.770023
        ],
        [
          -122.435415,
          37.762439
        ],
        [
          -122.438362,
          37.7617
        ],
        [
          -122.438081,
          37.7573
        ],
        [
          -122.432376,
          37.75767
        ],
        [
          -122.432469,
          37.759112
        ],
        [
          -122.428401,
          37.759297
        ],
        [
          -122.42784,
          37.754417
        ],
        [
          -122.434761,
          37.754047
        ],
        [
          -122.434262,
          37.7489
        ],
        [
          -122.430053,
          37.749122
        ],
        [
          -122.429632,
          37.747643
        ],
        [
          -122.418222,
          37.748161
        ],
        [
          -122.422945,
          37.740617
        ],
        [
          -122.418456,
          37.738953
        ],
        [
          -122.415556,
          37.738842
        ],
        [
          -122.415322,
          37.740802
        ],
        [
          -122.417053,
          37.740839
        ],
        [
          -122.420045,
          37.741911
        ],
        [
          -122.417707,
          37.745757
        ],
        [
          -122.415042,
          37.746645
        ],
        [
          -122.410459,
          37.746756
        ],
        [
          -122.409337,
          37.747458
        ],
        [
          -122.409337,
          37.748272
        ],
        [
          -122.407419,
          37.748678
        ],
        [
          -122.407513,
          37.749825
        ],
        [
          -122.406765,
          37.749862
        ],
        [
          -122.406952,
          37.75282
        ],
        [
          -122.407606,
          37.752857
        ],
        [
          -122.408606,
          37.761689
        ],
        [
          -122.394701,
          37.762527
        ],
        [
          -122.393938,
          37.75513
        ],
        [
          -122.387794,
          37.755321
        ],
        [
          -122.389842,
          37.776716
        ],
        [
          -122.392504,
          37.779026
        ],
        [
          -122.389452,
          37.781501
        ],
        [
          -122.388127,
          37.781999
        ],
        [
          -122.387806,
          37.787648
        ],
        [
          -122.388528,
          37.790123
        ],
        [
          -122.394913,
          37.795644
        ],
        [
          -122.402019,
          37.80388
        ],
        [
          -122.40557,
          37.806584
        ],
        [
          -122.413922,
          37.805461
        ],
        [
          -122.422962,
          37.804441
        ],
        [
          -122.42406,
          37.805818
        ],
        [
          -122.425803,
          37.805716
        ],
        [
          -122.425416,
          37.804288
        ],
        [
          -122.431714,
          37.803441
        ],
        [
          -122.431905,
          37.80425
        ],
        [
          -122.434077,
          37.805071
        ],
        [
          -122.439508,
          37.804454
        ],
        [
          -122.441957,
          37.805855
        ],
        [
          -122.448404,
          37.805091
        ],
        [
          -122.447663,
          37.800787
        ],
        [
          -122.444536,
          37.798775
        ],
        [
          -122.44734,
          37.798367
        ],
        [
          -122.445838,
          37.78931
        ]
      ]
    ],
    "type": "Polygon"
  }}
// var neighborhoods = {
//  "id": "06b38d10ec21eb80da1b81bdb7dfe8a1",
//  "type": "Feature",
//  "properties": {
//   "class": "exclusion-zone",
//   "type": "scooter-exclusion",
//   "region": "sf",
//   'defaultOpacity': ["line-opacity", 0.5]

//  },
//  "geometry": {
//   "coordinates": [
//    [
//     [
//      [
//       -122.39045909394365,
//       37.77725149474448
//      ],
//      [
//       -122.39884616410194,
//       37.77040648973167
//      ],
//      [
//       -122.40492003522152,
//       37.76960628175959
//      ],
//      [
//       -122.4079151225583,
//       37.7690881821695
//      ],
//      [
//       -122.41779085734863,
//       37.76994922909371
//      ],
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ],
//      [
//       -122.40355192396343,
//       37.78745508408275
//      ],
//      [
//       -122.39247635921232,
//       37.779048415121075
//      ],
//      [
//       -122.392504,
//       37.779026
//      ],
//      [
//       -122.39045909394365,
//       37.77725149474448
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.41719905246488,
//       37.80509124408029
//      ],
//      [
//       -122.40338047682256,
//       37.7956472476814
//      ],
//      [
//       -122.40272752160755,
//       37.79291994724964
//      ],
//      [
//       -122.42245148256123,
//       37.79025513026973
//      ],
//      [
//       -122.42479016989381,
//       37.80125998341968
//      ],
//      [
//       -122.42570772230235,
//       37.80424876710224
//      ],
//      [
//       -122.425416,
//       37.804288
//      ],
//      [
//       -122.425803,
//       37.805716
//      ],
//      [
//       -122.42406,
//       37.805818
//      ],
//      [
//       -122.422962,
//       37.804441
//      ],
//      [
//       -122.41719905246488,
//       37.80509124408029
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.45881524430638,
//       37.7811232997155
//      ],
//      [
//       -122.4311710987541,
//       37.78451797008509
//      ],
//      [
//       -122.42922542179235,
//       37.77409622411774
//      ],
//      [
//       -122.43768508612014,
//       37.77314459860135
//      ],
//      [
//       -122.44083005644882,
//       37.77276582418838
//      ],
//      [
//       -122.4410072264431,
//       37.773606079563535
//      ],
//      [
//       -122.45414881448201,
//       37.77203291032041
//      ],
//      [
//       -122.454732,
//       37.774726
//      ],
//      [
//       -122.45837590167599,
//       37.77435381682734
//      ],
//      [
//       -122.45881524430638,
//       37.7811232997155
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.409337,
//       37.748235582869185
//      ],
//      [
//       -122.41824209911505,
//       37.74812889588738
//      ],
//      [
//       -122.418222,
//       37.748161
//      ],
//      [
//       -122.429632,
//       37.747643
//      ],
//      [
//       -122.430053,
//       37.749122
//      ],
//      [
//       -122.434262,
//       37.7489
//      ],
//      [
//       -122.434761,
//       37.754047
//      ],
//      [
//       -122.42784,
//       37.754417
//      ],
//      [
//       -122.42816017952303,
//       37.757202162339446
//      ],
//      [
//       -122.4082380509521,
//       37.7584392740088
//      ],
//      [
//       -122.40823805095208,
//       37.75843927400876
//      ],
//      [
//       -122.407606,
//       37.752857
//      ],
//      [
//       -122.406952,
//       37.75282
//      ],
//      [
//       -122.406765,
//       37.749862
//      ],
//      [
//       -122.407513,
//       37.749825
//      ],
//      [
//       -122.407419,
//       37.748678
//      ],
//      [
//       -122.409337,
//       37.748272
//      ],
//      [
//       -122.409337,
//       37.748235582869185
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.44589590176656,
//       37.78930094062763
//      ],
//      [
//       -122.44541946328545,
//       37.787407374523085
//      ],
//      [
//       -122.43221807399567,
//       37.789107100271536
//      ],
//      [
//       -122.4311710987541,
//       37.78451797008509
//      ],
//      [
//       -122.45881524430638,
//       37.7811232997155
//      ],
//      [
//       -122.45925458694929,
//       37.786217966795
//      ],
//      [
//       -122.459044,
//       37.786253
//      ],
//      [
//       -122.459311,
//       37.787202
//      ],
//      [
//       -122.44589590176656,
//       37.78930094062763
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.4473073836856,
//       37.79817032492706
//      ],
//      [
//       -122.42479016989381,
//       37.80125998341968
//      ],
//      [
//       -122.42245148256123,
//       37.79025513026973
//      ],
//      [
//       -122.43221807399567,
//       37.789107100271536
//      ],
//      [
//       -122.44541946328545,
//       37.787407374523085
//      ],
//      [
//       -122.44589590176656,
//       37.78930094062763
//      ],
//      [
//       -122.445838,
//       37.78931
//      ],
//      [
//       -122.4473073836856,
//       37.79817032492706
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.42570772230235,
//       37.80424876710224
//      ],
//      [
//       -122.42479016989381,
//       37.80125998341968
//      ],
//      [
//       -122.4473073836856,
//       37.79817032492706
//      ],
//      [
//       -122.44734,
//       37.798367
//      ],
//      [
//       -122.444536,
//       37.798775
//      ],
//      [
//       -122.447663,
//       37.800787
//      ],
//      [
//       -122.448404,
//       37.805091
//      ],
//      [
//       -122.441957,
//       37.805855
//      ],
//      [
//       -122.439508,
//       37.804454
//      ],
//      [
//       -122.434077,
//       37.805071
//      ],
//      [
//       -122.431905,
//       37.80425
//      ],
//      [
//       -122.431714,
//       37.803441
//      ],
//      [
//       -122.42570772230235,
//       37.80424876710224
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.3956543836884,
//       37.79650327892733
//      ],
//      [
//       -122.40338047682256,
//       37.7956472476814
//      ],
//      [
//       -122.41719905246488,
//       37.80509124408029
//      ],
//      [
//       -122.413922,
//       37.805461
//      ],
//      [
//       -122.40557,
//       37.806584
//      ],
//      [
//       -122.402019,
//       37.80388
//      ],
//      [
//       -122.3956543836884,
//       37.79650327892733
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.394159375722,
//       37.79499235401114
//      ],
//      [
//       -122.40195069970116,
//       37.78883990065427
//      ],
//      [
//       -122.40272752160755,
//       37.79291994724964
//      ],
//      [
//       -122.40338047682256,
//       37.7956472476814
//      ],
//      [
//       -122.3956543836884,
//       37.79650327892733
//      ],
//      [
//       -122.394913,
//       37.795644
//      ],
//      [
//       -122.394159375722,
//       37.79499235401114
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.42245148256123,
//       37.79025513026973
//      ],
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ],
//      [
//       -122.40355192396343,
//       37.78745508408275
//      ],
//      [
//       -122.40195069970116,
//       37.78883990065427
//      ],
//      [
//       -122.40272752160755,
//       37.79291994724964
//      ],
//      [
//       -122.42245148256123,
//       37.79025513026973
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.40728688002807,
//       37.76176849820471
//      ],
//      [
//       -122.4079151225583,
//       37.7690881821695
//      ],
//      [
//       -122.40492003522152,
//       37.76960628175959
//      ],
//      [
//       -122.39884616410194,
//       37.77040648973167
//      ],
//      [
//       -122.39045909394365,
//       37.77725149474448
//      ],
//      [
//       -122.389842,
//       37.776716
//      ],
//      [
//       -122.387794,
//       37.755321
//      ],
//      [
//       -122.393938,
//       37.75513
//      ],
//      [
//       -122.394701,
//       37.762527
//      ],
//      [
//       -122.40728688002807,
//       37.76176849820471
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ],
//      [
//       -122.43542156329109,
//       37.76247699694626
//      ],
//      [
//       -122.436725,
//       37.770023
//      ],
//      [
//       -122.43723906634085,
//       37.76998688384624
//      ],
//      [
//       -122.43768508612014,
//       37.77314459860135
//      ],
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.45414881448198,
//       37.772032910320284
//      ],
//      [
//       -122.45414881448201,
//       37.77203291032041
//      ],
//      [
//       -122.4410072264431,
//       37.773606079563535
//      ],
//      [
//       -122.44083005644882,
//       37.77276582418838
//      ],
//      [
//       -122.43768508612014,
//       37.77314459860135
//      ],
//      [
//       -122.43723906634085,
//       37.76998688384624
//      ],
//      [
//       -122.43723906634085,
//       37.76998688384624
//      ],
//      [
//       -122.439344,
//       37.769839
//      ],
//      [
//       -122.440474,
//       37.770577
//      ],
//      [
//       -122.443513,
//       37.770245
//      ],
//      [
//       -122.443233,
//       37.769358
//      ],
//      [
//       -122.444636,
//       37.769025
//      ],
//      [
//       -122.443981,
//       37.765772
//      ],
//      [
//       -122.44473443917535,
//       37.7652460141606
//      ],
//      [
//       -122.44487432040796,
//       37.76520548499727
//      ],
//      [
//       -122.45274253718891,
//       37.76428398213103
//      ],
//      [
//       -122.45314352504744,
//       37.76649352226639
//      ],
//      [
//       -122.452955,
//       37.76652
//      ],
//      [
//       -122.45414881448198,
//       37.772032910320284
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.47052859152372,
//       37.7614462548148
//      ],
//      [
//       -122.47078524752493,
//       37.76577477740272
//      ],
//      [
//       -122.4588,
//       37.766409
//      ],
//      [
//       -122.458099,
//       37.766261
//      ],
//      [
//       -122.4582845168932,
//       37.76670181537008
//      ],
//      [
//       -122.45779703588963,
//       37.76668206452544
//      ],
//      [
//       -122.457584,
//       37.766261
//      ],
//      [
//       -122.457163,
//       37.765929
//      ],
//      [
//       -122.45314352504745,
//       37.76649352226639
//      ],
//      [
//       -122.45314352504744,
//       37.76649352226639
//      ],
//      [
//       -122.45274253718891,
//       37.76428398213103
//      ],
//      [
//       -122.45274253718893,
//       37.764283982131026
//      ],
//      [
//       -122.454877,
//       37.764034
//      ],
//      [
//       -122.456607,
//       37.763554
//      ],
//      [
//       -122.456794,
//       37.764848
//      ],
//      [
//       -122.457776,
//       37.764811
//      ],
//      [
//       -122.457776,
//       37.764478
//      ],
//      [
//       -122.4596,
//       37.764256
//      ],
//      [
//       -122.459553,
//       37.763813
//      ],
//      [
//       -122.461143,
//       37.763813
//      ],
//      [
//       -122.461003,
//       37.762075
//      ],
//      [
//       -122.461891,
//       37.76189
//      ],
//      [
//       -122.47052859152372,
//       37.7614462548148
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.47078524752493,
//       37.76577477740272
//      ],
//      [
//       -122.47052859152372,
//       37.7614462548148
//      ],
//      [
//       -122.476996,
//       37.761114
//      ],
//      [
//       -122.476762,
//       37.759746
//      ],
//      [
//       -122.481252,
//       37.759339
//      ],
//      [
//       -122.481855,
//       37.765189
//      ],
//      [
//       -122.47078524752493,
//       37.76577477740272
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.39247635921232,
//       37.779048415121075
//      ],
//      [
//       -122.39248178906564,
//       37.77904760982433
//      ],
//      [
//       -122.40355192396343,
//       37.78745508408275
//      ],
//      [
//       -122.40195069970116,
//       37.78883990065427
//      ],
//      [
//       -122.394159375722,
//       37.79499235401114
//      ],
//      [
//       -122.388528,
//       37.790123
//      ],
//      [
//       -122.387806,
//       37.787648
//      ],
//      [
//       -122.388127,
//       37.781999
//      ],
//      [
//       -122.389452,
//       37.781501
//      ],
//      [
//       -122.39247635921232,
//       37.779048415121075
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.43542156329109,
//       37.76247699694626
//      ],
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ],
//      [
//       -122.41779085734863,
//       37.76994922909371
//      ],
//      [
//       -122.4079151225583,
//       37.7690881821695
//      ],
//      [
//       -122.40728688002807,
//       37.76176849820471
//      ],
//      [
//       -122.408606,
//       37.761689
//      ],
//      [
//       -122.4082380509521,
//       37.7584392740088
//      ],
//      [
//       -122.42816017952303,
//       37.757202162339446
//      ],
//      [
//       -122.428401,
//       37.759297
//      ],
//      [
//       -122.432469,
//       37.759112
//      ],
//      [
//       -122.432376,
//       37.75767
//      ],
//      [
//       -122.438081,
//       37.7573
//      ],
//      [
//       -122.438362,
//       37.7617
//      ],
//      [
//       -122.43558321382652,
//       37.762396818114084
//      ],
//      [
//       -122.43556485156714,
//       37.76236320669868
//      ],
//      [
//       -122.43549452032475,
//       37.762419059205975
//      ],
//      [
//       -122.435415,
//       37.762439
//      ],
//      [
//       -122.43542156329109,
//       37.76247699694626
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.45925458694929,
//       37.786217966795
//      ],
//      [
//       -122.45881524430638,
//       37.7811232997155
//      ],
//      [
//       -122.45837590167599,
//       37.77435381682734
//      ],
//      [
//       -122.460156,
//       37.774172
//      ],
//      [
//       -122.460203,
//       37.775687
//      ],
//      [
//       -122.471473,
//       37.775133
//      ],
//      [
//       -122.47166,
//       37.77687
//      ],
//      [
//       -122.483772,
//       37.776316
//      ],
//      [
//       -122.484006,
//       37.781934
//      ],
//      [
//       -122.472244,
//       37.782533
//      ],
//      [
//       -122.472385,
//       37.784566
//      ],
//      [
//       -122.466648,
//       37.784988
//      ],
//      [
//       -122.45925458694929,
//       37.786217966795
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.43221807399567,
//       37.789107100271536
//      ],
//      [
//       -122.4311710987541,
//       37.78451797008509
//      ],
//      [
//       -122.42922542179235,
//       37.77409622411774
//      ],
//      [
//       -122.41928870068016,
//       37.77528866920126
//      ],
//      [
//       -122.42245148256123,
//       37.79025513026973
//      ],
//      [
//       -122.43221807399567,
//       37.789107100271536
//      ]
//     ]
//    ],
//    [
//     [
//      [
//       -122.41824209911505,
//       37.74812889588738
//      ],
//      [
//       -122.409337,
//       37.748235582869185
//      ],
//      [
//       -122.409337,
//       37.747458
//      ],
//      [
//       -122.410459,
//       37.746756
//      ],
//      [
//       -122.415042,
//       37.746645
//      ],
//      [
//       -122.417707,
//       37.745757
//      ],
//      [
//       -122.420045,
//       37.741911
//      ],
//      [
//       -122.417053,
//       37.740839
//      ],
//      [
//       -122.415322,
//       37.740802
//      ],
//      [
//       -122.415556,
//       37.738842
//      ],
//      [
//       -122.418456,
//       37.738953
//      ],
//      [
//       -122.422945,
//       37.740617
//      ],
//      [
//       -122.41824209911505,
//       37.74812889588738
//      ]
//     ]
//    ]
//   ],
//   "type": "MultiPolygon"
//  }}
var neighborhoods = zones.n
var scooterExclusionZones = {
 "type": "Feature",
 "properties": {
  "class": "exclusion-zone",
  "type": "scooter-exclusion",
  "region": "sf",
  'defaultOpacity': ["fill-opacity", 0.2]
 },
 "geometry": {
  "coordinates": [
   [
    [
     [
      -122.45026895369212,
      37.77903033705569
     ],
     [
      -122.45026895369212,
      37.774184376806645
     ],
     [
      -122.4405151181077,
      37.775359184218885
     ],
     [
      -122.44116537381124,
      37.779177179373534
     ],
     [
      -122.45026895369212,
      37.77903033705569
     ]
    ]
   ],
   [
    [
     [
      -122.44032933076116,
      37.79562167338712
     ],
     [
      -122.44032933076116,
      37.79400675120512
     ],
     [
      -122.43326941167356,
      37.794593999714834
     ],
     [
      -122.43326941167356,
      37.79635571724664
     ],
     [
      -122.44032933076116,
      37.79562167338712
     ]
    ]
   ],
   [
    [
     [
      -122.42668997452279,
      37.79273354977754
     ],
     [
      -122.42641129350608,
      37.78671387966503
     ],
     [
      -122.41591430853548,
      37.782896273806
     ],
     [
      -122.40783255905123,
      37.785465837908546
     ],
     [
      -122.41470669079854,
      37.794054875137746
     ],
     [
      -122.42668997452279,
      37.79273354977754
     ]
    ]
   ],
   [
    [
     [
      -122.42529656946823,
      37.77281429281571
     ],
     [
      -122.4245534200883,
      37.772520582600706
     ],
     [
      -122.4209305668712,
      37.77208001509554
     ],
     [
      -122.41526405286086,
      37.77274086536886
     ],
     [
      -122.41842243772095,
      37.77545763221772
     ],
     [
      -122.42083767319482,
      37.77516393250339
     ],
     [
      -122.42176660992132,
      37.779202201258386
     ],
     [
      -122.42631839985862,
      37.7785414087397
     ],
     [
      -122.42529656946823,
      37.77281429281571
     ]
    ]
   ]
  ],
  "type": "MultiPolygon"
 }}



var addStartingFeatures = function(){
  //draw.add(neighborhoods);
  
  var n = turf.featureCollection([neighborhoods]);
  var z = turf.featureCollection([zone]);
  var se = turf.featureCollection([scooterExclusionZones]);
  map.on('load', function() {
  	// map.setPaintProperty('parking-zones Stroke', 'line-opacity', 0);
  	// map.setPaintProperty('sf-devzones', 'fill-opacity', 0);
		map.addLayer({
            "id": "neighborhoods-layer",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": n
            },
            "properties":{
            		'defaultOpacity': ['line-opacity', 0.35]
            },
            "paint":{
            	'line-opacity': 0.35,
            }
        });
		map.addLayer({
            "id": "zone-perimeter-layer",
            "type": "fill",
            "source": {
                "type": "geojson",
                "data": z
            },
            "properties":{
            		'defaultOpacity': ['fill-opacity',0.2]
            },
            "paint":{
            	'fill-opacity': 0.2,
            }
        });
		map.addLayer({
            "id": "scooter-exclusion-layer",
            "type": "fill",
            "source": {
                "type": "geojson",
                "data": se
            },
            "properties":{
            		'defaultOpacity': ['fill-opacity', 0.2]
            },
            "paint":{
            	'fill-opacity': 0.2,
            	'fill-color': 'red'
            }
        });
  });
  // draw.add(big)
  // draw.add(small)
  

}
addStartingFeatures();

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
		draw.delete(poly1.id)
		draw.delete(poly2.id)
		draw.add(c);
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
    //var newPoly = turf.polygon([newPolyCoords]);


    // map.addLayer({
    //         "id": "points",
    //         "type": "fill",
    //         "source": {
    //             "type": "geojson",
    //             "data": dataz
    //         }
    //     });
    draw.delete(selectedPolyID)
    draw.add(newPoly);





  } // end of if


  
};

$('#tools').on('click','#point',snapToNearestPoint);
$('#tools').on('click','#combine',combineSelectedFeatures);
$('#tools').on('click','#subtract',subtractFromPerimeter);
$('#tools').on('click','#hole',createIsland);



// Click to lock
// $('.controls').on('click','.ion-md-unlock',function() {
//     $( this ).removeClass('ion-md-unlock').addClass('ion-md-lock');
// });

// Click to unlock
// $('.controls').on('click','.ion-md-lock',function() {
//     $( this ).removeClass('ion-md-lock').addClass('ion-md-unlock');
// });

// Click to lock
// $('.controls').on('click','.ion-md-eye',function() {
//     $( this ).removeClass('ion-md-eye').addClass('ion-md-eye-off');
// });

// Click to unlock
// $('.controls').on('click','.ion-md-eye-off',function() {
//     $( this ).removeClass('ion-md-eye-off').addClass('ion-md-eye');
// });
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




// $( ".controls .ion-md-lock.unlocked" ).hover(
//   function() {
//     $( this ).removeClass('ion-md-lock').addClass('ion-md-unlock')
//   }, function() {
//     $( this ).removeClass('ion-md-unlock').addClass('ion-md-lock')
//   }
// )
// $( "td" ).hover(
//   function() {
//     $( this ).addClass( "hover" );
//   }, function() {
//     $( this ).removeClass( "hover" );
//   }
// )



  

