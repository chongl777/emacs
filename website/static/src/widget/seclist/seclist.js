(function($){
    $.fn.init_sec_list = function(
        startLoading=function(){},
        endLoading=function(){}) {
        this.each(function(i, div) {
            initialize(
                div,
                startLoading,
                endLoading);
        })
        return this;
    }
    var initialize = function(div, startLoading, endLoading) {
        // unique id
        $(div).addClass('wfi-sec-list');
        $(div).append(
            '<div id="title" class="widget-title"><div>Security List</div></div>' +
                '<table class="row-border">' +
                "<caption></caption>" +
                "<thead>" +
                "<tr>" +
                "<th>payment_rnk</th>" +
                "<th>maturity</th>" +
                "<th>product_typ</th>" +
                "<th>Security ID</th>" +
                "<th>Description</th>" +
                "</tr>" +
                "</thead>" +
                "</table>");

        var height = $(div).height();
        var titleH = $(div).find('#title').height();
        //$(div).find('table').css('height', (height-titleH+0.5));
        //d3.select(div).select('table').style('height', (height-titleH+0.5)+'px');

        var widget = $(div).find("table");
        widget.css('height', height-titleH+0.5);
        var columns_config = {
            "payment_rnk": {
                "data": "payment_rnk",
                "sortable": false,
                "visible": false,
                "width": "0px"},
            "maturity": {
                "data": "maturity",
                "sortable": false,
                "visible": false,
                "width": "0px"},
            "product_typ": {
                "data": "product_typ",
                "sortable": false,
                "visible": false,
                "width": "0px"},
            "Security ID": {
                "data": "security_id",
                "visible": true,
                "render": function(data) {
                    return '<font class="sid">' + data + "</font>"},
                "width": "60px"},
            "Description": {
                "data": "description",
                "visible": true,
                "width": "100px"}};

        var columns_setup = [];
        $(div).find("table tr th").each(function(i, p) {
            columns_setup.push(columns_config[p.textContent]);
        })

        // get columns config
        var tbl = $(widget).DataTable( {
            bPaginate: false, bFilter: false, bInfo: false,
            bDestroy: true,
            bSort: true,
            fixedHeader: true,
            scrollY: height-titleH+"px",
            scrollCollapse: true,
            order: [[0, "asc"], [2, "asc"], [1, "asc"]],
            columns: columns_setup,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows().nodes();
                var last = null;
                api.rows().data().each(function(group, i) {
                    if (last !== group['product_typ']) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="2"><font>' +
                                group['product_typ'] + '</font></td></tr>'
                        );
                        last = group['product_typ'];
                    }
                });
                // end of drawback function
            }
        });

        div.update = updateWithLoadingIcon(startLoading, endLoading);
        div.updateWithData = function(data, clickfn) {
            updateWithData.call(tbl, data)
            $(div).on('click', 'tr[role="row"]', function(evt) {
                if (!evt.ctrlKey) {
                    tbl.$('tr.selected').removeClass('selected first');
                }

                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                } else {
                    $(this).addClass('selected');
                }

                if (tbl.$('tr.selected').length == 1) {
                    $(this).addClass('first');
                }

                clickfn.apply(tbl);
            });
        };
        return this;
    };

    var updateWithData = function(data) {
        var widget = this;
        //widget.rows().each(function(p) {widget.row(0).remove();});
        widget.rows().remove().draw();
        data.forEach(function(p) {widget.row.add(p)});
        widget.draw();
    };

    // update elements
    var updateWithLoadingIcon = function(startLoading, endLoading) {
        var update = function(pid, clickfn) {
            var self = this;
            startLoading();
            $.ajax({
                url: "get_parent_securities",
                method: "GET",
                dataType: 'json',
                data: {
                    "pid": parseInt(pid)},
                success: function(data) {
                    endLoading();
                    data = JSON.parse(data.replace(/\bNaN\b/g, "null"));
                    self.updateWithData(data, clickfn);
                },
                error: function () {
                    endLoading();
                }
            })
        };
        return update;
    }
})(jQuery);
