/*
*    FreeWheelingNC Mobile App
*    Copyright (C) 2015  John Weis
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* 
* 
* 
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
				"timeEnd" : 0  ,
				"purpose" : null,
				"debris" : null,
				"bikeRacks" : null,
				"pavement" : null,
				"lighting" : null,
				"space" : null,
				"speed" : null
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

								var tripFormValues = tripForm.getValues();
								for (property in tripFormValues){
								if(tripFormValues.hasOwnProperty(property)){
									geoJson.properties[property]=tripFormValues[property];
									}
								}
								var newJson = {"type" : "Feature",
									"properties" : geoJson.properties,
									"geometry" : {"type":"LineString", "coordinates": geoJson.coordinates}};
								newJson=Ext.JSON.encode(newJson);
								console.log(newJson);
								Ext.Ajax.request({
									url: 'http://freewheelingdashboard.herokuapp.com/routes/create',
									//withCredentials: true,
									headers: {"Content-Type": "application/json"},
									params: geoJson,
									success: function(response) {
									Ext.Msg.alert('Sent', 'Trip sent. Thanks!', Ext.emptyFn);
									},

									failure: function(response) {
									console.log("Curses, something terrible happened");
									}
									//callback: function(options, success, response) {
									//Ext.Msg.alert('Sent', 'Trip sent. Thanks!', Ext.emptyFn);
									//}
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
          Ext.Msg.alert('Sent', 'Trip sent. Thanks!', Ext.emptyFn);     
          },
          failure:function(form, result){
          }
      });
  }
}**/
								
								//tripFormValues=Ext.JSON.encode(tripFormValues);
								
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
					geoJson.coordinates.push([geo.getLongitude(),geo.getLatitude()]);
					geoJson.properties.timeEnd = gts;
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
												audio.setLoop(true);
												audio.play();										
												geo.setAutoUpdate(true);
											} else {
												var confirmBox = Ext.Msg.confirm("Confirm", "End your Trip?", function(buttonId){
													if (buttonId === 'yes'){

														audio.setLoop(false);
														audio.stop();
														geo.setAutoUpdate(false);
														
														Ext.Viewport.down('tabpanel').setActiveItem(2);
													} else {Ext.ComponentQuery.query('togglefield')[0].toggle();}
													
													});//end TripEnd Confirmation						
											}//end if

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

