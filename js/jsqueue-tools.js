/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsTools(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('TOOLS');

    }

    jsTools.prototype = {
        constructor: jsTools,
        TOOLS_UPDATE_VALUE: function(data) {
            $(data.element).val(JSON.stringify(data));
            jsqueue.finished(data.PID);
        },

        TOOLS_REST_API: function (data) {
            var senddata = JSON.stringify(data.json);
            $.ajax({
                type: 'POST',
                url: data.uri,
                dataType: 'JSON',
                data: senddata,
                async: true,
                processData: false,
                contentType: false,
                traditional: false,
                success: function (rdata) {
                    jsqueue.push(data.PID, rdata);
                    jsqueue.finished(data.PID);
                    jsqueue.add({
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'info'}
                    });

                },
                error: function (rdata) {
                    jsqueue.add({
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {'caller': 'jsTools->call_api', 'msg': 'API Fail', 'state': 'info'}
                    });

                }
            });
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsTools = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsTools', (data = new jsTools(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsTools.Constructor = jsTools;


}(window.jQuery));

