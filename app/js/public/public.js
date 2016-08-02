
jQuery.extend({
	

    createUploadIframe: function(id, uri)
	{
			//create frame
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
			if(window.ActiveXObject)
			{
                if(typeof uri== 'boolean'){
					iframeHtml += ' src="' + 'javascript:false' + '"';

                }
                else if(typeof uri== 'string'){
					iframeHtml += ' src="' + uri + '"';

                }	
			}
			iframeHtml += ' />';
			jQuery(iframeHtml).appendTo(document.body);

            return jQuery('#' + frameId).get(0);			
    },
    createUploadForm: function(id, fileElementId, data)
	{
		//create form	
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
		if(data)
		{
			for(var i in data)
			{
				jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		var oldElement = jQuery('#' + fileElementId);
		var newElement = jQuery(oldElement).clone();
		jQuery(oldElement).attr('id', fileId);
		jQuery(oldElement).before(newElement);
		jQuery(oldElement).appendTo(form);


		
		//set attributes
		jQuery(form).css('position', 'absolute');
		jQuery(form).css('top', '-1200px');
		jQuery(form).css('left', '-1200px');
		jQuery(form).appendTo('body');		
		return form;
    },

    ajaxFileUpload: function(s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()        
		var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;		
        // Watch for a new set of requests
        if ( s.global && ! jQuery.active++ )
		{
			jQuery.event.trigger( "ajaxStart" );
		}            
        var requestDone = false;
        // Create the request object
        var xml = {}   
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout)
		{			
			var io = document.getElementById(frameId);
            try 
			{				
				if(io.contentWindow)
				{
					 xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
					 
				}else if(io.contentDocument)
				{
					 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            }catch(e)
			{
				jQuery.handleError(s, xml, null, e);
			}
            if ( xml || isTimeout == "timeout") 
			{				
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" )
					{
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );    
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )
                            s.success( data, status );
    
                        // Fire the global callback
                        if( s.global )
                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e) 
				{
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if( s.global )
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )
                    jQuery.event.trigger( "ajaxStop" );

                // Process result
                if ( s.complete )
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function()
									{	try 
										{
											jQuery(io).remove();
											jQuery(form).remove();	
											
										} catch(e) 
										{
											jQuery.handleError(s, xml, null, e);
										}									

									}, 100)

                xml = null

            }
        }
        // Timeout checker
        if ( s.timeout > 0 ) 
		{
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try 
		{

			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
            if(form.encoding)
			{
				jQuery(form).attr('encoding', 'multipart/form-data');      			
            }
            else
			{	
				jQuery(form).attr('enctype', 'multipart/form-data');			
            }			
            jQuery(form).submit();

        } catch(e) 
		{			
            jQuery.handleError(s, xml, null, e);
        }
		
		jQuery('#' + frameId).load(uploadCallback	);
        return {abort: function () {}};	

    },

    uploadHttpData: function( r, type ) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if ( type == "script" )
            jQuery.globalEval( data );
        // Get the JavaScript object, if JSON is used.
        if ( type == "json" )
            eval( "data = " + data );
        // evaluate scripts within html
        if ( type == "html" )
            jQuery("<div>").html(data).evalScripts();

        return data;
    }
})


/**
 *               ~ CLNDR v1.4.1 ~
 * ==============================================
 *       https://github.com/kylestetz/CLNDR
 * ==============================================
 *  Created by kyle stetz (github.com/kylestetz)
 *       & available under the MIT license
 * http://opensource.org/licenses/mit-license.php
 * ==============================================
 *
 * This is the fully-commented development version of CLNDR.
 * For the production version, check out clndr.min.js
 * at https://github.com/kylestetz/CLNDR
 *
 * This work is based on the
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */
(function (factory) {
    // Multiple loading methods are supported depending on
    // what is available globally. While moment is loaded
    // here, the instance can be passed in at config time.
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    }
    else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'), require('moment'));
    }
    else {
        // Browser globals
        factory(jQuery, moment);
    }
}(function ($, moment) {
    // Namespace
    var pluginName = 'clndr';

    // This is the default calendar template. This can be overridden.
    var clndrTemplate =
        "<div class='clndr-controls'>" +
            "<div class='clndr-control-button'>" +
                "<span class='clndr-previous-button'></span>" +
            "</div>" +
            "<div class='month'><%= year %> <%= month %></div>" +
            "<div class='clndr-control-button rightalign'>" +
                "<span class='clndr-next-button'></span>" +
            "</div>" +
        "</div>" +
        "<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
            "<thead>" +
                "<tr class='header-days'>" +
                "<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
                    "<td class='header-day'><%= daysOfTheWeek[i] %><br><%= daysOfTheWeekEn[i] %></td>" +
                "<% } %>" +
                "</tr>" +
            "</thead>" +
            "<tbody>" +
            "<% for(var i = 0; i < numberOfRows; i++){ %>" +
                "<tr>" +
                "<% for(var j = 0; j < 7; j++){ %>" +
                "<% var d = j + i * 7; %>" +
                    "<td class='<%= days[d].classes %>'>" +
                        "<div class='day-contents'><%= days[d].day %></div>" +
                    "</td>" +
                "<% } %>" +
                "</tr>" +
            "<% } %>" +
            "</tbody>" +
        "</table>";

    // Defaults used throughout the application, see docs.
    var defaults = {
        events: [],
        ready: null,
        extras: null,
        render: null,
        moment: null,
        weekOffset: 0,
        constraints: null,
        forceSixRows: null,
        selectedDate: null,
        doneRendering: null,
        daysOfTheWeek: null,
        multiDayEvents: null,
        startWithMonth: null,
        dateParameter: 'date',
        template: clndrTemplate,
        showAdjacentMonths: true,
        trackSelectedDate: false,
        adjacentDaysChangeMonth: false,
        ignoreInactiveDaysInSelection: null,
        lengthOfTime: {
            days: null,
            interval: 1,
            months: null
        },
        clickEvents: {
            click: null,
            today: null,
            nextYear: null,
            nextMonth: null,
            nextInterval: null,
            previousYear: null,
            onYearChange: null,
            previousMonth: null,
            onMonthChange: null,
            previousInterval: null,
            onIntervalChange: null
        },
        targets: {
            day: 'day',
            empty: 'empty',
            nextButton: 'clndr-next-button',
            todayButton: 'clndr-today-button',
            previousButton: 'clndr-previous-button',
            nextYearButton: 'clndr-next-year-button',
            previousYearButton: 'clndr-previous-year-button'
        },
        classes: {
            past: "past",
            today: "today",
            event: "event",
            inactive: "inactive",
            selected: "selected",
            lastMonth: "last-month",
            nextMonth: "next-month",
            adjacentMonth: "adjacent-month"
        },
    };

    /**
     * The actual plugin constructor.
     * Parses the events and lengthOfTime options to build a calendar of day
     * objects containing event information from the events array.
     */
    function Clndr(element, options) {
        this.element = element;

        // Merge the default options with user-provided options
        this.options = $.extend(true, {}, defaults, options);

        // Check if moment was passed in as a dependency
        if (this.options.moment) {
            moment = this.options.moment;
        }

        // Boolean values used to log if any contraints are met
        this.constraints = {
            next: true,
            today: true,
            previous: true,
            nextYear: true,
            previousYear: true
        };

        // If there are events, we should run them through our
        // addMomentObjectToEvents function which will add a date object that
        // we can use to make life easier. This is only necessarywhen events
        // are provided on instantiation, since our setEvents function uses
        // addMomentObjectToEvents.
        if (this.options.events.length) {
            if (this.options.multiDayEvents) {
                this.options.events =
                    this.addMultiDayMomentObjectsToEvents(this.options.events);
            } else {
                this.options.events =
                    this.addMomentObjectToEvents(this.options.events);
            }
        }

        // This used to be a place where we'd figure out the current month,
        // but since we want to open up support for arbitrary lengths of time
        // we're going to store the current range in addition to the current
        // month.
        if (this.options.lengthOfTime.months || this.options.lengthOfTime.days) {
            // We want to establish intervalStart and intervalEnd, which will
            // keep track of our boundaries. Let's look at the possibilities...
            if (this.options.lengthOfTime.months) {
                // Gonna go right ahead and annihilate any chance for bugs here
                this.options.lengthOfTime.days = null;
                // The length is specified in months. Is there a start date?
                if (this.options.lengthOfTime.startDate) {
                    this.intervalStart =
                        moment(this.options.lengthOfTime.startDate)
                            .startOf('month');
                } else if (this.options.startWithMonth) {
                    this.intervalStart =
                        moment(this.options.startWithMonth)
                            .startOf('month');
                } else {
                    this.intervalStart = moment().startOf('month');
                }
                // Subtract a day so that we are at the end of the interval. We
                // always want intervalEnd to be inclusive.
                this.intervalEnd = moment(this.intervalStart)
                    .add(this.options.lengthOfTime.months, 'months')
                    .subtract(1, 'days');
                this.month = this.intervalStart.clone();
            }
            else if (this.options.lengthOfTime.days) {
                // The length is specified in days. Start date?
                if (this.options.lengthOfTime.startDate) {
                    this.intervalStart =
                        moment(this.options.lengthOfTime.startDate)
                            .startOf('day');
                } else {
                    this.intervalStart = moment().weekday(0).startOf('day');
                }
                this.intervalEnd = moment(this.intervalStart)
                    .add(this.options.lengthOfTime.days - 1, 'days')
                    .endOf('day');
                this.month = this.intervalStart.clone();
            }
        // No length of time specified so we're going to default into using the
        // current month as the time period.
        } else {
            this.month = moment().startOf('month');
            this.intervalStart = moment(this.month);
            this.intervalEnd = moment(this.month).endOf('month');
        }

        if (this.options.startWithMonth) {
            this.month = moment(this.options.startWithMonth).startOf('month');
            this.intervalStart = moment(this.month);
            this.intervalEnd = moment(this.month).endOf('month');
        }

        // If we've got constraints set, make sure the interval is within them.
        if (this.options.constraints) {
            // First check if the start date exists & is later than now.
            if (this.options.constraints.startDate) {
                var startMoment = moment(this.options.constraints.startDate);

                if (this.intervalStart.isBefore(startMoment, 'month')) {
                    // Try to preserve the date by moving only the month...
                    this.intervalStart
                        .set('month', startMoment.month())
                        .set('year', startMoment.year());
                    this.month
                        .set('month', startMoment.month())
                        .set('year', startMoment.year());
                }
            }
            // Make sure the intervalEnd is before the endDate
            if (this.options.constraints.endDate) {
                var endMoment = moment(this.options.constraints.endDate);

                if (this.intervalEnd.isAfter(endMoment, 'month')) {
                    this.intervalEnd
                        .set('month', endMoment.month())
                        .set('year', endMoment.year());
                    this.month
                        .set('month', endMoment.month())
                        .set('year', endMoment.year());
                }
            }
        }

        this._defaults = defaults;
        this._name = pluginName;

        // Some first-time initialization -> day of the week offset, template
        // compiling, making and storing some elements we'll need later, and
        // event handling for the controller.
        this.init();
    }

    /**
     * Calendar initialization.
     * Sets up the days of the week, the rendering function, binds all of the
     * events to the rendered calendar, and then stores the node locally.
     */
    Clndr.prototype.init = function () {
        // Create the days of the week using moment's current language setting
        this.daysOfTheWeek = this.options.daysOfTheWeek || [];

        if (!this.options.daysOfTheWeek) {
            this.daysOfTheWeek = [];
            var weekday = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            for (var i = 0; i < 7; i++) {
                /*this.daysOfTheWeek.push(
                    moment().weekday(i).format('dd').charAt(0));*/
                this.daysOfTheWeek.push(weekday[i]);
            }
        }

        // Shuffle the week if there's an offset
        if (this.options.weekOffset) {
            this.daysOfTheWeek = this.shiftWeekdayLabels(this.options.weekOffset);
        }

        // Quick and dirty test to make sure rendering is possible.
        if (!$.isFunction(this.options.render)) {
            this.options.render = null;

            if (typeof _ === 'undefined') {
                throw new Error(
                    "Underscore was not found. Please include underscore.js " +
                    "OR provide a custom render function.");
            } else {
                // We're just going ahead and using underscore here if no
                // render method has been supplied.
                this.compiledClndrTemplate = _.template(this.options.template);
            }
        }

        // Create the parent element that will hold the plugin and save it
        // for later
        $(this.element).html("<div class='clndr'></div>");
        this.calendarContainer = $('.clndr', this.element);

        // Attach event handlers for clicks on buttons/cells
        this.bindEvents();

        // Do a normal render of the calendar template
        this.render();

        // If a ready callback has been provided, call it.
        if (this.options.ready) {
            this.options.ready.apply(this, []);
        }
    };

    Clndr.prototype.shiftWeekdayLabels = function (offset) {
        var days = this.daysOfTheWeek;

        for (var i = 0; i < offset; i++) {
            days.push(days.shift());
        }

        return days;
    };

    /**
     * This is where the magic happens. Given a starting date and ending date,
     * an array of calendarDay objects is constructed that contains appropriate
     * events and classes depending on the circumstance.
     */
    Clndr.prototype.createDaysObject = function (startDate, endDate) {
        // This array will hold numbers for the entire grid (even the blank
        // spaces).
        var daysArray = [],
            date = startDate.clone(),
            lengthOfInterval = endDate.diff(startDate, 'days'),
            startOfLastMonth, endOfLastMonth, startOfNextMonth,
            endOfNextMonth, diff, dateIterator;

        // This is a helper object so that days can resolve their classes
        // correctly. Don't use it for anything please.
        this._currentIntervalStart = startDate.clone();

        // Filter the events list (if it exists) to events that are happening
        // last month, this month and next month (within the current grid view).
        this.eventsLastMonth = [];
        this.eventsNextMonth = [];
        this.eventsThisInterval = [];

        // Event parsing
        if (this.options.events.length) {
            // Here are the only two cases where we don't get an event in our
            // interval:
            //   startDate | endDate | e.start   | e.end
            //   e.start   | e.end   | startDate | endDate
            this.eventsThisInterval = $(this.options.events).filter(
                function () {
                    var afterEnd = this._clndrStartDateObject.isAfter(endDate),
                        beforeStart = this._clndrEndDateObject.isBefore(startDate);

                    if (beforeStart || afterEnd) {
                        return false;
                    } else {
                        return true;
                    }
                }).toArray();

            if (this.options.showAdjacentMonths) {
                startOfLastMonth = startDate.clone()
                    .subtract(1, 'months')
                    .startOf('month');
                endOfLastMonth = startOfLastMonth.clone().endOf('month');
                startOfNextMonth = endDate.clone()
                    .add(1, 'months')
                    .startOf('month');
                endOfNextMonth = startOfNextMonth.clone().endOf('month');

                this.eventsLastMonth = $(this.options.events).filter(
                    function () {
                        var beforeStart = this._clndrEndDateObject
                            .isBefore(startOfLastMonth);
                        var afterEnd = this._clndrStartDateObject
                            .isAfter(endOfLastMonth);

                        if (beforeStart || afterEnd) {
                            return false;
                        } else {
                            return true;
                        }
                    }).toArray();

                this.eventsNextMonth = $(this.options.events).filter(
                    function () {
                        var beforeStart = this._clndrEndDateObject
                            .isBefore(startOfNextMonth);
                        var afterEnd = this._clndrStartDateObject
                            .isAfter(endOfNextMonth);

                        if (beforeStart || afterEnd) {
                            return false;
                        } else {
                            return true;
                        }
                    }).toArray();
            }
        }

        // If diff is greater than 0, we'll have to fill in last days of the
        // previous month to account for the empty boxes in the grid. We also
        // need to take into account the weekOffset parameter. None of this
        // needs to happen if the interval is being specified in days rather
        // than months.
        if (!this.options.lengthOfTime.days) {
            diff = date.weekday() - this.options.weekOffset;

            if (diff < 0) {
                diff += 7;
            }

            if (this.options.showAdjacentMonths) {
                for (var i = 0; i < diff; i++) {
                    var day = moment([
                        startDate.year(),
                        startDate.month(),
                        i - diff + 1
                    ]);
                    daysArray.push(
                        this.createDayObject(
                            day,
                            this.eventsLastMonth
                        ));
                }
            } else {
                for (var i = 0; i < diff; i++) {
                    daysArray.push(
                        this.calendarDay({
                            classes: this.options.targets.empty +
                                " " + this.options.classes.lastMonth
                        }));
                }
            }
        }

        // Now we push all of the days in the interval
        dateIterator = startDate.clone();

        while (dateIterator.isBefore(endDate) || dateIterator.isSame(endDate, 'day')) {
            daysArray.push(
                this.createDayObject(
                    dateIterator.clone(),
                    this.eventsThisInterval
                ));
            dateIterator.add(1, 'days');
        }

        // ...and if there are any trailing blank boxes, fill those in with the
        // next month first days. Again, we can ignore this if the interval is
        // specified in days.
        if (!this.options.lengthOfTime.days) {
            while (daysArray.length % 7 !== 0) {
                if (this.options.showAdjacentMonths) {
                    daysArray.push(
                        this.createDayObject(
                            dateIterator.clone(),
                            this.eventsNextMonth
                        ));
                } else {
                    daysArray.push(
                        this.calendarDay({
                            classes: this.options.targets.empty + " " +
                                this.options.classes.nextMonth
                        }));
                }
                dateIterator.add(1, 'days');
            }
        }

        // If we want to force six rows of calendar, now's our Last Chance to
        // add another row. If the 42 seems explicit it's because we're
        // creating a 7-row grid and 6 rows of 7 is always 42!
        if (this.options.forceSixRows && daysArray.length !== 42) {
            while (daysArray.length < 42) {
                if (this.options.showAdjacentMonths) {
                    daysArray.push(
                        this.createDayObject(
                            dateIterator.clone(),
                            this.eventsNextMonth
                        ));
                    dateIterator.add(1, 'days');
                } else {
                    daysArray.push(
                        this.calendarDay({
                            classes: this.options.targets.empty + " " +
                                this.options.classes.nextMonth
                    }));
                }
            }
        }

        return daysArray;
    };

    Clndr.prototype.createDayObject = function (day, monthEvents) {
        var j = 0,
            self = this,
            now = moment(),
            eventsToday = [],
            extraClasses = "",
            properties = {
                isToday: false,
                isInactive: false,
                isAdjacentMonth: false
            },
            startMoment, endMoment, selectedMoment;

        // Validate moment date
        if (!day.isValid() && day.hasOwnProperty('_d') && day._d != undefined) {
            day = moment(day._d);
        }

        for (j; j < monthEvents.length; j++) {
            // Keep in mind that the events here already passed the month/year
            // test. Now all we have to compare is the moment.date(), which
            // returns the day of the month.
            var start = monthEvents[j]._clndrStartDateObject,
                end = monthEvents[j]._clndrEndDateObject;
            // If today is the same day as start or is after the start, and
            // if today is the same day as the end or before the end ...
            // woohoo semantics!
            if ( (day.isSame(start, 'day') || day.isAfter(start, 'day'))
                && (day.isSame(end, 'day') || day.isBefore(end, 'day')) )
            {
                eventsToday.push( monthEvents[j] );
            }
        }

        if (now.format("YYYY-MM-DD") == day.format("YYYY-MM-DD")) {
            extraClasses += (" " + this.options.classes.today);
            properties.isToday = true;
        }

        if (day.isBefore(now, 'day')) {
            extraClasses += (" " + this.options.classes.past);
        }

        if (eventsToday.length) {
            extraClasses += (" " + this.options.classes.event);
        }

        if (!this.options.lengthOfTime.days) {
            if (this._currentIntervalStart.month() > day.month()) {
                extraClasses += (" " + this.options.classes.adjacentMonth);
                properties.isAdjacentMonth = true;

                this._currentIntervalStart.year() === day.year()
                    ? extraClasses += (" " + this.options.classes.lastMonth)
                    : extraClasses += (" " + this.options.classes.nextMonth);
            }
            else if (this._currentIntervalStart.month() < day.month()) {
                extraClasses += (" " + this.options.classes.adjacentMonth);
                properties.isAdjacentMonth = true;

                this._currentIntervalStart.year() === day.year()
                    ? extraClasses += (" " + this.options.classes.nextMonth)
                    : extraClasses += (" " + this.options.classes.lastMonth);
            }
        }

        // If there are constraints, we need to add the inactive class to the
        // days outside of them
        if (this.options.constraints) {
            endMoment = moment(this.options.constraints.endDate);
            startMoment = moment(this.options.constraints.startDate);

            if (this.options.constraints.startDate && day.isBefore(startMoment)) {
                extraClasses += (" " + this.options.classes.inactive);
                properties.isInactive = true;
            }

            if (this.options.constraints.endDate && day.isAfter(endMoment)) {
                extraClasses += (" " + this.options.classes.inactive);
                properties.isInactive = true;
            }
        }

        // Validate moment date
        if (!day.isValid() && day.hasOwnProperty('_d') && day._d != undefined) {
            day = moment(day._d);
        }

        // Check whether the day is "selected"
        selectedMoment = moment(this.options.selectedDate);

        if (this.options.selectedDate && day.isSame(selectedMoment, 'day')) {
            extraClasses += (" " + this.options.classes.selected);
        }

        // We're moving away from using IDs in favor of classes, since when
        // using multiple calendars on a page we are technically violating the
        // uniqueness of IDs.
        extraClasses += " calendar-day-" + day.format("YYYY-MM-DD");
        // Day of week
        extraClasses += " calendar-dow-" + day.weekday();

        return this.calendarDay({
            date: day,
            day: day.date(),
            events: eventsToday,
            properties: properties,
            classes: this.options.targets.day + extraClasses
        });
    };

    Clndr.prototype.render = function () {
        // Get rid of the previous set of calendar parts. This should handle garbage
        // collection according to jQuery's docs:
        //   http://api.jquery.com/empty/
        //   To avoid memory leaks, jQuery removes other constructs such as
        //   data and event handlers from the child elements before removing
        //   the elements themselves.
        var data = {},
            end = null,
            start = null,
            oneYearFromEnd = this.intervalEnd.clone().add(1, 'years'),
            oneYearAgo = this.intervalStart.clone().subtract(1, 'years'),
            days, months, currentMonth, eventsThisInterval,
            numberOfRows;
        this.calendarContainer.empty();

        if (this.options.lengthOfTime.days) {
            days = this.createDaysObject(
                this.intervalStart.clone(),
                this.intervalEnd.clone());
            data = {
                days: days,
                months: [],
                year: null,
                month: null,
                eventsLastMonth: [],
                eventsNextMonth: [],
                eventsThisMonth: [],
                extras: this.options.extras,
                daysOfTheWeek: this.daysOfTheWeek,
                daysOfTheWeekEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                intervalEnd: this.intervalEnd.clone(),
                numberOfRows: Math.ceil(days.length / 7),
                intervalStart: this.intervalStart.clone(),
                eventsThisInterval: this.eventsThisInterval
            };
        }
        else if (this.options.lengthOfTime.months) {
            months = [];
            numberOfRows = 0;
            eventsThisInterval = [];

            for (i = 0; i < this.options.lengthOfTime.months; i++) {
                var currentIntervalStart = this.intervalStart
                    .clone()
                    .add(i, 'months');
                var currentIntervalEnd = currentIntervalStart
                    .clone()
                    .endOf('month');
                var days = this.createDaysObject(
                    currentIntervalStart,
                    currentIntervalEnd);
                // Save events processed for each month into a master array of
                // events for this interval
                eventsThisInterval.push(this.eventsThisInterval);
                months.push({
                    days: days,
                    month: currentIntervalStart
                });
            }

            // Get the total number of rows across all months
            for (i in months) {
                numberOfRows += Math.ceil(months[i].days.length / 7);
            }

            data = {
                days: [],
                year: null,
                month: null,
                months: months,
                eventsThisMonth: [],
                numberOfRows: numberOfRows,
                extras: this.options.extras,
                intervalEnd: this.intervalEnd,
                intervalStart: this.intervalStart,
                daysOfTheWeek: this.daysOfTheWeek,
                daysOfTheWeekEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                eventsLastMonth: this.eventsLastMonth,
                eventsNextMonth: this.eventsNextMonth,
                eventsThisInterval: eventsThisInterval,
            };
        }
        else {
            // Get an array of days and blank spaces
            days = this.createDaysObject(
                this.month.clone().startOf('month'),
                this.month.clone().endOf('month'));
            // This is to prevent a scope/naming issue between this.month and
            // data.month
            currentMonth = this.month;

            data = {
                days: days,
                months: [],
                intervalEnd: null,
                intervalStart: null,
                year: this.month.year(),
                eventsThisInterval: null,
                extras: this.options.extras,
                month: this.month.format('MMMM'),
                daysOfTheWeek: this.daysOfTheWeek,
                daysOfTheWeekEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                eventsLastMonth: this.eventsLastMonth,
                eventsNextMonth: this.eventsNextMonth,
                numberOfRows: Math.ceil(days.length / 7),
                eventsThisMonth: this.eventsThisInterval
            };
        }

        // Render the calendar with the data above & bind events to its
        // elements
        if ( !this.options.render) {
            this.calendarContainer.html(
                this.compiledClndrTemplate(data));
        } else {
            this.calendarContainer.html(
                this.options.render.apply(this, [data]));
        }

        // If there are constraints, we need to add the 'inactive' class to
        // the controls.
        if (this.options.constraints) {
            // In the interest of clarity we're just going to remove all
            // inactive classes and re-apply them each render.
            for (var target in this.options.targets) {
                if (target != this.options.targets.day) {
                    this.element.find('.' + this.options.targets[target])
                        .toggleClass(
                            this.options.classes.inactive,
                            false);
                }
            }

            // Just like the classes we'll set this internal state to true and
            // handle the disabling below.
            for (var i in this.constraints) {
                this.constraints[i] = true;
            }

            if (this.options.constraints.startDate) {
                start = moment(this.options.constraints.startDate);
            }

            if (this.options.constraints.endDate) {
                end = moment(this.options.constraints.endDate);
            }

            // Deal with the month controls first. Do we have room to go back?
            if (start
                && (start.isAfter(this.intervalStart)
                    || start.isSame(this.intervalStart, 'day')))
            {
                this.element.find('.' + this.options.targets.previousButton)
                    .toggleClass(this.options.classes.inactive, true);
                this.constraints.previous = !this.constraints.previous;
            }

            // Do we have room to go forward?
            if (end
                && (end.isBefore(this.intervalEnd)
                    || end.isSame(this.intervalEnd, 'day')))
            {
                this.element.find('.' + this.options.targets.nextButton)
                    .toggleClass(this.options.classes.inactive, true);
                this.constraints.next = !this.constraints.next;
            }

            // What's last year looking like?
            if (start && start.isAfter(oneYearAgo)) {
                this.element.find('.' + this.options.targets.previousYearButton)
                    .toggleClass(this.options.classes.inactive, true);
                this.constraints.previousYear = !this.constraints.previousYear;
            }

            // How about next year?
            if (end && end.isBefore(oneYearFromEnd)) {
                this.element.find('.' + this.options.targets.nextYearButton)
                    .toggleClass(this.options.classes.inactive, true);
                this.constraints.nextYear = !this.constraints.nextYear;
            }

            // Today? We could put this in init(), but we want to support the
            // user changing the constraints on a living instance.
            if ( (start && start.isAfter( moment(), 'month' ))
                || (end && end.isBefore( moment(), 'month' )) )
            {
                this.element.find('.' + this.options.targets.today)
                    .toggleClass(this.options.classes.inactive, true);
                this.constraints.today = !this.constraints.today;
            }
        }

        if (this.options.doneRendering) {
            this.options.doneRendering.apply(this, []);
        }
    };

    Clndr.prototype.bindEvents = function () {
        var self = this,
            $container = $(this.element),
            targets = this.options.targets,
            classes = self.options.classes,
            eventType = (this.options.useTouchEvents === true)
                ? 'touchstart'
                : 'click',
            eventName = eventType + '.clndr';

        // Make sure we don't already have events
        $container
            .off(eventName, '.' + targets.day)
            .off(eventName, '.' + targets.empty)
            .off(eventName, '.' + targets.nextButton)
            .off(eventName, '.' + targets.todayButton)
            .off(eventName, '.' + targets.previousButton)
            .off(eventName, '.' + targets.nextYearButton)
            .off(eventName, '.' + targets.previousYearButton);

        // Target the day elements and give them click events
        $container.on(eventName, '.' + targets.day, function (event) {
            var $currentTarget = $(event.currentTarget),
                target;

            if (self.options.clickEvents.click) {
                target = self.buildTargetObject(event.currentTarget, true);
                self.options.clickEvents.click.apply(self, [target]);
            }

            // If adjacentDaysChangeMonth is on, we need to change the
            // month here.
            if (self.options.adjacentDaysChangeMonth) {
                if ($currentTarget.is('.' + classes.lastMonth)) {
                    self.backActionWithContext(self);
                }
                else if ($currentTarget.is('.' + classes.nextMonth)) {
                    self.forwardActionWithContext(self);
                }
            }

            // if trackSelectedDate is on, we need to handle click on a new day
            if (self.options.trackSelectedDate) {
                if (self.options.ignoreInactiveDaysInSelection
                    && $currentTarget.hasClass(classes.inactive))
                {
                    return;
                }

                // Remember new selected date
                self.options.selectedDate =
                    self.getTargetDateString(event.currentTarget);
                // Handle "selected" class
                $currentTarget
                    .siblings().removeClass(classes.selected).end()
                    .addClass(classes.selected);
            }
        });

        // Target the empty calendar boxes as well
        $container.on(eventName, '.' + targets.empty, function (event) {
            var $eventTarget = $(event.currentTarget),
                target;

            if (self.options.clickEvents.click) {
                target = self.buildTargetObject(event.currentTarget, false);
                self.options.clickEvents.click.apply(self, [target]);
            }

            if (self.options.adjacentDaysChangeMonth) {
                if ($eventTarget.is('.' + classes.lastMonth)) {
                    self.backActionWithContext(self);
                }
                else if ($eventTarget.is('.' + classes.nextMonth)) {
                    self.forwardActionWithContext(self);
                }
            }
        });

        // Bind the previous, next and today buttons. We pass the current
        // context along with the event so that it can update this instance.
        data = {
            context: this
        };

        $container
            .on(eventName, '.' + targets.todayButton, data, this.todayAction)
            .on(eventName, '.' + targets.nextButton, data, this.forwardAction)
            .on(eventName, '.' + targets.previousButton, data, this.backAction)
            .on(eventName, '.' + targets.nextYearButton, data, this.nextYearAction)
            .on(eventName, '.' + targets.previousYearButton, data, this.previousYearAction);
    };

    /**
     * If the user provided a click callback we'd like to give them something
     * nice to work with. buildTargetObject takes the DOM element that was
     * clicked and returns an object with the DOM element, events, and the date
     * (if the latter two exist). Currently it is based on the id, however it'd
     * be nice to use a data- attribute in the future.
     */
    Clndr.prototype.buildTargetObject = function (currentTarget, targetWasDay) {
        // This is our default target object, assuming we hit an empty day
        // with no events.
        var target = {
            date: null,
            events: [],
            element: currentTarget
        };
        var dateString, filterFn;

        // Did we click on a day or just an empty box?
        if (targetWasDay) {
            dateString = this.getTargetDateString(currentTarget);
            target.date = (dateString)
                ? moment(dateString)
                : null;

            // Do we have events?
            if (this.options.events) {
                // Are any of the events happening today?
                if (this.options.multiDayEvents) {
                    filterFn = function () {
                        var isSameStart = target.date.isSame(
                            this._clndrStartDateObject,
                            'day');
                        var isAfterStart = target.date.isAfter(
                            this._clndrStartDateObject,
                            'day');
                        var isSameEnd = target.date.isSame(
                            this._clndrEndDateObject,
                            'day');
                        var isBeforeEnd = target.date.isBefore(
                            this._clndrEndDateObject,
                            'day');
                        return (isSameStart || isAfterStart)
                            && (isSameEnd || isBeforeEnd);
                    };
                }
                else {
                    filterFn = function () {
                        var startString = this._clndrStartDateObject
                            .format('YYYY-MM-DD');
                        return startString == dateString;
                    };
                }

                // Filter the dates down to the ones that match.
                target.events = $.makeArray(
                    $(this.options.events).filter(filterFn));
            }
        }

        return target;
    };

    /**
     * Get moment date object of the date associated with the given target.
     * This method is meant to be called on ".day" elements.
     */
    Clndr.prototype.getTargetDateString = function (target) {
        // Our identifier is in the list of classNames. Find it!
        var classNameIndex = target.className.indexOf('calendar-day-');

        if (classNameIndex !== -1) {
            // Our unique identifier is always 23 characters long.
            // If this feels a little wonky, that's probably because it is.
            // Open to suggestions on how to improve this guy.
            return target.className.substring(
                classNameIndex + 13,
                classNameIndex + 23);
        }

        return null;
    };

    /**
     * Triggers any applicable events given a change in the calendar's start
     * and end dates. ctx contains the current (changed) start and end date,
     * orig contains the original start and end dates.
     */
    Clndr.prototype.triggerEvents = function (ctx, orig) {
        var timeOpt = ctx.options.lengthOfTime,
            eventsOpt = ctx.options.clickEvents,
            newInt = {
                end: ctx.intervalEnd,
                start: ctx.intervalStart
            },
            intervalArg = [
                moment(ctx.intervalStart),
                moment(ctx.intervalEnd)
            ],
            monthArg = [moment(ctx.month)],
            nextYear, prevYear, yearChanged,
            nextMonth, prevMonth, monthChanged,
            nextInterval, prevInterval, intervalChanged;

        // We want to determine if any of the change conditions have been
        // hit and then trigger our events based off that.
        nextMonth = newInt.start.isAfter( orig.start )
            && (Math.abs(newInt.start.month() - orig.start.month()) == 1
                || orig.start.month() === 11 && newInt.start.month() === 0);
        prevMonth = newInt.start.isBefore( orig.start )
            && (Math.abs(orig.start.month() - newInt.start.month()) == 1
                || orig.start.month() === 0 && newInt.start.month() === 11);
        monthChanged = newInt.start.month() !== orig.start.month()
            || newInt.start.year() !== orig.start.year();
        nextYear = newInt.start.year() - orig.start.year() === 1
            || newInt.end.year() - orig.end.year() === 1;
        prevYear = orig.start.year() - newInt.start.year() === 1
            || orig.end.year() - newInt.end.year() === 1;
        yearChanged = newInt.start.year() !== orig.start.year();

        // Only configs with a time period will get the interval change event
        if (timeOpt.days || timeOpt.months) {
            nextInterval = newInt.start.isAfter(orig.start);
            prevInterval = newInt.start.isBefore(orig.start);
            intervalChanged = nextInterval || prevInterval;

            if (nextInterval && eventsOpt.nextInterval) {
                eventsOpt.nextInterval.apply(ctx, intervalArg);
            }

            if (prevInterval && eventsOpt.previousInterval) {
                eventsOpt.previousInterval.apply(ctx, intervalArg);
            }

            if (intervalChanged && eventsOpt.onIntervalChange) {
                eventsOpt.onIntervalChange.apply(ctx, intervalArg);
            }
        }
        // @V2-todo see https://github.com/kylestetz/CLNDR/issues/225
        else {
            if (nextMonth && eventsOpt.nextMonth) {
                eventsOpt.nextMonth.apply(ctx, monthArg);
            }

            if (prevMonth && eventsOpt.previousMonth) {
                eventsOpt.previousMonth.apply(ctx, monthArg);
            }

            if (monthChanged && eventsOpt.onMonthChange) {
                eventsOpt.onMonthChange.apply(ctx, monthArg);
            }

            if (nextYear && eventsOpt.nextYear) {
                eventsOpt.nextYear.apply(ctx, monthArg);
            }

            if (prevYear && eventsOpt.previousYear) {
                eventsOpt.previousYear.apply(ctx, monthArg);
            }

            if (yearChanged && eventsOpt.onYearChange) {
                eventsOpt.onYearChange.apply(ctx, monthArg);
            }
        }
    };

    /**
     * Main action to go backward one period. Other methods call these, like
     * backAction which proxies jQuery events, and backActionWithContext which
     * is an internal method that this library uses.
     */
    Clndr.prototype.back = function (options /*, ctx */) {
        var yearChanged = null,
            ctx = ( arguments.length > 1 )
                ? arguments[ 1 ]
                : this,
            timeOpt = ctx.options.lengthOfTime,
            defaults = {
                withCallbacks: false
            },
            orig = {
                end: ctx.intervalEnd.clone(),
                start: ctx.intervalStart.clone()
            };

        // Extend any options
        options = $.extend(true, {}, defaults, options);

        // Before we do anything, check if any constraints are limiting this
        if (!ctx.constraints.previous) {
            return ctx;
        }

        if (!timeOpt.days) {
            // Shift the interval by a month (or several months)
            ctx.intervalStart
                .subtract(timeOpt.interval, 'months')
                .startOf('month');
            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.months || timeOpt.interval, 'months')
                .subtract(1, 'days')
                .endOf('month');
            ctx.month = ctx.intervalStart.clone();
        }
        else {
            // Shift the interval in days
            ctx.intervalStart
                .subtract(timeOpt.interval, 'days')
                .startOf('day');
            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.days - 1, 'days')
                .endOf('day');
            // @V2-todo Useless, but consistent with API
            ctx.month = ctx.intervalStart.clone();
        }

        ctx.render();

        if (options.withCallbacks) {
            ctx.triggerEvents(ctx, orig);
        }

        return ctx;
    };

    Clndr.prototype.backAction = function (event) {
        var ctx = event.data.context;
        ctx.backActionWithContext(ctx);
    };

    Clndr.prototype.backActionWithContext = function (ctx) {
        ctx.back({
            withCallbacks: true
        }, ctx);
    };

    Clndr.prototype.previous = function (options) {
        // Alias
        return this.back(options);
    };

    /**
     * Main action to go forward one period. Other methods call these, like
     * forwardAction which proxies jQuery events, and backActionWithContext
     * which is an internal method that this library uses.
     */
    Clndr.prototype.forward = function (options /*, ctx */) {
        var ctx = ( arguments.length > 1 )
                ? arguments[ 1 ]
                : this,
            timeOpt = ctx.options.lengthOfTime,
            defaults = {
                withCallbacks: false
            },
            orig = {
                end: ctx.intervalEnd.clone(),
                start: ctx.intervalStart.clone()
            };

        // Extend any options
        options = $.extend(true, {}, defaults, options);

        // Before we do anything, check if any constraints are limiting this
        if (!ctx.constraints.next) {
            return ctx;
        }

        if (ctx.options.lengthOfTime.days) {
            // Shift the interval in days
            ctx.intervalStart
                .add(timeOpt.interval, 'days')
                .startOf('day');
            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.days - 1, 'days')
                .endOf('day');
            // @V2-todo Useless, but consistent with API
            ctx.month = ctx.intervalStart.clone();
        }
        else {
            // Shift the interval by a month (or several months)
            ctx.intervalStart
                .add(timeOpt.interval, 'months')
                .startOf('month');
            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.months || timeOpt.interval, 'months')
                .subtract(1, 'days')
                .endOf('month');
            ctx.month = ctx.intervalStart.clone();
        }

        ctx.render();

        if (options.withCallbacks) {
            ctx.triggerEvents(ctx, orig);
        }

        return ctx;
    };

    Clndr.prototype.forwardAction = function (event) {
        var ctx = event.data.context;
        ctx.forwardActionWithContext(ctx);
    };

    Clndr.prototype.forwardActionWithContext = function (ctx) {
        ctx.forward({
            withCallbacks: true
        }, ctx);
    };

    Clndr.prototype.next = function (options) {
        // Alias
        return this.forward(options);
    };

    /**
     * Main action to go back one year.
     */
    Clndr.prototype.previousYear = function (options /*, ctx */) {
        var ctx = ( arguments.length > 1 )
                ? arguments[ 1 ]
                : this,
            defaults = {
                withCallbacks: false
            },
            orig = {
                end: ctx.intervalEnd.clone(),
                start: ctx.intervalStart.clone()
            };

        // Extend any options
        options = $.extend(true, {}, defaults, options);

        // Before we do anything, check if any constraints are limiting this
        if (!ctx.constraints.previousYear) {
            return ctx;
        }

        ctx.month.subtract(1, 'year');
        ctx.intervalStart.subtract(1, 'year');
        ctx.intervalEnd.subtract(1, 'year');
        ctx.render();

        if (options.withCallbacks) {
            ctx.triggerEvents(ctx, orig);
        }

        return ctx;
    };

    Clndr.prototype.previousYearAction = function (event) {
        var ctx = event.data.context;
        ctx.previousYear({
            withCallbacks: true
        }, ctx);
    };

    /**
     * Main action to go forward one year.
     */
    Clndr.prototype.nextYear = function (options /*, ctx */) {
        var ctx = ( arguments.length > 1 )
                ? arguments[ 1 ]
                : this,
            defaults = {
                withCallbacks: false
            },
            orig = {
                end: ctx.intervalEnd.clone(),
                start: ctx.intervalStart.clone()
            };

        // Extend any options
        options = $.extend(true, {}, defaults, options);

        // Before we do anything, check if any constraints are limiting this
        if (!ctx.constraints.nextYear) {
            return ctx;
        }

        ctx.month.add(1, 'year');
        ctx.intervalStart.add(1, 'year');
        ctx.intervalEnd.add(1, 'year');
        ctx.render();

        if (options.withCallbacks) {
            ctx.triggerEvents(ctx, orig);
        }

        return ctx;
    };

    Clndr.prototype.nextYearAction = function (event) {
        var ctx = event.data.context;
        ctx.nextYear({
            withCallbacks: true
        }, ctx);
    };

    Clndr.prototype.today = function (options /*, ctx */) {
        var ctx = ( arguments.length > 1 )
                ? arguments[ 1 ]
                : this,
            timeOpt = ctx.options.lengthOfTime,
            defaults = {
                withCallbacks: false
            },
            orig = {
                end: ctx.intervalEnd.clone(),
                start: ctx.intervalStart.clone()
            };

        // Extend any options
        options = $.extend(true, {}, defaults, options);
        // @V2-todo Only used for legacy month view
        ctx.month = moment().startOf('month');

        if (timeOpt.days) {
            // If there was a startDate specified, we should figure out what
            // the weekday is and use that as the starting point of our
            // interval. If not, go to today.weekday(0).
            if (timeOpt.startDate) {
                ctx.intervalStart = moment()
                    .weekday(timeOpt.startDate.weekday())
                    .startOf('day');
            } else {
                ctx.intervalStart = moment().weekday(0).startOf('day');
            }

            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.days - 1, 'days')
                .endOf('day');
        }
        else {
            // Set the intervalStart to this month.
            ctx.intervalStart = moment().startOf('month');
            ctx.intervalEnd = ctx.intervalStart.clone()
                .add(timeOpt.months || timeOpt.interval, 'months')
                .subtract(1, 'days')
                .endOf('month');
        }
        
        // No need to re-render if we didn't change months.
        if (!ctx.intervalStart.isSame(orig.start)
            || !ctx.intervalEnd.isSame(orig.end))
        {
            ctx.render();
        }

        // Fire the today event handler regardless of any change
        if (options.withCallbacks) {
            if (ctx.options.clickEvents.today) {
                ctx.options.clickEvents.today.apply(ctx, [moment(ctx.month)]);
            }

            ctx.triggerEvents(ctx, orig);
        }
    };

    Clndr.prototype.todayAction = function (event) {
        var ctx = event.data.context;
        ctx.today({
            withCallbacks: true
        }, ctx);
    };

    /**
     * Changes the month. Accepts 0-11 or a full/partial month name e.g. "Jan",
     * "February", "Mar", etc.
     */
    Clndr.prototype.setMonth = function (newMonth, options) {
        var timeOpt = this.options.lengthOfTime,
            orig = {
                end: this.intervalEnd.clone(),
                start: this.intervalStart.clone()
            };

        if (timeOpt.days || timeOpt.months) {
            console.log(
                'You are using a custom date interval. Use ' +
                'Clndr.setIntervalStart(startDate) instead.');
            return this;
        }

        this.month.month(newMonth);
        this.intervalStart = this.month.clone().startOf('month');
        this.intervalEnd = this.intervalStart.clone().endOf('month');
        this.render();

        if (options && options.withCallbacks) {
            this.triggerEvents(this, orig);
        }

        return this;
    };

    Clndr.prototype.setYear = function (newYear, options) {
        var orig = {
            end: this.intervalEnd.clone(),
            start: this.intervalStart.clone()
        };

        this.month.year(newYear);
        this.intervalEnd.year(newYear);
        this.intervalStart.year(newYear);
        this.render();

        if (options && options.withCallbacks) {
            this.triggerEvents(this, orig);
        }

        return this;
    };

    /**
     * Sets the start of the time period according to newDate. newDate can be
     * a string or a moment object.
     */
    Clndr.prototype.setIntervalStart = function (newDate, options) {
        var timeOpt = this.options.lengthOfTime,
            orig = {
                end: this.intervalEnd.clone(),
                start: this.intervalStart.clone()
            };

        if (!timeOpt.days && !timeOpt.months) {
            console.log(
                'You are using a custom date interval. Use ' +
                'Clndr.setIntervalStart(startDate) instead.');
            return this;
        }

        if (timeOpt.days) {
            this.intervalStart = moment(newDate).startOf('day');
            this.intervalEnd = this.intervalStart.clone()
                .add(timeOpt - 1, 'days')
                .endOf('day');
        } else {
            this.intervalStart = moment(newDate).startOf('month');
            this.intervalEnd = this.intervalStart.clone()
                .add(timeOpt.months || timeOpt.interval, 'months')
                .subtract(1, 'days')
                .endOf('month');
        }

        this.month = this.intervalStart.clone();
        this.render();

        if (options && options.withCallbacks) {
            this.triggerEvents(this, orig);
        }

        return this;
    };

    /**
     * Overwrites events in the calendar and triggers a render.
     */
    Clndr.prototype.setEvents = function (events) {
        // Go through each event and add a moment object
        if (this.options.multiDayEvents) {
            this.options.events = this.addMultiDayMomentObjectsToEvents(events);
        } else {
            this.options.events = this.addMomentObjectToEvents(events);
        }

        this.render();
        return this;
    };

    /**
     * Adds additional events to the calendar and triggers a render.
     */
    Clndr.prototype.addEvents = function (events) {
        // Go through each event and add a moment object
        if (this.options.multiDayEvents) {
            this.options.events = $.merge(
                this.options.events,
                this.addMultiDayMomentObjectsToEvents(events));
        } else {
            this.options.events = $.merge(
                this.options.events,
                this.addMomentObjectToEvents(events));
        }

        this.render();
        return this;
    };

    /**
     * Passes all events through a matching function. Any that pass a truth
     * test will be removed from the calendar's events. This triggers a render.
     */
    Clndr.prototype.removeEvents = function (matchingFn) {
        for (var i = this.options.events.length - 1; i >= 0; i--) {
            if (matchingFn(this.options.events[i]) == true) {
                this.options.events.splice(i, 1);
            }
        }

        this.render();
        return this;
    };

    Clndr.prototype.addMomentObjectToEvents = function (events) {
        var i = 0,
            self = this;

        for (i; i < events.length; i++) {
            // Add the date as both start and end, since it's a single-day
            // event by default
            events[i]._clndrStartDateObject =
                moment(events[i][self.options.dateParameter]);
            events[i]._clndrEndDateObject =
                moment(events[i][self.options.dateParameter]);
        }

        return events;
    };

    Clndr.prototype.addMultiDayMomentObjectsToEvents = function (events) {
        var i = 0,
            self = this,
            multiEvents = self.options.multiDayEvents;

        for (i; i < events.length; i++) {
            var end = events[i][multiEvents.endDate],
                start = events[i][multiEvents.startDate];
            // If we don't find the startDate OR endDate fields, look for
            // singleDay
            if (!end && !start) {
                events[i]._clndrEndDateObject =
                    moment(events[i][multiEvents.singleDay]);
                events[i]._clndrStartDateObject =
                    moment(events[i][multiEvents.singleDay]);
            }
            // Otherwise use startDate and endDate, or whichever one is present
            else {
                events[i]._clndrEndDateObject = moment(end || start);
                events[i]._clndrStartDateObject = moment(start || end);
            }
        }

        return events;
    };

    Clndr.prototype.calendarDay = function (options) {
        var defaults = {
            day: "",
            date: null,
            events: [],
            classes: this.options.targets.empty
        };

        return $.extend({}, defaults, options);
    };

    Clndr.prototype.destroy = function () {
        var $container = $(this.calendarContainer);
        $container.parent().data('plugin_clndr', null);
        this.options = defaults;
        $container.empty().remove();
        this.element = null;
    };

    $.fn.clndr = function (options) {
        var clndrInstance;

        if (this.length > 1) {
            throw new Error(
                "CLNDR does not support multiple elements yet. Make sure " +
                "your clndr selector returns only one element.");
        }

        if (!this.length) {
            throw new Error(
                "CLNDR cannot be instantiated on an empty selector.");
        }

        if (!this.data('plugin_clndr')) {
            clndrInstance = new Clndr(this, options);
            this.data('plugin_clndr', clndrInstance);
            return clndrInstance;
        }

        return this.data('plugin_clndr');
    };
}));

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
/*global ActiveXObject */

// AMD support
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // using AMD; register as anon module
        define(['jquery'], factory);
    } else {
        // no AMD; invoke directly
        factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
    }
}

(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });

    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

var hasProp = !!$.fn.prop;

// attr2 uses prop when it can but checks the return type for
// an expected string.  this accounts for the case where a form 
// contains inputs with names like "action" or "method"; in those
// cases "prop" returns the element
$.fn.attr2 = function() {
    if ( ! hasProp ) {
        return this.attr.apply(this, arguments);
    }
    var val = this.prop.apply(this, arguments);
    if ( ( val && val.jquery ) || typeof val === 'string' ) {
        return val;
    }
    return this.attr.apply(this, arguments);
};

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }
    else if ( options === undefined ) {
        options = {};
    }

    method = options.type || this.attr2('method');
    action = options.url  || this.attr2('action');

    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || $.ajaxSettings.type,
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }

    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || this ;    // jQuery 1.4+ supports scope context
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    if (options.error) {
        var oldError = options.error;
        options.error = function(xhr, status, error) {
            var context = options.context || this;
            oldError.apply(context, [xhr, status, error, $form]);
        };
    }

     if (options.complete) {
        var oldComplete = options.complete;
        options.complete = function(xhr, status) {
            var context = options.context || this;
            oldComplete.apply(context, [xhr, status, $form]);
        };
    }

    // are there files to upload?

    // [value] (issue #113), also see comment:
    // https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
    var fileInputs = $('input[type=file]:enabled', this).filter(function() { return $(this).val() !== ''; });

    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    var jqxhr;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                jqxhr = fileUploadIframe(a);
            });
        }
        else {
            jqxhr = fileUploadIframe(a);
        }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        jqxhr = fileUploadXhr(a);
    }
    else {
        jqxhr = $.ajax(options);
    }

    $form.removeData('jqxhr').data('jqxhr', jqxhr);

    // clear element array
    for (var k=0; k < elements.length; k++) {
        elements[k] = null;
    }

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

    // utility fn for deep serialization
    function deepSerialize(extraData){
        var serialized = $.param(extraData, options.traditional).split('&');
        var len = serialized.length;
        var result = [];
        var i, part;
        for (i=0; i < len; i++) {
            // #252; undo param space replacement
            serialized[i] = serialized[i].replace(/\+/g,' ');
            part = serialized[i].split('=');
            // #278; use array instead of object storage, favoring array serializations
            result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
        }
        return result;
    }

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            var serializedData = deepSerialize(options.extraData);
            for (i=0; i < serializedData.length; i++) {
                if (serializedData[i]) {
                    formdata.append(serializedData[i][0], serializedData[i][1]);
                }
            }
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: method || 'POST'
        });

        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    }, false);
                }
                return xhr;
            };
        }

        s.data = null;
        var beforeSend = s.beforeSend;
        s.beforeSend = function(xhr, o) {
            //Send FormData() provided by user
            if (options.formData) {
                o.data = options.formData;
            }
            else {
                o.data = formdata;
            }
            if(beforeSend) {
                beforeSend.call(this, xhr, o);
            }
        };
        return $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var deferred = $.Deferred();

        // #341
        deferred.abort = function(status) {
            xhr.abort(status);
        };

        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( hasProp ) {
                    el.prop('disabled', false);
                }
                else {
                    el.removeAttr('disabled');
                }
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr2('name');
            if (!n) {
                $io.attr2('name', id);
            }
            else {
                id = n;
            }
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;

                try { // #214, #257
                    if (io.contentWindow.document.execCommand) {
                        io.contentWindow.document.execCommand('Stop');
                    }
                }
                catch(ignore) {}

                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error) {
                    s.error.call(s.context, xhr, e, status);
                }
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, e]);
                }
                if (s.complete) {
                    s.complete.call(s.context, xhr, e);
                }
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            deferred.reject();
            return deferred;
        }
        if (xhr.aborted) {
            deferred.reject();
            return deferred;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;
                
        function getDoc(frame) {
            /* it looks like contentWindow or contentDocument do not
             * carry the protocol property in ie8, when running under ssl
             * frame.document is the only valid response document, since
             * the protocol is know but not on the other two objects. strange?
             * "Same origin policy" http://en.wikipedia.org/wiki/Same_origin_policy
             */
            
            var doc = null;
            
            // IE8 cascading access check
            try {
                if (frame.contentWindow) {
                    doc = frame.contentWindow.document;
                }
            } catch(err) {
                // IE8 access denied under ssl & missing protocol
                log('cannot get iframe.contentWindow document: ' + err);
            }

            if (doc) { // successful getting content
                return doc;
            }

            try { // simply checking may throw in ie8 under ssl or mismatched protocol
                doc = frame.contentDocument ? frame.contentDocument : frame.document;
            } catch(err) {
                // last attempt
                log('cannot get iframe.contentDocument: ' + err);
                doc = frame.document;
            }
            return doc;
        }

        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr2('target'), 
                a = $form.attr2('action'), 
                mp = 'multipart/form-data',
                et = $form.attr('enctype') || $form.attr('encoding') || mp;

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method || /post/i.test(method) ) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized') {
                        setTimeout(checkState,50);
                    }
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                           // if using the $.param format that allows for multiple values with the same name
                           if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
                               extraInputs.push(
                               $('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value)
                                   .appendTo(form)[0]);
                           } else {
                               extraInputs.push(
                               $('<input type="hidden" name="'+n+'">').val(s.extraData[n])
                                   .appendTo(form)[0]);
                           }
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                }
                if (io.attachEvent) {
                    io.attachEvent('onload', cb);
                }
                else {
                    io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);

                try {
                    form.submit();
                } catch(err) {
                    // just in case form has element with name/id of 'submit'
                    var submitFn = document.createElement('form').submit;
                    submitFn.apply(form);
                }
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                form.setAttribute('enctype', et); // #380
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            
            doc = getDoc(io);
            if(!doc) {
                log('cannot access response document');
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut) {
                    return;
                }
            }
            if (io.detachEvent) {
                io.detachEvent('onload', cb);
            }
            else {
                io.removeEventListener('load', cb, false);
            }

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml) {
                    s.dataType = 'xml';
                }
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header.toLowerCase()];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (err) {
                    status = 'parsererror';
                    xhr.error = errMsg = (err || status);
                }
            }
            catch (err) {
                log('error caught: ',err);
                status = 'error';
                xhr.error = errMsg = (err || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success) {
                    s.success.call(s.context, data, 'success', xhr);
                }
                deferred.resolve(xhr.responseText, 'success', xhr);
                if (g) {
                    $.event.trigger("ajaxSuccess", [xhr, s]);
                }
            }
            else if (status) {
                if (errMsg === undefined) {
                    errMsg = xhr.statusText;
                }
                if (s.error) {
                    s.error.call(s.context, xhr, status, errMsg);
                }
                deferred.reject(xhr, 'error', errMsg);
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
                }
            }

            if (g) {
                $.event.trigger("ajaxComplete", [xhr, s]);
            }

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete) {
                s.complete.call(s.context, xhr, status);
            }

            callbackProcessed = true;
            if (s.timeout) {
                clearTimeout(timeoutHandle);
            }

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget) {
                    $io.remove();
                }
                else { //adding else to clean up existing iframe response.
                    $io.attr('src', s.iframeSrc);
                }
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error) {
                    $.error('parsererror');
                }
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };

        return deferred;
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);

    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(e.target).ajaxSubmit(options); // #365
    }
}

function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is("[type=submit],[type=image]"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest('[type=submit]');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var formId = this.attr('id');
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    var els2;

    if (els && !/MSIE [678]/.test(navigator.userAgent)) { // #390
        els = $(els).get();  // convert to standard array
    }

    // #386; account for inputs outside the form which use the 'form' attribute
    if ( formId ) {
        els2 = $(':input[form="' + formId + '"]').get(); // hat tip @thet
        if ( els2.length ) {
            els = (els || []).concat(els2);
        }
    }

    if (!els || !els.length) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n || el.disabled) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements) {
                elements.push(el);
            }
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file') {
            if (elements) {
                elements.push(el);
            }
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements) {
                elements.push(el);
            }
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $('input[type=text]').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $('input[type=checkbox]').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $('input[type=radio]').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array) {
            $.merge(val, v);
        }
        else {
            val.push(v);
        }
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
        else if (t == "file") {
            if (/MSIE/.test(navigator.userAgent)) {
                $(this).replaceWith($(this).clone(true));
            } else {
                $(this).val('');
            }
        }
        else if (includeHidden) {
            // includeHidden can be the value true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) ) {
                this.value = '';
            }
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug) {
        return;
    }
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

}));
	
	/**
	 * jQuery MD5 hash algorithm function
	 * 
	 * 	<code>
	 * 		Calculate the md5 hash of a String 
	 * 		String $.md5 ( String str )
	 * 	</code>
	 * 
	 * Calculates the MD5 hash of str using the » RSA Data Security, Inc. MD5 Message-Digest Algorithm, and returns that hash. 
	 * MD5 (Message-Digest algorithm 5) is a widely-used cryptographic hash function with a 128-bit hash value. MD5 has been employed in a wide variety of security applications, and is also commonly used to check the integrity of data. The generated hash is also non-reversable. Data cannot be retrieved from the message digest, the digest uniquely identifies the data.
	 * MD5 was developed by Professor Ronald L. Rivest in 1994. Its 128 bit (16 byte) message digest makes it a faster implementation than SHA-1.
	 * This script is used to process a variable length message into a fixed-length output of 128 bits using the MD5 algorithm. It is fully compatible with UTF-8 encoding. It is very useful when u want to transfer encrypted passwords over the internet. If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
	 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
	 * 
	 * Example
	 * 	Code
	 * 		<code>
	 * 			$.md5("I'm Persian."); 
	 * 		</code>
	 * 	Result
	 * 		<code>
	 * 			"b8c901d0f02223f9761016cfff9d68df"
	 * 		</code>
	 * 
	 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
	 * @link http://www.semnanweb.com/jquery-plugin/md5.html
	 * @see http://www.webtoolkit.info/
	 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
	 * @param {jQuery} {md5:function(string))
	 * @return string
	 */
	
	(function($){
		
		var rotateLeft = function(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}
		
		var addUnsigned = function(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			if (lX4 | lY4) {
				if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}
		
		var F = function(x, y, z) {
			return (x & y) | ((~ x) & z);
		}
		
		var G = function(x, y, z) {
			return (x & z) | (y & (~ z));
		}
		
		var H = function(x, y, z) {
			return (x ^ y ^ z);
		}
		
		var I = function(x, y, z) {
			return (y ^ (x | (~ z)));
		}
		
		var FF = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		
		var GG = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		
		var HH = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		
		var II = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		
		var convertToWordArray = function(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWordsTempOne = lMessageLength + 8;
			var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
			var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		};
		
		var wordToHex = function(lValue) {
			var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValueTemp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
			}
			return WordToHexValue;
		};
		
		var uTF8Encode = function(string) {
			string = string.replace(/\x0d\x0a/g, "\x0a");
			var output = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					output += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					output += String.fromCharCode((c >> 6) | 192);
					output += String.fromCharCode((c & 63) | 128);
				} else {
					output += String.fromCharCode((c >> 12) | 224);
					output += String.fromCharCode(((c >> 6) & 63) | 128);
					output += String.fromCharCode((c & 63) | 128);
				}
			}
			return output;
		};
		
		$.extend({
			md5: function(string) {
				var x = Array();
				var k, AA, BB, CC, DD, a, b, c, d;
				var S11=7, S12=12, S13=17, S14=22;
				var S21=5, S22=9 , S23=14, S24=20;
				var S31=4, S32=11, S33=16, S34=23;
				var S41=6, S42=10, S43=15, S44=21;
				string = uTF8Encode(string);
				x = convertToWordArray(string);
				a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
				for (k = 0; k < x.length; k += 16) {
					AA = a; BB = b; CC = c; DD = d;
					a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
					d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
					c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
					b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
					a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
					d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
					c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
					b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
					a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
					d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
					c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
					b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
					a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
					d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
					c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
					b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
					a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
					d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
					c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
					b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
					a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
					d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
					c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
					b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
					a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
					d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
					c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
					b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
					a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
					d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
					c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
					b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
					a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
					d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
					c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
					b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
					a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
					d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
					c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
					b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
					a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
					d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
					c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
					b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
					a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
					d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
					c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
					b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
					a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
					d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
					c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
					b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
					a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
					d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
					c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
					b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
					a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
					d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
					c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
					b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
					a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
					d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
					c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
					b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
					a = addUnsigned(a, AA);
					b = addUnsigned(b, BB);
					c = addUnsigned(c, CC);
					d = addUnsigned(d, DD);
				}
				var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
				return tempValue.toLowerCase();
			}
		});
	})(jQuery);
/**
 * Angularjs环境下分页
 * name: tm.pagination
 * Version: 1.0.0
 */
angular.module('tm.pagination', []).directive('tmPagination',[function(){
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
            '<ul class="pagination" ng-show="conf.totalItems > 0">' +
            '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
            '</ul>' +
            '<div class="page-total" ng-show="conf.totalItems > 0">' +
            '第<input type="text" ng-model="jumpPageNum"  ng-keyup="jumpToPage($event)"/>页 ' +
            '/共<strong>{{ conf.totalItems }}</strong>条' +
            '</div>' +
            '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
            '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){

            // 变更当前页
            scope.changeCurrentPage = function(item){
                if(item == '...'){
                    return;
                }else{
                    scope.conf.currentPage = item;
                }
            };

            // 定义分页的长度必须为奇数 (default:9)
            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9 ;
            if(scope.conf.pagesLength % 2 === 0){
                // 如果不是奇数的时候处理一下
                scope.conf.pagesLength = scope.conf.pagesLength -1;
            }

            // conf.erPageOptions
            if(!scope.conf.perPageOptions){
                scope.conf.perPageOptions = [10, 15, 20, 30, 50];
            }

            // pageList数组
            function getPagination(){
                // conf.currentPage
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                // conf.totalItems
                scope.conf.totalItems = parseInt(scope.conf.totalItems);

                // conf.itemsPerPage (default:15)
                // 先判断一下本地存储中有没有这个值
                if(scope.conf.rememberPerPage){
                    if(!parseInt(localStorage[scope.conf.rememberPerPage])){
                        localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                    }

                    scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);


                }else{
                    scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                }

                // numberOfPages
                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);

                // judge currentPage > scope.numberOfPages
                if(scope.conf.currentPage < 1){
                    scope.conf.currentPage = 1;
                }

                if(scope.conf.currentPage > scope.conf.numberOfPages){
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }

                // jumpPageNum
                scope.jumpPageNum = scope.conf.currentPage;

                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                var perPageOptionsLength = scope.conf.perPageOptions.length;
                // 定义状态
                var perPageOptionsStatus;
                for(var i = 0; i < perPageOptionsLength; i++){
                    if(scope.conf.perPageOptions[i] == scope.conf.itemsPerPage){
                        perPageOptionsStatus = true;
                    }
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                if(!perPageOptionsStatus){
                    scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
                }

                // 对选项进行sort
                scope.conf.perPageOptions.sort(function(a, b){return a-b});

                scope.pageList = [];
                if(scope.conf.numberOfPages <= scope.conf.pagesLength){
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for(i =1; i <= scope.conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (scope.conf.pagesLength - 1)/2;
                    if(scope.conf.currentPage <= offset){
                        // 左边没有...
                        for(i =1; i <= offset +1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else{
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for(i = Math.ceil(offset/2) ; i >= 1; i--){
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);
                        for(i = 1; i <= offset/2; i++){
                            scope.pageList.push(scope.conf.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }

                if(scope.conf.onChange){
                    scope.conf.onChange();
                }
                scope.$parent.conf = scope.conf;
            }

            // prevPage
            scope.prevPage = function(){
                if(scope.conf.currentPage > 1){
                    scope.conf.currentPage -= 1;
                }
            };
            // nextPage
            scope.nextPage = function(){
                if(scope.conf.currentPage < scope.conf.numberOfPages){
                    scope.conf.currentPage += 1;
                }
            };

            // 跳转页
            scope.jumpToPage = function(){
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
                if(scope.jumpPageNum !== ''){
                    scope.conf.currentPage = scope.jumpPageNum;
                }
            };

            // 修改每页显示的条数
            scope.changeItemsPerPage = function(){
                // 清除本地存储的值方便重新设置
                if(scope.conf.rememberPerPage){
                    localStorage.removeItem(scope.conf.rememberPerPage);
                }
            };

            scope.$watch(function(){
                var newValue = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';
                // 如果直接watch perPage变化的时候，因为记住功能的原因，所以一开始可能调用两次。
                //所以用了如下方式处理
                if(scope.conf.rememberPerPage){
                    // 由于记住的时候需要特别处理一下，不然可能造成反复请求
                    // 之所以不监控localStorage[scope.conf.rememberPerPage]是因为在删除的时候会undefind
                    // 然后又一次请求
                    if(localStorage[scope.conf.rememberPerPage]){
                        newValue += localStorage[scope.conf.rememberPerPage];
                    }else{
                        newValue += scope.conf.itemsPerPage;
                    }
                }else{
                    newValue += scope.conf.itemsPerPage;
                }
                return newValue;

            }, getPagination);

        }
    };
}]);

function transformSchArr(arr) {
	var options = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = {
			"id": arr[i].school_id,
			"name": arr[i].school_name
		};
		options.push(item);
	}
	return options;
}

function getCurrentDate() {
	var myDate = new Date(),
		Y = myDate.getFullYear(),
		M = myDate.getMonth() + 1,
		D = myDate.getDate();
	return Y + '-' + M + '-' + D;

}

//检查如期格式
function isDate(str) {
	var result = str.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
	if (result == null) {
		//alert("请输入正确的日期格式");
		return false;
	}else{
		return true;
	}

}
//检查时间格式
function isTime(str) {
	console.log(str)
	var a = str.match(/^(\d{1,2})(:)?(\d{1,2})$/);
	if (a == null) {
		return false;
	}
	if(!a[2]) {
		return false;
	}else if (a[1] > 24 || a[3] > 60) {
		return false
	}
	return true;
}
function ajaxFileUpload(domStr, urlStr) {
	$.ajaxFileUpload({
		url: urlStr, //用于文件上传的服务器端请求地址
		secureuri: false, //一般设置为false
		fileElementId: domStr, //文件上传空间的id属性  <input type="file" id="file" name="file" />
		dataType: 'json', //返回值类型 一般设置为json
		success: function(data, status) { //服务器成功响应处理函数
			console.log(data);
			console.log(status);
		},
		error: function(data, status, e) { //服务器响应失败处理函数
			alert(e);
		}
	})
}

var postData = function(url, data, callBack) {
	$.ajax({
		url: url,
		method: 'POST',
		data: data,
		dataType: 'json',
		beforeSend: function() {
			$('.mask').show();
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(result) {
			callBack(result);
		},
		complete: function() {
			$('.mask').hide();
		}
	})
}
var getData = function(url, callBack, data) {
	$.ajax({
		url: url,
		method: 'GET',
		data: data,
		dataType: 'json',
		beforeSend: function() {
			$('.mask').show();
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(result) {
			callBack(result);
		},
		complete: function() {
			$('.mask').hide();
		}
	})
}

var checkInputInObj = function(obj) {
	var status = 1;
	for(var item in obj) {
		if (!obj[item]) {
			status = 0;
			break;
		}
	}
	return status;
}


//common callback function

function callbackAlert(status, success) {
	if(status == 1) {
		if(success) {
			alert(success);
		}else {
			alert('操作成功');
		}
	}else if(status == 2) {
		alert('没有权限!');
	}else{
		alert('系统错误，请稍后重试!');
	}
}

//get data from localstorage
function getDataFromStorage(name) {
	var data = localStorage.getItem(name);
	data = JSON.parse(data);

	return data;
}

// get the currrent session
function getCurSession() {
    var curMonth = new Date().getMonth()+1;
    var data = {};
    if(2 =< curMonth <= 4) {
        data = {
            id: 1,
            name: '春季班'
        }
    }else if(5 =< curMonth <= 7) {
        data = {
            id: 2,
            name: '夏季班'
        }
    }else if(8 =< curMonth <= 10) {
        data = {
            id: 2,
            name: '秋季班'
        }
    }else {
        data = {
            id: 4,
            name: '冬季班'
        }
    }
    return data;
}