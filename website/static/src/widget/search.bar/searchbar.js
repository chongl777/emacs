(function($) {
    $.ui.autocomplete.prototype._renderMenu = function(ul, items) {
        var self = this;
        //table definitions
        $.each( items, function( index, item ) {
            self._renderItemData(ul, ul, item );
        });
    };

    var clickfn;

    $.ui.autocomplete.prototype._renderItemData = function(ul,table, item) {
        item = JSON.parse(item['value']);
        // item['value'] = item['value'];
        return this._renderItem( table, item ).data( "ui-autocomplete-item", item );
    };

    $.ui.autocomplete.prototype._renderItem = function(table, item) {
        return $( "<tr class='ui-menu-item' role='presentation'></tr>" )
        //.data( "item.autocomplete", item )
            .append('<td class="parent-id">'+item['id']+"</td>"+
                    '<td class="parent-name" nowrap>'+item['value']+"</td>")
            .appendTo( table );
    };

    var selected = function(p, item) {
        item = item['item'];
        $(this).val(item['value']);
        $(this).attr('pid', item['id']);
    }

    function update_selectoptions(result) {
        this.autocomplete('option', 'source', result);
    }

    var onkeydown = function(event, ul, input, update_fn=null) {
        //input.autocomplete('option', 'source', ['asd</div>']);
        if (event.which == 13) {
            clickfn(input);
            return;
        }
        var inputtext = $(this).val();
        if (inputtext.length <= 1) {
            return;
        }

        if (update_fn == null) {
            return;
        }
        update_fn(inputtext, update_selectoptions.bind(input))
    }

    $.fn.input_autocomplete = function(options={}) {
        var company_list = [];
        var self = this;
        var update_fn = options['update_fn'];
        options['placeholder'] = options['placeholder'] || '';
        clickfn = options['onsearch'];
        self.addClass("wfi-autocomplete");
        $(self).append(
            '<input id="search_text" type="text" placeholder="'+options['placeholder']+'"/>'+
                '<button id="search_button" type="button" style=""/>');

        self.each(function(i, div) {
            var input = $(div).find('input#search_text');
            input.autocomplete(
                {source: company_list,
                 select: options.selected || selected
                });

            input.on("change keyup", function(event, ui) {
                onkeydown.call(input, event, ui, input, update_fn);
            });

            $(input).on("keydown keypress", function(event) {
                if (event.which == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
            });

            $(div).find('button').on(
                "click",
                function() {
                    clickfn(input)});
        });
    };
})(jQuery);
