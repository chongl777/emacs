function initialize_crude_time_spread(PARAMS) {
    var colors = d3.scale.category10();

    PARAMS['widget']['oil-time-spread-brent'] = addTitle(
        $('div#oil-time-spread-brent').init_wfi_plot({
            title: 'Crude Time Spread vs Font Month',
            datasource: 'oil-time-spread-brent',
            scatters: {
                data: {field: 'crude_adj', axis: 'yaxis1', radius: 4, hightlightlast: true},
                color: function(j, d){
                    var color = d3.scale.linear().domain([0, 1])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("yellow"), d3.rgb('red')]);
                    return color(d.j/d.n);}},
            xaxis: {field: 'spread_adj',
                    fmt: function(x) {return d3.format(',.02f')(x*100)+'%'},
                    tooltipfmt: function(x) {
                        return d3.format(',.02f')(x*1000)+'%'},
                    scale: d3.scale.linear()},
            yaxis1: {fmt: function(x) {return d3.format('.2f')(x)},
                     tooltipfmt: function(x) {return d3.format('.2f')(x)},
                     scale: d3.scale.linear()},
            navigator: {
                field: 'date',
                fmt: d3.time.format('%b %y'),
                tooltipfmt: d3.time.format('%Y-%m-%d'),
                domainfmt: d3.time.format('%m/%d/%Y'),
                scale: d3.time.scale(),
                gradient: {color: function(d) {
                    var color = d3.scale.linear().domain([0, 1])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("yellow"), d3.rgb('red')]);
                    return color(d);
                }},
                default: function(navi) {
                    var end = navi[navi.length-1];
                    var start = new Date(end);
                    start.setFullYear(start.getFullYear()-3);
                    return [start, end];
                }
            },
            zoombar: true,
            legendbar: false,
            preProcess: function(data) {
                var dataClone = {}
                $.each(data, function(p) {
                    dataClone[p] = data[p].slice();});
                dataClone['date'] = dataClone['date'].map(
                    function(p) {return d3.time.format('%Y-%m-%d').parse(p.slice(0,10));})
                return dataClone;
            }}));

    PARAMS['widget']['oil-time-spread-wti'] = addTitle(
        $('div#oil-time-spread-wti').init_wfi_plot({
            title: 'Crude Time Spread vs Font Month',
            datasource: 'oil-time-spread-wti',
            scatters: {
                data: {field: 'crude_adj', axis: 'yaxis1', radius: 4, hightlightlast: true},
                color: function(j, d){
                    var color = d3.scale.linear().domain([0, 1])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("yellow"), d3.rgb('red')]);
                    return color(d.j/d.n);}},
            xaxis: {field: 'spread_adj',
                    fmt: function(x) {return d3.format(',.02f')(x*100)+'%'},
                    tooltipfmt: function(x) {
                        return d3.format(',.02f')(x*1000)+'%'},
                    scale: d3.scale.linear()},
            yaxis1: {fmt: function(x) {return d3.format('.2f')(x)},
                     tooltipfmt: function(x) {return d3.format('.2f')(x)},
                     scale: d3.scale.linear()},
            navigator: {
                field: 'date',
                fmt: d3.time.format('%b %y'),
                tooltipfmt: d3.time.format('%Y-%m-%d'),
                domainfmt: d3.time.format('%m/%d/%Y'),
                scale: d3.time.scale(),
                gradient: {color: function(d) {
                    var color = d3.scale.linear().domain([0, 1])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("yellow"), d3.rgb('red')]);
                    return color(d);
                }},
                default: function(navi) {
                    var end = navi[navi.length-1];
                    var start = new Date(end);
                    start.setFullYear(start.getFullYear()-3);
                    return [start, end];
                }
            },
            zoombar: true,
            legendbar: false,
            preProcess: function(data) {
                var dataClone = {}
                $.each(data, function(p) {
                    dataClone[p] = data[p].slice();});
                dataClone['date'] = dataClone['date'].map(
                    function(p) {return d3.time.format('%Y-%m-%d').parse(p.slice(0,10));})
                return dataClone;
            }}));
}
