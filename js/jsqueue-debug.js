/**
 *  jsqueue-debug.js (c) 2014 richard@nautoguide.com
 */


(function ($) {

    "use strict";

    function jsQueueDebug(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);
        /**
         *  IE9 is broken for debugging so we bottle it
         */
        if(navigator.appVersion.indexOf("MSIE 9")!=-1) {
            jsqueue.activate('DEBUG');
            return;
        }
        self.window = window.open('', "debugwin", "width=1024,height=600,scrollbars=1,resizeable=1");
        if(self.window) {
            $(self.window.document.body).html('Debugger Online<br/><br/>');
            $(element).on({
                "command": function (event, cmd, data) {
                    self[cmd](data);
                }
            });
            jsqueue.activate('DEBUG');

        } else {
            console.log('Debugger failed to start, Popup blocked?');
        }

        // Commands

    }

    jsQueueDebug.prototype = {
        constructor: jsQueueDebug,
        DEBUG_MSG: function (data) {
            var self = this;
            var color = 'green';
            if (data.hasOwnProperty('state')) {
                switch (data.state) {
                    case 'info':
                        color = 'green';
                        break;
                    case 'warn':
                        color = 'orange';
                        break;
                    case 'error':
                        color = 'red';
                        break;

                }
            }
            if(typeof data.msg=='object') {
                $(self.window.document.body).append('<span style="color: ' + color + '">' + data.caller + ':</span><br/>');
                $(self.window.document.body).append(prettyPrint(data.msg));
            }
            else
                $(self.window.document.body).append('<span style="color: ' + color + '">' + data.caller + '('+ $.now()+'):</span>' + data.msg + '<br/>');
            //self.window.scrollTo(0,self.window.document.body.scrollHeight);
            jsqueue.finished(data.PID);
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsQueueDebug = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('jsQueueDebug')
                , options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsQueueDebug', (data = new jsQueueDebug(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsQueueDebug.Constructor = jsQueueDebug;


}(window.jQuery));

