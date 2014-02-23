/**
 This base class for all Blocks / players which reside on the timeline_channel or inside scenes.
 The base class implements basic timeline and scene interfaces including the management the properties UI.
 @class Block
 @constructor
 @param {string} i_placement indicates if the block is set to exist inside a timeline or inside a scene
 @param {string} i_block_id block / player id, only required if block inserted onto channel_timeline
 @return none
 **/
define(['jquery', 'backbone', 'Knob'], function ($, Backbone, Knob) {

    /**
     block.PLACEMENT_SCENE indicates the insertion is inside a Scene
     @property Block.PLACEMENT_SCENE
     @static
     @final
     @type String
     */
    BB.CONSTS.PLACEMENT_SCENE = 'PLACEMENT_SCENE';

    /**
     block.PLACEMENT_CHANNEL indicates the insertion is on the timeline_channel
     @property Block.PLACEMENT_CHANNEL
     @static
     @final
     @type String
     */
    BB.CONSTS.PLACEMENT_CHANNEL = 'PLACEMENT_CHANNEL';

    /**
     event fires when block on timeline_channel is selected
     @event Block.BLOCK_ON_CHANNEL_SELECTED
     @param {this} caller
     @param {String} selected block_id
     **/
    BB.EVENTS.BLOCK_ON_CHANNEL_SELECTED = 'BLOCK_ON_CHANNEL_SELECTED';

    /**
     event fires when block length is changing (requesting a change), normally by a knob property widget
     @event Block.BLOCK_LENGTH_CHANGING
     @param {object} this
     @param {object} caller the firing knob element
     @param {number} value the knob's position value (hours / minutes / seconds)
     **/
    BB.EVENTS.BLOCK_LENGTH_CHANGING = 'BLOCK_LENGTH_CHANGING';

    var Block = BB.Controller.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function (options) {

            var self = this;
            this.m_placement = options.i_placement;
            this.m_block_id = options.i_block_id;
            this.m_selected = false;

            switch (this.m_placement) {

                case BB.CONSTS.PLACEMENT_CHANNEL:
                {
                    this.m_property = BB.comBroker.getService(BB.SERVICES.PROPERTIES_VIEW);

                    self._onTimelineChannelBlockSelected();
                    self._onTimelineChannelBlockLengthChanged();
                    var initiated = self.m_property.initPanel(Elements.BLOCK_PROPERTIES, true);
                    if (initiated)
                        self._propLengthKnobsInit();
                    break;
                }
                case BB.CONSTS.PLACEMENT_SCENE:
                {
                    break;
                }
            }
        },

        /**
         Notify this object that it has been selected so it can populate it's own the properties box etc
         The function triggers from the BLOCK_ON_CHANNEL_SELECTED event.
         @method _onTimelineChannelBlockSelected
         @return none
         **/
        _onTimelineChannelBlockSelected: function () {
            var self = this;

            BB.comBroker.listenWithNamespace(BB.EVENTS.BLOCK_ON_CHANNEL_SELECTED, self, function (e) {
                var blockID = e.edata;
                if (self.m_block_id != blockID) {
                    self._onTimelineChannelBlockDeselected();
                    return;
                }

                self.m_selected = true;
                // log('block selected ' + self.m_block_id);

                switch (self.m_placement) {
                    case BB.CONSTS.PLACEMENT_CHANNEL:
                    {
                        self.m_property.viewPanel(Elements.BLOCK_PROPERTIES);
                        self._updateTitle();
                        self._updateBlockLength();
                        break;
                    }
                    // Future support
                    case BB.CONSTS.PLACEMENT_SCENE:
                    {
                        break;
                    }
                }

                if (self._loadCommonProperties)
                    self._loadCommonProperties();

            });
        },

        /**
         Update the title of the block inside the assigned element.
         @method _updateTitle
         @return none
         **/
        _updateTitle: function () {
            var self = this;
            $(Elements.SELECTED_CHANNEL_RESOURCE_NAME).text(self.m_blockName);
        },

        /**
         Reset a timeline_channel block if it is no longer the chosen one
         @method _onTimelineChannelBlockDeselected
         @return none
         **/
        _onTimelineChannelBlockDeselected: function () {
            var self = this;
            self.m_selected = false;
        },

        /**
         Update the length properties of the block with respect to position on the timeline_channel
         @method _updateBlockLength
         @return none
         **/
        _updateBlockLength: function () {
            var self = this;
            var lengthData = jalapeno.getBlockTimelineChannelBlockLength(self.m_block_id);
            $(Elements.BLOCK_LENGTH_HOURS).val(lengthData.hours).trigger('change');
            $(Elements.BLOCK_LENGTH_MINUTES).val(lengthData.minutes).trigger('change');
            $(Elements.BLOCK_LENGTH_SECONDS).val(lengthData.seconds).trigger('change');
        },

        /**
         Take action when block length has changed which is triggered by the BLOCK_LENGTH_CHANGING event
         @method _onTimelineChannelBlockLengthChanged
         @return none
         **/
        _onTimelineChannelBlockLengthChanged: function () {
            var self = this;

            BB.comBroker.listenWithNamespace(BB.EVENTS.BLOCK_LENGTH_CHANGING, this, function (e) {

                if (self.m_selected) {
                    var hours = $(Elements.BLOCK_LENGTH_HOURS).val();
                    var minutes = $(Elements.BLOCK_LENGTH_MINUTES).val();
                    var seconds = $(Elements.BLOCK_LENGTH_SECONDS).val();

                    switch (e.caller) {
                        case 'blockLengthHours':
                        {
                            hours = e.edata;
                            break;
                        }
                        case 'blockLengthMinutes':
                        {
                            minutes = e.edata;
                            break;
                        }
                        case 'blockLengthSeconds':
                        {
                            seconds = e.edata;
                            break;
                        }
                    }
                    // log('upd: ' + self.m_block_id + ' ' + hours + ' ' + minutes + ' ' + seconds);
                    jalapeno.setBlockTimelineChannelBlockLength(self.m_block_id, hours, minutes, seconds);
                }
            });
        },


        /**
         Create the block length knobs so a user can set the length of the block with respect to timeline_channel
         @method _propLengthKnobsInit
         @return none
         **/
        _propLengthKnobsInit: function () {
            var self = this;

            var snippet = '<input id="blockLengthHours" data-displayPrevious="false" data-min="0" data-max="23" data-skin="tron" data-width="60" data-height="60"  data-thickness=".2" type="text" class="knob" data-fgColor="gray">' +
                '<input id="blockLengthMinutes" data-displayPrevious="false" data-min="0" data-max="59" data-skin="tron" data-width="60" data-height="60" data-thickness=".2" type="text" class="knob" data-fgColor="gray">' +
                '<input id="blockLengthSeconds" data-displayPrevious="false" data-min="0" data-max="59" data-skin="tron" data-width="60" data-height="60"  data-thickness=".2" type="text" class="knob" data-fgColor="gray">';

            $(Elements.TIMELIME_CHANNEL_BLOCK_LENGTH).append(snippet);

            $(Elements.CLASS_KNOB).knob({
                /*change: function (value) {
                 console.log("change : " + value);
                 var caller = this['i'][0].id;
                 },*/
                release: function (value) {
                    // console.log(this.$.attr('value'));
                    // console.log("release : " + value + ' ' + this['i'][0].id);
                    var caller = this['i'][0].id;
                    BB.comBroker.fire(BB.EVENTS.BLOCK_LENGTH_CHANGING, this, caller, value);
                },
                /*cancel: function () {
                 console.log("cancel : ", this);
                 },*/
                draw: function () {
                    if (this.$.data('skin') == 'tron') {

                        var a = this.angle(this.cv)  // Angle
                            , sa = this.startAngle          // Previous start angle
                            , sat = this.startAngle         // Start angle
                            , ea                            // Previous end angle
                            , eat = sat + a                 // End angle
                            , r = 1;

                        this.g.lineWidth = this.lineWidth;

                        this.o.cursor
                            && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                        if (this.o.displayPrevious) {
                            ea = this.startAngle + this.angle(this.v);
                            this.o.cursor
                                && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                            this.g.beginPath();
                            this.g.strokeStyle = this.pColor;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                            this.g.stroke();
                        }

                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                        this.g.stroke();

                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();

                        return false;
                    }
                }
            });
        },

        /**
         Get block data as a json formatted object literal and return to caller
         @method getBlockData
         @return {object} data
         The entire block data members which can be made public
         **/
        getBlockData: function () {
            var self = this;
            var data = {
                blockID: self.m_block_id,
                blockType: self.m_blockType,
                blockName: self.m_blockName,
                blockDescription: self.m_blockDescription,
                blockIcon: self.m_blockIcon
            }
            return data;
        },

        /**
         Delete block is a public method used as fall back method, if not overridden by inherited instance.
         It is also a semi abstract method, all implementations should go into _deleteBlock();
         @method deleteBlock
         @return none
         **/
        deleteBlock: function () {
            var self = this;
            self._deleteBlock();
        },

        /**
         Delete block is a private method that is always called regardless if instance has
         been inherited or not. Used for releasing memory for garbage collector.
         @method _deleteBlock
         @return none
         **/
        _deleteBlock: function () {
            var self = this;
            jalapeno.removeBlockFromTimelineChannel(self.m_block_id);
            BB.comBroker.stopListenWithNamespace(BB.EVENTS.BLOCK_ON_CHANNEL_SELECTED, self);
            BB.comBroker.stopListenWithNamespace(BB.EVENTS.BLOCK_LENGTH_CHANGING, self);
        }


    });

    return Block;
});