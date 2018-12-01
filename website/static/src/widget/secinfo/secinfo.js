(function($){
    var html_template =
            '<div style="float: left; display: flex; flex-direction: row; justify-content: space-around;"> \
            <table id="1" class="row-border" style="width:45%;"> \
                <thead> \
                    <tr> \
                    <th>group</th> \
                    <th>field</th> \
                    <th>value</th> \
                    </tr> \
                </thead> \
                <tbody> \
                    <tr class="group"><td colspan="2"><font>General Info</font></td></tr> \
                    <tr><td>Description</td> <td data-bind="text: Description"></td></tr> \
                    <tr><td>Short Name</td> <td data-bind="text: Short_Name"></td></tr> \
                    <tr><td>Issue Date</td> <td data-bind="text: Issue_Date"></td></tr> \
                    <tr><td>Issued Amount</td> <td data-bind="text: Issued_Amount"></td></tr> \
                    <tr><td>Maturity</td><td data-bind="text: Maturity"></td></tr> \
                    <tr><td>Rank</td><td data-bind="text: payment_rnk"></td></tr> \
                    <tr class="group"><td colspan="2"><font>Identifier</font></td></tr> \
                    <tr><td>SecurityID</td><td data-bind="text: SecurityID"></td></tr> \
                    <tr><td>Cusip</td><td data-bind="text: cusip"></td></tr> \
                    <tr><td>ISIN</td><td data-bind="text: isin"></td></tr> \
                    <tr><td>BBG ID</td><td data-bind="text: bbg_id"></td></tr> \
                    <tr><td>FINRA ID</td><td data-bind="text: finra_ticker"></td></tr> \
                    <tr class="group"><td colspan="2"><font>Sector & Region</font></td></tr> \
                    <tr><td>Sector</td><td data-bind="text: Sector"></td></tr> \
                    <tr><td>SubSector</td><td data-bind="text: SubSector"></td></tr> \
                    <tr><td>Country</td><td data-bind="text: Country"></td></tr> \
                    <tr><td>Region</td><td data-bind="text: Region"></td></tr> \
                </tbody> \
            </table> \
            <table id="2" class="row-border" style="width:45%;"> \
                <thead> \
                    <tr> \
                    <th>group</th> \
                    <th>field</th> \
                    <th>value</th> \
                    </tr> \
                </thead> \
                <tbody> \
                    <tr class="group"><td colspan="2"><font>Status</font></td></tr> \
                    <tr><td>Default</td><td data-bind="text: defaulted"></td></tr> \
                    <tr><td>Called</td><td data-bind="text: called"></td></tr> \
                    <tr class="group"><td colspan="2"><font>Coupon</font></td></tr> \
                    <tr><td>Coupon</td><td data-bind="text: Coupon"></td></tr> \
                    <tr><td>Sinkable</td><td data-bind="text: Sinkable"></td></tr> \
                    <tr><td>Callable</td><td data-bind="text: Callable"></td></tr> \
                    <tr><td>Putable</td><td data-bind="text: Putable"></td></tr> \
                    <tr><td>Multiplier</td><td data-bind="text: Multiplier"></td></tr> \
                    <tr class="group"><td colspan="2"><font>Price Info</font></td></tr> \
                    <tr><td>Last Price(BVAL)</td><td data-bind="text: px_bval"></td></tr> \
                    <tr><td>Last Time(BVAL)</td><td data-bind="text: t_date_bval"></td></tr> \
                    <tr><td>Last Price(FINRA)</td><td data-bind="text: px_finra"></td></tr> \
                    <tr><td>Last Time(FINRA)</td><td data-bind="text: t_date_finra"></td></tr> \
                    <tr><td>Chg (1day)</td><td data-bind="text: chg_1d.extend({format: \'.2%\'}) \
                    , css: {positive: chg_1d()>0, negative: chg_1d()<0}"></td></tr> \
                    <tr><td>Chg (5day)</td><td data-bind="text: chg_5d.extend({format: \'.2%\'}) \
                    , css: {positive: chg_5d()>0, negative: chg_5d()<0}"></td></tr> \
                    <tr><td>Vol (1 year)</td><td data-bind="text: vol_1y.extend({format: \'.2%\'})"></td></tr> \
                </tbody> \
            </table> \
            </div>';

    var vm = null;

    ko.extenders.format = function(target, fmt) {
        var result = ko.computed({
            read: function() {
                return d3.format(fmt)(target())
            },
            write: target
        });

        result.raw = target;
        return result;
    };

    $.fn.init_sec_info = function(
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
    var initialize = function(
        self, startLoading, endLoading) {
        // unique id
        $(self).addClass('wfi-sec-info');
        $(self).append(html_template);

        var widget = $('table', self);
        self.update = updateWithLoadingIcon(startLoading, endLoading);
        self.updateWithData = updateWithData;
        return this;
    };

    var updateWithData = function(data) {
        var self = this;
        if (vm == null) {
            init_vm.call(self, data);
        } else {
            update_vm.call(self, data);
        }
    };

    function update_vm(data) {
        $.each(data, function(p) {
            vm[p](data[p] == null ? '-' : data[p]);
        })
    }

    function init_vm(data) {
        var self = this;
        vm = {};
        $.each(data, function(p) {
            vm[p] = ko.observable(data[p]);
        })
        ko.applyBindings(vm, self);
    }

    // update elements
    var updateWithLoadingIcon = function(startLoading, endLoading) {
        var update = function(sid) {
            if (sid == null) {
                return;
            }
            var widget = this;
            startLoading();
            $.ajax({
                url: "get_security_info",
                method: "GET",
                dataType: 'json',
                data: {
                    "sid": sid},
                success: function(data) {
                    //data = JSON.parse(data.replace(/\bNaN\b/g, "null"));
                    endLoading();
                    widget.updateWithData(data);
                },
                error: function (msg) {
                    endLoading();
                    window.alert("secinfo.js:"+msg.statusText);
                }
            })
        };
        return update;
    }
})(jQuery);
