var initialize = function(PARAMS) {
    // currency exposure
    // PARAMS['widget']['pf_ccy_expo'] = addTitle(
    //     $('div#pf-ccy-risk').init_pf_ccy_risk(startLoading, endLoading), "CURRENCY RISK");
    var colors = d3.scale.category10();
    var group_columns = [];
    // delta exposures
    PARAMS['widget']['pf-position-pnl'] = addTitle(
        $('div#pf-position-pnl').init_wfi_table(
            {datasource: 'pf_position_pnl',
             title: ko.observable("PORTFOLIO POSITIONS"),
             input_args: {
                 't_date': ko.pureComputed(function() { return (new Date(paramsInput.t_date()));}),
                 'ref_date': ko.pureComputed(function() { return (new Date(paramsInput.ref_date()));}),
                 'accounts': ko.observable(paramsInput.selectedAccounts()),
                 'available_accounts': paramsInput.selectedAccounts,
                 'group_level_0': ko.observable('total'),
                 'group_level_1': ko.observable('product_typ'),
                 'group_level_2': ko.observable('None'),
                 'level_1_options': ['product_typ', 'industry_level_1', 'book', 'account', 'None', 'tag1'],
                 'level_2_options': ['industry_level_1', 'industry_level_2', 'book', 'product_typ', 'None','tag2'],
                 'sort_by': [{'field': 'rank', ascend: true, field_options: ['rank', 'deal', 'description', 'mktval', 'mkt_exposure', 'period_total_pnl']},
                             {field: 'mktval', ascend: false, field_options: ['rank', 'deal', 'description', 'mktval', 'mkt_exposure', 'period_total_pnl']},
                             {field: 'mktval', ascend: false, field_options: ['rank', 'deal', 'description', 'mktval', 'mkt_exposure', 'period_total_pnl']}],
                 'init_expansion_level': 3,
                 'display': 'summary',
                 'display_options': ['summary', 'details']
             },
             sort_by: [],
             processOption: function() {
                 var self = this;
                 self.title("PORTFOLIO POSITIONS (" +
                            d3.time.format('%Y-%m-%d')(self.input_args.ref_date())+
                            " TO " +
                            d3.time.format('%Y-%m-%d')(self.input_args.t_date()) + ")");
                 self.sort_by = self.input_args.sort_by;

                 self.init_expand = self.input_args.init_expansion_level;

                 // group columns
                 var group = [self.input_args.group_level_0()];
                 if (self.input_args.group_level_1() != 'None') {
                     group.push(self.input_args.group_level_1());
                 }
                 if (self.input_args.group_level_2() != 'None') {
                     group.push(self.input_args.group_level_2());
                 }
                 self.group_columns = group.concat(['deal', 'description', 'lot_id']);

                 // copy self.group_colums to group_columns
                 while(group_columns.length>0) group_columns.pop();
                 group_columns.push.apply(group_columns, self.group_columns);

                 // display option
                 if (self.input_args.display == 'summary') {
                     self.columns_setup.forEach(function(p, i) {
                         if (p.detail || false) {
                             p.visible = false;
                         } else {
                             p.visible = true;
                         }
                     });
                 } else {
                     self.columns_setup.forEach(function(p, i) {
                         p.visible = true;
                     });
                 }
             },
             process_row: function(row, rowdata) {
                 $('.sid-clickable', row).click(function() {
                     var url = '../sec_profile/security_profile?sid={sid}&pid={pid}'
                     url = url.replace(
                         '{sid}', rowdata['security_id']).replace('{pid}', rowdata['parent_id']);
                     window.open(url, '_blank');
                 });
             },
             process_child_data: function(data, depth) {
                 var self = this;
                 var n = self.options.sort_by.length;
                 data.sort(sort_by(self.options.sort_by.slice(depth-1, n)));
             },
             columns_setup: [
                 {data: "lot_id",
                  sortable: false,
                  visible: true,
                  title: '',
                  width: '25%',
                  render: function(value, type, row) {
                      var self = this;
                      var level = group_columns[row.depth];
                      if (level == null) {
                          return '<div style="margin-left:' + (row.depth-1)*4 + 'px">' + value + '</div>';
                      }
                      return '<div class="clickable" style="margin-left:' + (row.depth-1)*4 + 'px">' + value + '</div>';
                  }},
                 {data: 'security_id',
                  sortable: false,
                  visible: true,
                  title: '',
                  width: '10%',
                  render: function(value, type, row) {

                      if (value == "") return '';
                      var level = group_columns[row.depth-1];
                      if (level == 'lot_id') {
                          return '<div class="value">' + row.account + '</div>';
                      } else if (level == 'description') {
                          return '<div class="value sid-clickable">' + d3.format(".0f")(value) + '</div>';
                      }
                      return '<div class="value"></div>';
                  }},
                 {data: "prev_quantity",
                  sortable: false,
                  visible: true,
                  title: 'PrevQuantity',
                  width: '15%',
                  detail: true,
                  render: function(value) {
                      if (value == "") return '';
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>';}},
                 {data: "quantity",
                  sortable: false,
                  visible: true,
                  title: 'Quantity',
                  width: '15%',
                  render: function(value) {
                      if (value == "") return '';
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>';}},
                 {data: "ccy",
                  sortable: false,
                  visible: true,
                  title: 'Ccy',
                  width: '10%',
                  render: function(value) {
                      return '<div class="value">' + value + '</div>'}},
                 {data: "cleanCostBasis",
                  sortable: false,
                  visible: true,
                  title: 'Clean Cost Basis (USD)',
                  width: '15%',
                  render: function(value) {
                      if (value == "") return '';
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "prev_last_price",
                  sortable: false,
                  visible: true,
                  title: 'Prev Price (Loc)',
                  detail: true,
                  width: '15%',
                  render: function(value) {
                      if (value == "") return '';
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "last_price",
                  sortable: false,
                  visible: true,
                  title: 'Current Price (Loc)',
                  width: '15%',
                  render: function(value, type, row) {
                      if (value == "") return '';
                      var criteria = row.period_unrealized_pnl || 0;
                      return addSignClass(
                          '<div class="value">' + '$' + d3.format("7,.2f")(value) + '</div>', criteria);

                  }},
                 {data: "delta",
                  sortable: false,
                  visible: true,
                  title: 'Delta',
                  detail: true,
                  width: '15%',
                  render: function(value, type, row) {
                      if (value == "") return '';
                      var criteria = row.period_unrealized_pnl || 0;
                      return '<div class="value">' + '$' + d3.format("7,.2f")(value) + '</div>';

                  }},
                 {data: "sdv01",
                  sortable: false,
                  visible: true,
                  title: 'SDV01',
                  detail: true,
                  width: '15%',
                  render: function(value, type, row) {
                      if (value == "") return '';
                      var criteria = row.period_unrealized_pnl || 0;
                      return '<div class="value">' + '$' + d3.format("7,.2f")(value) + '</div>';

                  }},
                 {data: "factor",
                  sortable: false,
                  visible: true,
                  title: 'Factor',
                  width: '10%',
                  render: function(value) {
                      if (value == "" | value == null) return '';
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "tradeFlat",
                  sortable: false,
                  visible: true,
                  title: 'Trade Flat',
                  width: '10%',
                  render: function(value) {
                      if (value == "" | value == null) return '';
                      return '<div class="value">' + value + '</div>'}},
                 {data: "coupon",
                  sortable: false,
                  visible: true,
                  title: 'Coupon',
                  width: '10%',
                  render: function(value) {
                      if (value == "" | value == null) return '';
                      return '<div class="value">' + d3.format(",.2f")(value*100) + '%</div>'}},
                 {data: "fx_rate",
                  sortable: false,
                  visible: true,
                  width: '10%',
                  title: 'FX',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "mktval_clean",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Clean Price Market Value',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.1fK")(value/1000) + 'K</div>'}},
                 {data: "prev_mktval",
                  sortable: false,
                  visible: true,
                  detail: true,
                  width: '20%',
                  title: 'Prev Market Value',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>'}},
                 {data: "mktval",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Market Value',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>'}},
                 {data: "pct_mktval",
                  sortable: false,
                  visible: true,
                  width: '15%',
                  title: '% Allocation',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.2%")(value) + '</div>'}},
                 {data: "delta_adj_exposure",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Exposure',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>'}},
                 {sortable: false,
                  visible: true,
                  width: '15%',
                  title: '% Exposures',
                  render: function(val, type, row) {
                      var value = row['delta_adj_exposure'] / row['total_mktval'];
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return '<div class="value">' + d3.format(",.2%")(value) + '</div>'}},
                 {data: "period_fx_pnl",
                  sortable: false,
                  visible: true,
                  title: 'Period to Date\n FX P&L',
                  width: '20%',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return addSignClass('<div class="value">$' + d3.format("9,.1f")(value/1000) + 'K</div>', value);}},
                 {data: "period_realized_pnl",
                  sortable: false,
                  visible: true,
                  title: 'Period to Date Realized P&L',
                  width: '20%',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return addSignClass('<div class="value">$' + d3.format("9,.1f")(value/1000) + 'K</div>', value)}},
                 {data: "period_unrealized_pnl",
                  sortable: false,
                  visible: true,
                  title: 'Period to Date Unreal. P&L',
                  width: '20%',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return addSignClass('<div class="value">$' + d3.format("9,.1f")(value/1000) + 'K</div>', value)}},
                 {data: "period_total_pnl",
                  sortable: false,
                  visible: true,
                  title: 'Period to Date Total P&L',
                  width: '20%',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return addSignClass('<div class="value">$' + d3.format("9,.1f")(value/1000) + 'K</div>', value)}},
                 {sortable: false,
                  visible: true,
                  title: 'Period to Return Contrib',
                  width: '20%',
                  detail: true,
                  render: function(value, type, row) {
                      value = row['period_total_pnl'] / row['total_prev_mktval'];
                      if (value == "" | value == null) return '<div class="value">-</div>';
                      if (value == 0) return '<div class="value">-</div>';
                      return addSignClass('<div class="value">' +d3.format(".2f")(value*100) + '%</div>', value)}},
                 {data: "pricing_date",
                  sortable: false,
                  visible: true,
                  title: 'Pricing Date',
                  width: '20%',
                  render: function(value) {
                      try {
                          return '<div class="value">' + d3.time.format("%m/%d/%y")(value) + '</div>';
                      } catch(err) {
                          return '<div class="value"></div>'
                      }
                  }},
                 {data: "pricing_source",
                  sortable: false,
                  visible: true,
                  title: 'Pricing Source',
                  width: '10%',
                  render: function(value) {
                      if (value == "" | value == null) return '<div class="value"></div>';
                      return '<div class="value">' + d3.format(".0f")(value) + '</div>'}}
             ],
             group_columns: ['deal', 'description', 'lot_id'],
             init_level: 0,
             init_expand: 3,
             keyfield: 'lot_id',
             preProcess: function(data, options) {
                 var dataClone = []
                 data.forEach(function(p) {
                     if (!options.input_args.accounts().includes(p['account'])) {
                         return;
                     }
                     try {
                         p['pricing_date'] = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse(p['pricing_date']);
                     } catch(err) {
                         p['pricing_date'] = null;
                     };
                     p['book'] = p['product_typ'] == 'Currency' ? 'Cash' : (p['direction'] ? 'Long' : 'Short');
                     p['period_fx_pnl'] = (p['period_realized_fx_pnl'] || 0) + (p['period_unrealized_fx_pnl'] || 0);
                     p['cleanCostBasis'] = p['cleanCostBasis'] || p['costBasis'];
                     p['total'] = 'Total';
                     p['factor'] = p['factor'] || 1;
                     p['description'] = p['product_typ'] == 'Currency' ?  p['account'] : p['description'];
                     dataClone.push(p);
                 });

                 dataClone.sort(sort_by(options.sort_by));
                 return dataClone;
             },
             aggfun: function(node) {
                 sum(node, 'quantity', 2);
                 sum(node, 'prev_quantity', 2);
                 first(node, 'ccy', 4);
                 first(node, 'security_id', 1);
                 first(node, 'rank', 1);

                 weightedAvg(node, 'last_price', 'quantity', 3);
                 weightedAvg(node, 'delta', 'quantity', 3);
                 weightedAvg(node, 'sdv01', 'quantity', 3);
                 weightedAvg(node, 'prev_last_price', 'prev_quantity', 3);

                 weightedAvg(node, 'cleanCostBasis', 'quantity', 3);
                 weightedAvg(node, 'factor', 'quantity', 3);
                 first(node, 'tradeFlat', 3);
                 first(node, 'parent_id', 4);

                 weightedAvg(node, 'coupon', 'quantity', 3);
                 weightedAvg(node, 'fx_rate', 'quantity', 3);

                 sum(node, 'prev_mktval', 1);
                 sum(node, 'mktval_clean', 1);
                 sum(node, 'mktval', 0);
                 sum(node, 'period_total_pnl', 0);

                 var mktval = node.mktval - node.period_total_pnl;
                 set_attr(node, mktval, 'total_prev_mktval');

                 set_attr(node, node.mktval, 'total_mktval');

                 sum(node, 'delta_adj_exposure', 1);
                 sum(node, 'pct_mktval', 1);
                 // sum(node, 'pct_exposure', 1);
                 sum(node, 'period_fx_pnl', 1);
                 sum(node, 'period_realized_pnl', 1);
                 sum(node, 'period_unrealized_pnl', 1);

                 first(node, 'pricing_date', 3);
                 first(node, 'pricing_source', 3);
                 // sum(node, 'delta_adj_expo', 1);
             },
             options: function(data) {
                 var self = this;
                 var html = $(' \
                    <table style="width:300px"> \
                      <col width="40%"> \
                      <col width="30%"> \
                      <tbody> \
                        <tr> \
                           <td colspan=1>Accounts</td> \
                           <td colspan=1 class="value"> \
                               <select name="set_acct" class="boost-multiselect" multiple="multiple" \
                                  data-bind="selectedOptions: accounts, options: available_accounts"/> \
                           </td> \
                        </tr> \
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
                               <input data-bind="value:init_expansion_level"/> \
                           </td> \
                        </tr> \
                        <tr> \
                           <td colspan=1>Display</td> \
                           <td colspan=1 class="value"> \
                               <select data-bind="value: display, options: display_options"/> \
                           </td> \
                        </tr> \
                        <tr><td colspan=2> \
                          <table style="width:100%"> \
                              <caption style="font-weight: bold">Sorting By</caption> \
                              <thead><tr> \
                                  <th>Field</th><th>Ascending</th><th></th> \
                              </tr></thead> \
                              <tbody data-bind="foreach: sort_by"> \
                                  <tr> \
                                      <td >\
                                        <select data-bind="value: field, options: field_options"/> \
                                      </td>\
                                      <td >\
                                        <select data-bind="value: ascend, options: [true, false]"/> \
                                      </td>\
                                  </tr>   \
                              </tbody> \
                          </table> \
                        </td></tr>\
                      </tbody> \
                    </table>');
                 return html
             },
             update: updateSize}
        ));

    PARAMS['widget']['pf-summary'] = addTitle(
        $('div#pf-summary').init_wfi_table(
            {datasource: 'pf_summary',
             title: ko.observable("PORTFOLIO SUMMARY"),
             columns_setup: [
                 {data: "title",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: '',
                  render: function(name) {
                      return '<div>' + name + '</div>'}},
                 {data: "value",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Value',
                  render: function(value, type, row) {
                      if (value == "") {
                          return '<div class="value"></div>';
                      } else {
                          if (row['title'] != "Portfolio AUM")
                              return addSignClass('<div class="value">' + '$' + d3.format("15,.2f")(value) + '</div>', value);
                          else
                              return '<div class="value">' +'$'+d3.format("15,.2f")(value) + '</div>';
                      }
                  }},
                 {data: "pct",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: '% Value',
                  render: function(value, type, row) {
                      if (value == "") {
                          return '<div class="value"></div>';
                      } else {
                          if (!["Portfolio AUM", 'Cumulative PnL'].includes(row['title']))
                              return addSignClass('<div class="value">' + d3.format(".2%")(value) + '</div>', value);
                          else
                              return '<div class="value">-</div>';
                      }
                  }}
             ],
             aggfun: function(node) {
             },
             group_columns: ['title'],
             keyfield: 'title',
             init_level: 0,
             init_expand: 1,
             update: updateSize,
             preProcess: function(data) {
                 return data;
             }}
        ));

    // portfolio margin
    PARAMS['widget']['pf-margin'] = addTitle(
        $('div#pf-margin').init_wfi_table(
            {datasource: 'pf_margin',
             title: ko.observable("PORTFOLIO MARGIN"),
             header: ['Tag', 'Account Summary', '', '', '', '<div class="header">Change</div>'],
             processOption: function(data) {
                 var self = this;
                 try {
                     var t_date = d3.time.format("%Y-%m-%dT00:00:00.000Z").parse(data[0]['as_of_date']);
                     var prev_date = d3.time.format("%Y-%m-%dT00:00:00.000Z").parse(data[0]['prev_date']);
                     self.title("PORTFOLIO MARGIN (AS OF " +
                                d3.time.format('%Y-%m-%d')(t_date)+ ")");
                     self.columns_setup[3].title = '<div class="header">' + d3.time.format('%d-%b-%Y')(t_date) + '</div>';
                     self.columns_setup[4].title = '<div class="header">' + d3.time.format('%d-%b-%Y')(prev_date) + '</div>';
                 } catch (error) {
                 }
             },
             columns_setup: [
                 {sortable: false,
                  visible: true,
                  width: '6%',
                  title: 'Tag',
                  render: function(value, type, row) {
                      var val = row['account_summary'];
                      var res = '';
                      if (val == 'Equity') {
                          res = 'b';
                      } else if (val == 'Equity Minimum') {
                          res = 'c';
                      } else if (val == 'Total Margin') {
                          res = 'd';
                      } else if (val == 'House Stress Test') {
                          res = 'e';
                      } else if (val == 'Regulatory') {
                          res = 'f';
                      } else if (val == 'Margin Excess/(Call)') {
                          res = 'g';
                      } else if (val == 'Funding Excess/(Call)') {
                          res = 'h';
                      }
                      return '<div class="middle">' + res + '</div>';
                  }},
                 {data: "account_summary",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Account Summary',
                  render: function(value, type, row) {
                      return '<div class="value">' + value + '</div>';
                  }},
                 {sortable: false,
                  visible: true,
                  width: '10%',
                  title: '',
                  render: function(value, type, row) {
                      var val = row['account_summary'];
                      var res = '';
                      if (val == 'Total Margin') {
                          res = 'Max(e,f)';
                      } else if (val == 'Margin Excess/(Call)') {
                          res = 'b-Max(c,d)';
                      } else if (val == 'Total Excess/(Call)') {
                          res = 'Min(g,h)';
                      }
                      return '<div class="right">' + res + '</div>';
                  }},
                 {data: "as_of_date_val",
                  sortable: false,
                  visible: true,
                  title: '',
                  width: '15%',
                  render: function(value, type, row) {
                      if (row['account_summary'] == 'Total Excess/(Call)') {
                          return '<div class="value bold">' + d3.format(",.1f")(value/1000) + 'K</div>';
                      } else if (value == "" | value == null) {
                          return '<div class="value">-</div>';
                      } else {
                          return '<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>';
                      }
                  }},
                 {data: "prev_date_val",
                  sortable: false,
                  visible: true,
                  title: '',
                  width: '15%',
                  render: function(value, type, row) {
                      if (value == "" | value == null) {
                          return '<div class="value">-</div>';
                      } else {
                          return '<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>';
                      }
                  }},
                 {sortable: false,
                  visible: true,
                  width: '15%',
                  title: 'Change',
                  render: function(val, type, row) {
                      var value = row['as_of_date_val'] - row['prev_date_val'];
                      if (value == "") {
                          return '<div class="value">-</div>';
                      } else {
                          return addSignClass('<div class="value">' + d3.format(",.1f")(value/1000) + 'K</div>', value);
                      }
                  }}
             ],
             aggfun: function(node) {
             },
             group_columns: ['title'],
             keyfield: 'title',
             init_level: 0,
             init_expand: 1,
             update: updateSize,
             preProcess: function(data) {
                 return data;
             }}
        ));

    // exposure monitor
    PARAMS['widget']['pf-expo-monitor'] = addTitle(
        $('div#pf-expo-monitor').init_pf_expo_monitor(
            {datasource: 'pf_expo_monitor',
             title: ko.observable("EXPOSURE MONITOR")
            }
        ));


    PARAMS['widget']['pf-ccy-risk'] = addTitle(
        $('div#pf-ccy-risk').init_wfi_table(
            {datasource: 'pf_ccy_expo',
             title: ko.observable("CURRENCY RISK"),
             input_args: {
                 't_date': ko.pureComputed(function() { return (new Date(paramsInput.t_date()))})
             },
             processOption: function() {
                 var self = this;
                 self.title("CURRENCY RISK (AS OF " + d3.time.format('%Y-%m-%d')(self.input_args.t_date()) + ")")
             },
             columns_setup: [
                 {data: "key",
                  sortable: false,
                  visible: true,
                  width: '50%',
                  title: '',
                  render: function(value, type, row) {
                      return '<div class="clickable" style="margin-left:' + (row.depth-1)*4 + 'px">' + value + '</div>';
                  }},
                 {data: "exposure",
                  sortable: false,
                  visible: true,
                  width: '50%',
                  title: 'Exposure',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}}
             ],
             group_columns: ['currency', 'securityType_name', 'security_name'],
             init_level: 0,
             init_expand: 1,
             aggfun: function(node) {
                 sum(node, 'exposure', 1);
             },
             update: updateSize}
        ));


    // -------------------- tab 2 ----------------------------------
    //delta exposures
    PARAMS['widget']['pf-delta-risk'] = addTitle(
        $('div#pf-delta-risk').init_wfi_table(
            {datasource: 'pf_delta_expo',
             title: ko.observable("Credit & Rate Risk EXPOSURES"),
             input_args: {
                 't_date': ko.pureComputed(function() { return (new Date(paramsInput.t_date()))}),
                 'group_level_1': ko.observable('tag1'),
				         'group_level_2': ko.observable('tag2'),
                 'level_2_options': ['tag2', 'None'],
                 'level_1_options': ['tag1', 'None']
             },
             processOption: function() {
                 var self = this;
                 self.title("Derivatives Exposure & Performance (AS OF " +
                            d3.time.format('%Y-%m-%d')(self.input_args.t_date()) + ")");
                 self.group_columns[0] = self.input_args.group_level_1();
                 self.group_columns[1] = self.input_args.group_level_2();
             },
             columns_setup: [
                 {data: "key",
                  sortable: false,
                  visible: true,
                  width: '30%',
                  title: '',
                  render: function(value, type, row) {
                      return '<div class="clickable" style="margin-left:' + (row.depth-1)*4 + 'px">' + value + '</div>'}},
                 {data: "quantity",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Qty',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},
                 {data: "deltaQuantity",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'DeltaQty',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},
                 // {data: "delta_adj_expo",
                 // sortable: false,
                 // visible: true,
                 // width: '20%',
                 // title: 'Expo',
                 // render: function(value) {
                 // return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},

				         {data: "3m_carry",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: '3M Carry',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},

				         {data: "cdx_spread",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Spread',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.1f")(value) + '</div>'}},

				         {data: "3m_be",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: '3M BE Spread',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.1f")(value) + '</div>'}},

				         {data: "irdv01",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'IRDV01',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},
				         {data: "sdv01",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'SDV01',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},

				         {data: "period_total_pnl",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Period P&L',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}},

				         {data: "total_pnl",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Total P&L',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.0f")(value) + '</div>'}}

					   ],
             group_columns: [ 'tag1', 'tag2', 'deal', 'description'],
             sum_columns: ['quantity', 'irdv01', 'deltaQuantity', 'delta_adj_expo','sdv01', 'period_total_pnl', 'total_pnl','3m_carry','3m_be','cdx_spread'],
             init_level: 0,
             init_expand: 2,
             aggfun: function(node) {
                 sum(node, 'quantity', 1);
				         sum(node, '3m_carry', 1);
				         weightedAvg(node, 'cdx_spread', 'quantity', 2);
				         weightedAvg(node, '3m_be', 'quantity', 2);
                 sum(node, 'irdv01', 1);
                 sum(node, 'deltaQuantity', 1);
                 // sum(node, 'delta_adj_expo', 1);
				         sum(node, 'sdv01', 1);
				         sum(node, 'period_total_pnl', 1);
				         sum(node, 'total_pnl', 1);
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
                      </tbody> \
                    </table>');
                 return html
             },
             update: updateSize}
        ));


    PARAMS['widget']['pf-cashflow-proj'] = addTitle(
        $('div#pf-cashflow-proj').init_wfi_table(
            {datasource: 'pf_pending_cash_flow',
             title: ko.observable("CASH FLOW PROJECTION"),
             input_args: {
                 'frd_days': ko.observable(30)
             },
             processOption: function() {
                 var self = this;
                 self.title(
                     "CASH FLOW PROJECTION (FORWARD LOOKING " +
                         self.input_args.frd_days() + " DAYS)");
             },
             columns_setup: [
                 {data: "lot_id",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: '',
                  render: function(value, type, row) {
                      return '<div class="clickable" style="margin-left:' + (row.depth-1)*4 + 'px">' + value + '</div>'}},
                 {data: "accrued_end",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Ex-date',
                  render: function(value) {
                      try {
                          return '<div class="value">' + d3.time.format("%m/%d/%y")(value) + '</div>';
                      } catch(err) {
                          return '<div class="value"></div>'
                      }
                  }
                 },
                 {data: "coupon",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Amt/share',
                  render: function(value) {
                      if (value == "") {
                          return '<div class="value"></div>';
                      } else {
                          return '<div class="value">' + d3.format(",.3f")(value) + '</div>';
                      }
                  }
                 },
                 {data: "quantity",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Quantity',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "total_coupon",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Total Amt',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}},
                 {data: "status",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Status',
                  render: function(value) {
                      return '<div class="value">' + value + '</div>'}}
             ],
             sort: function(data) {
                 data.forEach(function(p, i) {
                     p.children.sort(function (x, y) {return x.lot_id > y.lot_id})});
                 return data
             },
             aggfun: function(node) {
                 first(node, 'status', 2);
                 first(node, 'coupon', 2);
                 first(node, 'accrued_end', 2);
                 sum(node, 'quantity', 1);
                 prodsum(node, 'total_coupon', ['quantity', 'amt_per_share']);
             },
             group_columns: ['product_typ', 'deal', 'description', 'lot_id'],
             keyfield: 'lot_id',
             init_level: 0,
             init_expand: 2,
             update: updateSize,
             options: function(data) {
                 var self = this;
                 var html = $(' \
                    <table style="width:300px"> \
                      <col width="40%"> \
                      <col width="30%"> \
                      <tbody> \
                        <tr> \
                           <td colspan=1>Forward Looking Days</td> \
                           <td colspan=1 class="value"> \
                               <input data-bind="value:frd_days"/> \
                           </td> \
                        </tr> \
                      </tbody> \
                    </table>');
                 return html
             },
             preProcess: function(data, options) {
                 var dataClone = []
                 var frd_days = options.input_args.frd_days();
                 var t_date = new Date(paramsInput.t_date());
                 data.forEach(function(p) {
                     try {
                         p['accrued_end'] = d3.time.format('%Y-%m-%d').parse(p['accrued_end'].slice(0,10));
                     } catch(err) {
                         p['accrued_end'] = new Date('1/1/2099');
                     };
                     var days = Math.round((p['accrued_end'].getTime() - t_date.getTime()) / (1000*60*60*24));
                     if (frd_days > days){
                         dataClone.push(p);
                     }
                 });
                 return dataClone;
             }}
        ));


    PARAMS['widget']['pf-short-cost'] = addTitle(
        $('div#pf-short-cost').init_wfi_table(
            {datasource: 'pf-short-cost',
             title: ko.observable("PORTFOLIO SHORT COST"),
             processOption: function(data) {
                 var self = this;
                 try {
                     var t_date = d3.time.format("%Y-%m-%dT00:00:00.000Z").parse(data[0]['t_date']);
                     self.title("PORTFOLIO SHORT COST (AS OF " +
                                d3.time.format('%Y-%m-%d')(t_date)+ ")");
                 } catch (error) {
                 }
             },
             columns_setup: [
                 {data: "security_id",
                  sortable: false,
                  visible: true,
                  width: '15%',
                  title: 'Security ID',
                  render: function(name) {
                      return '<div>' + name + '</div>'}},
                 {data: "description",
                  sortable: false,
                  visible: true,
                  width: '15%',
                  title: 'Description',
                  render: function(value) {
                      if (value == "" || value == null) return '';
                      return '<div class="value">' + value + '</div>';
                  }
                 },
                 {data: "quantity",
                  sortable: false,
                  visible: true,
                  title: 'Quantity',
                  width: '18%',
                  render: function(value) {
                      if (value == "") {
                          return '<div class="value"></div>';
                      } else {
                          return '<div class="value">' + d3.format(",.0f")(value) + '</div>';
                      }
                  }
                 },
                 {data: "price",
                  sortable: false,
                  visible: true,
                  width: '10%',
                  title: 'Price',
                  render: function(value) {
                      if (value == "" || value == null) {
                          return '<div class="value">-</div>';
                      } else {
                          return '<div class="value">' + d3.format(",.2f")(value) + '</div>';
                      }
                  }
                 },
                 {data: "mktval",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'MktVal',
                  render: function(value) {
                      if (value == "" || value == null) {
                          return '<div class="value">-</div>';
                      } else {
                          return '<div class="value">' + d3.format(",.2f")(value) + '</div>';
                      }
                  }
                 },
                 {data: "accrual_rate",
                  sortable: false,
                  visible: true,
                  title: 'AccrualRate',
                  width: '15%',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.2f")(value) + '%</div>'}},
                 {data: "accrual_days",
                  sortable: false,
                  visible: true,
                  title: 'AccrualDays',
                  width: '15%',
                  render: function(value) {
                      return '<div class="value">' + d3.format(".0f")(value) + '</div>'}},
                 {data: "accrual",
                  sortable: false,
                  visible: true,
                  title: '1D Accrual',
                  width: '15%',
                  render: function(value) {
                      return '<div class="value">' + d3.format(",.2f")(value) + '</div>'}}
             ],
             sort: function(data) {
                 return data
             },
             aggfun: function(node) {
                 sum(node, 'quantity', 1);
                 sum(node, 'accrual', 1);
                 sum(node, 'mktval', 1);

                 weightedAvg(node, 'accrual_rate', 'quantity', 1);
             },
             group_columns: ['total', 'security_id'],
             keyfield: 'security_id',
             init_level: 0,
             init_expand: 2,
             update: updateSize,
             preProcess: function(data) {
                 var dataClone = []
                 data.forEach(function(p) {
                     p['total'] = ''
                     dataClone.push(p);
                 });
                 return dataClone;
             }}
        ));

    // rolling risk
    PARAMS['widget']['pf-rolling-risk'] = addTitle(
        $('div#pf-rolling-risk').init_wfi_plot(
            {datasource: "pf_rolling_risk",
             title: ko.observable("ROLLING PRO-FORMA RISK"),
             lines: {
                 data:[{field: 'rolling_std', axis: 'yaxis1'},
                       {field: 'rolling_var99', axis: 'yaxis1'}],
                 color: function(i){
                     return colors(i);}},
             bars: {
                 data: [{field: 'proforma_pnl', axis: 'yaxis1'}],
                 color: function(i, j, d){
                     return colors(i+2);}},
             xaxis: {field: 'date',
                     fmt: d3.time.format('%Y-%m-%d'),
                     tooltipfmt: d3.time.format('%Y-%m-%d'),
                     scale: d3.time.scale()},
             yaxis1: {fmt: function(x) {return d3.format(',.0f')(x/1000)+' K'},
                      tooltipfmt: d3.format(',.0f'),
                      scale: d3.scale.linear()},
             navigator: {
                 field: 'date',
                 fmt: d3.time.format('%b %y'),
                 tooltipfmt: d3.time.format('%Y-%m-%d'),
                 domainfmt: d3.time.format('%m/%d/%Y'),
                 scale: d3.time.scale()
             },
             preProcess: function(data) {
                 var dataClone = {}
                 $.each(data, function(p) {
                     dataClone[p] = data[p].slice();});
                 dataClone['date'] = dataClone['date'].map(
                     function(p) {return d3.time.format('%Y-%m-%d').parse(p.slice(0,10));})
                 return dataClone;
             }}
        ));

    // pf vs bmk
    PARAMS['widget']['pf-bmk-plot'] = addTitle(
        $('div#pf-bmk-plot').init_wfi_plot(
            {datasource: "pf_vs_bmk",
             title: ko.observable("PORTFOLIO VS BENCHMARK"),
             scatters: {
                 data: {field: 'return', axis: 'yaxis1'},
                 color: function(j, d){
                     var color = d3.scale.linear().domain([0, 1])
                             .interpolate(d3.interpolateHcl)
                             .range([d3.rgb("yellow"), d3.rgb('red')]);
                     return color(d.j/d.n);}},
             xaxis: {field: 'benchmark',
                     fmt: function(x) {return d3.format('.2f')(x*100)+'%'},
                     tooltipfmt: function(x) {return d3.format('.2f')(x*100)+'%'},
                     scale: d3.scale.linear()},
             yaxis1: {fmt: function(x) {return d3.format('.2f')(x*100)+'%'},
                      tooltipfmt: function(x) {return d3.format('.2f')(x*100)+'%'},
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
                 }}
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

    // ------------------------- tab 3 ---------------------------
    PARAMS['widget']['processed-file-gs'] = addTitle(
        $('div#processed-file-gs').init_wfi_table(
            {datasource: 'processed-file-gs',
             title: ko.observable("PROCESSED GS REPORT"),
             init_level: 0,
             init_expand: 0,
             scrollCollapse: false,
             columns_setup: [
                 {data: "report_type",
                  sortable: false,
                  visible: true,
                  width: '30%',
                  title: 'Category',
                  render: function(value, type, row) {
                      return '<div>' + value + '</div>';;
                  }},
                 {data: "t_date",
                  sortable: false,
                  visible: true,
                  width: '20%',
                  title: 'Report Date',
                  render: function(value) {
                      return '<div>' + d3.time.format('%Y-%m-%d')(value) + '</div>';}},
                 {data: "rpt_name",
                  sortable: false,
                  visible: true,
                  width: '80%',
                  title: 'Name',
                  render: function(value, type, row) {
                      var img = '<img width="16" height="16" border="0" alt="" \
                          src="./static/src/images/file-image/icxlsx.png">';
                      return '<div class="clickable file">' + img + value + '</div>';;
                  }}],
             group_columns: ['category'],
             keyfield: "category",
             process_row: function(row, rowdata) {
                 $('.file', row).click(function() {
                     var args = {
                         t_date: rowdata['t_date'].toLocaleString(),
                         rpt_name: rowdata['rpt_name']}
                     var args_vec = [];
                     $.each(args, function(x, y) {
                         args_vec.push(x+"="+y);
                     })

                     var xhr = new XMLHttpRequest();
                     xhr.open('GET', 'api_download_file?'+args_vec.join('&'), true);
                     xhr.responseType = 'arraybuffer';

                     xhr.onload = function(e) {
                         if (this.status == 200) {
                             // var blob = new Blob([xhr.response], {type: 'application/vnd.ms-excel'});
                             //var binary = fr.readAsArrayBuffer(blob);
                             var blob = new Blob([xhr.response], {type: 'octet/stream'});
                             var downloadUrl = URL.createObjectURL(blob);
                             //window.open(downloadUrl);

                             var a = document.createElement("a");
                             a.href = downloadUrl;
                             a.download = rowdata['rpt_name'];
                             document.body.appendChild(a);
                             a.click();
                             //Do your stuff here
                         }
                     };
                     xhr.send();
                 });
             },
             preProcess: function(data, options) {
                 var dataClone = []
                 data.forEach(function(p) {
                     p['t_date'] = d3.time.format('%Y-%m-%dT%H:%M:%S.000Z').parse(p['t_date']);
                     dataClone.push(p);
                 });

                 dataClone.sort(function(x, y) {
                     return x.t_date - y.t_date;
                 });
                 return dataClone;
             },
             updateSize: updateSize}
        ));

    // ----------------------------------------------------

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
}
