/**
 Require js initialization module definition file
 @class Require init.js
 **/
require.config({
    baseUrl: '/_studiolite-dev/',
    paths: {
        "jquery": '_common/_jquery/std/jq1.9.1/jquery-1.9.1',
        "jqueryui": '_common/_jquery/std/jq1.10.1/jquery-ui-1.10.1',
        "backbone": '_common/_js/backbone/backbone',
        "backbone.controller": '_common/_js/backbone-controller/backbone.controller',
        "underscore": '_common/_js/underscore/underscore',
        "bootstrap": '_common/_js/bootstrap/js/bootstrap',
        "bootbox": '_common/_js/bootbox/bootbox',
        "Cookie": '_common/_js/cookie/jquery.cookie',
        "RC4": '_common/_js/rc4/RC4',
        "XDate": '_common/_js/xdate/xdate',
        "Base64": '_common/_js/base64/jquery.base64',
        "Knob": '_common/_js/knob/jquery.knob',
        "TouchPunch": '_common/_js/touchpunch/TouchPunch',
        "X2JS": '_common/_js/x2js/xml2json',
        "Elements": 'Elements',
        "LayoutRouter": '_controllers/LayoutRouter',
        "ComBroker": '_controllers/ComBroker',
        "ScreenTemplateFactory": '_controllers/ScreenTemplateFactory',
        "AppAuth": '_controllers/AppAuth',
        "AjaxRPC": '_controllers/AjaxRPC',
        "AjaxJsonGetter": '_controllers/AjaxJsonGetter',
        "Timeline": '_controllers/Timeline',
        "Channel": '_controllers/Channel',
        "Block": '_controllers/_blocks/Block',
        "BlockRSS": '_controllers/_blocks/BlockRSS',
        "BlockQR": '_controllers/_blocks/BlockQR',
        "BlockVideo": '_controllers/_blocks/BlockVideo',
        "BlockImage": '_controllers/_blocks/BlockImage',
        "StackView": '_views/StackView',
        "NavigationView": '_views/NavigationView',
        "WaitView": '_views/WaitView',
        "ResourcesView": '_views/ResourcesView',
        "ResourceListView": '_views/ResourceListView',
        "AddBlockView": '_views/AddBlockView',
        "AppContentFaderView": '_views/AppContentFaderView',
        "AppEntryFaderView": '_views/AppEntryFaderView',
        "LoginView": '_views/LoginView',
        "StationsView": '_views/StationsView',
        "StationsListView": '_views/StationsListView',
        "SettingsView": '_views/SettingsView',
        "ProStudioView": '_views/ProStudioView',
        "HelpView": '_views/HelpView',
        "LogoutView": '_views/LogoutView',
        "PropertiesView": '_views/PropertiesView',
        "CampaignManagerView": '_views/CampaignManagerView',
        "CampaignSliderStackView": '_views/CampaignSliderStackView',
        "CampaignSelectorView": '_views/CampaignSelectorView',
        "CampaignNameSelectorView": '_views/CampaignNameSelectorView',
        "ResolutionSelectorView": '_views/ResolutionSelectorView',
        "OrientationSelectorView": '_views/OrientationSelectorView',
        "ScreenLayoutSelectorView": '_views/ScreenLayoutSelectorView',
        "CampaignView": '_views/CampaignView',
        "SequencerView": '_views/SequencerView',
        "ChannelListView": '_views/ChannelListView',
        "PopModalView": '_views/PopModalView',
        "StationsCollection": '_collections/StationsCollection',
        "StationModel": '_models/StationModel',
        "Lib": '_libs/Lib',
        "ScreenTemplate": "_libs/ScreenTemplate",
        "Jalapeno": '_libs/Jalapeno',
        "JalapenoHelper": '_libs/JalapenoHelper'
    },


    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.controller': {
            deps: ['underscore', 'jquery']
        },
        "LayoutRouter": {
            deps: ["Elements", "backbone.controller"]
        },
        "Lib": {
            deps: ['backbone', "jquery"]
        },
        'sdk': {
            exports: 'sdk'
        },
        'underscore': {
            exports: '_'
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootbox": {
            deps: ["jquery"],
            exports: 'bootbox'
        },
        "AppAuth": {
            deps: ["RC4","Cookie"]
        },
        "Elements": {
            exports: 'Elements'
        },
        "X2JS":{
            exports: 'X2JS'
        },
        "RC4": {
            exports: 'RC4'
        },
        "Knob": {
           exports: 'knob'
        },
        "TouchPunch": {
            exports: 'TouchPunch',
            deps: ["jqueryui"]
        },
        "ComBroker": {
            deps: ["backbone", "jquery"]
        },
        "Jalapeno": {
            deps: ['jquery', 'Base64'],
            exports: 'Jalapeno'
        },
        "JalapenoHelper": {
            exports: 'JalapenoHelper'
        },
        "Base64": {
            deps: ['jquery'],
            exports: 'base64'
        },
        "ScreenTemplate": {
            exports: 'ScreenTemplate'
        }
    }
});

require(['StudioLite'],function(StudioLite){
    new StudioLite();
});