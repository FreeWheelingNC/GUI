/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'FreeWheelingNC',

    requires: [
        'Ext.MessageBox'
    ],

    views: [
        'Main'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
		var form;	

		var geoJson = {
			"type": "LineString",
			"coordinates" : [],
			"properties" : {
				"timeBegin" : 0,
				"timeEnd" : 0	
							}
		};
		var audio = Ext.create('Ext.Audio',
			{hidden: 'true',
			url: 'resources/audio/pBellExt.mp3'});
		var tripForm = Ext.create('Ext.form.Panel', 
			{
                    title: 'Trip Details',
                    id: 'tripForm',
                    iconCls: 'compose',
                    xtype: 'formpanel',
                    url: 'http://freewheelingdashboard.herokuapp.com/routes/create',
                    layout: 'vbox',
			
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Trip Details',
                            instructions: 'Please give us some details about your trip',
                            //height: 285,

                            items: [
						
                           {
								xtype: 'selectfield',
								id: 'purpose',
								name: 'purpose',
								label: 'Purpose',
								valueField: 'ridePurpose',
								displayField: 'ridePurpose',
                        store: {
                            data: [
                                { purpose: 'work', ridePurpose: 'Work Commute'},
                                { purpose: 'school', ridePurpose: 'School'},
                                { purpose: 'shopping', ridePurpose: 'Shopping'},
                                { purpose: 'dining', ridePurpose: 'Dining'}
									]
								}
							}
						]},
							{
								xtype:'fieldset',
								title: 'Problems?',
									items:[
                    
							{
									xtype: 'checkboxfield',
									name : 'debris',
									label: 'Debris in the lane',
									labelWrap:'true',
									//value: 'debris'
							},
							{
								xtype: 'checkboxfield',
								name : 'bikeRacks',
								labelWrap: 'true',
								label: 'No bike racks at destination',
								//value: 'bikeRackLack'
							},
							{
								xtype: 'checkboxfield',
								name : 'pavement',
								labelWrap: 'true',
								label: 'Bad pavement conditions',
								//value: 'poorPavement'
							},
							{
								xtype: 'checkboxfield',
								name : 'lighting',
								labelWrap: 'true',
								label: 'Not enough lighting',
								//value: 'lightingLack'
							},
							{
								xtype: 'checkboxfield',
								name : 'space',
								labelWrap: 'true',
								label: 'Traffic is too close',
								//value: 'space'
							},
							{
								xtype: 'checkboxfield',
								name : 'speed',
								labelWrap: 'true',
								label: 'Traffic is too fast',
								//value: 'speed'
							}
								             
                            ]//end fieldset
                        },
                        {
                            xtype: 'button',
                            text: 'Send',
                            ui: 'confirm',
                            scope: this,
                            //formBind: true,
                            handler: function(btn) {
								//console.log('Data send');
								var tripFormValues = tripForm.getValues();
								for (property in tripFormValues){
								if(tripFormValues.hasOwnProperty(property)){
									geoJson.properties[property]=tripFormValues[property];
									//console.log(property + ":" + tripFormValues[property]);
									}
								}
								//console.log(geoJson);
								geoJson=Ext.JSON.encode(geoJson);
								Ext.Ajax.request({
									url: 'http://freewheelingdashboard.herokuapp.com/routes/create',
									withCredentials: true,
									useDefaultXhrHeader: false,
									params: geoJson,
									callback: function(options, success, response) {
									//console.log(response.responseText);
									}
									});//end Request
							
/**from 		http://alvinalexander.com/javascript/sencha-touch-extjs-json-encode-post-examples						
{
  xtype: 'button',
  text: 'Create',
  scope: this,
  formBind: true,
  handler: function(btn) {
      form.submit({
          method:'POST', 
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          params: Ext.util.JSON.encode(form.getValues()),
          waitTitle:'Connecting', 
          waitMsg:'Creating...',
          success:function(data){             
          },
          failure:function(form, result){
          }
      });
  }
}**/
								//console.log(tripFormValues);
								//tripFormValues=Ext.JSON.encode(tripFormValues);
								//console.log(tripFormValues);
								//this.up('formpanel').submit();
                            }
                        }
                    ]
                });
	  var geo	= Ext.create('Ext.util.Geolocation', {
	    autoUpdate        : false,
		allowHighAccuracy :  true,
			listeners: {
				locationupdate: function(geo){
					var gts = geo.getTimestamp();
					if(!geoJson.properties.timeBegin) geoJson.properties.timeBegin=gts;
					geoJson.coordinates.push([geo.getLatitude(),geo.getLongitude()]);
					geoJson.properties.timeEnd = gts;
					
					//console.log('New latitude: ' + geo.getLatitude());
					//console.log('New longitude: ' + geo.getLongitude());
					
					//console.log('Taken at: ' + gts.toString());
					},//end locationupdate
					locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
						if(bTimeout){
							console.log('Timeout occurred.');
						} else {
							console.log('Error occurred.');
						}	
					}//end locationerror
			}//end listeners
		});
Ext.create("Ext.tab.Panel", {
            fullscreen: true,
            tabBarPosition: 'bottom',
			
            items: [
                {
                    title: 'Home',
                    iconCls: 'home',
                    cls: 'home',
                    html: [
                        '',
                        'Welcome to FreeWheeling<br />',
                        'Start your GPS,<br />',
                        'Ride,<br />', 'Stop your GPS and submit your trip!'
                    ].join("")
                },
                {
                    title: 'Start Trip',
                    iconCls: 'locate',
                    xtype: 'formpanel',
                    layout: 'vbox',

                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Start your Ride',
                            //height: 285,
                            instructions: ''
                            ,
                            items: [
                                {
                                    xtype: 'togglefield',
                                    labelWrap: 'true',
                                    label: 'Enable GPS',
                                    listeners: {
										change: function(field, newValue, oldValue) {
											
											if (newValue){
												//console.log("GPS Enabled");
												
												audio.setLoop(true);
												audio.play();										
												////geo.setAutoUpdate(true);
											} else {
												var confirmBox = Ext.Msg.confirm("Confirm", "End your Trip?", function(buttonId){
													if (buttonId === 'yes'){
														//console.log("GPS Disabled");
														audio.setLoop(false);
														audio.stop();
														//geo.setAutoUpdate(false);
														
														Ext.Viewport.down('tabpanel').setActiveItem(2);
													} else {Ext.ComponentQuery.query('togglefield')[0].toggle();}
													
													});
												
												
												//console.log(geo.getAutoUpdate());
											
											}//end if
											//console.log('Value of this toggle has changed:', (newValue) ? 'ON' : 'OFF');
										}
									}
                                    
                                },
									audio,
                            ]
                        }
							]			
						},
                    

/*    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }*/
    tripForm
 ,{
                    xtype: 'toolbar',

                    // Dock it to the top
                    docked: 'top',

                    html: null,

                    // Center all items horizontally and vertically
                    layout: {
                        pack: 'right',
                        align: 'right'
                    },

                    // Make the toolbar scrollable
                    
                    // Add some default configurations to all items added to this toolbar
                    defaults: {
                        ui: 'light'
                    },

                    // Add a bunch of buttons into the toolbar
                    items: [
                        { iconCls: 'settings' }
                           ]
                }
]
}

);//end tabPanel

}
});

