function main() {
  var [startloading, endloading] = loadingIcon('#div-user-input');

  $('div#fund-desc').input_autocomplete({
    placeholder: "Search Fund ...",
    onsearch: function(input) {
      user_input.fundId($(input[0]).attr("pid"));
    },
    update_fn: function(txt, fn) {
      var result
      $.ajax({
        url: 'search_fund',
        method: "GET",
        dataType: 'json',
        timeout: 10000,
        data: {text: txt},
        success: function(data) {
          fn(data);
        },
        error: function (error) {
        }
      });
    }
  });

  function search_snapshot_id(data) {
    startloading();
    $.ajax({
        url: 'search_snapshot',
        method: "POST",
        dataType: 'text',
        timeout: 10000,
      data: {
        fundId: data.fundId(),
        as_of_date: data.as_of_date(),
        date_basis: data.date_basis(),
        cost_basis: data.cost_basis(),
        retain: data.retain(),
        comments: data.comments()
      },
      success: function(result) {
        endloading();
        data.snapshot(JSON.parse(result));
      },
      error: function (error) {
        endloading();
        alert(error.responseText);
      }
    });
  }

  var user_input = new (function() {
    var self = this;
    this.fundId = ko.observable();
    this.as_of_date = ko.observable(d3.time.format('%Y-%m-%d')(new Date()));
    this.date_basis = ko.observable("Trade Date");
    this.date_basis_options = ko.observable(['Trade Date', 'Settlement Date']);

    this.cost_basis = ko.observable("Weighted Average");
    this.cost_basis_options = ko.observable(['Weighted Average', 'FIFO', 'LIFO']);

    this.retain = ko.observable(0);
    this.retain_options = ko.observable([0, 1]);

    this.comments = ko.observable("");

    this.submit = function() {
      search_snapshot_id(self);
    }
    this.snapshot = ko.observable();
  })();

  ko.applyBindings(user_input, $('#div-tables')[0]);
}

$(document).ready(main);
