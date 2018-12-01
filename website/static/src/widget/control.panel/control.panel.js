(function($){
    $.fn.init_wfi_control_panel = function(options={}) {
        var self = this;
        self.each(function(i, div) {
            initialize.call(div, options);
        })
        return self;
    }

    var initialize = function(options) {
        // unique id
        var self = this;
        self.options = options;
        $(self).html(function() {
            var html =
              '<table class="wfi-control-panel-table" style="width:100%"> \
                <tbody> \
                  <tr id="setting-bar"> \
                     <td align="right"><div id="site-settings" style="width: 70px">Site Settings</div></td> \
                  </tr> \
                  <tr> \
                    <td> \
                      <div id="drop-down-parms"> \
                        <table style="width:100%" id="table_params"> \
                          <tbody> \
                            <tr> \
                              <td id="params-holder" style="width:100%; height:100%"> '
                              + $(self).html() +
                              '</td> \
                              <td class="SubmitButtonCell"><table> \
											          <tbody><tr> \
												          <td><input type="submit" data-bind="value: buttonText" id="submit_rpt"></td> \
											          </tr> \
											          </tbody></table> \
                              </td> \
                            </tr> \
                          </tbody> \
                        </table> \
                      </div> \
                    </td> \
                  </tr> \
                  <tr style="height:6px;font-size:2pt;"> \
			              <td colspan="3" class="SplitterNormal" \
                      style="padding: 0px; margin: 0px; text-align: center; cursor: default;"> \
                      <div style="font-size: 0px"> \
					              <input type="image" class="down" id="ToggleParam_img" \
                              title="Show / Hide Parameters" \
                              src="/sites/Research/SiteAssets/static/src/widget/wfi.control.panel/img/DDPanelDownActive.png" \
                              alt="Show / Hide Parameters" align="middle" \
                              style="border-width:0px;cursor:pointer;"/> \
                      </div> \
			              </td> \
		              </tr> \
                </tbody> \
              </table> '
            return html;
        });
        //$(self).addClass('wfi-control-panel');
        init_options(self);
        return this;
    };

    function changeImg(self) {
        if ($(self).hasClass('up')) {
            $(self).attr('src', './static/src/widget/wfi.control.panel/img/DDPanelDownActive.png')
        } else {
            $(self).attr('src', './static/src/widget/wfi.control.panel/img/DDPanelUpInActive.png')
        }
    }

    function init_options(self) {
        self.options['showSettingPages'] = self.options['showSettingPages'] || false;
        self.options['preProcess'] = self.options['preProcess'] || function (data) {return data;};

        self.options['siteSetting'] = self.options['siteSetting'] || function () {};

        self.options['input_args'] = self.options['input_args'] || {};
        self.options['inputs']['buttonText'] = self.options['inputs']['buttonText'] || 'View Report';

        self.options['input_args']['submit'] = function() {
            self.removeDlg();
            //start_loading.call(self);
            var f = self.options['input_args']['submit_func'] ||
                    function() {};
            f.call(self);
        };

        self.options['input_args']['cancel'] = function() {
            self.removeDlg();
            //start_loading.call(self);
            var f = self.options['input_args']['cancel_func'] ||
                    function() {};
            f.call(self);
        };

        ko.applyBindings(self.options['inputs'], self);

        changeImg($("#ToggleParam_img", self));
        $("#ToggleParam_img", self).click(function(e){
            $("#drop-down-parms", self).slideToggle("fast");
            $(this).toggleClass('up down');
            changeImg(this);
            e.preventDefault();
        });

        if (self.options['showSettingPages']) {
            $("#setting-bar", self).css('display', 'table-row');
        } else {
            $("#setting-bar", self).css('display', 'none');
        }

        $(".boost-multiselect", self).multiselect({
            includeSelectAllOption: true
        });

        $("#submit_rpt", self).click(function(e) {
            self.options['update']();
            e.preventDefault();
        })

        $("#site-settings", self).click(function(e) {
            open_option_setup.call(self);
            //self.options['siteSetting']();
            e.preventDefault();
        })
    }

    function open_option_setup() {
        var self = this;
        var html = self.options['options']();
        var overlay = $('<div>');
        var removeDlg = function() {overlay.remove();}
        self.removeDlg = removeDlg;
        overlay.attr('id', 'OVER');
        overlay.html('<div class="wfi-control-panel-table args-dlg 1tgt-px-dlg" style="width: 400px; height:auto;"></div>');

        var dlg = $('div.args-dlg', overlay);
        dlg.css("top", $(window).height()/2-210)
            .css('left', $(window).width()/2-315);
        dlg.draggable();
        dlg.html(
            '<div class="dlgTitle" style="cursor: move; position:relative; clear:both; padding: 10px"> \
                 <h1 style="float: left; margin-top: 0px; margin-button: 0px">Site Setting</h1> \
                 <span id="TitleBtns" class="dlgTitleBtns" style="float: right; margin:0px;"> \
                   <a class="dlgCloseBtn" title="Close dialog" href="javascript:;" accesskey="C"> \
                     <span style="padding:0px;height:16px;width:16px;display:inline-block"> \
                       <span style="height:16px;width:16px; position:relative; \
                          display:inline-block; overflow:hidden;" class="s4-clust"> \
                          <img src="/_layouts/15/images/fgimg.png?rev=23" alt="Close dialog" \
                           style="left:-0px !important;top:-645px !important;position:absolute;" \
                           class="ms-dlgCloseBtnImg"> \
                       </span> \
                     </span> \
                   </a> \
                 </span> \
             </div> \
             <table id="content" align="center"> \
                  <tbody> </tbody> \
             </table> \
             <div class="dlgSetupButton" style="padding:10px"> \
                 <table id="submit-button" style="width:100%"> \
                     <tr> \
                        <td align="center"> \
                          <input type="button" value="Okay" data-bind="click: submit"/> \
                        </td> \
                        <td align="center"> \
                          <input type="button" value="Cancel" data-bind="click: cancel"/> \
                        </td> \
                     </tr> \
                  </table> \
             </div>');

        $('#content tbody', dlg).append(html);
        overlay.removeDlg = removeDlg;

        $('body').append(overlay);
        ko.applyBindings(self.options['input_args'], overlay[0]);

        $(".boost-multiselect", dlg).multiselect({
            includeSelectAllOption: true
        });
    }

    function start_loading() {
        var self = this;
        var html = '<div class="overlay-inner" style="width: 100%; height: 100%; position: absolute; \
                         background-color: rgba(12,12,3,0.4); top: 0px;">\
                         <img src="../SiteAssets/static/image/loadingAnimation.gif" style=" \
                             top: 35%; \
                             left: 45%; \
                             position: absolute;\
                             height: 30%;"> \
                    </div>'
        d3.select(self).selectAll('div.overlay').data([1]).enter()
            .append('div').attr('class', 'overlay');
        d3.select(self).select('div.overlay').html(html);
    }

    function end_loading() {
        var self = this;
        d3.select(self).select('div.overlay').html("");
    }

})(jQuery);
