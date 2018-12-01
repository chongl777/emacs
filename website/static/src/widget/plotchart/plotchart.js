(function($){
    $.fn.init_plot = function(
        dursec=2,
        startLoading=function(){},
        endLoading=function(){}) {
        this.each(function(i, div) {
            init_plot(
                div, dursec,
                startLoading, endLoading);
        })
        return this;
    };

    var init_plot = function(self, dursec, startLoading, endLoading) {
        // unique id
        self.args = {};
        $(self).addClass('wfi-plot')
        self.dursec = dursec;
        var guid = (function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                })})();
        var naviH = parseInt($(self).attr('navH'));
        var zoombarH = parseInt($(self).attr('zoombarH'));
        self.guid = guid;
        var pivot;
        self.margin = {top: 10, right: 5, bottom: 15, left: 5};
        self.width = $(self).width() - self.margin.left - self.margin.right;
        self.height = $(self).height() - self.margin.top - self.margin.bottom
            - naviH - zoombarH;

        self.naviMargin = {top: 5, right: 10, bottom: 4, left: 5},
        self.naviH = naviH - self.naviMargin.top - self.naviMargin.bottom;
        self.formatDate = d3.time.format("%Y-%m-%d");

        //
        self.typefunc = function type(d) {
            d.date = self.formatDate.parse(d.date);
            d.value = +d.value;
            return d;
        }

        /* ---------------------------------
                    add top-bar
           -----------------------------------*/
        d3.select(self)
            .selectAll("div.top-bar")
            .data([1, 2]).enter()
            .append("div")
            .attr("class", function(p) {
                return "top-bar top-bar-"+p;})
            .style("margin-left", self.margin.left+'px')
            .style("margin-right", self.margin.right+'px')
            .style("margin-bottom", '0px')
            .style('height', zoombarH/2+'px')
            .style('display', 'flex');

        var top_bar_1 = d3.select(self)
                .selectAll("div.top-bar-1");
        var top_bar_2 = d3.select(self)
                .selectAll("div.top-bar-2");

        var top_bar_left = top_bar_1.append('div')
                .style('display', 'flex')
                .style('flex-direction', 'row');

        // zoom section
        var zoom = top_bar_left
                .selectAll('table.zoom')
                .data([1]).enter()
                .append('table').attr('class', 'zoom')
                .style('width', '170px')
                .style('height', '100%')
                .append('tr');
        zoom.append('td').html('zoom:').style('font-weight', 'bold')
            .style('width', '32px');
        zoom.append('td').attr('class', 'zoom-scale').html('1d').on(
            'click', function() {
                var end = self.end;
                var start = (function (dates, ref) {
                    for (var i=0; i<dates.length; i++) {
                        if (dates[i] >= ref) {
                            return i>=1 ? dates[i-1] : ref;
                        };
                    };
                })(self.uniDates, end)
                self.drawBrush(start, end)});

        zoom.append('td').attr('class', 'zoom-scale').html('mtd').on(
            'click', function() {
                var end = self.uniDates[self.uniDates.length-1];
                var start = new Date(end);
                start.setDate(0);
                self.drawBrush(start, end)});
        zoom.append('td').attr('class', 'zoom-scale').html('1m').on(
            'click', function() {
                var end = self.end;
                var start = new Date(end);
                start.setMonth(end.getMonth()-1);
                self.drawBrush(start, end)});
        zoom.append('td').attr('class', 'zoom-scale').html('3m').on(
            'click', function() {
                var end = self.end;
                var start = new Date(end);
                start.setMonth(end.getMonth()-3);
                self.drawBrush(start, end)});
        zoom.append('td').attr('class', 'zoom-scale').html('ytd').on(
            'click', function() {
                var end = self.end;
                var start = new Date(end);
                start.setFullYear(end.getFullYear()-1);
                start.setMonth(11);
                start.setDate(31);
                self.drawBrush(start, end)});
        zoom.append('td').attr('class', 'zoom-scale').html('1y').on(
            'click', function() {
                var end = self.end;
                var start = new Date(end);
                start.setFullYear(end.getFullYear()-1);
                self.drawBrush(start, end)});
        zoom.append('td').attr('class', 'zoom-scale').html('3y').on(
            'click', function() {
                var end = self.end;
                var start = new Date(end);
                start.setFullYear(end.getFullYear()-3);
                self.drawBrush(start, end)});

        // time frame
        var time_frame = top_bar_left
                .selectAll('div.time-frame')
                .data([1]).enter()
                .append('div')
                .style('display', 'flex')
                .attr('class', 'time-frame')
                .style('height', '100%')
                .style('width', '150px');
        time_frame.append('tr')
            .style('display', 'table')
            .style('vertical-align', 'middle')
            .style('height', '100%')
            .style('width', '100%');
        time_frame.select('tr')
            .append('td')
            .style('height', '80%')
            .style('width', '45%')
            .append('input')
            .attr('id', 'start-date')
            .style('width', '100%')
            //.attr('pattern', "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d")
            .attr("placeholder", "mm/dd/yyyy");
        time_frame.select('tr')
            .append('td')
            .style('height', '80%')
            .style('width', '10%')
            .style('text-align', 'center')
            .html('-');
        time_frame.select('tr')
            .append('td')
            .style('height', '80%')
            .style('width', '45%')
            .append('input')
            .style('width', '100%')
            .attr('id', 'end-date')
            //.attr('pattern', "(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}")
            .attr("placeholder", "mm/dd/yyyy");
        $(self).find('div.time-frame input')
            .on("keydown keypress", function(event) {
                if (event.which == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
            })
            .on("keyup", function(event) {
                if (event.which == 13) {
                    var tfmt = d3.time.format("%m/%d/%Y");;
                    var start = $(self).find('div.time-frame input#start-date').val();
                    var end = $(self).find('div.time-frame input#end-date').val();
                    self.drawBrush(tfmt.parse(start), tfmt.parse(end))};
            });

        // return type
        var rtype = top_bar_1
                .selectAll('div.rtype')
                .data([1]).enter()
                .append('div')
                .style('display', 'flex')
                .attr('class', 'rtype')
                .style('height', '100%')
                .style('width', '80px');
        rtype.append('label').html('type: ')
            .style('font-weight', 'bold')
            .style('width', '30%')
            .style('line-height', zoombarH/2+'px');
        rtype.append('tr')
            .style('display', 'table')
            .style('vertical-align', 'middle')
            .style('height', '100%')
            .style('width', '70%')
            .append('td')
            .style('height', '100%')
            .append('select')
            .style('height', '100%')
            .style('width', '100%');

        rtype.select('select').append('option').attr('value', 'price').html('price');
        rtype.select('select').append('option').attr('value', 'return').html('return');

        $(self).find('div.rtype select').change(function(){
            self.updateWithData(
                self.args['sids'], self.args['ts'],
                self.args['title'],
                self.args['clrs'],
                $(this).val()=='return'?'6.2%':'6.2f',
                $(this).val()=='return'?'4.0%':'5.1f',
                $(this).val()=='return'?true:false);
        });

        //$(div).find('select').chosen({disable_search_threshold: 10});

        // legend
        var legend = top_bar_2
                .selectAll('div.legend-bar')
                .data([1]).enter()
                .append('div')
                .attr('class', 'legend-bar')
                .style('display', 'flex')
                .style('float', 'left')
                .style('height', '100%')
                .style('width', '100%');

        /* ------------------------------------
         adding main panel and navigation panel
         ------------------------------------ */
        // svg main object
        d3.select(self)
            .selectAll("svg.chart-main")
            .data([1]).enter()
            .append("svg")
            .style("top", zoombarH)
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
            .attr("class", "chart-main")
            .append('g').attr("class", "canvas-main")
            .attr("transform", "translate(" + self.margin.left + ", " + self.margin.top + ")")
            .append('g').attr('clip-path', 'url(#plotAreaClip-' + guid + ')')
            .attr('id', 'plot-area');

        // svg navigative object
        d3.select(self)
            .selectAll("svg.chart-navigator")
            .data([1]).enter()
            .append("svg")
            .attr("class", "chart-navigator")
            .attr("width", self.width + self.naviMargin.left + self.naviMargin.right)
            .attr("height", self.naviH + self.naviMargin.top + self.naviMargin.bottom)
            .style("top", $(self).height() - naviH)
            .append('g').attr("class", "canvas-navigator")
            .attr("transform", "translate(" + self.naviMargin.left + ", " + self.naviMargin.top + ")")

        // clip plot area
        d3.select(self).select("g#plot-area")
            .selectAll('clipPath').data([1]).enter()
            .append('clipPath').attr('id', 'plotAreaClip-'+guid)
            .append('rect')
            .attr({width: self.width, height: self.height})
            .attr('z-index', 10);
        // var plotClip = $(this).find("clippath#plotAreaClip rect");
        var plotClip = d3.select(self).select("g#plot-area")
                .selectAll('rect.plot-area').data([1])
                .enter().append('rect').attr('class', 'plot-area')
                .attr({width: self.width, height: self.height}).attr('opacity', 0);

        self.update = updateWithLoadingIcon(startLoading, endLoading);
        self.updateTimeFrame = updateTimeFrame;
        self.updateWithData = updateWithData;

        return this;
    };

    var updateTimeFrame = function(start, end, tfmt) {
        var self = this;
        $(self).find('input#start-date').val(tfmt(start));
        $(self).find('input#end-date').val(tfmt(end));
    }

    var updateWithData = function(sids, ts, title, clrs, numfmt, axisfmt, norm=true) {
        var self = this;
        self.args['sids'] = sids;
        self.args['ts'] = ts;
        self.args['title'] = title;
        self.args['clrs'] = clrs;
        self.args['numfmt'] = numfmt;
        self.args['norm'] = norm;

        var width = this.width;
        var height = this.height;
        var naviH = this.naviH,
            dursec = this.dursec,
            formatDate = this.formatDate;
        var svgMain = d3.select(self).select("g.canvas-main");
        var plotAreaMain = d3.select(self).select("g#plot-area")
        var svgNavi = d3.select(self).select("g.canvas-navigator");


        var fmt = function(x) {return d3.format(axisfmt)(x)};

        var drawdown = [];
        var data = [];
        var x_range = [];
        var y_range = [];
        var datum;

        // add title
        //$($(self).find('.title')).text(title);

        /* ----------------------------------
         add legend
         -----------------------------------*/
        // add circle
        d3.select(self).select('div.legend-bar').selectAll('*').remove();
        d3.select(self).select('div.legend-bar')
            .selectAll('p').data(sids).enter()
            .append('p')
            .style('height', '100%')
            .style('width', 90+'px')
            .style('margin', '0px')
            .style('display', 'flex')
            .append('svg')
            .style('width', '20%')
            .style('height', '100%')
            .append('circle')
            .attr('r', 4).attr('cx', 7)
            .attr('cy', 10)
            .style('fill', function(p, i) {return clrs(i)});

        // add legend
        d3.select(self).select('div.legend-bar')
            .selectAll('p').data(sids)
            .append('td').style('padding', 0)
            .style('width', '80%')
            .append('div').attr('class', 'legend-text')
            .style('height', '100%')
            .html(function(p) {return p+" (<span></span>)";})
            .style('display', 'block');

        var uniDates = {};
        for (var i=0; i<sids.length; i++) {
            datum = ts[sids[i]];
            data.push(datum);
            x_range = x_range.concat(d3.extent(datum, function(d) {uniDates[d.date]=1; return d.date;}));
            y_range = y_range.concat(d3.extent(datum, function(d) {return d.value;}));
        }

        uniDates = $.map(uniDates, function(value, index) {
            return new Date(index);});
        self.uniDates = uniDates;

        /*
         result['drawdown'].forEach(function(d, i) {
         if (!!d['peak date']) {
         d['peak date'] = formatDate.parse(d['peak date']);
         };
         if (!!d['recovery date']) {
         d['recovery date'] = formatDate.parse(d['recovery date']);
         } else {
         d['recovery date'] = uniDates[uniDates.length-1];
         };
         drawdown.push(
         [{'date': d['peak date']},
         {'date': d['recovery date']}
         ])
         })
         */

        // change the domain
        var x = d3.time.scale().range([0, width])
        //.domain(d3.extent(x_range));

        var y = d3.scale.linear().range([height, 0])
        //.domain(d3.extent(y_range));

        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom").ticks(5)
                .innerTickSize(-height)
                .outerTickSize(0)
                .tickFormat(d3.time.format('%m/%Y'))

        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("right").ticks(8)
                .tickFormat(fmt)
                .innerTickSize(width)
                .outerTickSize(0);

        var yAxisAdj = function(x) {
            yAxis(x);
            x.selectAll('.y.axis .tick text')
                .attr('x', width-30).attr('y', -5)
                .attr("xml:space", "preserve")
                .attr("textLength", 30);
        };

        var line = d3.svg.line()
                .x(function(d) {
                    return x(d.date); })
                .y(function(d) {
                    return y(d.value); });

        var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(height).y1(0);

        /* -------------------------------
         lower chart
         -------------------------------*/
        var navXScale = d3.time.scale()
                .range([0, width])
                .domain(d3.extent(x_range));
        var navYScale = d3.scale.linear()
                .range([naviH, 0])
                .domain(d3.extent(y_range));
        var navXAxis = d3.svg.axis()
                .scale(navXScale)
                .orient('bottom')
                .ticks(5)
                .innerTickSize(-naviH)
                .outerTickSize(-naviH)
                .tickFormat(d3.time.format("%b '%y"));
        var navXAxisAdj = function(x) {
            navXAxis(x);
            x.selectAll('.x.axis .tick text')
                .attr('x', 20).attr('y', -10);
        }

        var navArea = d3.svg.area()
                .x(function(d) { return navXScale(d.date); })
                .y0(naviH)
                .y1(function(d) { return navYScale(d.value); });

        // x axis draw or adjust
        svgNavi.selectAll('g.x.axis').data([1]).enter()
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + naviH + ')');
        svgNavi.selectAll('g.x.axis').call(navXAxisAdj);

        var navAreas = svgNavi.selectAll('.area').data([data[0]])
        navAreas.transition().attr('duration', dursec).attr("d", navArea);
        navAreas.enter().append('g').attr("class", "area-wrap")
            .append("path")
            .attr("class", function(p, i) {return 'area port'})
            .attr("d", navArea);


        svgNavi.selectAll('g.area-wrap')
            .selectAll('line.upper-line')
            .data([data[0]]).enter()
            .append("line")
            .attr("class", "upper-line")
            .attr("x2", width)
            .attr("y2", 0);

        var dataTrans = [];

        var brush = d3.svg.brush()
                .x(navXScale)
                .on("brush", brushed);

        // update brush
        var start = d3.extent(x_range)[0];
        var end = d3.extent(x_range)[1];
        //var start = svgMain.attr('start'), end = svgMain.attr('end');
        var view = svgNavi.selectAll('g.brush').data([1])
        if (!(start && end)) {
            brush.clear();
            view.call(brush);
            plotAreaMain.selectAll('.line').remove();
            return;
        }

        //brush.extent([start, end]);
        brush.clear();
        view.enter().append("g")
            .attr("class", "x brush")
            .call(brush).selectAll("rect")
            .attr("height", naviH);
        view.call(brush);
        // brushed();
        brush.event(svgNavi.select('g.x.brush'));

        /* --------------------------------------
         main chart
         --------------------------------------*/
        // add/change x axis
        svgMain.selectAll('.x.axis')
            .transition().attr('duration', dursec).call(xAxis);
        svgMain.selectAll('.x.axis')
            .data([1]).enter().append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // add/change y axis
        svgMain.selectAll('.y.axis')
            .transition().attr('duration', dursec).call(yAxisAdj);
        svgMain.selectAll('.y.axis')
            .data([1]).enter().append('g').attr('class', 'y axis')
            .call(yAxisAdj)
        /*
         .append('text').attr('transform', 'rotate(0)')
         .attr('y', 6).attr('dy', '.20em').attr('x', 2)
         .style('text-anchor', 'end').text('value');
         */
        // add line
        var lines = plotAreaMain.selectAll('.line').data(dataTrans)
        lines.enter().append('g').attr("class", "line-wrap")
            .append("path")
            .attr("class", function(p, i) {return "line " + sids[i]})
            .attr("d", line)
            .style('stroke', function(p, i) {return clrs(i)});
        lines.exit().remove();

        // add drawdown area
        var areas = plotAreaMain.selectAll('.area-drawdown').data(drawdown)
        areas.enter().append('g').append("path")
            .attr('opacity', function(p, i) {
                return 0.8 - (i+1.0)/drawdown.length/1.5})
            .attr('class', 'area-drawdown')
            .attr('fill', 'red')
            .attr("d", area)
        areas.exit().remove();

        /*-----------------------------
         tooltip
         -----------------------------*/
        // added guideline
        svgMain.data = dataTrans;
        svgMain.yScale = y;
        var pivot = xAxisTrans(uniDates, x);
        AddToolTip.call(self, svgMain, dataTrans, pivot, height, sids, clrs, fmt, dursec);

        self.drawBrush = drawBrush;

        /* --------------------------------
         inner function
         --------------------------------*/
        // brushed
        function brushed() {
            x.domain(brush.empty()? navXScale.domain() : brush.extent());
            var [start, end] = x.domain();
            // adjust start, end
            var pos_i, pos_j;
            [start, end, pos_i, pos_j] = adjustTimeFrame(uniDates, start, end);
            self.start = start;
            self.end = end;

            var yDomain = [];
            [dataTrans, yDomain] = DataTransform(data, start, end, norm);


            // update time frame
            self.updateTimeFrame(start, end, d3.time.format('%m/%d/%Y'));


            // update returns
            d3.select(self).selectAll('div.legend-bar .legend-text span')
                .data(data).html(function(p) {
                    var val = p[pos_j].value/p[pos_i].value-1;
                    return '<a class="'+(val>=0?'positive':'negative')+'">'+
                        d3.format('.2%')(val)+"</a>"})

            // update lines
            y.domain(adjDomain(yDomain, 0.1));
            lines = svgMain.selectAll('.line').data(dataTrans);
            lines.transition().attr('duration', dursec).attr("d", line);

            // update areas
            areas = svgMain.selectAll('.area-drawdown').data(drawdown);
            areas.transition().attr('duration', dursec).attr("d", area);

            // update axis
            yAxis.scale(y);
            xAxis.scale(x);
            svgMain.select('.y.axis').transition()
                .attr('duration', dursec).call(yAxisAdj);
            svgMain.select('.x.axis').transition()
                .attr('duration', dursec).call(xAxis);
            // update customized svg property
            svgMain.pivot = xAxisTrans(uniDates, x);
            svgMain.data = dataTrans;
            svgMain.yScale = y;
        }

        function drawBrush(start, end) {

            // define our brush extent to be begin and end of the year
            brush.extent([start, end])

            // now draw the brush to match our extent
            // use transition to slow it down so we can see what is happening
            // remove transition so just d3.select(".brush") to just draw
            brush(d3.select(self).select("g.x.brush").transition());

            // now fire the brushstart, brushmove, and brushend events
            // remove transition so just d3.select(".brush") to just draw
            brush.event(d3.select("g.x.brush").transition().delay(50));
        }
    }

    // update elements
    var updateWithLoadingIcon = function(startLoading, endLoading) {
        var update = function(sids, t_date, title, bar_count, risk_type, clrs, numfmt, axisfmt) {
            if ((sids == null) || !(sids.length)) {
                return;
            }
            var self = this;
            startLoading();
            $.ajax({
                url: "security_returns",
                method: "GET",
                dataType: 'json',
                data: {
                    t_date: t_date, ts_type: risk_type,
                    //bar_count: bar_count,
                    sids: JSON.stringify(sids)},
                success: function(ts) {
                    endLoading();
                    // format each data point
                    $.each(ts, function(i, d) {
                        d.forEach(function(datum) {
                            return self.typefunc(datum)})
                    })
                    self.updateWithData(
                        sids, ts, title, clrs, numfmt, axisfmt,
                        $(self).find('div.rtype select').val()=='return' ? true : false)
                },
                error: function () {
                    endLoading();
                    alert("error!");
                }
            });
        };
        return update;
    };

    var AddToolTip = function(svg, data, pivot, height, names, clrs, format, dursec) {
        // add tooltip and guideline
        d3.select(this).selectAll('div.tooltip')
            .data([1]).enter()
            .append('div')
            .attr('class', 'tooltip').style('display', 'none')
            .append('table')
        var tooltipTab = d3.select(this).selectAll('div.tooltip table');
        tooltipTab.selectAll('*').remove();
        tooltipTab.append('thead').append('a')
            .style('margin-left', '2px')
            .style('white-space', 'nowrap')
            .style('font-weight', 'bold');
        tooltipTab.append('tbody')
            .selectAll('tr.datum')
            .data(names).enter()
            .append('tr').attr('class', 'datum')
            .append('td').attr('class', 'sym')
            .append('svg')
            .style('width', 14)
            .style('height', 14)
            .append('circle')
            .attr('r', 4).attr('cx', 7)
            .attr('cy', 7)
            .style('fill', function(p, i) {return clrs(i)});
        tooltipTab.selectAll('tr.datum')
            .append('td').attr('class', 'val');

        var tooltip = d3.select(this).selectAll('div.tooltip');

        d3.select(this).select("svg.chart-main g#plot-area")
            .selectAll('g.guideline')
            .data([1]).enter()
            .append('g').attr('class', 'guideline');
        var pit = d3.select(this).selectAll('g.guideline');
        //var tooltip = d3.select(this).selectAll('div.tooltip table');
        //tooltip.append('thead').append('th');
        //tooltip.append('tbody');

        svg.on("mousemove", null).on("mouseleave", null);
        svg.on("mousemove", function(d) {
            var yScale = svg.yScale;
            var axis = d3.mouse(this);
            var xax = axis[0];
            var yax = axis[1];
            if (xax < 0) {return false;};
            var ref_nd = referenceNode(svg.pivot, xax);
            xax = svg.pivot[ref_nd];
            pit.selectAll('*').remove();
            pit.append('line').attr('class', 'guideline')
                .attr('x1', xax).attr('y1', height)
                .attr('x2', xax).attr('y2', 0)
                .attr('opacity', 0.8);

            // data
            var datum = [];
            svg.data.forEach(function(p, i) {
                datum.push(
                    {'date': p[ref_nd].date,
                     'value': p[ref_nd].value,
                     'name': names[i]});
            })

            var html_text = d3.time.format('%Y-%m-%d')(datum[0].date);

            // tooltip.html(html_text)
            tooltip.selectAll("thead a")
                .style('width', '100%')
                .html(d3.time.format('%Y-%m-%d')(datum[0].date));

            tooltip.selectAll('tbody tr.datum td.val')
                .data(datum)
                .html(function(p) {
                    return format(p.value)});


            // tooltip
            tooltip
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 30) + "px")
                .style("padding-left", "0px")
                .style("padding-right", "5px")
                .style("width", "90px")
            tooltip.transition()
                .attr('duration', dursec)
                .style('opacity', 0.8)
                .style('display', 'block');
            //tooltip.style('opacity', 0.8);


            // add circle
            pit.selectAll("circle").data(datum)
                .enter().append("circle")
                .attr("r", 4)
                .attr("class", function(d) {return d.name})
                .attr("cx", function(d) { return xax})
                .attr("cy", function(d) { return yScale(d.value)})
                .attr("opacity", 0.9)
                .style("fill", function(d, i) {return clrs(i)})
        }).on("mouseleave", function(d) {
            pit.selectAll('*').remove();
            tooltip.transition()
                .attr('duration', dursec)
                .style("opacity", 0)
                .style("display", "none")
        })
    }

    // helpers
    var xAxisTrans = function(uniDates, x) {
        var pivot = [];
        uniDates.forEach(function(p, i) {
            pivot.push(x(uniDates[i]));
        })
        return pivot;
    }

    var normData = function(data, start, end, norm=true) {
        var refValue = 1;
        // get the reference node
        for (var i=0; i<data.length; i++) {
            if (data[i].date >= start) {
                if (norm) {
                    refValue = data[i].value;
                }
                break;
            }
        };

        // get domain
        var domain = [];
        for (var j=i; j<data.length; j++) {
            if (data[j].date <= end)
                domain.push(data[j].value/refValue);
            else
                break;
        }
        domain = d3.extent(domain);

        var dataAdj = [];
        data.forEach(function(p, i) {
            return dataAdj.push(
                {'date': p.date,
                 'value': p.value/refValue});
        });
        return {'data': dataAdj, 'domain': domain};
    }

    var referenceNode = function(vec, v) {
        var n = vec.length;
        if (vec[0] >= v)
            return 0;
        if (vec[n-1] <= v)
            return n-1;
        var d1 = 0, d2= n-1, m = Math.floor((d2+d1)/2);
        do {
            if (v <= vec[m])
                d2 = m;
            else
                d1 = m;
            m = Math.floor((d2+d1)/2);
        } while ((d2-d1)>1);
        return d1;
    }

    var adjDomain = function(domain, pct) {
        domain = d3.extent(domain);
        var band = domain[1] - domain[0];
        domain[0] -= band*pct/2;
        domain[1] += band*pct/2;
        return domain;
    }

    var DataTransform = function(data, start, end, norm) {
        var data_adj = [];
        var yDomain = [];
        data.forEach(function(p, i) {
            var d = normData(p, start, end, norm);
            yDomain = yDomain.concat(d['domain']);
            data_adj.push(d['data']);
        })
        return [data_adj, yDomain];
    }

    var adjustTimeFrame = function(dates, start, end) {
        for (var i=0; i<dates.length; i++) {
            if (dates[i] >= start) {
                break;
            }
        };

        // get domain
        var domain = [];
        for (var j=i; j<dates.length; j++) {
            if (dates[j] > end)
                break;
        }

        return [dates[i],
                dates[j-1],
                i,
                j-1];
    }

})(jQuery);
