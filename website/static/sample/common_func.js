function create_screening_table(
    query, title, datasource, group_level_1, group_level_2,
    start_expansion_level, total_expansion_level=null, paginate=true) {
    // currency exposure
    // PARAMS['widget']['pf_ccy_expo'] = addTitle(
    //     $('div#pf-ccy-risk').init_pf_ccy_risk(startLoading, endLoading), "CURRENCY RISK");
    var colors = d3.scale.category10();
    // delta exposures
    return $(query).init_wfi_table(
        {datasource: datasource,
         title: ko.observable(title),
         bPaginate: paginate,
         aLengthMenu: [[25, 50, 75, 100], [25, 50, 75, 100]],
         groupdata: true,
         flatten: true,
         filename: "SecurityScreening",
         input_args: {
             'group_level_0': ko.observable('security_id'),
             'group_level_1': ko.observable(group_level_1),
             'group_level_2': ko.observable(group_level_2),
             'level_1_options': ['product_typ', 'bics_industry_level_1', 'None'],
             'level_2_options': ['bics_industry_level_1', 'bics_industry_level_2', 'None'],
             'start_expansion_level': start_expansion_level,
             'total_expansion_level': total_expansion_level
         },
         sort_by: [],
         total_expansion_level: null,
         processOption: function() {
             var self = this;
             self.title("SCREENING RESULT");
             self.total_expansion_level = self.input_args.total_expansion_level || Number.MAX_VALUE;

             self.start_expansion_level = self.input_args.start_expansion_level;

             // group columns
             self.group_columns = [self.input_args.group_level_0()];
             if (self.input_args.group_level_2() != 'None') {
                 self.group_columns.splice(0, 0, self.input_args.group_level_2());
             }

             if (self.input_args.group_level_1() != 'None') {
                 self.group_columns.splice(0, 0, self.input_args.group_level_1());
             }
             self.group_columns.splice(0, 0, 'Total');
         },
         process_row: function(row, rowdata) {
             var self = this;
             var rdepth = Math.min(self.options.total_expansion_level, self.options.group_columns.length-1) - rowdata.depth + 1;
             $('.sid-clickable', row).click(function() {
                 var url = 'http://westfieldinvestment/pfmgmt/sec_profile/security_profile?sid={sid}&pid={pid}'
                 url = url.replace(
                     '{sid}', rowdata['security_id']).replace('{pid}', rowdata['parent_id']);
                 window.open(url, '_blank');
             });
             $(row).addClass('rlevel-'+rdepth.toString())
         },
         process_child_data: function(data, depth) {
             var self = this;
             var n = self.options.sort_by.length;
         },
         columns_setup: [
             {data: "description",
              sortable: false,
              visible: true,
              title: '<div class="hover" data="description">Security</div>',
              width: '10%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div style="margin-left:' + Math.max(1, row.depth)*8 + 'px">' + row[options.keyfield] + '</div>';
                  } else {
                      return '<div style="margin-left:' + Math.max(1, row.depth)*8 + 'px">' + value + '</div>';
                  }
              }},
             {data: 'security_id',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="security_id">Sid</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  // var level = group_columns[row.depth-1];
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      return '<div class="value sid-clickable clickable">' + value + '</div>';
                  }
              }},
             {data: 'issuer',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="issuer">Issuer</div>',
              width: '15%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;

                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      return '<div class="value">' + value + '</div>';
                  }

              }},
             {data: 'coupon',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="coupon">Coupon</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return '<div class="value">-</div>';

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      if (value == null) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(".2f")(value) + '%</div>';
                  }
              }},
             {data: 'amt_outstanding',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="amt_outstanding">Outstanding Amt</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      if (value == null) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.0f")(value/1000000) + 'M</div>';
                  }
              }},
             {data: 'maturity',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="maturity">Maturity</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      if (value == null) return '<div class="value">-</div>';
                      var t_date = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(value);
                      return '<div class="value">' + d3.time.format("%Y-%m-%d")(t_date) + '</div>';
                  }
              }},
             {data: 'crr_px',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="crr_px">Current Px</div>',
              width: '5%',
              render: function(value, type, row, meta) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return addSignClass('<div class="value">' + d3.format(',.2f')(value) + '</div>', row['pct_chg_1d']);
              }},
             {data: 'crr_spread',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="crr_spread">Current Spread (bps)</div>',
              width: '7%',
              render: function(value, type, row, meta) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return '<div class="value">' + d3.format(',.2f')(value) + '</div>';
              }},
             {data: 'last_px_update',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="last_px_update">Last Update</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      if (value == null) return '<div class="value">-</div>';
                      var t_date = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(value);
                      return '<div class="value">' + d3.time.format("%Y-%m-%d")(t_date) + '</div>';
                  }
              }},
             {data: 'px_z_score_1y',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="px_z_score_1y">1 Year Zscore</div>',
              width: '5%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return '<div class="value">' + d3.format(',.2f')(value) + '</div>';
              }},
             {data: 'pct_chg_1d',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="pct_chg_1d">Chg 1D</div>',
              width: '5%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return addSignClass('<div class="value">' + d3.format(',.2f')(value*100) + '%</div>', value);
              }},
             {data: 'pct_chg_5d',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="pct_chg_5d">Chg 5D</div>',
              width: '5%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return addSignClass('<div class="value">' + d3.format(',.2f')(value*100) + '%</div>', value);
              }},
             {data: 'pct_chg_1m',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="pct_chg_1m">Chg 1M</div>',
              width: '5%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return addSignClass('<div class="value">' + d3.format(',.2f')(value*100) + '%</div>', value);
              }},
             {data: 'bics_industry_level_1',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="bics_industry_level_1">Industry Level 1</div>',
              width: '15%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return '<div class="value">' + value + '</div>';
              }},
             {data: 'bics_industry_level_2',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="bics_industry_level_2">Industry Level 2</div>',
              width: '20%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return '<div class="value">' + value + '</div>';
              }},
             {data: 'bb_rating',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="bb_rating">BBG Rating</div>',
              width: '5%',
              render: function(value, type, row) {

                  if (value == null) return '<div class="value">-</div>';
                  // var level = group_columns[row.depth-1];
                  return '<div class="value">' + value + '</div>';
              }},
             {data: 'bb_rtg_last_update',
              sortable: false,
              visible: true,
              title: '<div class="hover" data="bb_rtg_last_update">Rating Date</div>',
              width: '5%',
              render: function(value, type, row, meta) {
                  if (meta.settings.oInstance.context == null)
                      return "";

                  var options = meta.settings.oInstance.context.options;
                  var rdepth = options.group_columns.length - row.depth;
                  if (rdepth > 0) {
                      return '<div class="value"></div>';
                  } else {
                      if (value == null) return '<div class="value">-</div>';
                      var t_date = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(value);
                      return '<div class="value">' + d3.time.format("%Y-%m-%d")(t_date) + '</div>';
                  }
              }},
         ],
         keyfield: 'security_id',
         postProcess: function(self) {
             d3.select(self).selectAll('div.tooltip')
                 .data([1]).enter()
                 .append('div')
                 .attr('class', 'tooltip').style('display', 'none')
                 .append('table')
             var tooltipTab = d3.select(self).selectAll('div.tooltip table');
             var dursec = self.options.dursec;
             tooltipTab.selectAll('*').remove();

             // lines
             tooltipTab.append('tbody')
                 .attr('class', 'text-area')
                 .append('tr')
                 .html('<td>field_key:</td><td id="field"></td>')

             var tooltip = d3.select(self).selectAll('div.tooltip');
             tooltip.active = false;

             d3.select(self).selectAll('.hover').on("mousemove", null).on("mouseleave", null);

             d3.select(self).selectAll('.hover').on("mousemove", function(d) {
                 tooltip.active = true;
                 // lines tooltip
                 //var v = $(this).attr('data');
                 tooltip.select('#field').text($(this).attr('data'));
                 tooltip.active && show_tooltip.call(self, tooltip, d3.event, dursec);
             }).on("mouseleave", function(d) {
                 tooltip.active = false;
                 tooltip.transition()
                     .attr('duration', dursec)
                     .style("opacity", 0)
                     .style("display", "none")
             });
         },
         preProcess: function(data, options) {
             var dataClone = []
             data.forEach(function(p) {
                 p['Total'] = 'Total';
                 dataClone.push(p);
             });

             // dataClone.sort(sort_by(options.sort_by));
             return dataClone;
         },
         aggfun: function(node) {
             average(node, 'crr_spread', 1);
             average(node, 'pct_chg_1d', 1);
             average(node, 'pct_chg_5d', 1);
             average(node, 'pct_chg_1m', 1);
         },
         options: function(data) {
             var self = this;
             var html = $(' \
                    <table style="width:300px"> \
                      <col width="40%"> \
                      <col width="30%"> \
                      <tbody> \
                        <tr> \
                           <td colspan=1>Group Level 1</td> \
                           <td colspan=1 class="value"> \
                               <select data-bind="value: group_level_1, options: level_1_options"/> \
                           </td> \
                        </tr> \
                        <tr> \
                           <td colspan=1>Group Level 2</td> \
                           <td colspan=1 class="value"> \
                               <select data-bind="value: group_level_2, options: level_2_options"/> \
                           </td> \
                        </tr> \
                        <tr> \
                           <td colspan=1>Initial Expansion Level</td> \
                           <td colspan=1 class="value"> \
                               <input data-bind="value:start_expansion_level"/> \
                           </td> \
                        </tr> \
                        <tr> \
                           <td colspan=1>Total Expansion Level</td> \
                           <td colspan=1 class="value"> \
                               <input data-bind="value:total_expansion_level"/> \
                           </td> \
                        </tr> \
                      </tbody> \
                    </table>');
             return html
         },
         download: function(filename, data, callback) {
             var args = {
                 filename: filename}
             var args_vec = [];
             $.each(args, function(x, y) {
                 args_vec.push(x+"="+y);
             })
             var i;

             var xhr = new XMLHttpRequest();
             xhr.open('POST', 'api_download_data?'+args_vec.join('&'), true);
             xhr.responseType = 'arraybuffer';
             xhr.setRequestHeader('data', "{x: hello}")

             xhr.onload  = function(e) {
                 callback();
                 if (this.status == 200) {
                     var blob = new Blob([xhr.response], {type: 'octet/stream'});
                     var downloadUrl = URL.createObjectURL(blob);
                     //window.open(downloadUrl);
                     var a = document.createElement("a");
                     a.href = downloadUrl;
                     a.download = filename;
                     document.body.appendChild(a);
                     a.click();
                     //Do your stuff here
                 }
             };
             xhr.send(JSON.stringify(data));
         }}
    );


    /* ----------------------------------------------------
     Supportive Function
     ---------------------------------------------------- */
    function show_tooltip(tooltip, evt, dursec) {
        // tooltip
        var self = this;
        var w = $(tooltip.node()).width();
        var h = $(tooltip.node()).height();
        var w_total = self.options.width;
        var h_total = $(self).height();
        var x = evt.pageX - $(this).offset().left;
        var y = evt.pageY - $(this).offset().top;
        var right_id = true;
        var down_id = true;

        if ((x + w) > w_total) right_id = false;
        if ((y + h + 20) > h_total) down_id = false;

        tooltip
            .style(
                "left",
                (right_id ? (evt.pageX + 10):
                 (evt.pageX - w - 10)) + "px")
            .style("top", (down_id ? (evt.pageY + 30):
                           (evt.pageY - h - 20)) + "px")
            .style("padding-left", "0px")
            .style("padding-right", "5px")
        tooltip.transition()
            .attr('duration', dursec)
            .style('opacity', 0.99)
            .style('display', 'block');
    }


    function first(node, field, depth) {
        if (field in node) {
            return;
        } else {
            node.children.forEach(function(p) {
                first(p, field, depth);
            });
            if (node.depth<depth) {
                node[field] = "";
            } else {
                node[field] = node.children[0][field];
            };
        }
    };

    function sum(node, field, depth) {
        if (field in node) {
            return;
        } else {
            node.children.forEach(function(p) {
                sum(p, field, depth);
            });
            if (node.depth<depth) {
                node[field] = "";
            } else {
                var val = 0;
                node.children.forEach(
                    function(p) {
                        val += p[field]});
                node[field] = val;
            };
        }
    };

    function prodsum(node, field, prod, depth) {
        if (field in node) {
            return;
        } else {
            if (node.children) {
                node.children.forEach(function(p) {
                    prodsum(p, field, prod, depth);
                });
                var val1 = 0;
                node.children.forEach(
                    function(p) {
                        val1 += p[field]});
                node[field] = val1;
            } else {
                var val2 = 1;
                prod.forEach(function(p) {
                    val2 *= node[p];
                })
                node[field] = val2;
            }
            if (node.depth<depth) {
                node[field] = "";
            }
        }
    };

    function weightedAvg(node, field, weight, depth) {
        if (field in node) {
            return;
        } else {
            if (node.children) {
                node.children.forEach(function(p) {
                    weightedAvg(p, field, weight, depth);
                });
                var val1 = 0;
                node.children.forEach(
                    function(p) {
                        val1 += p[field] * p[weight]});
                node[field] = Math.abs(node[weight]) < 0.02 ? 0 : val1 / node[weight];
            }
            if (node.depth<depth) {
                node[field] = "";
            }
        }
    };

    function average(node, field, depth) {
        if (field in node) {
            return;
        } else {
            if (node.children) {
                node.children.forEach(function(p) {
                    average(p, field, depth);
                });
                var n = node.children.length;
                var val1 = 0;
                node.children.forEach(
                    function(p) {
                        val1 += p[field]});
                node[field] = Math.abs(n) < 0.02 ? 0 : val1 / n;
            }

            if (node.depth<depth) {
                node[field] = "";
            }
        }
    };

    function set_attr(node, attr_val, attr_name) {
        node[attr_name] = attr_val;
        if (node.children) {
            node.children.forEach(function(p) {
                set_attr(p, attr_val, attr_name);
            });

        }
    }

    function addSignClass(html, value) {
        if (value > 0) {
            html = $(html).addClass('positive');
        } else if (value < 0) {
            html = $(html).addClass('negative');
        } else {
            html = $(html);
        }
        return html[0].outerHTML;
    };

    function sort_by(by) {
        var default_cmp = function(a, b) {
            if (a == b) return 0;
            return a < b ? -1 : 1;
        }

        var fn = function(x, y) {
            var rnk;
            var field;
            var ascend;
            for (var i=0; i< by.length; i++) {
                field = by[i]['field'];
                ascend = by[i]['ascend'];
                rnk = default_cmp(x[field], y[field]);
                if (rnk != 0) {
                    return ascend == true ? rnk: -rnk;
                }
            }
            return -1;
        };
        return fn;
    };

    function addSignClass(html, value) {
        if (value > 0) {
            html = $(html).addClass('positive');
        } else if (value < 0) {
            html = $(html).addClass('negative');
        } else {
            html = $(html);
        }
        return html[0].outerHTML;
    };
}
